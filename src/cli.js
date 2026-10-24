#!/usr/bin/env node
'use strict';

/**
 * routerplex-bulk-apikey CLI — mint RouterPlex (routerplex.com) accounts, one
 * API key each, and keep only the keys that survived a live chat call.
 *
 * Why a real browser: sign-up is Cloudflare-fronted and carries a Turnstile
 * token in the register body (`POST /api/auth/register` answers 403
 * `__cf_chl_rt_tk` to anything that is not a browser), and the setup key only
 * exists behind the panel's own onboarding route. So the tool launches a real
 * Chrome over one exit (or direct) and drives the page over CDP with a tiny
 * built-in WebSocket client — still zero dependencies.
 *
 * Flow, per account (browser + panel + live proof through one pinned exit):
 *   1. vet exit   routerplex.com/sign-up answers 200 and the API host answers
 *   2. mailbox    temp.tf plus-alias on a real @hotmail.com box
 *   3. form       e-mail + names + password + terms, consent banner dismissed
 *   4. captcha    the page's own Turnstile widget (managed) issues the token
 *   5. verify     the mail's `https://routerplex.com/verify?token=…` link is
 *                 opened in the same context, then `/api/auth/me` confirms it
 *   6. key        `POST /api/onboarding` (tool+model) then
 *                 `POST /api/onboarding/key` (in-page fetch). The $1 test credit
 *                 is granted inside that call, once per account.
 *   7. gate       `GET /v1/models` + a real completion → a key is appended to
 *                 keys.txt only after the chat 200 (`content || reasoning_content`)
 *
 * Options:
 *   --count N        accounts (= keys) to mint, serial                     [1]
 *   --model <id>     model used for the live gate      [deepseek-v4.1-flash]
 *   --tool <id>      setup wizard tool that claims the trial    [claude-code]
 *   --pool <file>    proxy list, one line per exit (env ROUTERPLEX_PROXIES) [optional]
 *   --exits N        exit candidates vetted per account                    [6]
 *   --mint-tries N   full sign-up attempts (fresh mailbox + Chrome) per exit  [3]
 *   --gap MS         pause between accounts                                [4000]
 *   --timeout MS     per-request timeout (node side)                      [60000]
 *   --link-timeout S seconds to wait for the verification mail               [300]
 *   --grant-wait S   seconds a fresh key's 401 window is waited out         [150]
 *   --keys <file>    key file for --verify-only / --connect-9router  [keys.txt]
 *   --headless       run Chrome headless (a visible Chrome is the tested rail)
 *   --browser <exe>  Chrome binary (env CHROME_PATH)                     [auto]
 *   --debug-port N   Chrome DevTools port — a free nonzero one by default
 *   --verify-only    re-run every key in the key file through the chat gate
 *   --screen         only test the proxy list (sign-up + API reachability)
 *   --connect-9router  register this provider (and its keys) on a local 9Router
 *   --help
 *
 * Zero dependencies. Node.js >= 18 (the browser rail uses `fetch` only for the
 * local DevTools endpoint and the local 9Router).
 * Your proxy list is OPTIONAL: pass --pool (or ROUTERPLEX_PROXIES) and every
 * request — browser included — goes through an exit from it, fail-closed;
 * without a pool the tool connects directly.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const net = require('net');
const tls = require('tls');
const http = require('http');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');
const { EventEmitter } = require('events');

const IS_SRC = path.basename(__dirname) === 'src';
const ROOT = IS_SRC ? path.resolve(__dirname, '..') : __dirname;
const KEYS_FILE = path.join(ROOT, 'keys.txt');
const ACCOUNTS_FILE = path.join(ROOT, 'accounts.json');
const OUT_DIR = path.join(ROOT, 'out');
const SHOTS_DIR = path.join(OUT_DIR, 'shots');

const SITE = 'https://routerplex.com';
const API = 'https://api.routerplex.com/v1';
const TMPTF = 'https://temp.tf';
const DEFAULT_TOOL = 'claude-code';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';

// ------------------------------------------------------------------- options
const argv = process.argv.slice(2);
function arg(name, dflt) {
  const eq = argv.find((a) => a.startsWith(`--${name}=`));
  if (eq) return eq.slice(name.length + 3);
  const i = argv.indexOf(`--${name}`);
  if (i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--')) return argv[i + 1];
  return dflt;
}
const has = (name) => argv.includes(`--${name}`) || argv.includes(`-${name}`);

if (has('help') || has('h')) {
  console.log(`routerplex-bulk-apikey — mint RouterPlex accounts, one key each, verified by a live chat call.

  node src/cli.js --count 1          mint (sign-up in a real Chrome; $1 trial credit per account)
  node src/cli.js --verify-only      re-check every key in keys.txt
  node src/cli.js --screen           test your proxy list against RouterPlex
  node src/cli.js --connect-9router  register the provider + its keys on a local 9Router
  node src/cli.js --help

  --count N      accounts to mint, serial                                [1]
  --model <id>   model used for the live gate       [deepseek-v4.1-flash]
  --tool <id>    setup wizard tool that claims the trial      [claude-code]
  --pool <file>  proxy list, one exit per line (env ROUTERPLEX_PROXIES) [optional]
  --exits N      exit candidates vetted per account                      [6]
  --link-timeout S   seconds to wait for the verification mail          [300]
  --grant-wait S     seconds a fresh key's 401 window is waited out     [150]
  --insecure     accept the self-signed cert some HTTP exits inject (opt-in)
  --keys <file>  key file for --verify-only                [keys.txt]
  --headless     run Chrome headless (a visible Chrome is the tested rail)
  --debug-port N Chrome DevTools port — a free nonzero one picked by default

Keys: keys.txt keeps the keys that answered a live chat call; keys-dead.txt (next
to the keys file) gets key<TAB>reason<TAB>iso for the keys a panel REFUSED
(401/402/403/410) — a 404, a 429 or a 5xx is never filed.

Sign-up carries a Cloudflare Turnstile token in the register body and the $1
trial key only exists behind the panel's onboarding route, so the tool drives a
real Chrome (CDP) over one exit instead of calling the endpoints directly.

Requests go through the exits in your proxy list when one is provided (--pool or
the ROUTERPLEX_PROXIES env). Without a pool the tool connects DIRECTLY, and the
run still works where the network reaches routerplex.com.
`);
  process.exit(0);
}

const COUNT = Math.max(1, parseInt(arg('count', '1'), 10) || 1);
const MODEL = arg('model', process.env.ROUTERPLEX_MODEL || 'deepseek-v4.1-flash');
const EXITS = Math.max(1, parseInt(arg('exits', '6'), 10) || 6);
const GAP_MS = Math.max(0, parseInt(arg('gap', '4000'), 10) || 0);
const TIMEOUT_MS = Math.max(5000, parseInt(arg('timeout', '60000'), 10) || 60000);
const LINK_TIMEOUT_MS = Math.max(30000, (parseInt(arg('link-timeout', '300'), 10) || 300) * 1000);
const GRANT_WAIT_MS = Math.max(0, (parseInt(arg('grant-wait', '150'), 10) || 0) * 1000);
const MINT_TRIES = Math.max(1, parseInt(arg('mint-tries', '3'), 10) || 3);
const TOOL = arg('tool', process.env.ROUTERPLEX_TOOL || DEFAULT_TOOL);
const CHROME_BIN = arg('browser', process.env.CHROME_PATH || '');
const DEBUG_PORT = parseInt(arg('debug-port', '0'), 10) || 0; // 0 = auto-pick a free, nonzero port
const INSECURE = has('insecure');
const HEADLESS = has('headless');
const VERIFY_ONLY = has('verify-only');
const SCREEN = has('screen');
const CONNECT_9ROUTER = has('connect-9router');
const KEYS_ARG = arg('keys', KEYS_FILE);
const KEYS_PATH = path.isAbsolute(KEYS_ARG) ? KEYS_ARG : fs.existsSync(KEYS_ARG) ? path.resolve(KEYS_ARG) : path.resolve(ROOT, KEYS_ARG);
/** Dead keys are filed next to the keys file: `key<TAB>reason<TAB>ISO`. */
const DEAD_PATH = path.join(path.dirname(KEYS_PATH), 'keys-dead.txt');
/** The captcha step: the panel's own Turnstile widget, read back from the page
 *  we drive over the pinned exit (see src/solver.js). */
