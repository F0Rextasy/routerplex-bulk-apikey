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

**批量创建 RouterPlex 账户并自动生成 API 密钥 — OpenAI 兼容推理 + 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-72%20served-412991?style=for-the-badge)](https://docs.routerplex.com/models)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-72-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题反馈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么会有这个项目

RouterPlex 是一个由 Cloudflare 前置的 AI 网关，它**只有一项值得争取的赠额：每个已验证账户一次性 $1 测试额度**（无需银行卡、无需手机号，在创建设置密钥时发放）。其背后的目录包含 72 个模型 — Anthropic、OpenAI、Google、DeepSeek、Qwen、MiniMax、Kimi、Grok — 通过 OpenAI 兼容端点按厂商标价提供服务，此外还有 Anthropic Messages 以及供 Codex 使用的 Responses 路由。注册只是一个普通的电子邮件表单，但注册调用携带 **Cloudflare Turnstile** 令牌，并对任何非浏览器请求返回 `403 __cf_chl_rt_tk`，因此该工具会驱动真实的 Chrome，并且只保留通过实时聊天调用验证的密钥。

## 🎁 免费额度 — 你能获得多少

| 项目 | 值 |
| --- | --- |
| 免费额度 | **每个符合条件的已验证账户一次性 $1.00**，在 `POST /api/onboarding/key` 中发放（面板：`trial_credit_usd: 1.0`、`trial_granted: true`） |
| 密钥预算 | 设置密钥初始为硬性 `max_budget: 1.0`（美元） |
| 速率限制 | **10 次请求/分钟**、**250,000 tokens/分钟**（密钥行上的 `rpm_limit: 10`、`tpm_limit: 250000`），根据优惠条款为 4 个并发请求 |
| 有效期 | **无** — `expires: null`，额度不会过期 |
| 银行卡 / 手机 | **无需银行卡、无需手机** — “无需银行卡。注册和引导设置没有支付步骤。” |
| 资格 | 已验证的电子邮件 + 无先前付费充值、无现有额度、无先前设置额度发放（每账户一次发放，实时检查：创建密钥后 `trial_eligible` 变为 `false`） |
| $1 用完之后 | 仅按量付费，最低充值 **$5**（银行卡或加密货币），$0 充值手续费，0% token 加价 |

促销额度无现金价值，且可能因滥用而被撤回 — 一个账户、一个密钥、一次发放，这就是可扩展的单位。

> 💡 免费额度由 RouterPlex 设定，可能会变化。请在 [routerplex.com](https://routerplex.com) 查看实时数字 — 并让工具自身的关卡来判定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 — 全部 72 个

`GET /v1/models` 在一个实时试用密钥上返回 **200 及 72 个 id**（2026-10-21）。本工具写入的每个密钥都已应答过一次真实补全；以下五个经过端到端聊天验证：

| 模型 ID | 备注 |
| --- | --- |
| `deepseek-v4.1-flash` | 验证默认模型 — 返回 200 `pong`，是这组中最便宜的（$0.18 / $0.73 每 1M） |
| `claude-haiku-4-5` | 200 |
| `gemini-2.5-flash-lite` | 200 |
| `MiniMax-M3` | 200 |
| `qwen3.8-flash` | 200 |

目录还包含 `gpt-5.4`/`gpt-5.5`/`gpt-5.6-terra`、`gpt-6-sol`、`claude-sonnet-4-6`/`claude-opus-5`、`gemini-3.1-pro`/`gemini-3.5-flash`、`MiniMax-M3.1-flash`、`step-3.7-flash`、`doubao-seed-2.0-pro`、`mimo-v2.6-pro`、`deepseek-v4-pro`、`kimi-k3`、`glm-5.2`、`qwen3.7-max`/`qwen3.8-max`、`grok-4.7`、`LongCat-2.0`、`hy3`、`gpt-image-2` — 这些**未**在此逐一进行聊天测试；请从 `/v1/models` 读取实时列表，而不要信任硬编码的集合。

网关不认识的模型 id 会在计费前被拒绝：`gpt-5.4-mini` → **400** `{"error":{"type":"invalid_request_error","code":400,"provider":"RouterPlex"}}`。错误的密钥为 **401** `RouterPlex could not authenticate this API key.`

## 🧪 如何使用 API

基础 URL **`https://api.routerplex.com/v1`** — OpenAI 兼容的聊天补全，外加 `/v1/messages`（Anthropic）以及供 Codex 使用的 Responses 路由；文档自身的示例是一个 bearer 调用：

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

密钥为 25 个字符，以 `sk-` 为前缀。试用流量上限为 10 RPM / 250k TPM / 4 并发，因此突发请求会返回 **429**；请将调用间隔开。

## 🛠 快速开始

```bash
cd routerplex-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify
# or directly:
node src/cli.js --count 1        # one sign-up in a real Chrome (Turnstile), $1 credit, one key
node src/cli.js --verify-only    # re-test every key already in keys.txt
node src/cli.js --screen         # test the exit list against sign-up + the API
```

注册需要真实、可见的 Chrome：注册调用携带 Turnstile 令牌，而 Cloudflare 对普通 HTTP 客户端返回 `403 __cf_chl_rt_tk`。`keys.txt` 仅在 `GET /v1/models` **以及**一次真实补全之后才会写入，而 `accounts.json` 保存账户状态（电子邮件、密码、密钥、工具）。一个账户 = 一个密钥 = 一次 $1 发放。

### 🖱️ 启动器

`node src/launcher.js` 是本仓库所附带任务模块之上的一个菜单 — **mint**（一个新账户、其已验证的电子邮件、$1 设置密钥）和 **verify**（对 `keys.txt` 重新运行实时关卡），代理池和账户数量保存在 `launcher.config.json` 中。下面的每个标志都可直接从 CLI 访问；启动器只是一个便捷封装。

## ✅ 已验证可用 — 每个密钥都经过测试

以下所有检查均于 **2026-10-21** 从随附的 CLI 重新运行（出口：来自运营方池的一条经过审查的住宅线路 — 数据中心出口能加载表单，但从不挂载组件，见下文）。

**9/10 keys live** — one key was rotated out after a leaked sample prefix; the replacement slot needs a fresh (unused) network for the trial grant.

| 检查 | 结果 |
| --- | --- |
| `--screen`（出口审查） | **✔** — `routerplex.com/sign-up` **200** 且为真实表单，API 对**一次性密钥**探测返回 JSON **401**（匿名探测即使从可用出口也会被 Cloudflare 403 质询，因此审查会为其配密钥） |
| 在真实 Chrome 中注册 | **✔ 201** `POST /api/auth/register` → `200 /api/auth/login` → `/dashboard/setup` |
| 电子邮件验证 | **✔** — 来自收件箱的 `verify?token=…` 链接，随后 `/api/auth/me` 报告 `is_verified: true` |
| `POST /api/onboarding` | **200** `trial_credit_usd: 1.0`、`trial_eligible: true` |
| `POST /api/onboarding/key` | **200** `{"key":"sk-…"}`、`trial_granted: true`、`access_mode: "trial"` |
| 每个密钥的 `GET /v1/models` | **200**，72 个 id |
| 写入前每个密钥的 `POST /v1/chat/completions` | **200** — `deepseek-v4.1-flash`（`content \|\| reasoning_content`）；在 `claude-haiku-4-5`、`gemini-2.5-flash-lite`、`MiniMax-M3`、`qwen3.8-flash` 上也为 200 |
| 铸造后的密钥行 | `max_budget 1.0`、`rpm_limit 10`、`tpm_limit 250000`、`blocked false`、`expires null` |
| 未通过检查的密钥 | 从不写入 `keys.txt`（关卡会等待新密钥的 401 窗口过去，而不是将其丢弃） |

首次调用的成本：在 `claude-haiku-4-5` 上为 `$0.00056328`，因此在 flash 模型价格下，$1 是相当多的试用流量。

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: RouterPlex page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.routerplex.com/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 备注 |
| --- | --- | --- |
| 审查 | `GET routerplex.com/sign-up` + `GET api.routerplex.com/v1/models` | 审查会为 API 探测配密钥（匿名会被 403 质询），并在消耗邮箱之前跳过那些得到质询页面而非表单的出口 |
| 邮箱 | 在真实 `@hotmail.com`/`@outlook.com` 邮箱上使用 temp.tf 加号别名 | 先 `/api/account` 再 `POST /api/check`；只接受来自 `routerplex` 的邮件（该邮箱是共享池） |
| 表单 | 在真实 Chrome 中打开 `/sign-up` | 姓名 + 电子邮件 + 密码 + **条款勾选框**；先关闭可选的测量横幅 |
| 验证码 | 页面自带的 Turnstile（managed，sitekey `0x4AAAAAAD0CGKtkBfp1Bvp6`） | 在可见窗口中自行求解；令牌随注册请求体一起发送 |
| 注册 | `POST /api/auth/register`（201）然后 `/api/auth/login`（200） | 页面会完成这两步并跳转到 `/dashboard/setup` |
| 验证 | 从邮件中打开 `https://routerplex.com/verify?token=…` | 链接位于邮件的 `href` 中；JWT `aud=fastapi-users:verify`，约 1 小时 |
| 密钥 | `POST /api/onboarding {tool,model}` 然后 `POST /api/onboarding/key` | 向导自身的路由；**$1 在密钥调用中发放** |
| 关卡 | `GET /v1/models` + 一次补全 | 返回 200 且有内容（或推理）是唯一会写入 `keys.txt` 的条件 |

两个实测到的陷阱：**未勾选条款勾选框会使提交成为静默空操作**（无请求、无错误），以及**全新的密钥可能在数分钟内返回 401**，因为网关正在为账户进行配置 — 面板仍显示 `blocked: false`，因此关卡会等待其过去，而不是判定该密钥已失效。

## ⚙️ CLI 选项

```bash
node src/cli.js --count 5                  # five sign-ups, serial (one visible Chrome)
node src/cli.js --model claude-haiku-4-5   # model used for the live gate
node src/cli.js --tool opencode            # setup wizard tool that claims the trial
node src/cli.js --verify-only              # re-check keys.txt
node src/cli.js --screen                   # exit-pool self-test
node src/cli.js --connect-9router          # register provider + keys on a local 9Router
node src/cli.js --help
```

| 标志 | 默认值 | 含义 |
| --- | --- | --- |
| `--count N` | `1` | 要铸造的账户数，串行 |
| `--model <id>` | `deepseek-v4.1-flash` | 用于实时关卡的模型 |
| `--tool <id>` | `claude-code` | 用于领取试用的设置向导工具 |
| `--pool <file>` | `proxies.txt` | 出口池，每行一个代理 — 可选 |
| `--tries N` | `3` | 每个账户审查的出口候选数 |
| `--mint-tries N` | `3` | 每个出口的完整注册尝试次数（新邮箱 + Chrome） |
| `--link-timeout S` | `300` | 等待验证邮件的秒数 |
| `--grant-wait S` | `150` | 等待新密钥 401 窗口过去的秒数 |
| `--gap MS` | `4000` | 账户之间的暂停 |
| `--keys <file>` | `keys.txt` | 用于 `--verify-only` / `--connect-9router` 的密钥文件 |
| `--headless` | 关闭 | 以无头模式运行 Chrome（可见窗口是经过测试的轨道） |
| `--debug-port N` | 自动 | Chrome DevTools 端口 |

## 🛰️ 在代理之后

**可选 — 在规模化时推荐（按 IP 限制、封禁）。** 该工具在没有代理的情况下也能工作。

- **有代理池时：** 传入 `--pool <file>`（或设置 `ROUTERPLEX_PROXIES`），每个请求 — 包括 Chrome 浏览器 — 都会经过该列表中的一个出口，故障关闭：每个候选先经过审查（`routerplex.com/sign-up` 返回 200 且为真实表单 + API 主机可达），然后运行会固定在该出口上。失效线路会使其尝试失败，CLI 会转向下一个候选。
- **无代理池时：** CLI 会打印 `running WITHOUT a proxy (direct)` 并直接连接。注册、密钥铸造或验证没有任何变化 — 只是数据包离开的位置不同。
- **此处出口质量比通常更重要。** 面板由 Cloudflare 前置：从数据中心出口，注册页面仍会渲染，但 `challenges.cloudflare.com` 从不挂载组件（`window.turnstile` 保持未定义，无令牌），注册 POST 返回 `Just a moment...` 403。住宅/移动线路会获得 750-800 字符的令牌并在数秒内返回 201，因此在消耗邮箱之前先用组件检查进行审查。
- 带用户名/密码的 SOCKS5 线路会被跳过：Chrome 无法向它们进行身份验证（带凭据的 HTTP 代理没问题 — 浏览器通过 Fetch 域应答 407）。
- 审查在两个主机上均为故障关闭：注册页面必须是真实表单（Cloudflare 质询页面会使其失败），且 API 必须对一次性密钥探测返回 JSON，而不是质询页面。
- 对任一模式运行 `--screen`：它会针对注册页面和 API 测试你拥有的出口（或直接路由）。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个经实时验证的密钥 — 已被 git 忽略 |
| `accounts.json` | 电子邮件 / 密码 / 密钥 / 工具状态，包括失败的尝试 |
| `proxies.txt` | 你的出口 — 已被 git 忽略 |
| `out/` | 运行日志、失败截图、`attempts.jsonl` 账本 — 已被 git 忽略 |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、OpenAI 兼容的路由器：

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

默认值：`--prefix routerplex`、`--base-url https://api.routerplex.com/v1`、`--model deepseek-v4.1-flash`。模型以 `routerplex/<model id>` 形式提供。CLI 可以一次性完成同样的事：`node src/cli.js --connect-9router`。

## 🔑 一个密钥能给你带来什么

| | |
| --- | --- |
| 🏢 提供商 | **RouterPlex** — [routerplex.com](https://routerplex.com) |
| 🎁 提供商给予什么 | **每个已验证账户 $1 试用额度**（一次发放，无需银行卡，永不过期） |
| 🔑 一个密钥能给你带来什么 | `https://api.routerplex.com/v1` 上的 72 模型目录 — 硬性上限为 $1 预算，10 RPM / 250k TPM |
| 🌐 API 形态 | OpenAI 兼容：`POST https://api.routerplex.com/v1/chat/completions`（+ Anthropic Messages、Responses） |
| 🔒 你的数据 | 仅联系 `routerplex.com` / `api.routerplex.com` 以及你的收件箱后端 |

## 🐞 问题反馈

如果 RouterPlex 更改其注册表单、引导路由或模型目录，该工具会在此处停止并说明。请**[提交 issue](../../issues)**，附上命令和确切输出。

## 📄 许可证

MIT © 2026 — 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 routerplex-bulk-apikey contributors

</div>