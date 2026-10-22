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

**자동 생성된 API 키로 RouterPlex 계정을 대량 생성 — OpenAI 호환 추론 + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-72%20served-412991?style=for-the-badge)](https://docs.routerplex.com/models)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-72-of-them) · [🧪 API 사용하기](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 왜 이게 필요한가

RouterPlex는 Cloudflare가 앞단에 있는 AI 게이트웨이로, **가질 만한 가치가 있는 혜택이 하나 있습니다: 검증된 계정당 한 번 $1의 테스트 크레딧**입니다 (카드 없음, 전화 없음, 설정 키가 생성될 때 적립됨). 그 뒤의 카탈로그는 72개 모델 — Anthropic, OpenAI, Google, DeepSeek, Qwen, MiniMax, Kimi, Grok — 이며 OpenAI 호환 엔드포인트를 통해 벤더 정가로 제공되고, 추가로 Anthropic Messages와 Codex용 Responses 라우트도 있습니다. 가입은 평범한 이메일 양식이지만, 등록 호출에는 **Cloudflare Turnstile** 토큰이 실려 있고 브라우저가 아닌 모든 것에 `403 __cf_chl_rt_tk`로 응답하므로, 이 도구는 실제 Chrome을 구동하고 실시간 채팅 호출을 통과한 키만 보관합니다.

## 🎁 무료 티어 — 얼마나 받는가

| 항목 | 값 |
| --- | --- |
| 무료 크레딧 | **자격을 갖춘 검증된 계정당 한 번 $1.00**, `POST /api/onboarding/key` 안에서 적립됨 (패널: `trial_credit_usd: 1.0`, `trial_granted: true`) |
| 키 예산 | 설정 키는 하드 `max_budget: 1.0` (USD)에서 시작 |
| 속도 제한 | **분당 10 요청**, **분당 250,000 토큰** (키 행에 `rpm_limit: 10`, `tpm_limit: 250000`), 약관상 동시 요청 4개 |
| 만료 | **없음** — `expires: null`, 크레딧은 만료되지 않음 |
| 카드 / 전화 | **카드 없음, 전화 없음** — “No card needed. Signup and guided setup have no payment step.” |
| 자격 | 검증된 이메일 + 이전 유료 충전 없음, 기존 크레딧 없음, 이전 설정 크레딧 부여 없음 (계정당 한 번 부여, 실시간 확인: 키가 생성된 후 `trial_eligible`이 `false`로 바뀜) |
| $1 이후 | 종량제만 가능, 최소 충전 **$5** (카드 또는 암호화폐), 충전 수수료 $0, 토큰 마크업 0% |

프로모션 크레딧은 현금 가치가 없으며 남용 시 회수될 수 있습니다 — 계정 하나, 키 하나, 부여 하나가 확장되는 단위입니다.

> 💡 무료 티어는 RouterPlex가 정하며 변경될 수 있습니다. 실시간 수치는 [routerplex.com](https://routerplex.com)에서 확인하세요 — 그리고 도구 자체의 게이트가 판단하게 하세요:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 모델 — 72개 전부

`GET /v1/models`는 실제 트라이얼 키로 **200과 72개 id**를 응답했습니다 (2026-10-21). 이 도구가 기록하는 모든 키는 이미 실제 완성을 응답한 적이 있습니다; 다음 다섯 개는 처음부터 끝까지 채팅 검증되었습니다:

| 모델 ID | 비고 |
| --- | --- |
| `deepseek-v4.1-flash` | 검증 기본값 — 200 `pong`, 세트 중 가장 저렴 (1M당 $0.18 / $0.73) |
| `claude-haiku-4-5` | 200 |
| `gemini-2.5-flash-lite` | 200 |
| `MiniMax-M3` | 200 |
| `qwen3.8-flash` | 200 |

카탈로그에는 `gpt-5.4`/`gpt-5.5`/`gpt-5.6-terra`, `gpt-6-sol`, `claude-sonnet-4-6`/`claude-opus-5`, `gemini-3.1-pro`/`gemini-3.5-flash`, `MiniMax-M3.1-flash`, `step-3.7-flash`, `doubao-seed-2.0-pro`, `mimo-v2.6-pro`, `deepseek-v4-pro`, `kimi-k3`, `glm-5.2`, `qwen3.7-max`/`qwen3.8-max`, `grok-4.7`, `LongCat-2.0`, `hy3`, `gpt-image-2`도 있습니다 — 이들은 여기서 개별적으로 채팅 테스트되지 **않았습니다**; 하드코딩된 세트를 믿지 말고 `/v1/models`에서 실시간 목록을 읽으세요.

게이트웨이가 모르는 모델 id는 청구 전에 거부됩니다: `gpt-5.4-mini` → **400** `{"error":{"type":"invalid_request_error","code":400,"provider":"RouterPlex"}}`. 잘못된 키는 **401** `RouterPlex could not authenticate this API key.`입니다.

## 🧪 API 사용 방법

베이스 URL **`https://api.routerplex.com/v1`** — OpenAI 호환 채팅 완성, 그리고 `/v1/messages` (Anthropic)와 Codex용 Responses 라우트; 문서 자체의 예시는 베어러 호출입니다:

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

키는 25자이며 `sk-` 접두사가 붙습니다. 트라이얼 트래픽은 10 RPM / 250k TPM / 동시 4개로 제한되므로, 몰아서 보내면 **429**가 응답됩니다; 호출 간격을 두세요.

## 🛠 빠른 시작

```bash
cd routerplex-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify

# or directly:
node src/cli.js --count 1        # one sign-up in a real Chrome (Turnstile), $1 credit, one key
node src/cli.js --verify-only    # re-test every key already in keys.txt
node src/cli.js --screen         # test the exit list against sign-up + the API
```

가입에는 실제로 보이는 Chrome이 필요합니다: 등록 호출에는 Turnstile 토큰이 실려 있고 Cloudflare는 일반 HTTP 클라이언트에 `403 __cf_chl_rt_tk`로 응답합니다. `keys.txt`는 `GET /v1/models` **그리고** 실제 완성이 통과된 후에만 기록되며, `accounts.json`은 계정 상태 (이메일, 비밀번호, 키, 도구)를 보관합니다. 계정 하나 = 키 하나 = $1 부여 하나.

### 🖱️ 런처

`node src/launcher.js`는 이 저장소가 제공하는 작업 모듈 위의 메뉴입니다 — **mint** (새 계정, 검증된 이메일, $1 설정 키)와 **verify** (`keys.txt`에 대해 실시간 게이트 재실행), 프록시 풀과 계정 수는 `launcher.config.json`에 보관됩니다. 아래의 모든 플래그는 CLI에서 직접 접근할 수 있습니다; 런처는 편의 래퍼일 뿐입니다.

## ✅ 검증됨 — 모든 키가 테스트됨

아래의 모든 검사는 **2026-10-21**에 배포된 CLI에서 재실행되었습니다 (출구: 운영자 풀의 검증된 주거용 회선 — 데이터센터 출구는 양식을 로드하지만 위젯을 절대 마운트하지 않습니다, 아래 참조).

**verified working** —

| 검사 | 결과 |
| --- | --- |
| `--screen` (출구 검증) | **✔** — `routerplex.com/sign-up` **200** (실제 양식 포함) 및 API가 **임시 키** 프로브에 JSON **401**로 응답 (익명 프로브는 작동하는 출구에서도 Cloudflare가 403 챌린지를 걸기 때문에, 검증은 키를 사용함) |
| 실제 Chrome에서 가입 | **✔ 201** `POST /api/auth/register` → `200 /api/auth/login` → `/dashboard/setup` |
| 이메일 검증 | **✔** — 받은편지함의 `verify?token=…` 링크, 이후 `/api/auth/me`가 `is_verified: true`를 보고 |
| `POST /api/onboarding` | **200** `trial_credit_usd: 1.0`, `trial_eligible: true` |
| `POST /api/onboarding/key` | **200** `{"key":"sk-…"}`, `trial_granted: true`, `access_mode: "trial"` |
| 키별 `GET /v1/models` | **200**, 72개 id |
| 기록되기 전 키별 `POST /v1/chat/completions` | **200** — `deepseek-v4.1-flash` (`content \|\| reasoning_content`); `claude-haiku-4-5`, `gemini-2.5-flash-lite`, `MiniMax-M3`, `qwen3.8-flash`에서도 200 |
| 발급 후 키 행 | `max_budget 1.0`, `rpm_limit 10`, `tpm_limit 250000`, `blocked false`, `expires null` |
| 검사에 실패한 키 | `keys.txt`에 절대 기록되지 않음 (게이트는 새 키의 401 구간을 버리지 않고 재시도함) |

첫 호출 비용: `claude-haiku-4-5`에서 `$0.00056328`, 따라서 $1은 플래시 모델 가격에서 상당한 트라이얼 트래픽입니다.

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: RouterPlex page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.routerplex.com/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| 검증 | `GET routerplex.com/sign-up` + `GET api.routerplex.com/v1/models` | 검증은 API 프로브에 키를 사용하고 (익명이면 403 챌린지가 걸림) 메일함이 소모되기 전에 양식 대신 챌린지 페이지를 받는 출구를 건너뜀 |
| 메일함 | 실제 `@hotmail.com`/`@outlook.com` 박스의 temp.tf 플러스 별칭 | `/api/account` 후 `POST /api/check`; `routerplex`에서 온 메일만 허용됨 (박스는 공유 풀임) |
| 양식 | 실제 Chrome에서 `/sign-up` | 이름 + 이메일 + 비밀번호 + **약관 체크박스**; 선택적 측정 배너가 먼저 닫힘 |
| 캡차 | 페이지 자체의 Turnstile (관리형, sitekey `0x4AAAAAAD0CGKtkBfp1Bvp6`) | 보이는 창에서 자동 해결됨; 토큰은 등록 본문에 실림 |
| 등록 | `POST /api/auth/register` (201) 후 `/api/auth/login` (200) | 페이지가 둘 다 수행하고 `/dashboard/setup`에 도착 |
| 검증 | 메일에서 `https://routerplex.com/verify?token=…` 열기 | 링크는 메일의 `href`에 있음; JWT `aud=fastapi-users:verify`, 약 1시간 |
| 키 | `POST /api/onboarding {tool,model}` 후 `POST /api/onboarding/key` | 마법사 자체의 라우트; **$1은 키 호출에서 적립됨** |
| 게이트 | `GET /v1/models` + 완성 | 콘텐츠 (또는 추론)와 함께 200이 나오는 것만이 `keys.txt`를 기록함 |

측정된 두 가지 함정: **체크되지 않은 약관 체크박스는 제출을 조용한 무동작으로 만듭니다** (요청도 오류도 없음), 그리고 **새 키는 게이트웨이가 계정을 프로비저닝하는 동안 몇 분간 401을 응답할 수 있습니다** — 패널은 여전히 `blocked: false`라고 표시하므로, 게이트는 키를 죽었다고 판단하지 않고 기다립니다.

## ⚙️ CLI 옵션

```bash
node src/cli.js --count 5                  # five sign-ups, serial (one visible Chrome)
node src/cli.js --model claude-haiku-4-5   # model used for the live gate
node src/cli.js --tool opencode            # setup wizard tool that claims the trial
node src/cli.js --verify-only              # re-check keys.txt
node src/cli.js --screen                   # exit-pool self-test
node src/cli.js --connect-9router          # register provider + keys on a local 9Router
node src/cli.js --help
```

| 플래그 | 기본값 | 의미 |
| --- | --- | --- |
| `--count N` | `1` | 발급할 계정 수, 직렬 |
| `--model <id>` | `deepseek-v4.1-flash` | 실시간 게이트에 사용되는 모델 |
| `--tool <id>` | `claude-code` | 트라이얼을 청구하는 설정 마법사 도구 |
| `--pool <file>` | `proxies.txt` | 출구 풀, 프록시당 한 줄 — 선택 사항 |
| `--tries N` | `3` | 계정당 검증되는 출구 후보 |
| `--mint-tries N` | `3` | 출구당 전체 가입 시도 (새 메일함 + Chrome) |
| `--link-timeout S` | `300` | 검증 메일을 기다리는 초 |
| `--grant-wait S` | `150` | 새 키의 401 구간을 기다리는 초 |
| `--gap MS` | `4000` | 계정 간 일시정지 |
| `--keys <file>` | `keys.txt` | `--verify-only` / `--connect-9router`용 키 파일 |
| `--headless` | 꺼짐 | Chrome을 헤드리스로 실행 (보이는 창이 테스트된 경로임) |
| `--debug-port N` | 자동 | Chrome DevTools 포트 |

## 🛰️ 프록시 뒤에서

**선택 사항 — 규모가 커질 때 권장 (IP당 제한, 차단).** 프록시 없이도 도구는 작동합니다.

- **풀 사용 시:** `--pool <file>`을 전달하거나 (또는 `ROUTERPLEX_PROXIES` 설정) 모든 요청 — Chrome 브라우저 포함 — 이 해당 목록의 출구를 통해 나가며, 실패 시 닫힘: 각 후보는 먼저 검증되고 (`routerplex.com/sign-up` 200 (실제 양식 포함) + API 호스트 도달 가능) 실행은 그 출구에 고정됩니다. 죽은 회선은 시도에 실패하고 CLI는 다음 후보로 이동합니다.
- **풀 없이:** CLI는 `running WITHOUT a proxy (direct)`를 출력하고 직접 연결합니다. 가입, 키 발급 또는 검증에 대해 바뀌는 것은 없습니다 — 패킷이 나가는 위치만 다릅니다.
- **출구 품질이 여기서는 평소보다 더 중요합니다.** 패널은 Cloudflare가 앞단에 있습니다: 데이터센터 출구에서는 가입 페이지가 여전히 렌더링되지만, `challenges.cloudflare.com`이 위젯을 절대 마운트하지 않고 (`window.turnstile`이 undefined로 유지, 토큰 없음) 등록 POST는 `Just a moment...` 403을 응답합니다. 주거용/모바일 회선은 750-800자 토큰과 몇 초 만에 201을 받으므로, 메일함을 소모하기 전에 위젯 검사로 검증하세요.
- 사용자 이름/비밀번호가 있는 SOCKS5 회선은 건너뜁니다: Chrome이 이들에 인증할 수 없습니다 (자격 증명이 있는 HTTP 프록시는 괜찮습니다 — 브라우저가 Fetch 도메인을 통해 407에 응답합니다).
- 검증은 두 호스트 모두에서 실패 시 닫힘: 가입 페이지는 실제 양식이어야 하고 (Cloudflare 챌린지 페이지는 실패함) API는 챌린지 페이지가 아닌 JSON으로 임시 키 프로브에 응답해야 합니다.
- 두 모드 중 하나에 대해 `--screen`을 실행하세요: 보유한 출구 (또는 직접 경로)를 가입 페이지와 API에 대해 테스트합니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 한 줄에 하나의 실시간 검증된 키 — git 무시됨 |
| `accounts.json` | 이메일 / 비밀번호 / 키 / 도구 상태, 실패한 시도 포함 |
| `proxies.txt` | 사용자의 출구 — git 무시됨 |
| `out/` | 실행 로그, 실패 스크린샷, `attempts.jsonl` 원장 — git 무시됨 |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅, OpenAI 호환 라우터입니다:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

기본값: `--prefix routerplex`, `--base-url https://api.routerplex.com/v1`, `--model deepseek-v4.1-flash`. 모델은 `routerplex/<model id>`로 제공됩니다. CLI는 한 번에 동일하게 수행할 수 있습니다: `node src/cli.js --connect-9router`.

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **RouterPlex** — [routerplex.com](https://routerplex.com) |
| 🎁 제공자가 주는 것 | **검증된 계정당 $1 트라이얼 크레딧** (한 번 부여, 카드 없음, 만료 없음) |
| 🔑 키 하나로 얻는 것 | `https://api.routerplex.com/v1`의 72개 모델 카탈로그 — $1 예산, 10 RPM / 250k TPM으로 하드 제한됨 |
| 🌐 API 형태 | OpenAI 호환: `POST https://api.routerplex.com/v1/chat/completions` (+ Anthropic Messages, Responses) |
| 🔒 데이터 | `routerplex.com` / `api.routerplex.com`과 사용자의 받은편지함 백엔드만 접촉됨 |

## 🐞 이슈

RouterPlex가 가입 양식, 온보딩 라우트 또는 모델 카탈로그를 변경하면, 도구는 그 지점에서 멈추고 그렇게 알립니다. 명령과 정확한 출력을 포함하여 **[이슈를 열어주세요](../../issues)**.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 routerplex-bulk-apikey contributors

</div>