const { solveTurnstile } = require('./solver.js');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT_DIR, { recursive: true });
const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);
const rand = (n) => crypto.randomBytes(32).toString('hex').slice(0, n);

function withTimeout(promise, ms, message) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); }
    );
  });
}

// ------------------------------------------------------- fail-class ledger
/** One line per failure: {ts, account, exit, class, stage, detail} in out/attempts.jsonl. */
function ledger(rec) {
  try {
    fs.appendFileSync(path.join(OUT_DIR, 'attempts.jsonl'), JSON.stringify({ ts: new Date().toISOString(), ...rec }) + '\n');
  } catch (e) { /* diagnostics must never break the run */ }
}
function classify(e) {
  const m = String((e && e.message) || e || '');
  if (/already had a key|already|exists|in use/i.test(m)) return 'account-exists';
  if (/verification mail|no link|mail/i.test(m)) return 'mail';
  if (/terms checkbox|form never rendered|register did not sign in/i.test(m)) return 'register';
  if (/unverified|not eligible|onboarding/i.test(m)) return 'onboarding';
  if (/no key in onboarding/i.test(m)) return 'token';
  if (/chat gate|no model answered/i.test(m)) return 'chat-gate';
  if (/chrome|websocket|DevTools/i.test(m)) return 'browser';
  if (/proxy|connect|timeout|socket|ECONN|EPIPE|reset|TLS/i.test(m)) return 'exit';
  return 'other';
}

// ------------------------------------------------------------------- proxy
function parseProxy(line) {
  const s = String(line || '').trim();
  if (!s || s.startsWith('#') || s.startsWith('//')) return null;
  let m = s.match(/^(https?|socks5h?|socks4a?):\/\/(?:([^:@/]+):([^@/]+)@)?([^:/]+):(\d+)/i);
  if (!m) m = s.match(/^(?:([^:@/]+):([^@/]+)@)?([^:/]+):(\d+)$/);
  if (!m) return null;
  if (m.length === 6) {
    const raw = m[1].toLowerCase();
    if (raw === 'socks4' || raw === 'socks4a') return null; // not supported by this client
    const protocol = raw.startsWith('socks') ? 'socks5' : 'http';
    return { protocol, host: m[4], port: Number(m[5]), username: m[2] || undefined, password: m[3] || undefined, line: s };
  }
  return { protocol: 'http', host: m[3], port: Number(m[4]), username: m[1] || undefined, password: m[2] || undefined, line: s };
}
const labelOf = (p) => (p ? `${p.protocol}://${p.host}:${p.port}` : '(direct)');

/** A raw socket straight to host:port — direct-mode twin of connectThrough. */
function directConnect(host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    const sock = net.connect({ host, port });
    const t = setTimeout(() => { sock.destroy(); reject(new Error(`connect timeout (${host}:${port})`)); }, timeoutMs);
    sock.once('error', (e) => { clearTimeout(t); try { sock.destroy(); } catch {} reject(new Error(`connect failed: ${e.message}`)); });
    sock.once('connect', () => { clearTimeout(t); resolve(sock); });
  });
}

function connectThrough(proxy, host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    const sock = net.connect({ host: proxy.host, port: proxy.port });
    const t = setTimeout(() => { sock.destroy(); reject(new Error(`proxy timeout (${proxy.host}:${proxy.port})`)); }, timeoutMs);
    const done = (err, s) => { clearTimeout(t); if (err) { try { sock.destroy(); } catch {} reject(err); } else resolve(s); };
    sock.once('error', (e) => done(new Error(`proxy connect failed: ${e.message}`)));
    sock.once('connect', () => {
      if (proxy.protocol === 'socks5') {
        sock.write(proxy.username ? Buffer.from([5, 2, 0, 2]) : Buffer.from([5, 1, 0]));
        let stage = 0;
        let buf = Buffer.alloc(0);
        const sendConnect = () => {
          const hb = Buffer.from(host);
          sock.write(Buffer.concat([Buffer.from([5, 1, 0, 3, hb.length]), hb, Buffer.from([port >> 8, port & 0xff])]));
        };
        const onData = (d) => {
          try {
            buf = Buffer.concat([buf, d]);
            for (;;) {
              if (stage === 0) {
                if (buf.length < 2) return;
                const v = buf; buf = buf.slice(2);
                if (v[0] !== 5) return done(new Error('SOCKS5 bad version'));
                if (v[1] === 2) {
                  if (!proxy.username) return done(new Error('SOCKS5 auth required'));
                  const u = Buffer.from(proxy.username || '');
                  const p = Buffer.from(proxy.password || '');
                  sock.write(Buffer.concat([Buffer.from([1, u.length]), u, Buffer.from([p.length]), p]));
                  stage = 1;
                  continue;
                }
                if (v[1] !== 0) return done(new Error('SOCKS5 no acceptable method'));
                stage = 2; sendConnect(); continue;
              }
              if (stage === 1) {
                if (buf.length < 2) return;
                const v = buf; buf = buf.slice(2);
                if (v[1] !== 0) return done(new Error('SOCKS5 auth failed'));
                stage = 2; sendConnect(); continue;
              }
              if (stage === 2) {
                if (buf.length < 5) return;
                const atyp = buf[3];
                const need = 4 + (atyp === 1 ? 4 : atyp === 3 ? 1 + buf[4] : 16) + 2;
                if (buf.length < need) return;
                const rep = buf[1]; buf = buf.slice(need);
                if (rep !== 0) return done(new Error(`SOCKS5 connect failed (code ${rep})`));
                sock.off('data', onData);
                return done(null, sock);
              }
            }
          } catch (e) { done(e); }
        };
        sock.on('data', onData);
        return;
      }
      const auth = proxy.username ? `Proxy-Authorization: Basic ${Buffer.from(`${proxy.username}:${proxy.password || ''}`).toString('base64')}\r\n` : '';
      sock.write(`CONNECT ${host}:${port} HTTP/1.1\r\nHost: ${host}:${port}\r\n${auth}\r\n`);
      let buf = '';
      const onData = (d) => {
        buf += d;
        if (!buf.includes('\r\n\r\n')) return;
        sock.off('data', onData);
        if (!/^HTTP\/\d(\.\d)? 200/.test(buf)) return done(new Error(`proxy CONNECT refused: ${buf.split('\r\n')[0]}`));
        done(null, sock);
      };
      sock.on('data', onData);
    });
  });
}

/**
 * One HTTPS request through one exit (or direct). Redirects are followed on
 * demand, and a flaky exit is retried: the pool mixes proxy timeouts and
 * self-signed interception errors with working answers (measured 2026-10-21 on
 * the residential line), and one retry is far cheaper than a lost account.
 */
async function exitFetch(proxy, url, { method = 'GET', headers = {}, body = null, timeoutMs = TIMEOUT_MS, redirects = 0, tries = 3 } = {}) {
  let current = url;
  for (let hop = 0; ; hop++) {
    const u = new URL(current);
    let lastErr = null;
    let followed = false;
    for (let attempt = 1; attempt <= tries && !followed; attempt++) {
      let sock = null;
      try {
        const raw = proxy
          ? await connectThrough(proxy, u.hostname, u.port || 443, Math.min(timeoutMs, 20000))
          : await directConnect(u.hostname, u.port || 443, Math.min(timeoutMs, 20000));
        sock = tls.connect({ socket: raw, servername: u.hostname, ...(INSECURE ? { rejectUnauthorized: false } : {}) });
        await withTimeout(
          new Promise((res, rej) => { sock.once('secureConnect', res); sock.once('error', rej); }),
          timeoutMs,
          `TLS handshake timeout (${u.hostname})`
        );
        const payload = body == null ? null : Buffer.isBuffer(body) ? body : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body));
        const r = await withTimeout(
          new Promise((resolve, reject) => {
            const req = http.request(
              {
                method,
                path: u.pathname + u.search,
                createConnection: () => sock,
                headers: {
                  host: u.host,
                  'user-agent': UA,
                  accept: '*/*',
                  connection: 'close',
                  ...(payload ? { 'content-type': 'application/json', 'content-length': payload.length } : {}),
                  ...headers,
                },
              },
              (res) => {
                const chunks = [];
                res.on('data', (c) => chunks.push(c));
                res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') }));
              }
            );
            req.on('error', reject);
            if (payload) req.write(payload);
            req.end();
          }),
          timeoutMs,
          'request timeout'
        );
        try { sock.destroy(); } catch {}
        const loc = r.headers.location;
        if ([301, 302, 303, 307, 308].includes(r.status) && loc && hop < redirects) {
          const next = new URL(loc, current).toString();
          if (!next.startsWith('https://')) return { ...r, url: current };
          current = next;
          followed = true;
          break;
        }
        return { ...r, url: current };
      } catch (e) {
        lastErr = e;
        try { if (sock) sock.destroy(); } catch {}
        if (attempt < tries) await sleep(1200 * attempt);
      }
    }
    if (followed) continue;
    throw lastErr || new Error(`exit fetch failed (${current})`);
  }
}

