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

**Otomatik oluşturulan API anahtarlarıyla toplu RouterPlex hesabı oluşturma — OpenAI uyumlu çıkarım + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-72%20served-412991?style=for-the-badge)](https://docs.routerplex.com/models)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-72-of-them) · [🧪 API'yi kullan](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Bu neden var

RouterPlex, Cloudflare önünde çalışan bir yapay zeka ağ geçididir ve **elde tutmaya değer tek bir hibesi vardır: doğrulanmış hesap başına bir kez 1 $ deneme kredisi** (kart yok, telefon yok, kurulum anahtarı oluşturulduğunda yüklenir). Ardındaki katalog 72 modeldir — Anthropic, OpenAI, Google, DeepSeek, Qwen, MiniMax, Kimi, Grok — OpenAI uyumlu bir uç nokta üzerinden satıcı liste fiyatından sunulur, ayrıca Anthropic Messages ve Codex için bir Responses rotası vardır. Kayıt düz bir e-posta formudur, ancak kayıt çağrısı bir **Cloudflare Turnstile** belirteci taşır ve tarayıcı olmayan her şeye `403 __cf_chl_rt_tk` yanıtı verir; bu nedenle araç gerçek bir Chrome'u çalıştırır ve yalnızca canlı bir sohbet çağrısını geçen anahtarları saklar.

## 🎁 Ücretsiz katman — ne kadar alırsınız

| Ne | Değer |
| --- | --- |
| Ücretsiz kredi | **Uygun doğrulanmış hesap başına bir kez 1,00 $**, `POST /api/onboarding/key` içinde verilir (panel: `trial_credit_usd: 1.0`, `trial_granted: true`) |
| Anahtar bütçesi | kurulum anahtarı sabit `max_budget: 1.0` (USD) ile başlar |
| Hız limitleri | **10 istek/dk**, **250.000 token/dk** (anahtar satırında `rpm_limit: 10`, `tpm_limit: 250000`), teklif şartlarına göre 4 eşzamanlı istek |
| Bitiş | **yok** — `expires: null`, kredinin süresi dolmaz |
| Kart / telefon | **kart yok, telefon yok** — "Kart gerekmez. Kayıt ve yönlendirilmiş kurulumda ödeme adımı yoktur." |
| Uygunluk | doğrulanmış e-posta + önceki ücretli bakiye yüklemesi yok, mevcut kredi yok, önceki kurulum kredisi hibesi yok (hesap başına bir hibe, canlı kontrol edilir: anahtar oluşturulduktan sonra `trial_eligible` `false` olur) |
| 1 $ sonrası | yalnızca kullandıkça öde, minimum bakiye yüklemesi **5 $** (kart veya kripto), 0 $ yükleme ücreti, %0 token marjı |

Promosyon kredisinin nakit değeri yoktur ve kötüye kullanım nedeniyle geri çekilebilir — bir hesap, bir anahtar, bir hibe ölçeklenen birimdir.

> 💡 Ücretsiz katman RouterPlex tarafından belirlenir ve değişebilir. Güncel rakamları [routerplex.com](https://routerplex.com) adresinden kontrol edin — ve kararı aracın kendi kapısına bırakın:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modeller — 72'sinin tamamı

`GET /v1/models`, canlı bir deneme anahtarında **200 ve 72 kimlik** yanıtı verdi (2026-10-21). Bu aracın yazdığı her anahtar zaten gerçek bir tamamlama yanıtlamıştır; şu beşi baştan sona sohbetle doğrulandı:

| Model Kimliği | not |
| --- | --- |
| `deepseek-v4.1-flash` | doğrulama varsayılanı — 200 `pong`, setin en ucuzu (1M başına 0,18 $ / 0,73 $) |
| `claude-haiku-4-5` | 200 |
| `gemini-2.5-flash-lite` | 200 |
| `MiniMax-M3` | 200 |
| `qwen3.8-flash` | 200 |

Katalog ayrıca `gpt-5.4`/`gpt-5.5`/`gpt-5.6-terra`, `gpt-6-sol`, `claude-sonnet-4-6`/`claude-opus-5`, `gemini-3.1-pro`/`gemini-3.5-flash`, `MiniMax-M3.1-flash`, `step-3.7-flash`, `doubao-seed-2.0-pro`, `mimo-v2.6-pro`, `deepseek-v4-pro`, `kimi-k3`, `glm-5.2`, `qwen3.7-max`/`qwen3.8-max`, `grok-4.7`, `LongCat-2.0`, `hy3`, `gpt-image-2` içerir — bunlar burada tek tek sohbetle test **edilmedi**; sabit kodlanmış bir sete güvenmek yerine canlı listeyi `/v1/models` üzerinden okuyun.

Ağ geçidinin bilmediği bir model kimliği faturalandırmadan önce reddedilir: `gpt-5.4-mini` → **400** `{"error":{"type":"invalid_request_error","code":400,"provider":"RouterPlex"}}`. Hatalı bir anahtar **401** `RouterPlex could not authenticate this API key.` yanıtı verir.

## 🧪 API nasıl kullanılır

Temel URL **`https://api.routerplex.com/v1`** — OpenAI uyumlu sohbet tamamlamaları, ayrıca `/v1/messages` (Anthropic) ve Codex için bir Responses rotası; dokümanların kendi örneği bir bearer çağrısıdır:

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

Anahtarlar 25 karakterdir ve `sk-` öneki taşır. Deneme trafiği 10 RPM / 250k TPM / 4 eşzamanlı istek ile sınırlıdır, bu nedenle ani bir yük **429** yanıtı verir; çağrıları aralıklı yapın.

## 🛠 Hızlı başlangıç

```bash
cd routerplex-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify

# or directly:
node src/cli.js --count 1        # one sign-up in a real Chrome (Turnstile), $1 credit, one key
node src/cli.js --verify-only    # re-test every key already in keys.txt
node src/cli.js --screen         # test the exit list against sign-up + the API
```

Kayıt gerçek, görünür bir Chrome gerektirir: kayıt çağrısı bir Turnstile belirteci taşır ve Cloudflare düz HTTP istemcilerine `403 __cf_chl_rt_tk` yanıtı verir. `keys.txt` yalnızca `GET /v1/models` **ve** gerçek bir tamamlama sonrasında yazılır ve `accounts.json` hesap durumunu (e-posta, parola, anahtar, araç) saklar. Bir hesap = bir anahtar = bir 1 $ hibesi.

### 🖱️ Başlatıcı

`node src/launcher.js`, bu deponun sunduğu görev modülleri üzerinde bir menüdür — **mint** (yeni bir hesap, doğrulanmış e-postası, 1 $ kurulum anahtarı) ve **verify** (`keys.txt` üzerinde canlı kapıyı yeniden çalıştırır) — proxy havuzu ve hesap sayısı `launcher.config.json` içinde tutulur. Aşağıdaki her bayrak doğrudan CLI'dan erişilebilir; başlatıcı yalnızca bir kolaylık sarmalayıcısıdır.

## ✅ Çalıştığı doğrulandı — her anahtar test edilir

Aşağıdaki tüm kontroller **2026-10-21** tarihinde gönderilen CLI'dan yeniden çalıştırıldı (çıkış: operatör havuzundan incelenmiş bir konut hattı — veri merkezi çıkışları formu yükler ama widget'ı asla bağlamaz, aşağıya bakın).

**verified working** —

| Kontrol | Sonuç |
| --- | --- |
| `--screen` (çıkış incelemesi) | **✔** — `routerplex.com/sign-up` gerçek formla **200** ve API, **tek kullanımlık anahtarlı** bir yoklamaya JSON **401** yanıtı veriyor (anonim bir yoklama, çalışan bir çıkıştan bile Cloudflare tarafından 403 ile karşılanır, bu nedenle inceleme onu anahtarlar) |
| gerçek Chrome'da kayıt | **✔ 201** `POST /api/auth/register` → `200 /api/auth/login` → `/dashboard/setup` |
| e-posta doğrulama | **✔** — gelen kutusundan `verify?token=…` bağlantısı, ardından `/api/auth/me` `is_verified: true` bildirir |
| `POST /api/onboarding` | **200** `trial_credit_usd: 1.0`, `trial_eligible: true` |
| `POST /api/onboarding/key` | **200** `{"key":"sk-…"}`, `trial_granted: true`, `access_mode: "trial"` |
| anahtar başına `GET /v1/models` | **200**, 72 kimlik |
| yazılmadan önce anahtar başına `POST /v1/chat/completions` | **200** — `deepseek-v4.1-flash` (`content \|\| reasoning_content`); ayrıca `claude-haiku-4-5`, `gemini-2.5-flash-lite`, `MiniMax-M3`, `qwen3.8-flash` üzerinde 200 |
| oluşturma sonrası anahtar satırı | `max_budget 1.0`, `rpm_limit 10`, `tpm_limit 250000`, `blocked false`, `expires null` |
| kontrolünü geçemeyen bir anahtar | `keys.txt` dosyasına asla yazılmaz (kapı, yeni bir anahtarın 401 penceresini düşürmek yerine yeniden dener) |

İlk çağrının maliyeti: `claude-haiku-4-5` üzerinde `$0.00056328`, yani flash model fiyatlarında 1 $ çok fazla deneme trafiği demektir.

## 🧭 Nasıl çalışır

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: RouterPlex page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.routerplex.com/v1/chat/completions → real content = the key is live
```

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| inceleme | `GET routerplex.com/sign-up` + `GET api.routerplex.com/v1/models` | inceleme, API yoklamasını anahtarlar (anonim olarak 403 ile karşılanır) ve bir posta kutusu harcanmadan önce form yerine bir Cloudflare meydan okuma sayfası alan bir çıkışı atlar |
| posta kutusu | gerçek bir `@hotmail.com`/`@outlook.com` kutusunda temp.tf artı takma adı | `/api/account` ardından `POST /api/check`; yalnızca `routerplex`'ten gelen posta kabul edilir (kutu paylaşılan bir havuzdur) |
| form | gerçek Chrome'da `/sign-up` | adlar + e-posta + parola + **şartlar kutusu**; isteğe bağlı ölçüm banner'ı önce kapatılır |
| captcha | sayfanın kendi Turnstile'ı (yönetilen, sitekey `0x4AAAAAAD0CGKtkBfp1Bvp6`) | görünür bir pencerede kendi kendine çözülür; belirteç kayıt gövdesinde taşınır |
| kayıt | `POST /api/auth/register` (201) ardından `/api/auth/login` (200) | sayfa her ikisini de yapar ve `/dashboard/setup` sayfasına iner |
| doğrulama | postadan `https://routerplex.com/verify?token=…` bağlantısını aç | bağlantı postanın `href`'inde bulunur; JWT `aud=fastapi-users:verify`, ~1 sa |
| anahtar | `POST /api/onboarding {tool,model}` ardından `POST /api/onboarding/key` | sihirbazın kendi rotaları; **1 $ anahtar çağrısında yüklenir** |
| kapı | `GET /v1/models` + bir tamamlama | içerikle (veya akıl yürütmeyle) 200, `keys.txt` dosyasını yazan tek şeydir |

Ölçülen iki tuzak: **işaretlenmemiş bir şartlar kutusu gönderimi sessiz bir no-op yapar** (istek yok, hata yok) ve **yepyeni bir anahtar, ağ geçidi hesabı hazırlarken birkaç dakika boyunca 401 yanıtı verebilir** — panel hâlâ `blocked: false` der, bu nedenle kapı anahtarı ölü ilan etmek yerine bekler.

## ⚙️ CLI seçenekleri

```bash
node src/cli.js --count 5                  # five sign-ups, serial (one visible Chrome)
node src/cli.js --model claude-haiku-4-5   # model used for the live gate
node src/cli.js --tool opencode            # setup wizard tool that claims the trial
node src/cli.js --verify-only              # re-check keys.txt
node src/cli.js --screen                   # exit-pool self-test
node src/cli.js --connect-9router          # register provider + keys on a local 9Router
node src/cli.js --help
```

| Bayrak | Varsayılan | Anlamı |
| --- | --- | --- |
| `--count N` | `1` | oluşturulacak hesap sayısı, seri |
| `--model <id>` | `deepseek-v4.1-flash` | canlı kapı için kullanılan model |
| `--tool <id>` | `claude-code` | denemenin talep edildiği kurulum sihirbazı aracı |
| `--pool <file>` | `proxies.txt` | çıkış havuzu, proxy başına bir satır — isteğe bağlı |
| `--tries N` | `3` | hesap başına incelenen çıkış adayı |
| `--mint-tries N` | `3` | çıkış başına tam kayıt denemesi (yeni posta kutusu + Chrome) |
| `--link-timeout S` | `300` | doğrulama postasını bekleme süresi (saniye) |
| `--grant-wait S` | `150` | yeni bir anahtarın 401 penceresinin beklendiği saniye |
| `--gap MS` | `4000` | hesaplar arası duraklama |
| `--keys <file>` | `keys.txt` | `--verify-only` / `--connect-9router` için anahtar dosyası |
| `--headless` | kapalı | Chrome'u başsız çalıştır (test edilen ray görünür bir penceredir) |
| `--debug-port N` | otomatik | Chrome DevTools bağlantı noktası |

## 🛰️ Proxy arkasında

**İsteğe bağlı — ölçekte önerilir (IP başına limitler, yasaklar).** Araç proxy olmadan da çalışır.

- **Havuzla:** `--pool <file>` geçin (veya `ROUTERPLEX_PROXIES` ayarlayın) ve her istek — Chrome tarayıcısı dahil — o listeden bir çıkış üzerinden gider, fail-closed: her aday önce incelenir (`routerplex.com/sign-up` gerçek formla 200 + API ana bilgisayarına erişilebilir) ve çalışma ardından o çıkışa sabitlenir. Ölü bir hat denemesini başarısız kılar ve CLI bir sonraki adaya geçer.
- **Havuz olmadan:** CLI `running WITHOUT a proxy (direct)` yazdırır ve doğrudan bağlanır. Kayıt, anahtar oluşturma veya doğrulama konusunda hiçbir şey değişmez — yalnızca paketlerin nereden çıktığı değişir.
- **Çıkış kalitesi burada normalden daha önemlidir.** Panel Cloudflare önündedir: bir veri merkezi çıkışından kayıt sayfası hâlâ görüntülenir, ancak `challenges.cloudflare.com` widget'ı asla bağlamaz (`window.turnstile` tanımsız kalır, belirteç yok) ve kayıt POST'u bir `Just a moment...` 403 yanıtı verir. Bir konut/mobil hat 750-800 karakterlik bir belirteç ve saniyeler içinde bir 201 alır, bu nedenle posta kutuları harcamadan önce bir widget kontrolüyle inceleyin.
- Kullanıcı adı/parolalı SOCKS5 hatları atlanır: Chrome bunlara kimlik doğrulayamaz (kimlik bilgili HTTP proxy'leri sorunsuzdur — tarayıcı 407'yi Fetch alanı üzerinden yanıtlar).
- İnceleme her iki ana bilgisayarda da fail-closed'dur: kayıt sayfası gerçek form olmalıdır (bir Cloudflare meydan okuma sayfası bunu başarısız kılar) ve API, tek kullanımlık anahtarlı bir yoklamaya meydan okuma sayfası değil JSON yanıtı vermelidir.
- Her iki moda karşı `--screen` çalıştırın: sahip olduğunuz çıkışları (veya doğrudan rotayı) kayıt sayfasına ve API'ye karşı test eder.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | satır başına bir canlı doğrulanmış anahtar — git tarafından yok sayılır |
| `accounts.json` | e-posta / parola / anahtar / araç durumu, başarısız denemeler dahil |
| `proxies.txt` | çıkışlarınız — git tarafından yok sayılır |
| `out/` | çalışma günlüğü, başarısızlık ekran görüntüleri, `attempts.jsonl` defteri — git tarafından yok sayılır |

## 🔌 9Router'a bağlan

[9Router](https://9router.com) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Varsayılanlar: `--prefix routerplex`, `--base-url https://api.routerplex.com/v1`, `--model deepseek-v4.1-flash`. Modeller `routerplex/<model id>` olarak sunulur. CLI aynısını tek seferde yapabilir: `node src/cli.js --connect-9router`.

## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **RouterPlex** — [routerplex.com](https://routerplex.com) |
| 🎁 Sağlayıcının verdikleri | **doğrulanmış hesap başına 1 $ deneme kredisi** (bir hibe, kart yok, süresi dolmaz) |
| 🔑 Bir anahtar size ne kazandırır | `https://api.routerplex.com/v1` üzerinde 72 modelli katalog — 1 $ bütçeyle sabit sınırlı, 10 RPM / 250k TPM |
| 🌐 API şekli | OpenAI uyumlu: `POST https://api.routerplex.com/v1/chat/completions` (+ Anthropic Messages, Responses) |
| 🔒 Verileriniz | yalnızca `routerplex.com` / `api.routerplex.com` ve gelen kutusu arka ucunuzla iletişim kurulur |

## 🐞 Sorunlar

RouterPlex kayıt formunu, onboarding rotasını veya model kataloğunu değiştirirse araç orada durur ve bunu bildirir. Komut ve tam çıktıyla birlikte **[bir sorun açın](../../issues)**.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 routerplex-bulk-apikey katkıda bulunanlar

</div>