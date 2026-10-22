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

**Crie contas RouterPlex em massa com chaves de API geradas automaticamente — inferência compatível com OpenAI + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-72%20served-412991?style=for-the-badge)](https://docs.routerplex.com/models)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Início rápido](#-quick-start) · [🎁 Nível gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-72-of-them) · [🧪 Use a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por que isto existe

RouterPlex é um gateway de IA com front-end Cloudflare com **uma concessão que vale a pena: $1 de crédito de teste, uma vez por conta verificada** (sem cartão, sem telefone, creditado quando a chave de configuração é criada). O catálogo por trás dele tem 72 modelos — Anthropic, OpenAI, Google, DeepSeek, Qwen, MiniMax, Kimi, Grok — servidos pelo preço de tabela do fornecedor através de um endpoint compatível com OpenAI, além de Anthropic Messages e uma rota Responses para Codex. O cadastro é um formulário simples de e-mail, mas a chamada de registro carrega um token **Cloudflare Turnstile** e responde `403 __cf_chl_rt_tk` a qualquer coisa que não seja um navegador, então a ferramenta controla um Chrome real e mantém apenas as chaves que passam por uma chamada de chat ao vivo.

## 🎁 Nível gratuito — quanto você recebe

| O quê | Valor |
| --- | --- |
| Crédito gratuito | **$1,00 uma vez por conta verificada elegível**, concedido dentro de `POST /api/onboarding/key` (painel: `trial_credit_usd: 1.0`, `trial_granted: true`) |
| Orçamento da chave | a chave de configuração começa com um `max_budget: 1.0` rígido (USD) |
| Limites de taxa | **10 requisições/min**, **250.000 tokens/min** (`rpm_limit: 10`, `tpm_limit: 250000` na linha da chave), 4 requisições simultâneas conforme os termos da oferta |
| Expiração | **nenhuma** — `expires: null`, o crédito não expira |
| Cartão / telefone | **sem cartão, sem telefone** — "No card needed. Signup and guided setup have no payment step." |
| Elegibilidade | e-mail verificado + nenhuma recarga paga anterior, nenhum crédito existente, nenhuma concessão anterior de crédito de configuração (uma concessão por conta, verificado ao vivo: `trial_eligible` muda para `false` após a chave ser criada) |
| Após os $1 | somente pagamento conforme o uso, recarga mínima de **$5** (cartão ou cripto), taxa de recarga de $0, 0% de markup de tokens |

O crédito promocional não tem valor em dinheiro e pode ser retirado por abuso — uma conta, uma chave, uma concessão é a unidade que escala.

> 💡 O nível gratuito é definido pela RouterPlex e pode mudar. Verifique os números ao vivo em [routerplex.com](https://routerplex.com) — e deixe o próprio gate da ferramenta decidir:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — todos os 72

`GET /v1/models` respondeu **200 com 72 ids** em uma chave de teste ao vivo (2026-10-21). Toda chave que esta ferramenta grava já respondeu a uma conclusão real; estes cinco foram verificados por chat de ponta a ponta:

| ID do modelo | nota |
| --- | --- |
| `deepseek-v4.1-flash` | o padrão de verificação — 200 `pong`, o mais barato do conjunto ($0,18 / $0,73 por 1M) |
| `claude-haiku-4-5` | 200 |
| `gemini-2.5-flash-lite` | 200 |
| `MiniMax-M3` | 200 |
| `qwen3.8-flash` | 200 |

O catálogo também inclui `gpt-5.4`/`gpt-5.5`/`gpt-5.6-terra`, `gpt-6-sol`, `claude-sonnet-4-6`/`claude-opus-5`, `gemini-3.1-pro`/`gemini-3.5-flash`, `MiniMax-M3.1-flash`, `step-3.7-flash`, `doubao-seed-2.0-pro`, `mimo-v2.6-pro`, `deepseek-v4-pro`, `kimi-k3`, `glm-5.2`, `qwen3.7-max`/`qwen3.8-max`, `grok-4.7`, `LongCat-2.0`, `hy3`, `gpt-image-2` — esses **não** foram testados individualmente por chat aqui; leia a lista ao vivo de `/v1/models` em vez de confiar em um conjunto codificado.

Um id de modelo que o gateway não conhece é rejeitado antes da cobrança: `gpt-5.4-mini` → **400** `{"error":{"type":"invalid_request_error","code":400,"provider":"RouterPlex"}}`. Uma chave inválida é **401** `RouterPlex could not authenticate this API key.`

## 🧪 Como usar a API

URL base **`https://api.routerplex.com/v1`** — chat completions compatível com OpenAI, além de `/v1/messages` (Anthropic) e uma rota Responses para Codex; o próprio exemplo da documentação é uma chamada bearer:

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

As chaves têm 25 caracteres, com prefixo `sk-`. O tráfego de teste é limitado a 10 RPM / 250k TPM / 4 simultâneas, então uma rajada responde **429**; espaçe as chamadas.

## 🛠 Início rápido

```bash
cd routerplex-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify

# or directly:
node src/cli.js --count 1        # one sign-up in a real Chrome (Turnstile), $1 credit, one key
node src/cli.js --verify-only    # re-test every key already in keys.txt
node src/cli.js --screen         # test the exit list against sign-up + the API
```

O cadastro precisa de um Chrome real e visível: a chamada de registro carrega um token Turnstile e a Cloudflare responde `403 __cf_chl_rt_tk` a clientes HTTP simples. `keys.txt` só é gravado após `GET /v1/models` **e** uma conclusão real, e `accounts.json` mantém o estado da conta (e-mail, senha, chave, ferramenta). Uma conta = uma chave = uma concessão de $1.

### 🖱️ O launcher

`node src/launcher.js` é um menu sobre os módulos de tarefa que este repositório fornece — **mint** (uma conta nova, seu e-mail verificado, a chave de configuração de $1) e **verify** (reexecuta o gate ao vivo sobre `keys.txt`), com o pool de proxies e a contagem de contas mantidos em `launcher.config.json`. Cada flag abaixo é acessível diretamente pela CLI; o launcher é apenas um wrapper de conveniência.

## ✅ Verificado e funcionando — toda chave é testada

Todas as verificações abaixo foram reexecutadas em **2026-10-21** a partir da CLI fornecida (saída: uma linha residencial verificada do pool do operador — saídas de datacenter carregam o formulário mas nunca montam o widget, veja abaixo).

**verified working** —

| Verificação | Resultado |
| --- | --- |
| `--screen` (verificação de saída) | **✔** — `routerplex.com/sign-up` **200** com o formulário real e a API respondendo a uma sondagem **com chave descartável** com JSON **401** (uma sondagem anônima é desafiada com 403 pela Cloudflare mesmo de uma saída que funciona, então a verificação usa uma chave) |
| cadastro em Chrome real | **✔ 201** `POST /api/auth/register` → `200 /api/auth/login` → `/dashboard/setup` |
| verificação de e-mail | **✔** — link `verify?token=…` da caixa de entrada, `/api/auth/me` então reporta `is_verified: true` |
| `POST /api/onboarding` | **200** `trial_credit_usd: 1.0`, `trial_eligible: true` |
| `POST /api/onboarding/key` | **200** `{"key":"sk-…"}`, `trial_granted: true`, `access_mode: "trial"` |
| `GET /v1/models` por chave | **200**, 72 ids |
| `POST /v1/chat/completions` por chave antes de ser gravada | **200** — `deepseek-v4.1-flash` (`content \|\| reasoning_content`); também 200 em `claude-haiku-4-5`, `gemini-2.5-flash-lite`, `MiniMax-M3`, `qwen3.8-flash` |
| linha da chave após a criação | `max_budget 1.0`, `rpm_limit 10`, `tpm_limit 250000`, `blocked false`, `expires null` |
| uma chave que falha na verificação | nunca gravada em `keys.txt` (o gate tenta novamente a janela de 401 de uma chave nova em vez de descartá-la) |

Custo da primeira chamada: `$0.00056328` em `claude-haiku-4-5`, então $1 é bastante tráfego de teste aos preços dos modelos flash.

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: RouterPlex page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.routerplex.com/v1/chat/completions → real content = the key is live
```

| Etapa | Chamada | Notas |
| --- | --- | --- |
| verificação | `GET routerplex.com/sign-up` + `GET api.routerplex.com/v1/models` | a verificação usa uma chave na sondagem da API (anonimamente é desafiada com 403) e pula uma saída que recebe uma página de desafio em vez do formulário, antes de gastar uma caixa de correio |
| caixa de correio | alias plus do temp.tf em uma caixa real `@hotmail.com`/`@outlook.com` | `/api/account` e depois `POST /api/check`; somente e-mails de `routerplex` são aceitos (a caixa é um pool compartilhado) |
| formulário | `/sign-up` em Chrome real | nomes + e-mail + senha + **caixa de termos**; o banner de medição opcional é dispensado primeiro |
| captcha | o próprio Turnstile da página (managed, sitekey `0x4AAAAAAD0CGKtkBfp1Bvp6`) | resolve-se sozinho em uma janela visível; o token viaja no corpo do registro |
| registro | `POST /api/auth/register` (201) e depois `/api/auth/login` (200) | a página faz ambos e chega em `/dashboard/setup` |
| verificação | abrir `https://routerplex.com/verify?token=…` do e-mail | o link fica no `href` do e-mail; JWT `aud=fastapi-users:verify`, ~1 h |
| chave | `POST /api/onboarding {tool,model}` e depois `POST /api/onboarding/key` | as próprias rotas do assistente; os **$1 caem na chamada da chave** |
| gate | `GET /v1/models` + uma conclusão | 200 com conteúdo (ou reasoning) é a única coisa que grava `keys.txt` |

Duas armadilhas medidas: uma **caixa de termos desmarcada torna o envio um no-op silencioso** (sem requisição, sem erro), e uma **chave recém-criada pode responder 401 por vários minutos** enquanto o gateway provisiona a conta — o painel ainda diz `blocked: false`, então o gate espera em vez de declarar a chave morta.

## ⚙️ Opções da CLI

```bash
node src/cli.js --count 5                  # five sign-ups, serial (one visible Chrome)
node src/cli.js --model claude-haiku-4-5   # model used for the live gate
node src/cli.js --tool opencode            # setup wizard tool that claims the trial
node src/cli.js --verify-only              # re-check keys.txt
node src/cli.js --screen                   # exit-pool self-test
node src/cli.js --connect-9router          # register provider + keys on a local 9Router
node src/cli.js --help
```

| Flag | Padrão | Significado |
| --- | --- | --- |
| `--count N` | `1` | contas a criar, em série |
| `--model <id>` | `deepseek-v4.1-flash` | modelo usado para o gate ao vivo |
| `--tool <id>` | `claude-code` | ferramenta do assistente de configuração com a qual o teste é reivindicado |
| `--pool <file>` | `proxies.txt` | pool de saídas, uma linha por proxy — opcional |
| `--tries N` | `3` | candidatos de saída verificados por conta |
| `--mint-tries N` | `3` | tentativas completas de cadastro (caixa de correio nova + Chrome) por saída |
| `--link-timeout S` | `300` | segundos para esperar o e-mail de verificação |
| `--grant-wait S` | `150` | segundos que a janela de 401 de uma chave nova é aguardada |
| `--gap MS` | `4000` | pausa entre contas |
| `--keys <file>` | `keys.txt` | arquivo de chaves para `--verify-only` / `--connect-9router` |
| `--headless` | desligado | executar o Chrome em modo headless (uma janela visível é o caminho testado) |
| `--debug-port N` | automático | porta do Chrome DevTools |

## 🛰️ Atrás de um proxy

**Opcional — recomendado em escala (limites por IP, banimentos).** A ferramenta funciona sem proxy também.

- **Com um pool:** passe `--pool <file>` (ou defina `ROUTERPLEX_PROXIES`) e toda requisição — incluindo o navegador Chrome — passa por uma saída dessa lista, fail-closed: cada candidato é verificado primeiro (`routerplex.com/sign-up` 200 com o formulário real + o host da API acessível) e a execução então fica fixada nessa saída. Uma linha morta falha sua tentativa e a CLI passa para o próximo candidato.
- **Sem um pool:** a CLI imprime `running WITHOUT a proxy (direct)` e conecta diretamente. Nada sobre cadastro, criação de chave ou verificação muda — apenas de onde os pacotes saem.
- **A qualidade da saída importa mais do que o normal aqui.** O painel tem front-end Cloudflare: de uma saída de datacenter a página de cadastro ainda renderiza, mas `challenges.cloudflare.com` nunca monta o widget (`window.turnstile` permanece undefined, sem token) e o POST de registro responde um 403 `Just a moment...`. Uma linha residencial/móvel obtém um token de 750-800 caracteres e um 201 em segundos, então verifique com uma checagem de widget antes de gastar caixas de correio.
- Linhas SOCKS5 com usuário/senha são ignoradas: o Chrome não consegue autenticar nelas (proxies HTTP com credenciais funcionam — o navegador responde ao 407 via domínio Fetch).
- A verificação é fail-closed em ambos os hosts: a página de cadastro deve ser o formulário real (uma página de desafio da Cloudflare falha) e a API deve responder a uma sondagem com chave descartável com JSON, não uma página de desafio.
- Execute `--screen` contra qualquer um dos modos: ele testa as saídas que você tem (ou a rota direta) contra a página de cadastro e a API.

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `keys.txt` | uma chave verificada ao vivo por linha — ignorado pelo git |
| `accounts.json` | estado de e-mail / senha / chave / ferramenta, incluindo tentativas falhas |
| `proxies.txt` | suas saídas — ignorado pelo git |
| `out/` | log de execução, capturas de tela de falha, registro `attempts.jsonl` — ignorado pelo git |

## 🔌 Conectar ao 9Router

[9Router](https://9router.com) é um roteador auto-hospedado e compatível com OpenAI:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Padrões: `--prefix routerplex`, `--base-url https://api.routerplex.com/v1`, `--model deepseek-v4.1-flash`. Os modelos são servidos como `routerplex/<model id>`. A CLI pode fazer o mesmo em um único comando: `node src/cli.js --connect-9router`.

## 🔌 Conectar ao OmniRoute

[OmniRoute](https://omniroute.online) é um roteador auto-hospedado e compatível com OpenAI:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

Padrões: `--prefix routerplex`, `--base-url https://api.routerplex.com/v1`, `--model deepseek-v4.1-flash`. Os modelos são servidos como `routerplex/<model id>`. A CLI pode fazer o mesmo em um único comando: `node src/cli.js --connect-omniroute`.
## 🔑 O que uma chave lhe dá

| | |
| --- | --- |
| 🏢 Provedor | **RouterPlex** — [routerplex.com](https://routerplex.com) |
| 🎁 O que o provedor dá | **$1 de crédito de teste por conta verificada** (uma concessão, sem cartão, nunca expira) |
| 🔑 O que uma chave lhe dá | o catálogo de 72 modelos em `https://api.routerplex.com/v1` — limitado rigidamente a um orçamento de $1, 10 RPM / 250k TPM |
| 🌐 Formato da API | Compatível com OpenAI: `POST https://api.routerplex.com/v1/chat/completions` (+ Anthropic Messages, Responses) |
| 🔒 Seus dados | somente `routerplex.com` / `api.routerplex.com` e seu backend de caixa de entrada são contatados |

## 🐞 Problemas

Se a RouterPlex mudar seu formulário de cadastro, a rota de onboarding ou o catálogo de modelos, a ferramenta para ali e avisa. **[Abra uma issue](../../issues)** com o comando e a saída exata.

## 📄 Licença

MIT © 2026 — veja [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 routerplex-bulk-apikey contributors

</div>