async function exitJson(proxy, url, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  if (opts.body != null && !Buffer.isBuffer(opts.body)) headers['content-type'] = headers['content-type'] || 'application/json';
  const r = await exitFetch(proxy, url, { ...opts, headers });
  let json = null;
  try { json = JSON.parse(r.body); } catch { /* not json */ }
  return { status: r.status, json, text: r.body, headers: r.headers };
}

// ------------------------------------------------------------------- pool
function loadExits() {
  const poolArg = arg('pool', process.env.ROUTERPLEX_PROXIES || 'proxies.txt');
  const poolFile = fs.existsSync(poolArg) ? path.resolve(poolArg) : path.resolve(ROOT, poolArg);
  if (!fs.existsSync(poolFile)) {
    // No pool = DIRECT mode: the tool works without a proxy too.
    console.log(`no proxy list at ${poolFile} — running WITHOUT a proxy (direct).`);
    return [null];
  }
  const lines = fs.readFileSync(poolFile, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const exits = [];
  let skipped = 0;
  for (const line of lines) {
    const p = parseProxy(line);
    if (!p) { skipped++; continue; }
    // Chrome cannot authenticate to a SOCKS5 proxy; such lines are unusable in
    // the browser rail and are dropped here (fail-closed, never silently direct).
    if (p.protocol === 'socks5' && p.username) { skipped++; continue; }
    exits.push(p);
  }
  if (skipped) console.log(`pool: ${skipped} line(s) skipped (unparsable or socks5-with-auth — Chrome cannot use those)`);
  if (!exits.length) throw new Error(`${poolFile} has no usable exits`);
  return exits;
}

/** Exit vet: the sign-up page must answer 200 and the API host must answer.
 *  routerplex is Cloudflare-fronted — an exit that is challenged or blocked by
 *  CF (403 html) is dropped here, before a mailbox or a browser is spent. */
async function vetExit(exit) {
  const t0 = Date.now();
  const su = await exitFetch(exit, `${SITE}/sign-up`, { timeoutMs: 25000, redirects: 3 });
  if (su.status !== 200) return { ok: false, why: `sign-up ${su.status}` };
  if (!/FIRST NAME|Create your account/i.test(su.body || '')) return { ok: false, why: 'sign-up served a challenge page' };
  // The API host challenges *anonymous* traffic with a Cloudflare page but
  // answers keyed requests, so the probe carries a throwaway key: a JSON 401
  // proves reachability, a challenge page proves the exit is blocked (measured
  // 2026-10-21: an unauthenticated probe 403s even from an exit that works).
  let api = { status: 0, body: '' };
  try {
    api = await exitFetch(exit, `${API}/models`, {
      timeoutMs: 25000,
      headers: { authorization: 'Bearer sk-dummy' },
    });
  } catch (e) {
    return { ok: false, why: `api unreachable: ${String(e.message).slice(0, 60)}` };
  }
  if (/Attention Required|__cf_chl|cf-error-details|Just a moment/i.test(String(api.body || ''))) {
    return { ok: false, why: `api behind a Cloudflare challenge (${api.status})` };
  }
  if (api.status >= 500 || api.status === 0) return { ok: false, why: `api /models ${api.status}` };
  return { ok: true, ms: Date.now() - t0, api: api.status, signupBytes: su.body.length };
}

async function screen(exits) {
  let ok = 0;
  for (const e of exits) {
    try {
      const v = await vetExit(e);
      if (v.ok) ok++;
      console.log(`  ${v.ok ? '✔' : '✘'} ${labelOf(e)} ${v.ok ? `ok ${v.ms}ms (api ${v.api})` : v.why}`);
    } catch (err) {
      console.log(`  ✘ ${labelOf(e)} ${String(err.message).slice(0, 90)}`);
    }
  }
  console.log(`screened ${exits.length} exit(s): ${ok} pass the sign-up + api gates`);
}

// ------------------------------------------------------------------- mail
/**
 * temp.tf hands out plus-aliases on its own pool of real @hotmail.com boxes —
 * the address family that sails past disposable-domain screens. `/api/check` is
 * a plain JSON reader, so no browser and no Cloudflare cookie is involved.
 *
 *   GET  /api/account?providers=outlook,hotmail&dot=0&plus=1 -> {email}
 *   POST /api/check {email, wait:false}                      -> {data:[…]}
 */
async function newMailbox(exit) {
  const q = 'providers=outlook,hotmail&dot=0&plus=1';
  const r = await exitJson(exit, `${TMPTF}/api/account?${q}`, {
    headers: { 'user-agent': UA, accept: 'application/json' },
    timeoutMs: 40000,
  });
  const address = String((r.json && r.json.email) || '').trim();
  if (!/@/.test(address)) throw new Error(`temp.tf account ${r.status}: ${String(r.text).slice(0, 120)}`);
  return { provider: 'temptf', address };
}

/** Inbox messages, newest first. A throttle is an error, never a silent empty box. */
async function inboxList(exit, box) {
  const r = await exitJson(exit, `${TMPTF}/api/check`, {
    method: 'POST',
    headers: { 'user-agent': UA, accept: 'application/json' },
    body: { email: box.address, wait: false },
    timeoutMs: 40000,
  });
  const err = r.json && r.json.error;
  if (err) throw new Error(`temp.tf check: ${String(err).slice(0, 120)}`);
  const list = Array.isArray(r.json) ? r.json : r.json && (r.json.data || r.json.messages);
  return Array.isArray(list) ? list : [];
}

/** The account route is throttled per IP and the line itself 504s now and then —
 *  wait those out instead of burning the attempt. */
async function pickMailbox(exit, tries = 5) {
  let last = null;
  for (let i = 0; i < tries; i++) {
    try {
      return await newMailbox(exit);
    } catch (e) {
      last = e;
      const m = String(e.message);
      if (!/too many|rate|limit|50[0-9]|unreadable|gateway|timeout/i.test(m)) throw e;
      log(`  temp.tf hiccup (${m.slice(0, 70)}) — retrying`);
      await sleep(6000 + 4000 * i);
    }
  }
  throw last || new Error('temp.tf offered no mailbox');
}

/** Message ids already in the (pool) box before this run — never accepted. */
async function baseline(exit, box) {
  try {
    return new Set((await inboxList(exit, box)).map((m) => String(m.id)));
  } catch (e) {
    return new Set();
  }
}

/** Only the panel's own mail counts — the mailbox is a shared pool box. */
const isBrandMail = (from, subject) => /routerplex/i.test(`${from} ${subject}`);

/**
 * The one link that matters lives in `href` on a button, and every
 * tag-stripping pass deletes it — so URLs are lifted out of the raw HTML first.
 * The bare `https://routerplex.com` logo/footer links must never win.
 */
function extractVerifyLink(raw) {
  const html = typeof raw === 'string' ? raw : `${(raw && raw.body) || ''}\n${(raw && raw.html) || ''}`;
  const urls = String(html).replace(/&amp;/g, '&').match(/https?:\/\/[^\s"'<>()]+/g) || [];
  const tagged = urls.find((u) => /routerplex\.com/i.test(u) && /token|verify|confirm/i.test(u));
  return tagged ? tagged.replace(/[.,)]+$/, '') : null;
}

const mailBody = (m) => `${(m && m.subject) || ''}\n${(m && (m.body || m.html || m.content || m.text)) || ''}`;

/** Waits for the verification mail and returns its link, newest mail first. */
async function waitForVerifyLink(exit, box, skip, { timeoutMs = Math.min(LINK_TIMEOUT_MS, 300000), pollMs = 8000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  const seen = new Set();
  for (;;) {
    let messages = [];
    try {
      messages = await inboxList(exit, box);
    } catch (e) {
      log(`  mailbox: ${String(e.message).slice(0, 80)}`);
    }
    for (const m of messages) {
      const id = String(m.id);
      if (skip.has(id) || seen.has(id)) continue;
      seen.add(id);
      if (!isBrandMail(m.from || m.fromAddress || '', m.subject || '')) continue;
      const link = extractVerifyLink(mailBody(m));
      if (link) return { link, id, subject: String(m.subject || '').slice(0, 80), from: String(m.from || '').slice(0, 80) };
      log(`  mail "${String(m.subject || '').slice(0, 60)}" carries no verify link`);
    }
    if (Date.now() > deadline) throw new Error('no verification mail arrived in the window');
    await sleep(pollMs);
  }
}

// ------------------------------------------------------------ websocket CDP
/**
 * Minimal RFC6455 client for Chrome's ws:// DevTools endpoint. Node 18 has no
 * global WebSocket, so the handshake and framing are done here on `net`.
 */
class WsClient extends EventEmitter {
  constructor(url) {
    super();
    this.url = url;
    this.sock = null;
    this.buf = Buffer.alloc(0);
    this.frag = [];
    this.id = 0;
    this.pending = new Map();
  }
  connect(timeoutMs = 15000) {
    const u = new URL(this.url);
    return new Promise((resolve, reject) => {
      const sock = net.connect({ host: u.hostname, port: Number(u.port || 80) });
      this.sock = sock;
      const t = setTimeout(() => { sock.destroy(); reject(new Error('websocket handshake timeout')); }, timeoutMs);
      sock.once('error', (e) => { clearTimeout(t); reject(new Error(`websocket error: ${e.message}`)); });
      sock.once('close', () => {
        for (const [, p] of this.pending) p.reject(new Error('websocket closed'));
        this.pending.clear();
        this.emit('closed');
      });
      sock.once('connect', () => {
        sock.write(
          `GET ${u.pathname} HTTP/1.1\r\n` +
            `Host: ${u.hostname}:${u.port}\r\n` +
            'Upgrade: websocket\r\n' +
            'Connection: Upgrade\r\n' +
            `Sec-WebSocket-Key: ${crypto.randomBytes(16).toString('base64')}\r\n` +
            'Sec-WebSocket-Version: 13\r\n\r\n'
        );
      });
      let handshake = '';
      const onData = (d) => {
        handshake += d.toString('latin1');
        const idx = handshake.indexOf('\r\n\r\n');
        if (idx === -1) return;
        sock.off('data', onData);
        const head = handshake.slice(0, idx);
        if (!/^HTTP\/1\.1 101/.test(head)) {
          clearTimeout(t);
          sock.destroy();
          reject(new Error(`websocket refused: ${head.split('\r\n')[0]}`));
          return;
        }
        clearTimeout(t);
        const rest = Buffer.from(handshake.slice(idx + 4), 'latin1');
        sock.on('data', (chunk) => this._feed(chunk));
        if (rest.length) this._feed(rest);
        resolve(this);
      };
      sock.on('data', onData);
    });
  }
  _feed(chunk) {
    this.buf = Buffer.concat([this.buf, chunk]);
    for (;;) {
      const b = this.buf;
      if (b.length < 2) return;
      const fin = (b[0] & 0x80) !== 0;
      const op = b[0] & 0x0f;
      const masked = (b[1] & 0x80) !== 0;
      let len = b[1] & 0x7f;
      let off = 2;
      if (len === 126) {
        if (b.length < 4) return;
        len = b.readUInt16BE(2);
        off = 4;
      } else if (len === 127) {
        if (b.length < 10) return;
        len = Number(b.readBigUInt64BE(2));
        off = 10;
      }
      let mask = null;
      if (masked) {
        if (b.length < off + 4) return;
        mask = b.slice(off, off + 4);
        off += 4;
      }
      if (b.length < off + len) return;
      const payload = Buffer.from(b.slice(off, off + len));
      if (mask) for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i & 3];
      this.buf = b.slice(off + len);
      if (op === 0x0) {
        this.frag.push(payload);
        if (fin) { const full = Buffer.concat(this.frag).toString('utf8'); this.frag = []; this._message(full); }
        continue;
      }
      if (op === 0x1) {
        if (fin) this._message(payload.toString('utf8'));
        else this.frag = [payload];
        continue;
      }
      if (op === 0x9) { this._frame(payload, 0xa); continue; }
      if (op === 0x8) { try { this.sock.destroy(); } catch {} return; }
      // 0xa pong — ignore
    }
  }
  _frame(payload, opcode) {
    const data = Buffer.isBuffer(payload) ? payload : Buffer.from(payload);
    const len = data.length;
    let header;
    if (len < 126) header = Buffer.from([0x80 | opcode, 0x80 | len]);
    else if (len < 65536) {
      header = Buffer.alloc(4);
      header[0] = 0x80 | opcode;
      header[1] = 0x80 | 126;
      header.writeUInt16BE(len, 2);
    } else {
      header = Buffer.alloc(10);
      header[0] = 0x80 | opcode;
      header[1] = 0x80 | 127;
      header.writeBigUInt64BE(BigInt(len), 2);
    }
    const mask = crypto.randomBytes(4);
    const out = Buffer.allocUnsafe(len);
    for (let i = 0; i < len; i++) out[i] = data[i] ^ mask[i & 3];
    try { this.sock.write(Buffer.concat([header, mask, out])); } catch (e) { /* closed */ }
  }
  _message(text) {
    let msg;
    try { msg = JSON.parse(text); } catch { return; }
    if (msg.id !== undefined && this.pending.has(msg.id)) {
      const { resolve, reject } = this.pending.get(msg.id);
      this.pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message || 'cdp error'));
      else resolve(msg.result || {});
      return;
    }
    if (msg.method) this.emit('event', msg);
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this._frame(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }), 0x1);
    });
  }
  close() { try { this.sock.destroy(); } catch {} }
}

