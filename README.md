<div align="center">

```
██████╗  ██████╗ ██╗   ██╗████████╗███████╗██████╗ ██████╗ ██╗     ███████╗
██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██║     ██╔════╝
██████╔╝██║   ██║██║   ██║   ██║   █████╗  ██████╔╝██████╔╝██║     █████╗
██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ██╔══██╗██╔═══╝ ██║     ██╔══╝
██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗██║  ██║██║     ███████╗███████╗
╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝╚══════╝

██╗  ██╗
╚██╗██╔╝
 ╚███╔╝
 ██╔██╗
██╔╝ ██╗
╚═╝  ╚═╝
```

# routerplex-bulk-apikey

**Bulk-create RouterPlex accounts with auto-generated API keys — OpenAI-compatible inference + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-72%20served-412991?style=for-the-badge)](https://docs.routerplex.com/models)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-72-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Why this exists

RouterPlex is a Cloudflare-fronted AI gateway with **one grant worth having: $1 of test credit, once per verified account** (no card, no phone, credited when the setup key is created). The catalogue behind it is 72 models — Anthropic, OpenAI, Google, DeepSeek, Qwen, MiniMax, Kimi, Grok — served at vendor list price through an OpenAI-compatible endpoint, plus Anthropic Messages and a Responses route for Codex. Sign-up is a plain e-mail form, but the register call carries a **Cloudflare Turnstile** token and answers `403 __cf_chl_rt_tk` to anything that is not a browser, so the tool drives a real Chrome and keeps only the keys that pass a live chat call.

## 🎁 Free tier — how much you get

| What | Value |
| --- | --- |
| Free credit | **$1.00 once per eligible verified account**, granted inside `POST /api/onboarding/key` (panel: `trial_credit_usd: 1.0`, `trial_granted: true`) |
| Key budget | the setup key starts at a hard `max_budget: 1.0` (USD) |
| Rate limits | **10 requests/min**, **250,000 tokens/min** (`rpm_limit: 10`, `tpm_limit: 250000` on the key row), 4 concurrent requests per the offer terms |
| Expiry | **none** — `expires: null`, the credit does not expire |
| Card / phone | **no card, no phone** — “No card needed. Signup and guided setup have no payment step.” |
| Eligibility | verified e-mail + no previous paid top-up, no existing credit, no previous setup-credit grant (one grant per account, checked live: `trial_eligible` flips to `false` after the key is created) |
| After the $1 | pay-as-you-go only, minimum top-up **$5** (card or crypto), $0 top-up fee, 0% token markup |

Promotional credit has no cash value and may be withdrawn for abuse — one account, one key, one grant is the unit that scales.

> 💡 The free tier is set by RouterPlex and can change. Check the live numbers at [routerplex.com](https://routerplex.com) — and let the tool's own gate decide:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Models — all 72 of them

`GET /v1/models` answered **200 with 72 ids** on a live trial key (2026-10-21). Every key this tool writes has already answered a real completion; these five were chat-verified end to end:

| Model ID | note |
| --- | --- |
| `deepseek-v4.1-flash` | the verification default — 200 `pong`, cheapest of the set ($0.18 / $0.73 per 1M) |
| `claude-haiku-4-5` | 200 |
| `gemini-2.5-flash-lite` | 200 |
| `MiniMax-M3` | 200 |
| `qwen3.8-flash` | 200 |

Catalog also carries `gpt-5.4`/`gpt-5.5`/`gpt-5.6-terra`, `gpt-6-sol`, `claude-sonnet-4-6`/`claude-opus-5`, `gemini-3.1-pro`/`gemini-3.5-flash`, `MiniMax-M3.1-flash`, `step-3.7-flash`, `doubao-seed-2.0-pro`, `mimo-v2.6-pro`, `deepseek-v4-pro`, `kimi-k3`, `glm-5.2`, `qwen3.7-max`/`qwen3.8-max`, `grok-4.7`, `LongCat-2.0`, `hy3`, `gpt-image-2` — those were **not** individually chat-tested here; read the live list from `/v1/models` instead of trusting a hard-coded set.

A model id the gateway does not know is rejected before billing: `gpt-5.4-mini` → **400** `{"error":{"type":"invalid_request_error","code":400,"provider":"RouterPlex"}}`. A bad key is **401** `RouterPlex could not authenticate this API key.`

## 🧪 How to use the API

Base URL **`https://api.routerplex.com/v1`** — OpenAI-compatible chat completions, plus `/v1/messages` (Anthropic) and a Responses route for Codex; the docs' own example is a bearer call:

```bash
curl --fail-with-body https://api.routerplex.com/v1/chat/completions \
  -H "Authorization: Bearer $ROUTERPLEX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"Reply with the single word: ok"}]}'
```

```python
from openai import OpenAI
c = OpenAI(base_url="https://api.routerplex.com/v1", api_key="YOUR_KEY")
print(c.chat.completions.create(model="deepseek-v4.1-flash",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

Keys are 25 characters, `sk-` prefixed. Trial traffic is capped at 10 RPM / 250k TPM / 4 concurrent, so a burst answers **429**; space the calls out.

## 🛠 Quick start

```bash
cd routerplex-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify
# or directly:
node src/cli.js --count 1        # one sign-up in a real Chrome (Turnstile), $1 credit, one key
node src/cli.js --verify-only    # re-test every key already in keys.txt
node src/cli.js --screen         # test the exit list against sign-up + the API
```

The sign-up needs a real, visible Chrome: the register call carries a Turnstile token and Cloudflare answers `403 __cf_chl_rt_tk` to plain HTTP clients. `keys.txt` is written only after `GET /v1/models` **and** a real completion, and `accounts.json` keeps the account state (e-mail, password, key, tool). One account = one key = one $1 grant.

### 🖱️ The launcher

`node src/launcher.js` is a menu over the task modules this repo ships — **mint** (a fresh account, its verified e-mail, the $1 setup key) and **verify** (re-run the live gate over `keys.txt`), with the proxy pool and the account count kept in `launcher.config.json`. Every flag below is reachable from the CLI directly; the launcher is only a convenience wrapper.

## ✅ Verified working — every key is tested

All checks below were re-run on **2026-10-21** from the shipped CLI (exit: a vetted residential line from the operator pool — datacenter exits load the form but never mount the widget, see below).

**9/10 keys live** — one key was rotated out after a leaked sample prefix; the replacement slot needs a fresh (unused) network for the trial grant.

| Check | Result |
| --- | --- |
| `--screen` (exit vet) | **✔** — `routerplex.com/sign-up` **200** with the real form and the API answering a **throwaway-keyed** probe with JSON **401** (an anonymous probe is 403-challenged by Cloudflare even from an exit that works, so the vet keys it) |
| sign-up in real Chrome | **✔ 201** `POST /api/auth/register` → `200 /api/auth/login` → `/dashboard/setup` |
| e-mail verification | **✔** — `verify?token=…` link from the inbox, `/api/auth/me` then reports `is_verified: true` |
| `POST /api/onboarding` | **200** `trial_credit_usd: 1.0`, `trial_eligible: true` |
| `POST /api/onboarding/key` | **200** `{"key":"sk-…"}`, `trial_granted: true`, `access_mode: "trial"` |
| `GET /v1/models` per key | **200**, 72 ids |
| `POST /v1/chat/completions` per key before it is written | **200** — `deepseek-v4.1-flash` (`content \|\| reasoning_content`); also 200 on `claude-haiku-4-5`, `gemini-2.5-flash-lite`, `MiniMax-M3`, `qwen3.8-flash` |
| key row after minting | `max_budget 1.0`, `rpm_limit 10`, `tpm_limit 250000`, `blocked false`, `expires null` |
| a key that fails its check | never written to `keys.txt` (the gate retries a fresh key's 401 window instead of dropping it) |

Cost of the first call: `$0.00056328` on `claude-haiku-4-5`, so $1 is a lot of trial traffic at flash-model prices.

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: RouterPlex page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.routerplex.com/v1/chat/completions → real content = the key is live
```

| Step | Call | Notes |
| --- | --- | --- |
| vet | `GET routerplex.com/sign-up` + `GET api.routerplex.com/v1/models` | the vet keys the API probe (anonymously it is 403-challenged) and skips an exit that gets a challenge page instead of the form, before a mailbox is spent |
| mailbox | temp.tf plus-alias on a real `@hotmail.com`/`@outlook.com` box | `/api/account` then `POST /api/check`; only mail from `routerplex` is accepted (the box is a shared pool) |
| form | `/sign-up` in real Chrome | names + e-mail + password + **terms box**; the optional-measurement banner is dismissed first |
| captcha | the page's own Turnstile (managed, sitekey `0x4AAAAAAD0CGKtkBfp1Bvp6`) | self-solves in a visible window; the token rides in the register body |
| register | `POST /api/auth/register` (201) then `/api/auth/login` (200) | the page does both and lands on `/dashboard/setup` |
| verify | open `https://routerplex.com/verify?token=…` from the mail | the link lives in the mail's `href`; JWT `aud=fastapi-users:verify`, ~1 h |
| key | `POST /api/onboarding {tool,model}` then `POST /api/onboarding/key` | the wizard's own routes; the **$1 lands in the key call** |
| gate | `GET /v1/models` + a completion | 200 with content (or reasoning) is the only thing that writes `keys.txt` |

Two measured traps: an **unchecked terms box makes submit a silent no-op** (no request, no error), and a **brand-new key can answer 401 for several minutes** while the gateway provisions the account — the panel still says `blocked: false`, so the gate waits it out rather than calling the key dead.

## ⚙️ CLI options

```bash
node src/cli.js --count 5                  # five sign-ups, serial (one visible Chrome)
node src/cli.js --model claude-haiku-4-5   # model used for the live gate
node src/cli.js --tool opencode            # setup wizard tool that claims the trial
node src/cli.js --verify-only              # re-check keys.txt
node src/cli.js --screen                   # exit-pool self-test
node src/cli.js --connect-9router          # register provider + keys on a local 9Router
node src/cli.js --help
```

| Flag | Default | Meaning |
| --- | --- | --- |
| `--count N` | `1` | accounts to mint, serial |
| `--model <id>` | `deepseek-v4.1-flash` | model used for the live gate |
| `--tool <id>` | `claude-code` | setup wizard tool the trial is claimed with |
| `--pool <file>` | `proxies.txt` | exit pool, one line per proxy — optional |
| `--tries N` | `3` | exit candidates vetted per account |
| `--mint-tries N` | `3` | full sign-up attempts (fresh mailbox + Chrome) per exit |
| `--link-timeout S` | `300` | seconds to wait for the verification mail |
| `--grant-wait S` | `150` | seconds a fresh key's 401 window is waited out |
| `--gap MS` | `4000` | pause between accounts |
| `--keys <file>` | `keys.txt` | key file for `--verify-only` / `--connect-9router` |
| `--headless` | off | run Chrome headless (a visible window is the tested rail) |
| `--debug-port N` | auto | Chrome DevTools port |

## 🛰️ Behind a proxy

**Optional — recommended at scale (per-IP limits, bans).** The tool works without a proxy too.

- **With a pool:** pass `--pool <file>` (or set `ROUTERPLEX_PROXIES`) and every request — the Chrome browser included — goes through an exit from that list, fail-closed: each candidate is vetted first (`routerplex.com/sign-up` 200 with the real form + the API host reachable) and the run then stays pinned to that exit. A dead line fails its attempt and the CLI moves to the next candidate.
- **Without a pool:** the CLI prints `running WITHOUT a proxy (direct)` and connects directly. Nothing about sign-up, key minting or verification changes — only where the packets leave from.
- **Exit quality matters more than usual here.** The panel is Cloudflare-fronted: from a datacenter exit the sign-up page still renders, but `challenges.cloudflare.com` never mounts the widget (`window.turnstile` stays undefined, no token) and the register POST answers a `Just a moment...` 403. A residential/mobile line gets a 750-800 character token and a 201 in seconds, so vet with a widget check before spending mailboxes.
- SOCKS5 lines with a username/password are skipped: Chrome cannot authenticate to them (HTTP proxies with credentials are fine — the browser answers the 407 via the Fetch domain).
- The vet is fail-closed on both hosts: the sign-up page must be the real form (a Cloudflare challenge page fails it) and the API must answer a throwaway-keyed probe with JSON, not a challenge page.
- Run `--screen` against either mode: it tests the exits you have (or the direct route) against the sign-up page and the API.

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | one live-verified key per line — git-ignored |
| `accounts.json` | e-mail / password / key / tool state, incl. failed attempts |
| `proxies.txt` | your exits — git-ignored |
| `out/` | run log, failure screenshots, `attempts.jsonl` ledger — git-ignored |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Defaults: `--prefix routerplex`, `--base-url https://api.routerplex.com/v1`, `--model deepseek-v4.1-flash`. Models are served as `routerplex/<model id>`. The CLI can do the same in one shot: `node src/cli.js --connect-9router`.

## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **RouterPlex** — [routerplex.com](https://routerplex.com) |
| 🎁 What the provider gives | **$1 trial credit per verified account** (one grant, no card, never expires) |
| 🔑 What one key gets you | the 72-model catalogue on `https://api.routerplex.com/v1` — hard-capped at a $1 budget, 10 RPM / 250k TPM |
| 🌐 API shape | OpenAI-compatible: `POST https://api.routerplex.com/v1/chat/completions` (+ Anthropic Messages, Responses) |
| 🔒 Your data | only `routerplex.com` / `api.routerplex.com` and your inbox backend are contacted |

## 🐞 Issues

If RouterPlex changes its sign-up form, the onboarding route or the model catalogue, the tool stops there and says so. **[Open an issue](../../issues)** with the command and the exact output.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 routerplex-bulk-apikey contributors

</div>
