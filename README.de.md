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

**RouterPlex-Konten in großen Mengen erstellen mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz + 9Router-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-72%20served-412991?style=for-the-badge)](https://docs.routerplex.com/models)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-72-of-them) · [🧪 Die API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 So funktioniert es](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

RouterPlex ist ein AI-Gateway hinter Cloudflare mit **einer Zuwendung, die es wert ist: 1 $ Testguthaben, einmal pro verifiziertem Konto** (keine Karte, kein Telefon, gutgeschrieben, sobald der Setup-Schlüssel erstellt wird). Der dahinterliegende Katalog umfasst 72 Modelle — Anthropic, OpenAI, Google, DeepSeek, Qwen, MiniMax, Kimi, Grok — bereitgestellt zum Listenpreis des Anbieters über einen OpenAI-kompatiblen Endpunkt, plus Anthropic Messages und eine Responses-Route für Codex. Die Anmeldung ist ein einfaches E-Mail-Formular, aber der Registrierungsaufruf trägt ein **Cloudflare-Turnstile**-Token und antwortet allem, was kein Browser ist, mit `403 __cf_chl_rt_tk`, weshalb das Tool ein echtes Chrome steuert und nur die Schlüssel behält, die einen Live-Chat-Aufruf bestehen.

## 🎁 Kostenlose Stufe — wie viel du bekommst

| Was | Wert |
| --- | --- |
| Kostenloses Guthaben | **1,00 $ einmal pro berechtigtem verifiziertem Konto**, gewährt innerhalb von `POST /api/onboarding/key` (Panel: `trial_credit_usd: 1.0`, `trial_granted: true`) |
| Schlüsselbudget | der Setup-Schlüssel startet bei einem harten `max_budget: 1.0` (USD) |
| Ratenlimits | **10 Anfragen/Min.**, **250.000 Token/Min.** (`rpm_limit: 10`, `tpm_limit: 250000` in der Schlüsselzeile), 4 gleichzeitige Anfragen gemäß den Angebotsbedingungen |
| Ablauf | **keiner** — `expires: null`, das Guthaben läuft nicht ab |
| Karte / Telefon | **keine Karte, kein Telefon** — „No card needed. Signup and guided setup have no payment step.“ |
| Berechtigung | verifizierte E-Mail + keine vorherige bezahlte Aufladung, kein bestehendes Guthaben, keine vorherige Setup-Guthaben-Zuwendung (eine Zuwendung pro Konto, live geprüft: `trial_eligible` wechselt nach Erstellung des Schlüssels auf `false`) |
| Nach dem 1 $ | nur Pay-as-you-go, Mindestaufladung **5 $** (Karte oder Krypto), 0 $ Aufladegebühr, 0 % Token-Aufschlag |

Werbeguthaben hat keinen Barwert und kann bei Missbrauch entzogen werden — ein Konto, ein Schlüssel, eine Zuwendung ist die Einheit, die skaliert.

> 💡 Die kostenlose Stufe wird von RouterPlex festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen auf [routerplex.com](https://routerplex.com) — und lass das Gate des Tools selbst entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 72 davon

`GET /v1/models` antwortete mit **200 und 72 IDs** auf einem Live-Test-Schlüssel (2026-10-21). Jeder Schlüssel, den dieses Tool schreibt, hat bereits eine echte Completion beantwortet; diese fünf wurden Ende-zu-Ende per Chat verifiziert:

| Modell-ID | Anmerkung |
| --- | --- |
| `deepseek-v4.1-flash` | der Verifizierungs-Standard — 200 `pong`, günstigstes der Gruppe (0,18 $ / 0,73 $ pro 1M) |
| `claude-haiku-4-5` | 200 |
| `gemini-2.5-flash-lite` | 200 |
| `MiniMax-M3` | 200 |
| `qwen3.8-flash` | 200 |

Der Katalog enthält außerdem `gpt-5.4`/`gpt-5.5`/`gpt-5.6-terra`, `gpt-6-sol`, `claude-sonnet-4-6`/`claude-opus-5`, `gemini-3.1-pro`/`gemini-3.5-flash`, `MiniMax-M3.1-flash`, `step-3.7-flash`, `doubao-seed-2.0-pro`, `mimo-v2.6-pro`, `deepseek-v4-pro`, `kimi-k3`, `glm-5.2`, `qwen3.7-max`/`qwen3.8-max`, `grok-4.7`, `LongCat-2.0`, `hy3`, `gpt-image-2` — diese wurden hier **nicht** einzeln per Chat getestet; lies die Live-Liste aus `/v1/models`, statt einer fest codierten Menge zu vertrauen.

Eine Modell-ID, die das Gateway nicht kennt, wird vor der Abrechnung abgelehnt: `gpt-5.4-mini` → **400** `{"error":{"type":"invalid_request_error","code":400,"provider":"RouterPlex"}}`. Ein ungültiger Schlüssel ist **401** `RouterPlex could not authenticate this API key.`

## 🧪 So verwendest du die API

Basis-URL **`https://api.routerplex.com/v1`** — OpenAI-kompatible Chat-Completions, plus `/v1/messages` (Anthropic) und eine Responses-Route für Codex; das eigene Beispiel der Dokumentation ist ein Bearer-Aufruf:

```bash
curl --fail-with-body https://api.routerplex.com/v1/chat/completions \
  -H "Authorization: Bearer $ROUTERPLEX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"Reply with the single word: ok"}]}'
```

```python
from openai import OpenAI
c = OpenAI(base_url="https://api.routerplex.com/v1", api_key="<your key>")
print(c.chat.completions.create(model="deepseek-v4.1-flash",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

Schlüssel sind 25 Zeichen lang, mit `sk-`-Präfix. Test-Traffic ist auf 10 RPM / 250k TPM / 4 gleichzeitig begrenzt, sodass ein Burst mit **429** antwortet; verteile die Aufrufe zeitlich.

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

Die Anmeldung benötigt ein echtes, sichtbares Chrome: Der Registrierungsaufruf trägt ein Turnstile-Token und Cloudflare antwortet einfachen HTTP-Clients mit `403 __cf_chl_rt_tk`. `keys.txt` wird erst geschrieben, nachdem `GET /v1/models` **und** eine echte Completion erfolgreich waren, und `accounts.json` speichert den Kontozustand (E-Mail, Passwort, Schlüssel, Tool). Ein Konto = ein Schlüssel = eine 1-$-Zuwendung.

### 🖱️ Der Launcher

`node src/launcher.js` ist ein Menü über die Aufgabenmodule, die dieses Repo mitliefert — **mint** (ein frisches Konto, seine verifizierte E-Mail, der 1-$-Setup-Schlüssel) und **verify** (das Live-Gate erneut über `keys.txt` laufen lassen), wobei der Proxy-Pool und die Kontenanzahl in `launcher.config.json` gehalten werden. Jedes unten aufgeführte Flag ist direkt über die CLI erreichbar; der Launcher ist nur ein praktischer Wrapper.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

Alle untenstehenden Prüfungen wurden am **2026-10-21** über die mitgelieferte CLI erneut ausgeführt (Exit: eine geprüfte Residential-Leitung aus dem Betreiber-Pool — Datacenter-Exits laden das Formular, mounten aber nie das Widget, siehe unten).

| Prüfung | Ergebnis |
| --- | --- |
| `--screen` (Exit-Prüfung) | **✔** — `routerplex.com/sign-up` **200** mit dem echten Formular und die API antwortet auf eine **mit Wegwerf-Schlüssel versehene** Probe mit JSON **401** (eine anonyme Probe wird selbst von einem funktionierenden Exit durch Cloudflare mit 403 herausgefordert, daher versieht die Prüfung sie mit einem Schlüssel) |
| Anmeldung in echtem Chrome | **✔ 201** `POST /api/auth/register` → `200 /api/auth/login` → `/dashboard/setup` |
| E-Mail-Verifizierung | **✔** — `verify?token=…`-Link aus dem Posteingang, `/api/auth/me` meldet dann `is_verified: true` |
| `POST /api/onboarding` | **200** `trial_credit_usd: 1.0`, `trial_eligible: true` |
| `POST /api/onboarding/key` | **200** `{"key":"sk-…"}`, `trial_granted: true`, `access_mode: "trial"` |
| `GET /v1/models` pro Schlüssel | **200**, 72 IDs |
| `POST /v1/chat/completions` pro Schlüssel, bevor er geschrieben wird | **200** — `deepseek-v4.1-flash` (`content \|\| reasoning_content`); ebenfalls 200 bei `claude-haiku-4-5`, `gemini-2.5-flash-lite`, `MiniMax-M3`, `qwen3.8-flash` |
| Schlüsselzeile nach dem Minting | `max_budget 1.0`, `rpm_limit 10`, `tpm_limit 250000`, `blocked false`, `expires null` |
| ein Schlüssel, der seine Prüfung nicht besteht | wird nie in `keys.txt` geschrieben (das Gate wiederholt das 401-Fenster eines frischen Schlüssels, statt ihn zu verwerfen) |

Kosten des ersten Aufrufs: `$0.00056328` bei `claude-haiku-4-5`, also ist 1 $ bei Flash-Modell-Preisen eine Menge Test-Traffic.

> **Qualitätsgates.** Jeder Schlüssel hier hat ein Live-`chat-200` bestanden, bevor er in `keys.txt`
> geschrieben wurde (tote Schlüssel werden nie ausgeliefert). Router-Kombinationen folgen derselben Regel
> auf Modellebene: Ein Eintrag wird **nur hinzugefügt, wenn das Modell `chat-200` antwortet und Tools
> aufrufen kann** — ein Modell ohne Tool-Unterstützung, ein toter Schlüssel oder ein toter Anbieter wird
> verworfen statt hinzugefügt. Führe den Verifizierungsschritt jederzeit erneut aus; Fehler werden
> gemeldet, nie verborgen.

## 🧭 So funktioniert es

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: RouterPlex page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.routerplex.com/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf | Anmerkungen |
| --- | --- | --- |
| Prüfung | `GET routerplex.com/sign-up` + `GET api.routerplex.com/v1/models` | die Prüfung versieht die API-Probe mit einem Schlüssel (anonym wird sie mit 403 herausgefordert) und überspringt einen Exit, der eine Challenge-Seite statt des Formulars erhält, bevor ein Postfach verbraucht wird |
| Postfach | temp.tf Plus-Alias auf einer echten `@hotmail.com`/`@outlook.com`-Box | `/api/account`, dann `POST /api/check`; nur Mail von `routerplex` wird akzeptiert (die Box ist ein geteilter Pool) |
| Formular | `/sign-up` in echtem Chrome | Namen + E-Mail + Passwort + **Terms-Checkbox**; das optionale Mess-Banner wird zuerst weggeklickt |
| Captcha | das eigene Turnstile der Seite (managed, Sitekey `0x4AAAAAAD0CGKtkBfp1Bvp6`) | löst sich selbst in einem sichtbaren Fenster; das Token fährt im Registrierungs-Body mit |
| Registrierung | `POST /api/auth/register` (201), dann `/api/auth/login` (200) | die Seite macht beides und landet auf `/dashboard/setup` |
| Verifizierung | `https://routerplex.com/verify?token=…` aus der Mail öffnen | der Link steht im `href` der Mail; JWT `aud=fastapi-users:verify`, ~1 h |
| Schlüssel | `POST /api/onboarding {tool,model}`, dann `POST /api/onboarding/key` | die eigenen Routen des Assistenten; die **1 $ landen im Schlüsselaufruf** |
| Gate | `GET /v1/models` + eine Completion | 200 mit Inhalt (oder Reasoning) ist das Einzige, was `keys.txt` schreibt |

Zwei gemessene Fallstricke: Eine **nicht angehakte Terms-Checkbox macht das Absenden zu einem stillen No-op** (keine Anfrage, kein Fehler), und ein **brandneuer Schlüssel kann mehrere Minuten lang 401 antworten**, während das Gateway das Konto bereitstellt — das Panel sagt trotzdem `blocked: false`, also wartet das Gate es ab, statt den Schlüssel als unbrauchbar zu bezeichnen.

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
| `--exits N` | `6` | pro Konto geprüfte Exit-Kandidaten |
| `--mint-tries N` | `3` | vollständige Anmeldeversuche (frisches Postfach + Chrome) pro Exit |
| `--link-timeout S` | `300` | Sekunden, die auf die Verifizierungs-Mail gewartet wird |
| `--grant-wait S` | `150` | Sekunden, die das 401-Fenster eines frischen Schlüssels abgewartet wird |
| `--gap MS` | `4000` | Pause zwischen den Konten |
| `--keys <file>` | `keys.txt` | Schlüsseldatei für `--verify-only` / `--connect-9router` |
| `--headless` | aus | Chrome headless ausführen (ein sichtbares Fenster ist die getestete Schiene) |
| `--debug-port N` | automatisch | Chrome-DevTools-Port |

## 🛰️ Hinter einem Proxy

**Optional — bei Skalierung empfohlen (Limits pro IP, Bans).** Das Tool funktioniert auch ohne Proxy.

- **Mit einem Pool:** übergib `--pool <file>` (oder setze `ROUTERPLEX_PROXIES`), und jede Anfrage — einschließlich des Chrome-Browsers — geht durch einen Exit aus dieser Liste, fail-closed: jeder Kandidat wird zuerst geprüft (`routerplex.com/sign-up` 200 mit dem echten Formular + der API-Host erreichbar) und der Lauf bleibt dann an diesen Exit gebunden. Eine tote Leitung lässt ihren Versuch scheitern und die CLI geht zum nächsten Kandidaten über.
- **Ohne einen Pool:** die CLI gibt `running WITHOUT a proxy (direct)` aus und verbindet direkt. An Anmeldung, Schlüssel-Minting oder Verifizierung ändert sich nichts — nur daran, wo die Pakete das Haus verlassen.
- **Die Exit-Qualität ist hier wichtiger als sonst.** Das Panel liegt hinter Cloudflare: Von einem Datacenter-Exit rendert die Anmeldeseite zwar noch, aber `challenges.cloudflare.com` mountet nie das Widget (`window.turnstile` bleibt undefined, kein Token) und der Registrierungs-POST antwortet mit einem `Just a moment...` 403. Eine Residential-/Mobile-Leitung erhält in Sekunden ein 750-800-Zeichen-Token und ein 201, also prüfe mit einem Widget-Check, bevor du Postfächer verbrauchst.
- SOCKS5-Leitungen mit Benutzername/Passwort werden übersprungen: Chrome kann sich bei ihnen nicht authentifizieren (HTTP-Proxys mit Zugangsdaten sind in Ordnung — der Browser beantwortet die 407 über die Fetch-Domain).
- Die Prüfung ist auf beiden Hosts fail-closed: Die Anmeldeseite muss das echte Formular sein (eine Cloudflare-Challenge-Seite lässt sie scheitern) und die API muss auf eine mit Wegwerf-Schlüssel versehene Probe mit JSON antworten, nicht mit einer Challenge-Seite.
- Führe `--screen` gegen beide Modi aus: Es testet die Exits, die du hast (oder die direkte Route) gegen die Anmeldeseite und die API.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein live-verifizierter Schlüssel pro Zeile — von Git ignoriert |
| `accounts.json` | E-Mail-/Passwort-/Schlüssel-/Tool-Zustand, inkl. fehlgeschlagener Versuche |
| `proxies.txt` | deine Exits — von Git ignoriert |
| `out/` | Ausführungsprotokoll, Fehler-Screenshots, `attempts.jsonl`-Ledger — von Git ignoriert |

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
| 🎁 Was der Anbieter gibt | **1 $ Testguthaben pro verifiziertem Konto** (eine Zuwendung, keine Karte, läuft nie ab) |
| 🔑 Was ein Schlüssel dir bringt | den 72-Modell-Katalog auf `https://api.routerplex.com/v1` — hart begrenzt auf ein 1-$-Budget, 10 RPM / 250k TPM |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://api.routerplex.com/v1/chat/completions` (+ Anthropic Messages, Responses) |
| 🔒 Deine Daten | nur `routerplex.com` / `api.routerplex.com` und dein Postfach-Backend werden kontaktiert |

## 🐞 Probleme

Wenn RouterPlex sein Anmeldeformular, die Onboarding-Route oder den Modellkatalog ändert, stoppt das Tool dort und sagt es. **[Öffne ein Issue](../../issues)** mit dem Befehl und der exakten Ausgabe.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 routerplex-bulk-apikey contributors

</div>