/** Thin CDP layer: session-aware send + method-scoped events. */
class CDP {
  constructor(ws) {
    this.ws = ws;
  }
  send(method, params, sessionId) { return this.ws.send(method, params, sessionId); }
  /** No `sessionId` = every session (attach events carry the new session id). */
  on(method, fn, sessionId) {
    const h = (msg) => {
      if (msg.method !== method) return;
      if (sessionId !== undefined && (msg.sessionId || undefined) !== sessionId) return;
      fn(msg.params);
    };
    this.ws.on('event', h);
    return () => this.ws.off('event', h);
  }
}

// ------------------------------------------------------------------- chrome
function findChrome() {
  if (CHROME_BIN) return CHROME_BIN;
  const cands =
    process.platform === 'win32'
      ? [
          'C:/Program Files/Google/Chrome/Application/chrome.exe',
          'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
          process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe') : null,
        ]
      : process.platform === 'darwin'
        ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
        : ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'];
  for (const c of cands) {
    if (!c) continue;
    if (c.includes('/') || c.includes('\\')) { if (fs.existsSync(c)) return c; continue; }
    const probe = spawnSync(process.platform === 'win32' ? 'where' : 'which', [c], { encoding: 'utf8', windowsHide: true });
    if (probe.status === 0 && String(probe.stdout).trim()) return String(probe.stdout).trim().split(/\r?\n/)[0];
  }
  throw new Error('Chrome not found — pass --browser <chrome.exe> or set CHROME_PATH');
}

