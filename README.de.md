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

**RouterPlex-Konten in großen Mengen erstellen mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz + 9Router-Konnektor.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-72%20served-412991?style=for-the-badge)](https://docs.routerplex.com/models)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-72-of-them) · [🧪 Die API nutzen](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 So funktioniert es](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

RouterPlex ist ein Cloudflare-vorgeschaltetes KI-Gateway mit **einem Zuschuss, der sich lohnt: 1 $ Testguthaben, einmal pro verifiziertem Konto** (keine Karte, kein Telefon, gutgeschrieben bei der Erstellung des Setup-Schlüssels). Der dahinterliegende Katalog umfasst 72 Modelle — Anthropic, OpenAI, Google, DeepSeek, Qwen, MiniMax, Kimi, Grok — bereitgestellt zum Listenpreis des Anbieters über einen OpenAI-kompatiblen Endpunkt, plus Anthropic Messages und eine Responses-Route für Codex. Die Anmeldung ist ein einfaches E-Mail-Formular, aber der Registrierungsaufruf trägt ein **Cloudflare-Turnstile**-Token und antwortet allem, was kein Browser ist, mit `403 __cf_chl_rt_tk`, weshalb das Tool einen echten Chrome steuert und nur die Schlüssel behält, die einen Live-Chat-Aufruf bestehen.

## 🎁 Kostenlose Stufe — wie viel du bekommst

| Was | Wert |
| --- | --- |
| Kostenloses Guthaben | **1,00 $ einmal pro berechtigtem verifizierten Konto**, gewährt innerhalb von `POST /api/onboarding/key` (Panel: `trial_credit_usd: 1.0`, `trial_granted: true`) |
| Schlüsselbudget | der Setup-Schlüssel startet mit einem harten `max_budget: 1.0` (USD) |
| Ratenlimits | **10 Anfragen/Min.**, **250.000 Token/Min.** (`rpm_limit: 10`, `tpm_limit: 250000` in der Schlüsselzeile), 4 gleichzeitige Anfragen gemäß den Angebotsbedingungen |
| Ablauf | **keiner** — `expires: null`, das Guthaben läuft nicht ab |
| Karte / Telefon | **keine Karte, kein Telefon** — „Keine Karte nötig. Anmeldung und geführte Einrichtung haben keinen Zahlungsschritt." |
| Berechtigung | verifizierte E-Mail + keine vorherige bezahlte Aufladung, kein bestehendes Guthaben, kein vorheriger Setup-Guthabenzuschuss (ein Zuschuss pro Konto, live geprüft: `trial_eligible` wechselt nach der Schlüsselerstellung auf `false`) |
| Nach dem 1 $ | nur Pay-as-you-go, Mindestaufladung **5 $** (Karte oder Krypto), 0 $ Aufladegebühr, 0 % Token-Aufschlag |

Werbeguthaben hat keinen Barwert und kann bei Missbrauch entzogen werden — ein Konto, ein Schlüssel, ein Zuschuss ist die Einheit, die skaliert.

> 💡 Die kostenlose Stufe wird von RouterPlex festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen auf [routerplex.com](https://routerplex.com) — und lass das eigene Gate des Tools entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 72 davon

`GET /v1/models` antwortete mit **200 und 72 IDs** auf einem Live-Test-Schlüssel (2026-10-21). Jeder Schlüssel, den dieses Tool schreibt, hat bereits eine echte Completion beantwortet; diese fünf wurden Ende-zu-Ende per Chat verifiziert:

| Modell-ID | Anmerkung |
| --- | --- |
| `deepseek-v4.1-flash` | der Verifizierungs-Standard — 200 `pong`, günstigstes der Gruppe (0,18 $ / 0,73 $ pro 1 Mio.) |
| `claude-haiku-4-5` | 200 |
| `gemini-2.5-flash-lite` | 200 |
| `MiniMax-M3` | 200 |
| `qwen3.8-flash` | 200 |

Der Katalog enthält außerdem `gpt-5.4`/`gpt-5.5`/`gpt-5.6-terra`, `gpt-6-sol`, `claude-sonnet-4-6`/`claude-opus-5`, `gemini-3.1-pro`/`gemini-3.5-flash`, `MiniMax-M3.1-flash`, `step-3.7-flash`, `doubao-seed-2.0-pro`, `mimo-v2.6-pro`, `deepseek-v4-pro`, `kimi-k3`, `glm-5.2`, `qwen3.7-max`/`qwen3.8-max`, `grok-4.7`, `LongCat-2.0`, `hy3`, `gpt-image-2` — diese wurden hier **nicht** einzeln per Chat getestet; lies die Live-Liste aus `/v1/models`, statt einem fest kodierten Satz zu vertrauen.

Eine Modell-ID, die das Gateway nicht kennt, wird vor der Abrechnung abgelehnt: `gpt-5.4-mini` → **400** `{"error":{"type":"invalid_request_error","code":400,"provider":"RouterPlex"}}`. Ein ungültiger Schlüssel ist **401** `RouterPlex could not authenticate this API key.`

## 🧪 So nutzt du die API

Basis-URL **`https://api.routerplex.com/v1`** — OpenAI-kompatible Chat-Completions, plus `/v1/messages` (Anthropic) und eine Responses-Route für Codex; das eigene Beispiel der Dokumentation ist ein Bearer-Aufruf:

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

Schlüssel sind 25 Zeichen lang, mit `sk-`-Präfix. Test-Traffic ist auf 10 RPM / 250k TPM / 4 gleichzeitig begrenzt, daher antwortet ein Burst mit **429**; verteile die Aufrufe zeitlich.

## 🛠 Schnellstart

```bash
cd routerplex-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify

# or directly:
node src/cli.js --count 1        # one sign-up in a real Chrome (Turnstile), $1 credit, one key
node src/cli.js --verify-only    # re-test every key already in keys.txt
node src/cli.js --screen         # test the exit list against sign-up + the API
```

Die Anmeldung erfordert einen echten, sichtbaren Chrome: Der Registrierungsaufruf trägt ein Turnstile-Token und Cloudflare antwortet einfachen HTTP-Clients mit `403 __cf_chl_rt_tk`. `keys.txt` wird erst nach `GET /v1/models` **und** einer echten Completion geschrieben, und `accounts.json` speichert den Kontozustand (E-Mail, Passwort, Schlüssel, Tool). Ein Konto = ein Schlüssel = ein 1-$-Zuschuss.

### 🖱️ Der Launcher

`node src/launcher.js` ist ein Menü über die Aufgabenmodule, die dieses Repo mitliefert — **mint** (ein frisches Konto, seine verifizierte E-Mail, der 1-$-Setup-Schlüssel) und **verify** (das Live-Gate erneut über `keys.txt` laufen lassen), wobei der Proxy-Pool und die Kontenanzahl in `launcher.config.json` gehalten werden. Jedes Flag unten ist direkt über die CLI erreichbar; der Launcher ist nur ein praktischer Wrapper.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

Alle untenstehenden Prüfungen wurden am **2026-10-21** über die mitgelieferte CLI erneut ausgeführt (Exit: eine geprüfte Residential-Leitung aus dem Betreiber-Pool — Datacenter-Exits laden das Formular, mounten aber nie das Widget, siehe unten).

**verified working** —

| Prüfung | Ergebnis |
| --- | --- |
| `--screen` (Exit-Prüfung) | **✔** — `routerplex.com/sign-up` **200** mit dem echten Formular und die API antwortet auf eine **Wegwerf-Schlüssel**-Probe mit JSON **401** (eine anonyme Probe wird selbst von einem funktionierenden Exit per Cloudflare-Challenge mit 403 beantwortet, daher versieht die Prüfung sie mit einem Schlüssel) |
| Anmeldung in echtem Chrome | **✔ 201** `POST /api/auth/register` → `200 /api/auth/login` → `/dashboard/setup` |
| E-Mail-Verifizierung | **✔** — `verify?token=…`-Link aus dem Postfach, `/api/auth/me` meldet dann `is_verified: true` |
| `POST /api/onboarding` | **200** `trial_credit_usd: 1.0`, `trial_eligible: true` |
| `POST /api/onboarding/key` | **200** `{"key":"sk-…"}`, `trial_granted: true`, `access_mode: "trial"` |
| `GET /v1/models` pro Schlüssel | **200**, 72 IDs |
| `POST /v1/chat/completions` pro Schlüssel, bevor er geschrieben wird | **200** — `deepseek-v4.1-flash` (`content \|\| reasoning_content`); ebenfalls 200 bei `claude-haiku-4-5`, `gemini-2.5-flash-lite`, `MiniMax-M3`, `qwen3.8-flash` |
| Schlüsselzeile nach dem Minting | `max_budget 1.0`, `rpm_limit 10`, `tpm_limit 250000`, `blocked false`, `expires null` |
| Ein Schlüssel, der seine Prüfung nicht besteht | wird nie in `keys.txt` geschrieben (das Gate wiederholt das 401-Fenster eines frischen Schlüssels, statt ihn zu verwerfen) |

Kosten des ersten Aufrufs: `0,00056328 $` bei `claude-haiku-4-5`, also ist 1 $ bei Flash-Modell-Preisen eine Menge Test-Traffic.

## 🧭 So funktioniert es

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: RouterPlex page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.routerplex.com/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| Prüfung | `GET routerplex.com/sign-up` + `GET api.routerplex.com/v1/models` | die Prüfung versieht die API-Probe mit einem Schlüssel (anonym wird sie per 403-Challenge beantwortet) und überspringt einen Exit, der eine Challenge-Seite statt des Formulars erhält, bevor ein Postfach verbraucht wird |
| Postfach | temp.tf Plus-Alias auf einer echten `@hotmail.com`/`@outlook.com`-Box | `/api/account` dann `POST /api/check`; nur Mail von `routerplex` wird akzeptiert (die Box ist ein geteilter Pool) |
| Formular | `/sign-up` in echtem Chrome | Namen + E-Mail + Passwort + **AGB-Kästchen**; das optionale Mess-Banner wird zuerst weggeklickt |
| Captcha | das eigene Turnstile der Seite (managed, Sitekey `0x4AAAAAAD0CGKtkBfp1Bvp6`) | löst sich selbst in einem sichtbaren Fenster; das Token reist im Registrierungs-Body mit |
| Registrierung | `POST /api/auth/register` (201) dann `/api/auth/login` (200) | die Seite macht beides und landet auf `/dashboard/setup` |
| Verifizierung | `https://routerplex.com/verify?token=…` aus der Mail öffnen | der Link steckt im `href` der Mail; JWT `aud=fastapi-users:verify`, ~1 h |
| Schlüssel | `POST /api/onboarding {tool,model}` dann `POST /api/onboarding/key` | die eigenen Routen des Assistenten; der **1 $ landet im Schlüsselaufruf** |
| Gate | `GET /v1/models` + eine Completion | 200 mit Inhalt (oder Reasoning) ist das Einzige, was `keys.txt` schreibt |

Zwei gemessene Fallstricke: Ein **nicht angekreuztes AGB-Kästchen macht das Absenden zu einem stillen No-op** (keine Anfrage, kein Fehler), und ein **brandneuer Schlüssel kann mehrere Minuten lang 401 antworten**, während das Gateway das Konto bereitstellt — das Panel sagt trotzdem `blocked: false`, daher wartet das Gate es ab, statt den Schlüssel für tot zu erklären.

## ⚙️ CLI-Optionen

```bash
node src/cli.js --count 5                  # five sign-ups, serial (one visible Chrome)
node src/cli.js --model claude-haiku-4-5   # model used for the live gate
node src/cli.js --tool opencode            # setup wizard tool that claims the trial
node src/cli.js --verify-only              # re-check keys.txt
node src/cli.js --screen                   # exit-pool self-test
node src/cli.js --connect-9router          # register provider + keys on a local 9Router
node src/cli.js --help
```

| Flag | Standard | Bedeutung |
| --- | --- | --- |
| `--count N` | `1` | Anzahl der zu erstellenden Konten, seriell |
| `--model <id>` | `deepseek-v4.1-flash` | Modell, das für das Live-Gate verwendet wird |
| `--tool <id>` | `claude-code` | Setup-Assistent-Tool, mit dem die Testversion beansprucht wird |
| `--pool <file>` | `proxies.txt` | Exit-Pool, eine Zeile pro Proxy — optional |
| `--tries N` | `3` | Exit-Kandidaten, die pro Konto geprüft werden |
| `--mint-tries N` | `3` | vollständige Anmeldeversuche (frisches Postfach + Chrome) pro Exit |
| `--link-timeout S` | `300` | Sekunden, die auf die Verifizierungsmail gewartet wird |
| `--grant-wait S` | `150` | Sekunden, die das 401-Fenster eines frischen Schlüssels abgewartet wird |
| `--gap MS` | `4000` | Pause zwischen den Konten |
| `--keys <file>` | `keys.txt` | Schlüsseldatei für `--verify-only` / `--connect-9router` |
| `--headless` | aus | Chrome headless ausführen (ein sichtbares Fenster ist die getestete Schiene) |
| `--debug-port N` | automatisch | Chrome-DevTools-Port |

## 🛰️ Hinter einem Proxy

**Optional — bei Skalierung empfohlen (Limits pro IP, Sperren).** Das Tool funktioniert auch ohne Proxy.

- **Mit einem Pool:** übergib `--pool <file>` (oder setze `ROUTERPLEX_PROXIES`) und jede Anfrage — einschließlich des Chrome-Browsers — geht durch einen Exit aus dieser Liste, fail-closed: jeder Kandidat wird zuerst geprüft (`routerplex.com/sign-up` 200 mit dem echten Formular + der API-Host erreichbar) und der Lauf bleibt dann an diesen Exit gebunden. Eine tote Leitung lässt ihren Versuch scheitern und die CLI geht zum nächsten Kandidaten über.
- **Ohne einen Pool:** die CLI gibt `running WITHOUT a proxy (direct)` aus und verbindet direkt. An Anmeldung, Schlüsselerstellung oder Verifizierung ändert sich nichts — nur daran, wo die Pakete das Haus verlassen.
- **Die Exit-Qualität ist hier wichtiger als sonst.** Das Panel ist Cloudflare-vorgeschaltet: Von einem Datacenter-Exit rendert die Anmeldeseite zwar noch, aber `challenges.cloudflare.com` mountet das Widget nie (`window.turnstile` bleibt undefined, kein Token) und der Registrierungs-POST antwortet mit einem `Just a moment...`-403. Eine Residential-/Mobile-Leitung erhält ein 750-800 Zeichen langes Token und ein 201 in Sekunden, prüfe also mit einem Widget-Check, bevor du Postfächer verbrauchst.
- SOCKS5-Leitungen mit Benutzername/Passwort werden übersprungen: Chrome kann sich bei ihnen nicht authentifizieren (HTTP-Proxys mit Anmeldedaten sind in Ordnung — der Browser beantwortet das 407 über die Fetch-Domain).
- Die Prüfung ist bei beiden Hosts fail-closed: Die Anmeldeseite muss das echte Formular sein (eine Cloudflare-Challenge-Seite lässt sie scheitern) und die API muss auf eine Wegwerf-Schlüssel-Probe mit JSON antworten, nicht mit einer Challenge-Seite.
- Führe `--screen` gegen beide Modi aus: Es testet die Exits, die du hast (oder die direkte Route) gegen die Anmeldeseite und die API.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein live-verifizierter Schlüssel pro Zeile — von Git ignoriert |
| `accounts.json` | E-Mail-/Passwort-/Schlüssel-/Tool-Zustand, inkl. fehlgeschlagener Versuche |
| `proxies.txt` | deine Exits — von Git ignoriert |
| `out/` | Lauf-Log, Fehler-Screenshots, `attempts.jsonl`-Ledger — von Git ignoriert |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Standardwerte: `--prefix routerplex`, `--base-url https://api.routerplex.com/v1`, `--model deepseek-v4.1-flash`. Modelle werden als `routerplex/<model id>` bereitgestellt. Die CLI kann dasselbe in einem Durchgang erledigen: `node src/cli.js --connect-9router`.

## 🔌 Mit OmniRoute verbinden

[OmniRoute](https://omniroute.online) ist ein selbst gehosteter, OpenAI-kompatibler Router:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

Standardwerte: `--prefix routerplex`, `--base-url https://api.routerplex.com/v1`, `--model deepseek-v4.1-flash`. Modelle werden als `routerplex/<model id>` bereitgestellt. Die CLI kann dasselbe in einem Durchgang erledigen: `node src/cli.js --connect-omniroute`.
## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **RouterPlex** — [routerplex.com](https://routerplex.com) |
| 🎁 Was der Anbieter gibt | **1 $ Testguthaben pro verifiziertem Konto** (ein Zuschuss, keine Karte, läuft nie ab) |
| 🔑 Was ein Schlüssel dir bringt | der 72-Modell-Katalog auf `https://api.routerplex.com/v1` — hart begrenzt auf ein 1-$-Budget, 10 RPM / 250k TPM |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://api.routerplex.com/v1/chat/completions` (+ Anthropic Messages, Responses) |
| 🔒 Deine Daten | nur `routerplex.com` / `api.routerplex.com` und dein Postfach-Backend werden kontaktiert |

## 🐞 Probleme

Wenn RouterPlex sein Anmeldeformular, die Onboarding-Route oder den Modellkatalog ändert, stoppt das Tool dort und sagt es. **[Öffne ein Issue](../../issues)** mit dem Befehl und der exakten Ausgabe.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 routerplex-bulk-apikey contributors

</div>