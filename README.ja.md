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

**自動生成された API キーで RouterPlex アカウントを一括作成 — OpenAI 互換の推論 + 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-72%20served-412991?style=for-the-badge)](https://docs.routerplex.com/models)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-72-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題報告](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ これが存在する理由

RouterPlex は Cloudflare を前面に置いた AI ゲートウェイで、**手に入れる価値のある特典が 1 つあります。それは検証済みアカウントごとに 1 回だけ付与される $1 のテストクレジットです**（カード不要、電話番号不要、セットアップキーが作成された時点で付与されます）。その背後にあるカタログは 72 モデル — Anthropic、OpenAI、Google、DeepSeek、Qwen、MiniMax、Kimi、Grok — で、OpenAI 互換エンドポイントを通じてベンダー定価で提供され、さらに Anthropic Messages と Codex 用の Responses ルートもあります。サインアップは単純なメールフォームですが、register 呼び出しには **Cloudflare Turnstile** トークンが含まれており、ブラウザ以外のものには `403 __cf_chl_rt_tk` を返すため、このツールは実際の Chrome を操作し、ライブのチャット呼び出しを通過したキーだけを保持します。

## 🎁 無料枠 — どれだけ得られるか

| 項目 | 値 |
| --- | --- |
| 無料クレジット | **対象となる検証済みアカウントごとに 1 回 $1.00**、`POST /api/onboarding/key` 内で付与（パネル: `trial_credit_usd: 1.0`、`trial_granted: true`） |
| キー予算 | セットアップキーはハードな `max_budget: 1.0`（USD）から始まる |
| レート制限 | **10 リクエスト/分**、**250,000 トークン/分**（キー行の `rpm_limit: 10`、`tpm_limit: 250000`）、提供条件による同時 4 リクエスト |
| 有効期限 | **なし** — `expires: null`、クレジットは失効しない |
| カード / 電話 | **カード不要、電話不要** — 「カードは不要です。サインアップとガイド付きセットアップに支払いステップはありません。」 |
| 対象条件 | 検証済みメール + 過去の有料チャージなし、既存クレジットなし、過去のセットアップクレジット付与なし（アカウントごとに 1 回の付与、ライブで確認: キー作成後に `trial_eligible` は `false` に変わる） |
| $1 の後 | 従量課金のみ、最低チャージ額 **$5**（カードまたは暗号通貨）、チャージ手数料 $0、トークンマークアップ 0% |

プロモーションクレジットには現金価値はなく、不正利用に対して取り消される場合があります — 1 アカウント、1 キー、1 付与がスケールする単位です。

> 💡 無料枠は RouterPlex によって設定され、変更される可能性があります。最新の数値は [routerplex.com](https://routerplex.com) で確認してください — そしてツール自身のゲートに判断させてください:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — そのすべて 72 個

`GET /v1/models` はライブのトライアルキーで **200 と 72 個の id** を返しました（2026-10-21）。このツールが書き込むすべてのキーはすでに実際の completion に応答しており、次の 5 つはエンドツーエンドでチャット検証されました:

| モデル ID | 備考 |
| --- | --- |
| `deepseek-v4.1-flash` | 検証のデフォルト — 200 `pong`、セット中最安（$0.18 / $0.73 per 1M） |
| `claude-haiku-4-5` | 200 |
| `gemini-2.5-flash-lite` | 200 |
| `MiniMax-M3` | 200 |
| `qwen3.8-flash` | 200 |

カタログには `gpt-5.4`/`gpt-5.5`/`gpt-5.6-terra`、`gpt-6-sol`、`claude-sonnet-4-6`/`claude-opus-5`、`gemini-3.1-pro`/`gemini-3.5-flash`、`MiniMax-M3.1-flash`、`step-3.7-flash`、`doubao-seed-2.0-pro`、`mimo-v2.6-pro`、`deepseek-v4-pro`、`kimi-k3`、`glm-5.2`、`qwen3.7-max`/`qwen3.8-max`、`grok-4.7`、`LongCat-2.0`、`hy3`、`gpt-image-2` も含まれます — これらはここでは個別にチャットテストされて**いません**。ハードコードされたセットを信頼するのではなく、`/v1/models` からライブのリストを読んでください。

ゲートウェイが知らないモデル id は課金前に拒否されます: `gpt-5.4-mini` → **400** `{"error":{"type":"invalid_request_error","code":400,"provider":"RouterPlex"}}`。不正なキーは **401** `RouterPlex could not authenticate this API key.`

## 🧪 API の使い方

ベース URL **`https://api.routerplex.com/v1`** — OpenAI 互換の chat completions、さらに `/v1/messages`（Anthropic）と Codex 用の Responses ルート。ドキュメント自身の例は bearer 呼び出しです:

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

キーは 25 文字で、`sk-` が先頭に付きます。トライアルのトラフィックは 10 RPM / 250k TPM / 同時 4 に制限されているため、バーストすると **429** が返ります。呼び出しの間隔を空けてください。

## 🛠 クイックスタート

```bash
cd routerplex-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify
# or directly:
node src/cli.js --count 1        # one sign-up in a real Chrome (Turnstile), $1 credit, one key
node src/cli.js --verify-only    # re-test every key already in keys.txt
node src/cli.js --screen         # test the exit list against sign-up + the API
```

サインアップには実際の可視 Chrome が必要です: register 呼び出しには Turnstile トークンが含まれており、Cloudflare はプレーンな HTTP クライアントに `403 __cf_chl_rt_tk` を返します。`keys.txt` は `GET /v1/models` **および**実際の completion の後にのみ書き込まれ、`accounts.json` はアカウントの状態（メール、パスワード、キー、ツール）を保持します。1 アカウント = 1 キー = 1 回の $1 付与です。

### 🖱️ ランチャー

`node src/launcher.js` は、このリポジトリが提供するタスクモジュールのメニューです — **mint**（新しいアカウント、その検証済みメール、$1 セットアップキー）と **verify**（`keys.txt` に対してライブゲートを再実行）で、プロキシプールとアカウント数は `launcher.config.json` に保持されます。以下のすべてのフラグは CLI から直接利用できます。ランチャーは単なる便利なラッパーです。

## ✅ 動作検証済み — すべてのキーがテストされる

以下のすべてのチェックは **2026-10-21** に出荷された CLI から再実行されました（終了: オペレータプールからの検証済みレジデンシャル回線 — データセンターの出口はフォームを読み込みますがウィジェットをマウントしません。以下を参照）。

**9/10 keys live** — one key was rotated out after a leaked sample prefix; the replacement slot needs a fresh (unused) network for the trial grant.

| チェック | 結果 |
| --- | --- |
| `--screen`（出口審査） | **✔** — `routerplex.com/sign-up` が実際のフォームで **200**、API が**使い捨てキー付き**のプローブに JSON **401** で応答（匿名プローブは動作する出口からでも Cloudflare によって 403 チャレンジされるため、審査ではキーを付けます） |
| 実際の Chrome でのサインアップ | **✔ 201** `POST /api/auth/register` → `200 /api/auth/login` → `/dashboard/setup` |
| メール検証 | **✔** — 受信トレイからの `verify?token=…` リンク、その後 `/api/auth/me` が `is_verified: true` を報告 |
| `POST /api/onboarding` | **200** `trial_credit_usd: 1.0`、`trial_eligible: true` |
| `POST /api/onboarding/key` | **200** `{"key":"sk-…"}`、`trial_granted: true`、`access_mode: "trial"` |
| キーごとの `GET /v1/models` | **200**、72 個の id |
| 書き込まれる前のキーごとの `POST /v1/chat/completions` | **200** — `deepseek-v4.1-flash`（`content \|\| reasoning_content`）、`claude-haiku-4-5`、`gemini-2.5-flash-lite`、`MiniMax-M3`、`qwen3.8-flash` でも 200 |
| 発行後のキー行 | `max_budget 1.0`、`rpm_limit 10`、`tpm_limit 250000`、`blocked false`、`expires null` |
| チェックに失敗したキー | `keys.txt` に書き込まれない（ゲートは新しいキーの 401 ウィンドウを破棄せずに再試行します） |

最初の呼び出しのコスト: `claude-haiku-4-5` で `$0.00056328`、つまりフラッシュモデルの価格では $1 はかなりのトライアルトラフィックになります。

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: RouterPlex page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.routerplex.com/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| 審査 | `GET routerplex.com/sign-up` + `GET api.routerplex.com/v1/models` | 審査では API プローブにキーを付け（匿名では 403 チャレンジされます）、メールボックスを消費する前に、フォームではなくチャレンジページを返す出口をスキップします |
| メールボックス | 実際の `@hotmail.com`/`@outlook.com` ボックス上の temp.tf プラスエイリアス | `/api/account` の後に `POST /api/check`、`routerplex` からのメールのみ受け入れ（ボックスは共有プールです） |
| フォーム | 実際の Chrome での `/sign-up` | 名前 + メール + パスワード + **利用規約チェックボックス**、オプションの測定バナーは最初に閉じられます |
| キャプチャ | ページ自身の Turnstile（managed、sitekey `0x4AAAAAAD0CGKtkBfp1Bvp6`） | 可視ウィンドウで自動解決、トークンは register ボディに乗ります |
| 登録 | `POST /api/auth/register`（201）の後に `/api/auth/login`（200） | ページが両方を行い、`/dashboard/setup` に着地します |
| 検証 | メールから `https://routerplex.com/verify?token=…` を開く | リンクはメールの `href` にあり、JWT `aud=fastapi-users:verify`、約 1 時間 |
| キー | `POST /api/onboarding {tool,model}` の後に `POST /api/onboarding/key` | ウィザード自身のルート、**$1 はキー呼び出しで付与されます** |
| ゲート | `GET /v1/models` + completion | コンテンツ（または reasoning）付きの 200 だけが `keys.txt` を書き込みます |

測定された 2 つの罠: **利用規約チェックボックスが未チェックだと送信がサイレントな no-op になります**（リクエストなし、エラーなし）、そして**新品のキーはゲートウェイがアカウントをプロビジョニングする間、数分間 401 を返すことがあります** — パネルは依然として `blocked: false` と表示するため、ゲートはキーを死んだと判断せずに待ちます。

## ⚙️ CLI オプション

```bash
node src/cli.js --count 5                  # five sign-ups, serial (one visible Chrome)
node src/cli.js --model claude-haiku-4-5   # model used for the live gate
node src/cli.js --tool opencode            # setup wizard tool that claims the trial
node src/cli.js --verify-only              # re-check keys.txt
node src/cli.js --screen                   # exit-pool self-test
node src/cli.js --connect-9router          # register provider + keys on a local 9Router
node src/cli.js --help
```

| フラグ | デフォルト | 意味 |
| --- | --- | --- |
| `--count N` | `1` | 発行するアカウント数、直列 |
| `--model <id>` | `deepseek-v4.1-flash` | ライブゲートに使用するモデル |
| `--tool <id>` | `claude-code` | トライアルを請求するセットアップウィザードツール |
| `--pool <file>` | `proxies.txt` | 出口プール、1 行につき 1 プロキシ — オプション |
| `--tries N` | `3` | アカウントごとに審査する出口候補 |
| `--mint-tries N` | `3` | 出口ごとの完全なサインアップ試行（新しいメールボックス + Chrome） |
| `--link-timeout S` | `300` | 検証メールを待つ秒数 |
| `--grant-wait S` | `150` | 新しいキーの 401 ウィンドウを待つ秒数 |
| `--gap MS` | `4000` | アカウント間の一時停止 |
| `--keys <file>` | `keys.txt` | `--verify-only` / `--connect-9router` 用のキーファイル |
| `--headless` | off | Chrome をヘッドレスで実行（可視ウィンドウがテスト済みのレールです） |
| `--debug-port N` | auto | Chrome DevTools ポート |

## 🛰️ プロキシの背後で

**オプション — 規模を拡大する場合は推奨（IP ごとの制限、BAN）。** ツールはプロキシなしでも動作します。

- **プールあり:** `--pool <file>` を渡す（または `ROUTERPLEX_PROXIES` を設定する）と、すべてのリクエスト — Chrome ブラウザを含む — がそのリストの出口を通り、fail-closed で動作します: 各候補は最初に審査され（`routerplex.com/sign-up` が実際のフォームで 200 + API ホストに到達可能）、その後実行はその出口に固定されたままになります。死んだ回線は試行に失敗し、CLI は次の候補に移ります。
- **プールなし:** CLI は `running WITHOUT a proxy (direct)` と表示し、直接接続します。サインアップ、キー発行、検証について何も変わりません — パケットが出ていく場所だけが変わります。
- **ここでは出口の品質がいつも以上に重要です。** パネルは Cloudflare を前面に置いています: データセンターの出口からでもサインアップページはレンダリングされますが、`challenges.cloudflare.com` はウィジェットをマウントせず（`window.turnstile` は undefined のまま、トークンなし）、register POST は `Just a moment...` の 403 を返します。レジデンシャル/モバイル回線は 750〜800 文字のトークンを取得し、数秒で 201 を返すため、メールボックスを消費する前にウィジェットチェックで審査してください。
- ユーザー名/パスワード付きの SOCKS5 回線はスキップされます: Chrome はそれらに認証できません（認証情報付きの HTTP プロキシは問題ありません — ブラウザは Fetch ドメイン経由で 407 に応答します）。
- 審査は両方のホストで fail-closed です: サインアップページは実際のフォームでなければならず（Cloudflare チャレンジページは失敗します）、API は使い捨てキー付きのプローブにチャレンジページではなく JSON で応答しなければなりません。
- どちらのモードでも `--screen` を実行してください: 持っている出口（または直接ルート）をサインアップページと API に対してテストします。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 1 行につき 1 つのライブ検証済みキー — git で無視 |
| `accounts.json` | メール / パスワード / キー / ツールの状態、失敗した試行を含む |
| `proxies.txt` | あなたの出口 — git で無視 |
| `out/` | 実行ログ、失敗のスクリーンショット、`attempts.jsonl` 台帳 — git で無視 |

## 🔌 9Router に接続する

[9Router](https://9router.com) はセルフホスト型の OpenAI 互換ルーターです:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

デフォルト: `--prefix routerplex`、`--base-url https://api.routerplex.com/v1`、`--model deepseek-v4.1-flash`。モデルは `routerplex/<model id>` として提供されます。CLI でもワンショットで同じことができます: `node src/cli.js --connect-9router`。

## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **RouterPlex** — [routerplex.com](https://routerplex.com) |
| 🎁 プロバイダーが提供するもの | **検証済みアカウントごとに $1 のトライアルクレジット**（1 回の付与、カード不要、失効なし） |
| 🔑 1 つのキーで得られるもの | `https://api.routerplex.com/v1` 上の 72 モデルカタログ — $1 の予算、10 RPM / 250k TPM でハードキャップ |
| 🌐 API の形式 | OpenAI 互換: `POST https://api.routerplex.com/v1/chat/completions`（+ Anthropic Messages、Responses） |
| 🔒 あなたのデータ | `routerplex.com` / `api.routerplex.com` とあなたの受信トレイバックエンドのみが接触されます |

## 🐞 問題報告

RouterPlex がサインアップフォーム、オンボーディングルート、またはモデルカタログを変更した場合、ツールはそこで停止し、その旨を報告します。コマンドと正確な出力を添えて **[issue を開いてください](../../issues)**。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 routerplex-bulk-apikey contributors

</div>