function killChromeTree(child) {
  if (!child || child.killed || child.exitCode !== null) return;
  try {
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
    else child.kill('SIGTERM');
  } catch (e) { /* best effort */ }
}

/** A free loopback port — each run gets its own browser and profile. */
function freePort() {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.once('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const p = s.address().port;
      s.close(() => resolve(p));
    });
  });
}

/**
 * Launch Chrome with lean flags over the pinned exit (whole-browser
 * --proxy-server; authenticated HTTP proxies are answered through the Fetch
 * domain). A fresh profile per call keeps every account's panel session clean.
 */
async function launchChrome(exit) {
  const bin = findChrome();
  const debugPort = DEBUG_PORT || (await freePort());
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'routerplex-cli-'));
  const args = [
    '--disable-gpu',
    '--disable-software-rasterizer',
    '--disable-dev-shm-usage',
    '--disable-extensions',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-default-apps',
    '--disable-sync',
    '--disable-features=Translate,BackForwardCache,AcceptCHFrame,MediaRouter,OptimizationHints',
    '--renderer-process-limit=2',
    '--js-flags=--max-old-space-size=256',
    '--no-first-run',
    '--no-default-browser-check',
    '--mute-audio',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profile}`,
    '--window-size=1280,900',
    '--remote-allow-origins=*',
  ];
  if (HEADLESS) args.push('--headless=new');
  if (exit) args.push(`--proxy-server=${exit.protocol}://${exit.host}:${exit.port}`);
  args.push('about:blank');

  const child = spawn(bin, args, { detached: false, stdio: 'ignore' });
  const cleanup = () => {
    killChromeTree(child);
    setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {} }, 2000).unref();
  };
  child.once('error', cleanup);

  const devFile = path.join(profile, 'DevToolsActivePort');
  let port = 0;
  let wsPath = '';
  for (let i = 0; i < 160 && !port; i++) {
    const v = await fetch(`http://127.0.0.1:${debugPort}/json/version`).then((r) => r.json()).catch(() => null);
    if (v && v.webSocketDebuggerUrl) {
      const u = new URL(v.webSocketDebuggerUrl);
      port = Number(u.port);
      wsPath = u.pathname;
      break;
    }
    if (fs.existsSync(devFile)) {
      const lines = fs.readFileSync(devFile, 'utf8').split('\n');
      port = Number(lines[0]);
      wsPath = (lines[1] || '').trim();
      break;
    }
    await sleep(300);
  }
  if (!port) {
    cleanup();
    throw new Error(`chrome never came up (debug port ${debugPort} busy? pass --debug-port N)`);
  }

  const ws = new WsClient(`ws://127.0.0.1:${port}${wsPath || '/devtools/browser'}`);
  try {
    await ws.connect();
  } catch (e) {
    cleanup();
    throw e;
  }
  const cdp = new CDP(ws);

  // Auth'd HTTP proxy: answer 407 challenges via the Fetch domain, on the page
  // session and on every auto-attached child (out-of-process iframes).
  const needAuth = !!(exit && exit.username && exit.protocol !== 'socks5');
  const wired = new Set();
  const wireAuth = async (sid) => {
    if (!needAuth || !sid || wired.has(sid)) return;
    wired.add(sid);
    cdp.on('Fetch.authRequired', (p) => {
      cdp.send('Fetch.continueWithAuth', {
        requestId: p.requestId,
        authChallengeResponse: {
          response: 'ProvideCredentials',
          username: exit.username,
          password: exit.password || '',
          proxyUsername: exit.username,
          proxyPassword: exit.password || '',
        },
      }, sid).catch(() => {});
    }, sid);
    cdp.on('Fetch.requestPaused', (p) => cdp.send('Fetch.continueRequest', { requestId: p.requestId }, sid).catch(() => {}), sid);
    await cdp.send('Fetch.enable', { handleAuthRequests: true, patterns: [{ urlPattern: '*' }] }, sid).catch(() => {});
  };

  cdp.on('Target.attachedToTarget', (p) => wireAuth(p && p.sessionId));
  await cdp.send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: false, flatten: true });
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  for (const d of ['Page', 'Runtime', 'Network']) await cdp.send(`${d}.enable`, {}, sessionId);
  await wireAuth(sessionId);

  return {
    cdp,
    targetId,
    sessionId,
    close: async () => {
      try { await cdp.send('Target.closeTarget', { targetId }); } catch (e) {}
      try { ws.close(); } catch (e) {}
      cleanup();
    },
  };
}

class Page {
  constructor(cdp, sessionId) {
    this.cdp = cdp;
    this.sessionId = sessionId;
  }
  async eval(expr, { awaitPromise = false, timeoutMs = 70000 } = {}) {
    const r = await withTimeout(this.cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise }, this.sessionId), timeoutMs, 'eval timeout');
    if (r.exceptionDetails) throw new Error('eval: ' + JSON.stringify(r.exceptionDetails).slice(0, 300));
    return r.result && r.result.value;
  }
  async goto(url) {
    await this.cdp.send('Page.navigate', { url }, this.sessionId);
  }
  async url() {
    return this.eval('location.href', { timeoutMs: 20000 }).catch(() => '');
  }
  async shoot(name) {
    try {
      const r = await this.cdp.send('Page.captureScreenshot', { format: 'png' }, this.sessionId);
      fs.mkdirSync(SHOTS_DIR, { recursive: true });
      fs.writeFileSync(path.join(SHOTS_DIR, `${name}.png`), Buffer.from(r.data, 'base64'));
    } catch (e) { /* diagnostics only */ }
  }
}

// ---------------------------------------------------------- in-page helpers
/**
 * The panel is a plain React SPA. `set` still goes through the native value
 * descriptor and fires input/change, because React ignores a bare
 * `el.value = …`; `deep` walks shadow roots so a widget that renders inside one
 * still resolves.
 */
const pageHelper = () => `
window.__rp = window.__rp || {};
window.__rp.deep = (sel) => {
  const walk = (r) => {
    const el = r.querySelector(sel);
    if (el) return el;
    for (const e of r.querySelectorAll('*')) if (e.shadowRoot) { const f = walk(e.shadowRoot); if (f) return f; }
    return null;
  };
  return walk(document);
};
window.__rp.set = (sel, text) => {
  const el = window.__rp.deep(sel);
  if (!el) return false;
  el.focus();
  const d = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
  d.set.call(el, text);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
};
window.__rp.clickText = (re) => {
  const out = [];
  const walk = (r) => { out.push(...r.querySelectorAll('button,[role=button],a')); for (const e of r.querySelectorAll('*')) if (e.shadowRoot) walk(e.shadowRoot); };
  walk(document);
  const b = out.find((x) => new RegExp(re, 'i').test((x.innerText || '').trim()));
  if (!b) return false;
  b.click();
  return true;
};
/**
 * The terms box is required — unchecked, the register request is never sent and
 * the form just sits there. The mode argument cycles the three ways to set it,
 * because a React-controlled box can revert a plain click.
 */
window.__rp.checkTerms = (mode) => {
  const cs = [...document.querySelectorAll('input[type=checkbox]')];
  const el = cs[cs.length - 1];
  if (!el) return null;
  el.scrollIntoView({ block: 'center' });
  if (el.checked) return true;
  const label = el.closest('label');
  if (mode === 1 && label) label.click();
  else if (mode === 2) {
    const d = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'checked');
    d.set.call(el, true);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  } else el.click();
  return el.checked;
};
window.__rp.turnstile = () => { try { return (window.turnstile && window.turnstile.getResponse && window.turnstile.getResponse()) || ''; } catch (e) { return ''; } };
window.__rp.text = () => {
  const out = [];
  const walk = (r) => { out.push(r.textContent || ''); for (const e of r.querySelectorAll('*')) if (e.shadowRoot) walk(e.shadowRoot); };
  walk(document);
  return out.join(' ').replace(/\\s+/g, ' ').slice(0, 400);
};
window.__rp.fetchJson = async (p, opts) => {
  opts = opts || {};
  const r = await fetch(p, {
    method: opts.method || 'GET',
    headers: Object.assign({ Accept: 'application/json', 'Content-Type': 'application/json' }, opts.headers || {}),
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    credentials: 'include',
  });
  const text = await r.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) {}
  return { status: r.status, json, text };
};
true;
`;

