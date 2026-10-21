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

**Crea cuentas de RouterPlex en masa con claves API autogeneradas — inferencia compatible con OpenAI + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-72%20served-412991?style=for-the-badge)](https://docs.routerplex.com/models)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-72-of-them) · [🧪 Usar la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por qué existe esto

RouterPlex es una pasarela de IA con frontend de Cloudflare con **una subvención que vale la pena: $1 de crédito de prueba, una vez por cuenta verificada** (sin tarjeta, sin teléfono, acreditado cuando se crea la clave de configuración). El catálogo detrás es de 72 modelos — Anthropic, OpenAI, Google, DeepSeek, Qwen, MiniMax, Kimi, Grok — servidos al precio de lista del proveedor a través de un endpoint compatible con OpenAI, además de Anthropic Messages y una ruta Responses para Codex. El registro es un simple formulario de correo electrónico, pero la llamada de registro lleva un token de **Cloudflare Turnstile** y responde `403 __cf_chl_rt_tk` a cualquier cosa que no sea un navegador, por lo que la herramienta maneja un Chrome real y conserva solo las claves que pasan una llamada de chat en vivo.

## 🎁 Nivel gratuito — cuánto obtienes

| Qué | Valor |
| --- | --- |
| Crédito gratuito | **$1.00 una vez por cuenta verificada elegible**, otorgado dentro de `POST /api/onboarding/key` (panel: `trial_credit_usd: 1.0`, `trial_granted: true`) |
| Presupuesto de la clave | la clave de configuración comienza con un `max_budget: 1.0` (USD) estricto |
| Límites de velocidad | **10 solicitudes/min**, **250,000 tokens/min** (`rpm_limit: 10`, `tpm_limit: 250000` en la fila de la clave), 4 solicitudes concurrentes según los términos de la oferta |
| Caducidad | **ninguna** — `expires: null`, el crédito no caduca |
| Tarjeta / teléfono | **sin tarjeta, sin teléfono** — "No se necesita tarjeta. El registro y la configuración guiada no tienen paso de pago." |
| Elegibilidad | correo electrónico verificado + sin recarga de pago previa, sin crédito existente, sin subvención de crédito de configuración previa (una subvención por cuenta, verificada en vivo: `trial_eligible` cambia a `false` después de crear la clave) |
| Después del $1 | solo pago por uso, recarga mínima **$5** (tarjeta o cripto), tarifa de recarga de $0, 0% de margen de tokens |

El crédito promocional no tiene valor en efectivo y puede retirarse por abuso — una cuenta, una clave, una subvención es la unidad que escala.

> 💡 El nivel gratuito lo establece RouterPlex y puede cambiar. Consulta los números en vivo en [routerplex.com](https://routerplex.com) — y deja que la propia puerta de la herramienta decida:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — los 72

`GET /v1/models` respondió **200 con 72 ids** en una clave de prueba en vivo (2026-10-21). Cada clave que escribe esta herramienta ya ha respondido una finalización real; estos cinco fueron verificados por chat de principio a fin:

| ID del modelo | nota |
| --- | --- |
| `deepseek-v4.1-flash` | el predeterminado de verificación — 200 `pong`, el más barato del conjunto ($0.18 / $0.73 por 1M) |
| `claude-haiku-4-5` | 200 |
| `gemini-2.5-flash-lite` | 200 |
| `MiniMax-M3` | 200 |
| `qwen3.8-flash` | 200 |

El catálogo también incluye `gpt-5.4`/`gpt-5.5`/`gpt-5.6-terra`, `gpt-6-sol`, `claude-sonnet-4-6`/`claude-opus-5`, `gemini-3.1-pro`/`gemini-3.5-flash`, `MiniMax-M3.1-flash`, `step-3.7-flash`, `doubao-seed-2.0-pro`, `mimo-v2.6-pro`, `deepseek-v4-pro`, `kimi-k3`, `glm-5.2`, `qwen3.7-max`/`qwen3.8-max`, `grok-4.7`, `LongCat-2.0`, `hy3`, `gpt-image-2` — esos **no** fueron probados individualmente por chat aquí; lee la lista en vivo desde `/v1/models` en lugar de confiar en un conjunto codificado.

Un id de modelo que la pasarela no conoce se rechaza antes de la facturación: `gpt-5.4-mini` → **400** `{"error":{"type":"invalid_request_error","code":400,"provider":"RouterPlex"}}`. Una clave incorrecta es **401** `RouterPlex could not authenticate this API key.`

## 🧪 Cómo usar la API

URL base **`https://api.routerplex.com/v1`** — finalizaciones de chat compatibles con OpenAI, además de `/v1/messages` (Anthropic) y una ruta Responses para Codex; el propio ejemplo de la documentación es una llamada bearer:

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

Las claves tienen 25 caracteres, con prefijo `sk-`. El tráfico de prueba está limitado a 10 RPM / 250k TPM / 4 concurrentes, por lo que una ráfaga responde **429**; espacia las llamadas.

## 🛠 Inicio rápido

```bash
cd routerplex-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify
# or directly:
node src/cli.js --count 1        # one sign-up in a real Chrome (Turnstile), $1 credit, one key
node src/cli.js --verify-only    # re-test every key already in keys.txt
node src/cli.js --screen         # test the exit list against sign-up + the API
```

El registro necesita un Chrome real y visible: la llamada de registro lleva un token de Turnstile y Cloudflare responde `403 __cf_chl_rt_tk` a los clientes HTTP simples. `keys.txt` se escribe solo después de `GET /v1/models` **y** una finalización real, y `accounts.json` guarda el estado de la cuenta (correo electrónico, contraseña, clave, herramienta). Una cuenta = una clave = una subvención de $1.

### 🖱️ El lanzador

`node src/launcher.js` es un menú sobre los módulos de tareas que incluye este repositorio — **mint** (una cuenta nueva, su correo electrónico verificado, la clave de configuración de $1) y **verify** (volver a ejecutar la puerta en vivo sobre `keys.txt`), con el grupo de proxies y el recuento de cuentas guardados en `launcher.config.json`. Cada indicador a continuación es accesible directamente desde la CLI; el lanzador es solo un envoltorio de conveniencia.

## ✅ Verificado y funcionando — cada clave se prueba

Todas las comprobaciones a continuación se volvieron a ejecutar el **2026-10-21** desde la CLI incluida (salida: una línea residencial verificada del grupo del operador — las salidas de centro de datos cargan el formulario pero nunca montan el widget, ver más abajo).

| Comprobación | Resultado |
| --- | --- |
| `--screen` (verificación de salida) | **✔** — `routerplex.com/sign-up` **200** con el formulario real y la API respondiendo a una sonda **con clave desechable** con JSON **401** (una sonda anónima es desafiada con 403 por Cloudflare incluso desde una salida que funciona, por lo que la verificación la marca con clave) |
| registro en Chrome real | **✔ 201** `POST /api/auth/register` → `200 /api/auth/login` → `/dashboard/setup` |
| verificación de correo electrónico | **✔** — enlace `verify?token=…` desde la bandeja de entrada, `/api/auth/me` luego informa `is_verified: true` |
| `POST /api/onboarding` | **200** `trial_credit_usd: 1.0`, `trial_eligible: true` |
| `POST /api/onboarding/key` | **200** `{"key":"sk-…"}`, `trial_granted: true`, `access_mode: "trial"` |
| `GET /v1/models` por clave | **200**, 72 ids |
| `POST /v1/chat/completions` por clave antes de escribirse | **200** — `deepseek-v4.1-flash` (`content \|\| reasoning_content`); también 200 en `claude-haiku-4-5`, `gemini-2.5-flash-lite`, `MiniMax-M3`, `qwen3.8-flash` |
| fila de la clave después de acuñar | `max_budget 1.0`, `rpm_limit 10`, `tpm_limit 250000`, `blocked false`, `expires null` |
| una clave que falla su comprobación | nunca se escribe en `keys.txt` (la puerta reintenta la ventana 401 de una clave nueva en lugar de descartarla) |

Costo de la primera llamada: `$0.00056328` en `claude-haiku-4-5`, por lo que $1 es mucho tráfico de prueba a precios de modelos flash.

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: RouterPlex page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.routerplex.com/v1/chat/completions → real content = the key is live
```

| Paso | Llamada | Notas |
| --- | --- | --- |
| verificación | `GET routerplex.com/sign-up` + `GET api.routerplex.com/v1/models` | la verificación marca con clave la sonda de la API (de forma anónima es desafiada con 403) y omite una salida que obtiene una página de desafío en lugar del formulario, antes de gastar un buzón |
| buzón | alias plus de temp.tf en un buzón real `@hotmail.com`/`@outlook.com` | `/api/account` luego `POST /api/check`; solo se acepta correo de `routerplex` (el buzón es un grupo compartido) |
| formulario | `/sign-up` en Chrome real | nombres + correo electrónico + contraseña + **casilla de términos**; primero se descarta el banner de medición opcional |
| captcha | el propio Turnstile de la página (gestionado, sitekey `0x4AAAAAAD0CGKtkBfp1Bvp6`) | se resuelve solo en una ventana visible; el token viaja en el cuerpo del registro |
| registro | `POST /api/auth/register` (201) luego `/api/auth/login` (200) | la página hace ambos y aterriza en `/dashboard/setup` |
| verificación | abre `https://routerplex.com/verify?token=…` desde el correo | el enlace vive en el `href` del correo; JWT `aud=fastapi-users:verify`, ~1 h |
| clave | `POST /api/onboarding {tool,model}` luego `POST /api/onboarding/key` | las propias rutas del asistente; el **$1 llega en la llamada de la clave** |
| puerta | `GET /v1/models` + una finalización | 200 con contenido (o razonamiento) es lo único que escribe `keys.txt` |

Dos trampas medidas: una **casilla de términos sin marcar hace que el envío sea un no-op silencioso** (sin solicitud, sin error), y una **clave recién creada puede responder 401 durante varios minutos** mientras la pasarela aprovisiona la cuenta — el panel aún dice `blocked: false`, por lo que la puerta espera en lugar de declarar la clave muerta.

## ⚙️ Opciones de la CLI

```bash
node src/cli.js --count 5                  # five sign-ups, serial (one visible Chrome)
node src/cli.js --model claude-haiku-4-5   # model used for the live gate
node src/cli.js --tool opencode            # setup wizard tool that claims the trial
node src/cli.js --verify-only              # re-check keys.txt
node src/cli.js --screen                   # exit-pool self-test
node src/cli.js --connect-9router          # register provider + keys on a local 9Router
node src/cli.js --help
```

| Indicador | Predeterminado | Significado |
| --- | --- | --- |
| `--count N` | `1` | cuentas a acuñar, en serie |
| `--model <id>` | `deepseek-v4.1-flash` | modelo usado para la puerta en vivo |
| `--tool <id>` | `claude-code` | herramienta del asistente de configuración con la que se reclama la prueba |
| `--pool <file>` | `proxies.txt` | grupo de salidas, una línea por proxy — opcional |
| `--tries N` | `3` | candidatos de salida verificados por cuenta |
| `--mint-tries N` | `3` | intentos de registro completos (buzón nuevo + Chrome) por salida |
| `--link-timeout S` | `300` | segundos de espera para el correo de verificación |
| `--grant-wait S` | `150` | segundos que se espera la ventana 401 de una clave nueva |
| `--gap MS` | `4000` | pausa entre cuentas |
| `--keys <file>` | `keys.txt` | archivo de claves para `--verify-only` / `--connect-9router` |
| `--headless` | off | ejecutar Chrome sin interfaz (una ventana visible es el riel probado) |
| `--debug-port N` | auto | puerto de Chrome DevTools |

## 🛰️ Detrás de un proxy

**Opcional — recomendado a escala (límites por IP, prohibiciones).** La herramienta también funciona sin proxy.

- **Con un grupo:** pasa `--pool <file>` (o establece `ROUTERPLEX_PROXIES`) y cada solicitud — incluido el navegador Chrome — pasa por una salida de esa lista, con fallo cerrado: cada candidato se verifica primero (`routerplex.com/sign-up` 200 con el formulario real + el host de la API accesible) y la ejecución luego permanece fijada a esa salida. Una línea muerta falla su intento y la CLI pasa al siguiente candidato.
- **Sin un grupo:** la CLI imprime `running WITHOUT a proxy (direct)` y se conecta directamente. Nada sobre el registro, la acuñación de claves o la verificación cambia — solo desde dónde salen los paquetes.
- **La calidad de la salida importa más de lo habitual aquí.** El panel tiene frontend de Cloudflare: desde una salida de centro de datos la página de registro aún se renderiza, pero `challenges.cloudflare.com` nunca monta el widget (`window.turnstile` permanece indefinido, sin token) y el POST de registro responde un `Just a moment...` 403. Una línea residencial/móvil obtiene un token de 750-800 caracteres y un 201 en segundos, así que verifica con una comprobación de widget antes de gastar buzones.
- Las líneas SOCKS5 con nombre de usuario/contraseña se omiten: Chrome no puede autenticarse con ellas (los proxies HTTP con credenciales están bien — el navegador responde al 407 a través del dominio Fetch).
- La verificación es de fallo cerrado en ambos hosts: la página de registro debe ser el formulario real (una página de desafío de Cloudflare la falla) y la API debe responder a una sonda con clave desechable con JSON, no una página de desafío.
- Ejecuta `--screen` contra cualquiera de los dos modos: prueba las salidas que tienes (o la ruta directa) contra la página de registro y la API.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave verificada en vivo por línea — ignorada por git |
| `accounts.json` | estado de correo electrónico / contraseña / clave / herramienta, incl. intentos fallidos |
| `proxies.txt` | tus salidas — ignoradas por git |
| `out/` | registro de ejecución, capturas de pantalla de fallos, libro mayor `attempts.jsonl` — ignorado por git |

## 🔌 Conectar a 9Router

[9Router](https://9router.com) es un enrutador autoalojado compatible con OpenAI:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Predeterminados: `--prefix routerplex`, `--base-url https://api.routerplex.com/v1`, `--model deepseek-v4.1-flash`. Los modelos se sirven como `routerplex/<model id>`. La CLI puede hacer lo mismo de una sola vez: `node src/cli.js --connect-9router`.

## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **RouterPlex** — [routerplex.com](https://routerplex.com) |
| 🎁 Qué da el proveedor | **$1 de crédito de prueba por cuenta verificada** (una subvención, sin tarjeta, nunca caduca) |
| 🔑 Qué te da una clave | el catálogo de 72 modelos en `https://api.routerplex.com/v1` — limitado estrictamente a un presupuesto de $1, 10 RPM / 250k TPM |
| 🌐 Forma de la API | Compatible con OpenAI: `POST https://api.routerplex.com/v1/chat/completions` (+ Anthropic Messages, Responses) |
| 🔒 Tus datos | solo se contacta `routerplex.com` / `api.routerplex.com` y tu backend de bandeja de entrada |

## 🐞 Problemas

Si RouterPlex cambia su formulario de registro, la ruta de incorporación o el catálogo de modelos, la herramienta se detiene ahí y lo dice. **[Abre un problema](../../issues)** con el comando y la salida exacta.

## 📄 Licencia

MIT © 2026 — ver [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 routerplex-bulk-apikey contributors

</div>