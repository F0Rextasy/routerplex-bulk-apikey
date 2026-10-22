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

**Массовое создание аккаунтов RouterPlex с автоматически сгенерированными API-ключами — вывод, совместимый с OpenAI, + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-72%20served-412991?style=for-the-badge)](https://docs.routerplex.com/models)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-72-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

RouterPlex — это AI-шлюз с фронтендом на Cloudflare, у которого есть **один стоящий грант: $1 тестового кредита, один раз на подтверждённый аккаунт** (без карты, без телефона, начисляется при создании setup-ключа). За ним стоит каталог из 72 моделей — Anthropic, OpenAI, Google, DeepSeek, Qwen, MiniMax, Kimi, Grok — обслуживаемых по каталожной цене вендора через endpoint, совместимый с OpenAI, плюс Anthropic Messages и маршрут Responses для Codex. Регистрация — это обычная форма с e-mail, но запрос на регистрацию несёт токен **Cloudflare Turnstile** и отвечает `403 __cf_chl_rt_tk` всему, что не является браузером, поэтому инструмент управляет настоящим Chrome и сохраняет только те ключи, которые проходят живой чат-запрос.

## 🎁 Бесплатный тариф — сколько вы получаете

| Что | Значение |
| --- | --- |
| Бесплатный кредит | **$1.00 один раз на подходящий подтверждённый аккаунт**, начисляется внутри `POST /api/onboarding/key` (панель: `trial_credit_usd: 1.0`, `trial_granted: true`) |
| Бюджет ключа | setup-ключ начинается с жёсткого `max_budget: 1.0` (USD) |
| Лимиты скорости | **10 запросов/мин**, **250 000 токенов/мин** (`rpm_limit: 10`, `tpm_limit: 250000` в строке ключа), 4 одновременных запроса согласно условиям предложения |
| Срок действия | **нет** — `expires: null`, кредит не истекает |
| Карта / телефон | **без карты, без телефона** — «No card needed. Signup and guided setup have no payment step.» |
| Право на получение | подтверждённый e-mail + отсутствие предыдущего платного пополнения, отсутствие существующего кредита, отсутствие предыдущего начисления setup-кредита (один грант на аккаунт, проверяется в реальном времени: `trial_eligible` переключается на `false` после создания ключа) |
| После $1 | только оплата по мере использования, минимальное пополнение **$5** (карта или криптовалюта), комиссия за пополнение $0, наценка на токены 0% |

Промо-кредит не имеет денежной стоимости и может быть отозван за злоупотребление — один аккаунт, один ключ, один грант — это единица, которая масштабируется.

> 💡 Бесплатный тариф устанавливается RouterPlex и может меняться. Проверяйте актуальные цифры на [routerplex.com](https://routerplex.com) — и пусть собственный гейт инструмента решает:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Модели — все 72 из них

`GET /v1/models` ответил **200 с 72 id** на живом trial-ключе (2026-10-21). Каждый ключ, который записывает этот инструмент, уже ответил на реальное завершение; эти пять были проверены чатом от начала до конца:

| ID модели | примечание |
| --- | --- |
| `deepseek-v4.1-flash` | по умолчанию для верификации — 200 `pong`, самая дешёвая из набора ($0.18 / $0.73 за 1M) |
| `claude-haiku-4-5` | 200 |
| `gemini-2.5-flash-lite` | 200 |
| `MiniMax-M3` | 200 |
| `qwen3.8-flash` | 200 |

Каталог также содержит `gpt-5.4`/`gpt-5.5`/`gpt-5.6-terra`, `gpt-6-sol`, `claude-sonnet-4-6`/`claude-opus-5`, `gemini-3.1-pro`/`gemini-3.5-flash`, `MiniMax-M3.1-flash`, `step-3.7-flash`, `doubao-seed-2.0-pro`, `mimo-v2.6-pro`, `deepseek-v4-pro`, `kimi-k3`, `glm-5.2`, `qwen3.7-max`/`qwen3.8-max`, `grok-4.7`, `LongCat-2.0`, `hy3`, `gpt-image-2` — они **не** были протестированы чатом по отдельности здесь; читайте живой список из `/v1/models` вместо того, чтобы доверять жёстко заданному набору.

ID модели, который шлюз не знает, отклоняется до выставления счёта: `gpt-5.4-mini` → **400** `{"error":{"type":"invalid_request_error","code":400,"provider":"RouterPlex"}}`. Плохой ключ — это **401** `RouterPlex could not authenticate this API key.`

## 🧪 Как использовать API

Базовый URL **`https://api.routerplex.com/v1`** — совместимые с OpenAI chat completions, плюс `/v1/messages` (Anthropic) и маршрут Responses для Codex; собственный пример из документации — это вызов с bearer:

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

Ключи состоят из 25 символов с префиксом `sk-`. Trial-трафик ограничен 10 RPM / 250k TPM / 4 одновременными запросами, поэтому всплеск отвечает **429**; разносите вызовы по времени.

## 🛠 Быстрый старт

```bash
cd routerplex-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify

# or directly:
node src/cli.js --count 1        # one sign-up in a real Chrome (Turnstile), $1 credit, one key
node src/cli.js --verify-only    # re-test every key already in keys.txt
node src/cli.js --screen         # test the exit list against sign-up + the API
```

Регистрация требует настоящего, видимого Chrome: запрос на регистрацию несёт токен Turnstile, и Cloudflare отвечает `403 __cf_chl_rt_tk` обычным HTTP-клиентам. `keys.txt` записывается только после `GET /v1/models` **и** реального завершения, а `accounts.json` хранит состояние аккаунта (e-mail, пароль, ключ, инструмент). Один аккаунт = один ключ = один грант $1.

### 🖱️ Лаунчер

`node src/launcher.js` — это меню над модулями задач, которые поставляет этот репозиторий — **mint** (свежий аккаунт, его подтверждённый e-mail, setup-ключ на $1) и **verify** (повторный запуск живого гейта по `keys.txt`), с пулом прокси и количеством аккаунтов, хранящимися в `launcher.config.json`. Каждый флаг ниже доступен напрямую из CLI; лаунчер — лишь удобная обёртка.

## ✅ Проверено в работе — каждый ключ тестируется

Все проверки ниже были повторно запущены **2026-10-21** из поставляемого CLI (выход: проверенная резидентная линия из пула оператора — выходы дата-центров загружают форму, но никогда не монтируют виджет, см. ниже).

**verified working** —

| Проверка | Результат |
| --- | --- |
| `--screen` (проверка выхода) | **✔** — `routerplex.com/sign-up` **200** с настоящей формой, и API отвечает на пробу с **одноразовым ключом** JSON **401** (анонимная проба получает 403-челлендж от Cloudflare даже с рабочего выхода, поэтому проверка использует ключ) |
| регистрация в настоящем Chrome | **✔ 201** `POST /api/auth/register` → `200 /api/auth/login` → `/dashboard/setup` |
| подтверждение e-mail | **✔** — ссылка `verify?token=…` из почтового ящика, `/api/auth/me` затем сообщает `is_verified: true` |
| `POST /api/onboarding` | **200** `trial_credit_usd: 1.0`, `trial_eligible: true` |
| `POST /api/onboarding/key` | **200** `{"key":"sk-…"}`, `trial_granted: true`, `access_mode: "trial"` |
| `GET /v1/models` на каждый ключ | **200**, 72 id |
| `POST /v1/chat/completions` на каждый ключ до его записи | **200** — `deepseek-v4.1-flash` (`content \|\| reasoning_content`); также 200 на `claude-haiku-4-5`, `gemini-2.5-flash-lite`, `MiniMax-M3`, `qwen3.8-flash` |
| строка ключа после создания | `max_budget 1.0`, `rpm_limit 10`, `tpm_limit 250000`, `blocked false`, `expires null` |
| ключ, не прошедший проверку | никогда не записывается в `keys.txt` (гейт пережидает окно 401 свежего ключа вместо того, чтобы отбросить его) |

Стоимость первого вызова: `$0.00056328` на `claude-haiku-4-5`, так что $1 — это много trial-трафика по ценам flash-моделей.

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: RouterPlex page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.routerplex.com/v1/chat/completions → real content = the key is live
```

| Шаг | Вызов | Примечания |
| --- | --- | --- |
| проверка | `GET routerplex.com/sign-up` + `GET api.routerplex.com/v1/models` | проверка использует ключ для пробы API (анонимно она получает 403-челлендж) и пропускает выход, который получает страницу-челлендж вместо формы, до того как потрачен почтовый ящик |
| почтовый ящик | plus-алиас temp.tf на реальном ящике `@hotmail.com`/`@outlook.com` | `/api/account` затем `POST /api/check`; принимается только почта от `routerplex` (ящик — это общий пул) |
| форма | `/sign-up` в настоящем Chrome | имя + e-mail + пароль + **галочка условий**; баннер необязательного измерения сначала закрывается |
| капча | собственный Turnstile страницы (managed, sitekey `0x4AAAAAAD0CGKtkBfp1Bvp6`) | решается сам в видимом окне; токен передаётся в теле запроса на регистрацию |
| регистрация | `POST /api/auth/register` (201) затем `/api/auth/login` (200) | страница делает и то, и другое и приземляется на `/dashboard/setup` |
| подтверждение | открыть `https://routerplex.com/verify?token=…` из письма | ссылка находится в `href` письма; JWT `aud=fastapi-users:verify`, ~1 ч |
| ключ | `POST /api/onboarding {tool,model}` затем `POST /api/onboarding/key` | собственные маршруты мастера; **$1 начисляется в вызове ключа** |
| гейт | `GET /v1/models` + завершение | 200 с содержимым (или рассуждением) — единственное, что записывает `keys.txt` |

Две измеренные ловушки: **неотмеченная галочка условий делает отправку молчаливым no-op** (нет запроса, нет ошибки), и **совершенно новый ключ может отвечать 401 в течение нескольких минут**, пока шлюз подготавливает аккаунт — панель всё ещё говорит `blocked: false`, поэтому гейт пережидает это, а не объявляет ключ мёртвым.

## ⚙️ Опции CLI

```bash
node src/cli.js --count 5                  # five sign-ups, serial (one visible Chrome)
node src/cli.js --model claude-haiku-4-5   # model used for the live gate
node src/cli.js --tool opencode            # setup wizard tool that claims the trial
node src/cli.js --verify-only              # re-check keys.txt
node src/cli.js --screen                   # exit-pool self-test
node src/cli.js --connect-9router          # register provider + keys on a local 9Router
node src/cli.js --help
```

| Флаг | По умолчанию | Значение |
| --- | --- | --- |
| `--count N` | `1` | количество аккаунтов для создания, последовательно |
| `--model <id>` | `deepseek-v4.1-flash` | модель, используемая для живого гейта |
| `--tool <id>` | `claude-code` | инструмент мастера настройки, которым запрашивается trial |
| `--pool <file>` | `proxies.txt` | пул выходов, одна строка на прокси — необязательно |
| `--tries N` | `3` | кандидаты выходов, проверяемых на аккаунт |
| `--mint-tries N` | `3` | полные попытки регистрации (свежий ящик + Chrome) на выход |
| `--link-timeout S` | `300` | секунды ожидания письма с подтверждением |
| `--grant-wait S` | `150` | секунды, в течение которых пережидается окно 401 свежего ключа |
| `--gap MS` | `4000` | пауза между аккаунтами |
| `--keys <file>` | `keys.txt` | файл ключей для `--verify-only` / `--connect-9router` |
| `--headless` | выкл. | запускать Chrome в headless-режиме (видимое окно — проверенный путь) |
| `--debug-port N` | авто | порт Chrome DevTools |

## 🛰️ За прокси

**Необязательно — рекомендуется при масштабе (лимиты на IP, баны).** Инструмент работает и без прокси.

- **С пулом:** передайте `--pool <file>` (или задайте `ROUTERPLEX_PROXIES`), и каждый запрос — включая браузер Chrome — идёт через выход из этого списка, fail-closed: каждый кандидат сначала проверяется (`routerplex.com/sign-up` 200 с настоящей формой + доступность хоста API), и запуск затем остаётся привязанным к этому выходу. Мёртвая линия проваливает свою попытку, и CLI переходит к следующему кандидату.
- **Без пула:** CLI печатает `running WITHOUT a proxy (direct)` и подключается напрямую. Ничего в регистрации, создании ключей или верификации не меняется — только то, откуда уходят пакеты.
- **Качество выхода здесь важнее обычного.** Панель имеет фронтенд на Cloudflare: с выхода дата-центра страница регистрации всё ещё отображается, но `challenges.cloudflare.com` никогда не монтирует виджет (`window.turnstile` остаётся undefined, токена нет), и POST на регистрацию отвечает `Just a moment...` 403. Резидентная/мобильная линия получает токен из 750-800 символов и 201 за секунды, поэтому проверяйте с помощью проверки виджета, прежде чем тратить почтовые ящики.
- SOCKS5-линии с именем пользователя/паролем пропускаются: Chrome не может аутентифицироваться в них (HTTP-прокси с учётными данными подходят — браузер отвечает на 407 через домен Fetch).
- Проверка fail-closed на обоих хостах: страница регистрации должна быть настоящей формой (страница-челлендж Cloudflare её проваливает), и API должен отвечать на пробу с одноразовым ключом JSON, а не страницей-челленджем.
- Запустите `--screen` для любого режима: он тестирует имеющиеся у вас выходы (или прямой маршрут) против страницы регистрации и API.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один живой проверенный ключ на строку — игнорируется git |
| `accounts.json` | состояние e-mail / пароля / ключа / инструмента, включая неудачные попытки |
| `proxies.txt` | ваши выходы — игнорируется git |
| `out/` | журнал запуска, скриншоты сбоев, реестр `attempts.jsonl` — игнорируется git |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый роутер, совместимый с OpenAI:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

По умолчанию: `--prefix routerplex`, `--base-url https://api.routerplex.com/v1`, `--model deepseek-v4.1-flash`. Модели обслуживаются как `routerplex/<model id>`. CLI может сделать то же самое одним выстрелом: `node src/cli.js --connect-9router`.

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **RouterPlex** — [routerplex.com](https://routerplex.com) |
| 🎁 Что даёт провайдер | **$1 trial-кредита на подтверждённый аккаунт** (один грант, без карты, никогда не истекает) |
| 🔑 Что даёт один ключ | каталог из 72 моделей на `https://api.routerplex.com/v1` — жёстко ограничен бюджетом $1, 10 RPM / 250k TPM |
| 🌐 Форма API | совместим с OpenAI: `POST https://api.routerplex.com/v1/chat/completions` (+ Anthropic Messages, Responses) |
| 🔒 Ваши данные | связывается только с `routerplex.com` / `api.routerplex.com` и вашим бэкендом почтового ящика |

## 🐞 Проблемы

Если RouterPlex изменит свою форму регистрации, маршрут онбординга или каталог моделей, инструмент остановится на этом и сообщит об этом. **[Откройте issue](../../issues)** с командой и точным выводом.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 routerplex-bulk-apikey contributors

</div>