/**
 * Installs (and re-installs) the in-page helper: every navigation drops the
 * `window.__rp` binding and an evaluate that lands mid-navigation throws, so
 * installation is retried.
 */
async function ensureHelper(page, tries = 20) {
  for (let i = 0; i < tries; i++) {
    const ok = await page.eval(`!!(window.__rp && window.__rp.deep)`).catch(() => false);
    if (ok) return true;
    await page.eval(pageHelper()).catch(() => {});
    await sleep(700);
  }
  return false;
}

// ------------------------------------------------------------ account flow
async function mintOnExit(n, exit) {
  const started = Date.now();
  const box = await pickMailbox(exit);
  log(`account ${n}: mailbox ${box.address}`);

  const chrome = await launchChrome(exit);
  const page = new Page(chrome.cdp, chrome.sessionId);
  let ua = null;
  let stage = 'browser';
  try {
    const inPage = (p, opts) => page.eval(`window.__rp.fetchJson(${JSON.stringify(p)}, ${JSON.stringify(opts || {})})`, { awaitPromise: true, timeoutMs: 90000 });

    log(`account ${n}: goto ${SITE}/sign-up via ${labelOf(exit)}`);
    await page.goto(`${SITE}/sign-up`);
    await sleep(8000);
    ua = await page.eval('navigator.userAgent');
    for (let i = 0; i < 20; i++) {
      if (await page.eval(`!!document.querySelector('input[type=email]')`).catch(() => false)) break;
      await sleep(1500);
    }
    if (!(await ensureHelper(page))) throw new Error('page helper could not be installed on /sign-up');
    await page.shoot('01-signup');

    // the mailbox is a shared pool box: whatever is already there is not ours
    const skip = await baseline(exit, box);

    const password = `Rp${rand(8)}!7a`;
    const email = box.address;
    const name = String(email).split('@')[0].replace(/\+.*$/, '').replace(/[^a-z]/gi, '').slice(0, 8) || 'Alex';
    stage = 'form';
    const set = (sel, val) => page.eval(`window.__rp.set(${JSON.stringify(sel)}, ${JSON.stringify(val)})`).catch(() => false);
    /** Fill the form (banner → fields → terms) and wait for a widget token. */
    const fillAndToken = async (round) => {
      if (round > 1) {
        log('  no widget token on the last page — reloading and redoing the form');
        await page.goto(`${SITE}/sign-up`);
        await sleep(7000);
        if (!(await ensureHelper(page))) throw new Error('page helper lost after reload');
      }
      // the optional-measurement banner covers the form's lower half and swallows
      // clicks aimed at the terms box — dismiss it before touching anything
      const banner = await page.eval(`window.__rp.clickText('decline|reject')`).catch(() => false);
      log(`  consent banner ${banner ? 'declined' : 'not shown'}`);
      await sleep(600);
      const f = {};
      f.first = await set('input[autocomplete=given-name]', name.charAt(0).toUpperCase() + name.slice(1));
      f.last = await set('input[autocomplete=family-name]', 'River');
      f.email = await set('input[type=email]', email);
      f.pass = await set('input[autocomplete=new-password]', password);
      f.confirm = await page.eval(
        `(() => { const ps = [...document.querySelectorAll('input[type=password]')]; const el = ps[ps.length - 1]; if (!el) return false; const d = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value'); el.focus(); d.set.call(el, ${JSON.stringify(password)}); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); el.blur(); return true; })()`
      ).catch(() => false);
      log(`  form: ${JSON.stringify(f)}`);
      if (!f.email || !f.pass) throw new Error('sign-up form never rendered (e-mail/password fields not found)');

      // The terms box is required, and an unchecked submit is a silent no-op.
      let terms = false;
      for (let i = 0; i < 6 && !terms; i++) {
        terms = await page.eval(`window.__rp.checkTerms(${i % 3})`).catch(() => false);
        if (!terms) await sleep(500);
      }
      log(`  terms checkbox ${terms}`);
      if (!terms) throw new Error('terms checkbox would not stay checked');
      await page.shoot(`02-filled-r${round}`);

      // A managed widget either answers in ~15 s or never does; sitting on a dead
      // page for a minute costs more than a reload, which usually gets a fresh
      // widget (measured 2026-10-21: EMPTY page → 794-char token after reload).
      return solveTurnstile(page, { poke: !HEADLESS, log });
    };

    let token = '';
    for (let round = 1; round <= 2 && !token; round++) token = await fillAndToken(round);

    stage = 'submit';
    // The submit can silently no-op (React re-render, a consumed widget token),
    // so the button is clicked by its own selector and retried with the box
    // re-checked between tries instead of losing the account.
    let landed = '';
    for (let attempt = 1; attempt <= 3 && !/\/dashboard/.test(landed); attempt++) {
      const clicked = await page
        .eval(`(() => { const b = document.querySelector('button[type=submit]'); if (b) { b.click(); return 'submit-button'; } return window.__rp.clickText('create account|create your account|register') ? 'button-text' : ''; })()`)
        .catch(() => '');
      log(`  submit click -> ${clicked || 'NOT FOUND'} (try ${attempt})`);
      for (let i = 0; i < 8 && !/\/dashboard/.test(landed); i++) {
        await sleep(1500);
        landed = await page.url();
      }
      if (!/\/dashboard/.test(landed) && attempt < 3) {
        log('  still on the form — resetting the widget, re-checking the box and re-submitting');
        // A consumed or stale token makes the client-side submit a no-op, so the
        // widget is reset and a fresh token waited for before the next try.
        await page
          .eval(`(() => { try { if (window.turnstile && window.turnstile.reset) window.turnstile.reset(); } catch (e) {} return true; })()`)
          .catch(() => false);
        await page.eval(`window.__rp.checkTerms(${attempt % 3})`).catch(() => false);
        const fresh = await page
          .eval(`(async () => { for (let i = 0; i < 20; i++) { const t = window.__rp.turnstile(); if (t) return String(t).length; await new Promise((r) => setTimeout(r, 1500)); } return 0; })()`, { awaitPromise: true })
          .catch(() => 0);
        log(`  fresh turnstile token len=${fresh || 0}`);
      }
    }
    log(`  after submit ${landed}`);
    await page.shoot('03-after-submit');
    if (!/\/dashboard/.test(landed)) {
      const errs = await page.eval(`(() => [...document.querySelectorAll('[role=alert],.text-red-500,.text-red-600')].map((e) => (e.innerText || '').trim()).filter(Boolean).slice(0, 3))()`).catch(() => []);
      throw new Error(`register did not sign in (${landed}) ${JSON.stringify(errs).slice(0, 200)}`);
    }

    // 5) e-mail verification — the link lives in the mail's href
    stage = 'verify';
    const mail = await waitForVerifyLink(exit, box, skip, { timeoutMs: Math.min(LINK_TIMEOUT_MS, 240000) });
    log(`  verify mail «${mail.subject}» from ${mail.from}`);
    await page.goto(mail.link);
    await sleep(6000);
    log(`  after verify link ${await page.url()}`);
    await page.shoot('04-verified');

    // 6) the setup wizard's own routes hand out the $1 trial key
    stage = 'key';
    await page.goto(`${SITE}/dashboard/setup`);
    await sleep(5000);
    if (!(await ensureHelper(page))) throw new Error('page helper could not be installed on /dashboard/setup');
    const state = await page
      .eval(
        `(async () => {
          const s = await (await fetch('/api/onboarding', { credentials: 'include' })).json();
          const tool = s.tool || ((s.tools || [])[0] || {}).id || null;
          const t = (s.tools || []).find((x) => x.id === tool) || {};
          const allowed = s.allowed_models || [];
          const ok = (m) => (t.models || []).includes(m) && (s.models || []).some((x) => x.id === m) && (!allowed.length || allowed.includes(m));
          const model = s.model && ok(s.model) ? s.model : (t.models || []).find(ok) || ((s.models || [])[0] || {}).id || null;
          return { verified: !!s.verified, key_created: !!s.key_created, eligible: !(s.has_paid || s.has_existing_credit || s.trial_granted), models: (s.models || []).length, tool, model };
        })()`,
        { awaitPromise: true }
      )
      .catch(() => null);
    if (!state) throw new Error('onboarding state unreadable');
    log(`  onboarding verified=${state.verified} models=${state.models} trial_eligible=${state.eligible}`);
    if (!state.verified) throw new Error('account still unverified after the mail link');
    if (state.key_created) throw new Error('account already had a key — this rail needs a fresh account');
    if (!state.eligible) throw new Error('account is not eligible for the trial grant');
    const tool = TOOL || state.tool;
    const adv = await inPage('/api/onboarding', { method: 'POST', body: { tool, model: state.model } });
    log(`  POST /api/onboarding tool=${tool} model=${state.model} -> ${adv.status} ${String(adv.text).slice(0, 160)}`);
    const made = await inPage('/api/onboarding/key', { method: 'POST' });
    log(`  POST /api/onboarding/key -> ${made.status} ${String(made.text).slice(0, 200)}`);
    const key = String((made.json && made.json.key) || (String(made.text).match(/sk-[A-Za-z0-9_\-]{16,}/) || [])[0] || '');
    if (!key) throw new Error(`no key in onboarding response: ${String(made.text).slice(0, 160)}`);
    await page.shoot('05-key');

    // 7) live proof through the same pinned exit — the key is kept only on 200
    stage = 'verify-key';
    const proof = await proveKey(exit, key);
    if (!proof.ok) {
      fileDeadIfRefused(key, proof.status, proof.sample);
      throw new Error(`chat gate ${proof.status}: ${String(proof.sample).slice(0, 120)}`);
    }
    await page.shoot('06-live');

    log(`account ${n}: key LIVE on ${proof.model} (${proof.models} models) · ${key.slice(0, 12)}… · ${Math.round((Date.now() - started) / 1000)}s`);
    return {
      provider: 'routerplex',
      address: box.address,
      password,
      key,
      tool,
      exit: labelOf(exit),
      ua,
      ts: new Date().toISOString(),
      trialCreditUsd: (made.json && made.json.status && made.json.status.trial_credit_usd) || 1,
      live: proof,
      models: proof.models,
      rateLimits: proof.rateLimits,
    };
  } catch (e) {
    await page.shoot(`99-fatal-${stage}`).catch(() => {});
    e.rpStage = stage;
    throw e;
  } finally {
    await chrome.close();
  }
}

