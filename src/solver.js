'use strict';

/**
 * solver.js — the captcha step of this repo (the browser rail lives in cli.js).
 *
 * RouterPlex sign-up is Cloudflare-fronted and the register body carries a
 * Turnstile token, so the panel's *own widget* is the solver: the token is
 * minted inside the page the CLI already drives over the pinned exit, bound to
 * that exit's IP. Nothing is injected into the page and no token is ever
 * pasted — this module only reads the widget back and, when a managed widget
 * stalls, delivers the one real mouse click an interactive widget needs.
 *
 *   const { solveTurnstile } = require('./solver.js');
 *   const token = await solveTurnstile(page, { poke: !HEADLESS, log });
 *
 * `page` is the CDP page from cli.js (`eval`, `cdp`, `sessionId`). Headed
 * Chrome is the measured rail; headless gets `poke: false` because a headless
 * window cannot be clicked.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** One real click on the widget's checkbox — dispatched as mouseMoved →
 *  mousePressed → mouseReleased, because a bare `click()` on the iframe is the
 *  first thing a bot check looks at. Only fires when the challenge iframe is
 *  actually up and big enough to be the interactive widget. */
async function pokeTurnstile(page) {
  const box = await page.eval(
    `(() => { const f = [...document.querySelectorAll('iframe')].find((x) => /challenges\\.cloudflare\\.com/.test(x.src || '')); if (!f) return null; const r = f.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()`,
    { timeoutMs: 20000 }
  ).catch(() => null);
  if (!box || box.w < 10) return false;
  const x = box.x + Math.min(30, box.w / 2);
  const y = box.y + box.h / 2;
  await page.cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }, page.sessionId);
  await page.cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1 }, page.sessionId);
  await sleep(70);
  await page.cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', buttons: 0, clickCount: 1 }, page.sessionId);
  return true;
}

/**
 * The widget's token, or '' when it never answered — the caller then reloads
 * the form and asks once more (measured 2026-10-21: an EMPTY page turned into a
 * 794-char token after a reload, so a stalled widget is worth one retry and not
 * a minute of waiting).
 */
async function solveTurnstile(page, { rounds = 20, gapMs = 1500, poke = true, pokeAt = 5, log = () => {} } = {}) {
  for (let i = 0; i < rounds; i++) {
    const tok = await page.eval('window.__rp.turnstile()').catch(() => '');
    if (tok) {
      log(`  turnstile ${String(tok).slice(0, 12)}… (${String(tok).length})`);
      return tok;
    }
    if (i === pokeAt && poke) await pokeTurnstile(page).catch(() => false);
    await sleep(gapMs);
  }
  log('  turnstile EMPTY');
  return '';
}

module.exports = { solveTurnstile, pokeTurnstile };