async function attemptAccount(n, exits, seed) {
  const limit = Math.min(EXITS, exits.length);
  let deadCandidates = 0;
  for (let t = 0; t < limit; t++) {
    const exit = exits[(seed + t) % exits.length];
    let vet;
    try {
      vet = await vetExit(exit);
    } catch (e) {
      vet = { ok: false, why: String(e.message).slice(0, 90) };
    }
    if (!vet.ok) {
      log(`account ${n}: exit ${labelOf(exit)} failed the vet (${vet.why}) — trying the next one`);
      ledger({ account: n, exit: labelOf(exit), class: 'exit-vet', detail: vet.why });
      deadCandidates++;
      continue;
    }
    log(`account ${n}: exit pinned ${labelOf(exit)} (vet ${vet.ms}ms)`);
    // The mailbox rail is the flaky half: a dead box costs one full attempt,
    // then the next try builds a new box (and a new Chrome) on the same exit.
    let exitDead = 0;
    for (let m = 1; m <= MINT_TRIES; m++) {
      try {
        return { rec: await mintOnExit(n, exit) };
      } catch (e) {
        const cls = classify(e);
        if (cls === 'exit') exitDead++;
        log(`account ${n}: ${cls} failed (try ${m}/${MINT_TRIES}) — ${String(e.message).slice(0, 150)}`);
        ledger({ account: n, exit: labelOf(exit), class: cls, stage: e.rpStage, try: m, detail: String(e.message).slice(0, 300) });
        if (m < MINT_TRIES && GAP_MS) await sleep(GAP_MS);
      }
    }
    if (exitDead === MINT_TRIES) deadCandidates++;
  }
  return { rec: null, allTransportDead: deadCandidates > 0 && deadCandidates === limit };
}

// ------------------------------------------------------------ key handling
function readKeys(file = KEYS_PATH) {
  try {
    return fs
      .readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}
function appendKey(key) {
  fs.appendFileSync(KEYS_FILE, (fs.existsSync(KEYS_FILE) && fs.statSync(KEYS_FILE).size ? '\n' : '') + key + '\n');
}

/**
 * Dead-key report: `key<TAB>reason<TAB>ISO`, one line per key the panel refused.
 * Only a refusal is a verdict — 401/402/403/410 are filed, while a 404, a 429,
 * a 5xx or a transport error means "try again" and is never written.
 */
const DEAD_STATUS = new Set([401, 402, 403, 410]);
function fileDeadIfRefused(key, status, sample) {
  const s = Number(status);
  if (!DEAD_STATUS.has(s)) return null;
  const t = String(sample || '');
  const why = /quota|balance|credit|insufficient|exceed/i.test(t) ? `${s} quota`
    : /ban|suspend|disabl|forbidden|block/i.test(t) ? `${s} ban` : String(s);
  try { fs.appendFileSync(DEAD_PATH, `${key}\t${why}\t${new Date().toISOString()}\n`); } catch (e) { /* a report must never break the run */ }
  return why;
}
function loadAccounts() {
  try { return JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf8')); } catch { return []; }
}
function saveAccounts(list) {
  fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(list, null, 2) + '\n');
}

// ------------------------------------------------------------------- proof
/** Chat-capable candidates, free/cheap-looking first, embedding ids excluded. */
function pickCandidates(ids) {
  const chat = (ids || []).filter((id) => id && !/embedding|rerank/i.test(id));
  const out = [MODEL];
  for (const hint of ['free', 'flash', 'lite', 'mini', 'small', 'qwen']) {
    for (const id of chat) if (!out.includes(id) && id.toLowerCase().includes(hint)) out.push(id);
  }
  for (const id of chat) if (!out.includes(id)) out.push(id);
  return out.slice(0, 8);
}

async function listModels(exit, key) {
  const r = await exitJson(exit, `${API}/models`, { headers: { authorization: `Bearer ${key}` }, timeoutMs: TIMEOUT_MS });
  return { status: r.status, ids: ((r.json && r.json.data) || []).map((m) => m.id).filter(Boolean) };
}

const RL_HEADERS = [
  'x-ratelimit-limit-requests',
  'x-ratelimit-remaining-requests',
  'x-ratelimit-limit-tokens',
  'x-ratelimit-remaining-tokens',
  'retry-after',
];
/** One real completion; 200 with content (or reasoning) = the key is live. */
async function chatGate(exit, key, model) {
  const r = await exitJson(exit, `${API}/chat/completions`, {
    method: 'POST',
    headers: { authorization: `Bearer ${key}` },
    timeoutMs: Math.max(TIMEOUT_MS, 120000),
    body: { model, messages: [{ role: 'user', content: 'Reply with the single word: ok' }], max_tokens: 16, stream: false },
  });
  const msg = r.json && r.json.choices && r.json.choices[0] && r.json.choices[0].message;
  const content = msg && (msg.content || msg.reasoning_content);
  const rateLimits = {};
  for (const k of RL_HEADERS) if (r.headers && r.headers[k] != null) rateLimits[k] = String(r.headers[k]);
  return {
    ok: r.status === 200 && !!content,
    status: r.status,
    model,
    sample: content ? String(content).slice(0, 60) : String(r.text).slice(0, 140),
    rateLimits,
  };
}

/**
 * Models + a completion on the first model that answers — the keep/drop gate.
 *
 * A brand-new trial key can answer 401 for several minutes while the gateway
 * provisions the account (measured 2026-10-21: ~10 min, while the panel keeps
 * saying blocked:false). That window is waited out, not read as a dead key.
 */
async function proveKey(exit, key, { grantWaitMs = GRANT_WAIT_MS, log_ = log } = {}) {
  const deadline = Date.now() + grantWaitMs;
  for (;;) {
    const models = await listModels(exit, key);
    if (models.status === 200 && models.ids.length) {
      let last = null;
      for (const model of pickCandidates(models.ids)) {
        try {
          const g = await chatGate(exit, key, model);
          if (g.ok) return { ok: true, status: 200, model: g.model, sample: g.sample, models: models.ids.length, rateLimits: g.rateLimits };
          last = g;
        } catch (e) {
          last = { status: 0, model, sample: String(e.message).slice(0, 120), rateLimits: {} };
        }
      }
      return { ok: false, status: last && last.status, models: models.ids.length, sample: (last && last.sample) || 'no model answered', rateLimits: (last && last.rateLimits) || {} };
    }
    if (models.status === 401 && Date.now() < deadline) {
      log_(`  ${key.slice(0, 12)}… 401 while the gateway provisions — waiting 90 s`);
      await sleep(90000);
      continue;
    }
    return { ok: false, status: models.status, models: 0, sample: `GET /v1/models -> ${models.status}`, rateLimits: {} };
  }
}

// ------------------------------------------------------------------- modes
async function mint(exits) {
  log(`routerplex mint · ${COUNT} account(s) · model ${MODEL} · exits ${exits.filter(Boolean).length || 'direct'} · keys land in ${KEYS_FILE}`);
  const accounts = loadAccounts();
  let made = 0;
  const routes = Math.min(EXITS, exits.length);
  let transportDead = 0;
  for (let i = 0; i < COUNT; i++) {
    const out = await attemptAccount(i + 1, exits, i);
    if (out.rec) {
      appendKey(out.rec.key);
      accounts.push(out.rec);
      saveAccounts(accounts);
      made++;
    } else if (out.allTransportDead) transportDead++;
    if (i < COUNT - 1 && GAP_MS) await sleep(GAP_MS);
  }
  if (!made && transportDead === COUNT) {
    const route = exits[0] === null ? 'direct mode (no proxy list)' : `${exits.length}-exit pool`;
    console.error(`[fatal] no usable route — ${COUNT} account(s) × ${routes} candidate(s) over ${route}: every attempt died at the transport layer.`);
    process.exit(1);
  }
  log(`done — ${made}/${COUNT} key(s) written to ${KEYS_FILE}`);
  process.exit(made === COUNT ? 0 : 1);
}

async function verifyOnly(exits) {
  const keys = readKeys();
  if (!keys.length) {
    console.log(`no keys in ${KEYS_PATH}`);
    process.exit(0);
  }
  console.log(`keys: ${keys.length} from ${KEYS_PATH} · exits ${exits.filter(Boolean).length || 'direct'}`);
  let live = 0;
  // Refused keys leave keys.txt for keys-dead.txt; anything that is not a
  // verdict (404/429/5xx/transport) stays in the list for the next run.
  const dead = [];
  let modelCount = null;
  for (let i = 0; i < keys.length; i++) {
    const exit = exits[i % exits.length];
    try {
      if (modelCount === null) {
        const m = await listModels(exit, keys[i]);
        modelCount = m.ids.length;
        console.log(`  /v1/models -> ${m.status}, ${modelCount} models`);
      }
      const g = await proveKey(exit, keys[i]);
      if (g.ok) live++;
      else if (fileDeadIfRefused(keys[i], g.status, g.sample)) dead.push(keys[i]);
      console.log(`  ${g.ok ? '✔' : '✘'} ${keys[i].slice(0, 12)}… chat=${g.ok ? 200 : g.status || 0} ${g.ok ? `${g.model} "${g.sample}" rl=${JSON.stringify(g.rateLimits)}` : String(g.sample).slice(0, 90)}`);
    } catch (e) {
      console.log(`  ✘ ${keys[i].slice(0, 12)}… ${String(e.message).slice(0, 90)}`);
    }
  }
  if (dead.length) {
    const gone = new Set(dead);
    fs.writeFileSync(KEYS_PATH, `${keys.filter((k) => !gone.has(k)).join('\n')}\n`);
    console.log(`dead: ${dead.length} → ${DEAD_PATH} (removed from ${KEYS_PATH})`);
  }
  console.log(`verify: ${live}/${keys.length} keys live`);
  process.exit(live === keys.length ? 0 : 1);
}

// ------------------------------------------------------------ 9Router
/** Register the provider-node + one connection per key on a local 9Router. */
async function connect9router() {
  const base = (arg('9router-base', 'http://localhost:20128')).replace(/\/$/, '');
  const password = arg('9router-password', '123456');
  const name = arg('9router-name', 'RouterPlex');
  const prefix = arg('9router-prefix', 'routerplex');
  const baseUrl = arg('base-url', `${API}`);
  const r9ua = 'routerplex-bulk-9router-connector/1.0';
  const keys = arg('api-key', '') ? [arg('api-key', '')] : readKeys();
  if (!keys.length) {
    console.log(`no keys — mint one first (node src/cli.js --count 1), or pass --api-key <key>`);
    process.exit(1);
  }

  const login = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': r9ua },
    body: JSON.stringify({ password }),
  });
  const setCookie = typeof login.headers.getSetCookie === 'function' ? login.headers.getSetCookie() : [];
  const cookie = setCookie.map((c) => c.split(';')[0]).join('; ');
  console.log(`9Router login: ${login.ok ? 'ok' : `not required/failed ${(await login.text()).slice(0, 120)}`}`);

  const api = async (route, init = {}) => {
    const res = await fetch(`${base}${route}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', 'User-Agent': r9ua, ...(cookie ? { Cookie: cookie } : {}), ...(init.headers || {}) },
    });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* non-JSON reported as text */ }
    return { status: res.status, ok: res.ok, json, text: text.slice(0, 300) };
  };

  const nodes = await api('/api/provider-nodes');
  let node = (((nodes.json || {}).nodes) || []).find((n) => n.prefix === prefix || n.name === name);
  if (node) {
    console.log(`provider-node exists: ${node.id} (prefix ${node.prefix})`);
  } else {
    const created = await api('/api/provider-nodes', {
      method: 'POST',
      body: JSON.stringify({ name, prefix, apiType: 'chat', type: 'openai-compatible', baseUrl }),
    });
    if (!created.ok) throw new Error(`create node failed ${created.status}: ${created.text}`);
    node = created.json.node;
    console.log(`provider-node created: ${node.id} (${baseUrl})`);
  }

  const conns = await api('/api/providers');
  const existing = (((conns.json || {}).connections) || []).filter((c) => c.provider === node.id || c.name === name);
  let added = 0;
  for (let i = 0; i < keys.length; i++) {
    const connName = keys.length === 1 ? name : `${prefix}-${String(i + 1).padStart(3, '0')}`;
    if (existing.some((c) => c.name === connName)) {
      console.log(`connection exists: ${connName}`);
      continue;
    }
    const created = await api('/api/providers', {
      method: 'POST',
      body: JSON.stringify({ provider: node.id, apiKey: keys[i], name: connName, priority: 1, defaultModel: MODEL }),
    });
    if (!created.ok && created.status !== 409) throw new Error(`create connection ${connName} failed ${created.status}: ${created.text}`);
    added++;
    console.log(`connection created: ${connName}`);
  }
  console.log(`\nDone — ${added} new connection(s). Models are served as ${prefix}/<model id>:\n  ${prefix}/${MODEL}`);
}

// ------------------------------------------------------------------- main
if (require.main === module) {
  (async () => {
    if (CONNECT_9ROUTER) {
      await connect9router();
      process.exit(0);
    }
    const exits = loadExits();
    if (SCREEN) {
      const pass = await screen(exits);
      process.exit(pass ? 0 : 1);
    }
    if (VERIFY_ONLY) {
      await verifyOnly(exits);
      return;
    }
    await mint(exits);
  })().catch((e) => {
    console.error('[fatal]', e.message);
    process.exit(1);
  });
}

// Exported so the lab can drive parts of the rail directly (page probe); the
// CLI itself only runs its main flow when executed as a script.
module.exports = { parseProxy, extractVerifyLink, pickCandidates, launchChrome, Page, pageHelper, WsClient, CDP, proveKey, vetExit, newMailbox, waitForVerifyLink, parseArgs: arg };
