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

**Créez en masse des comptes RouterPlex avec des clés API générées automatiquement — inférence compatible OpenAI + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-72%20served-412991?style=for-the-badge)](https://docs.routerplex.com/models)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-72-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Derrière un proxy](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Pourquoi cet outil existe

RouterPlex est une passerelle IA derrière Cloudflare avec **une seule subvention qui vaut la peine : 1 $ de crédit d'essai, une fois par compte vérifié** (sans carte, sans téléphone, crédité lors de la création de la clé de configuration). Le catalogue derrière compte 72 modèles — Anthropic, OpenAI, Google, DeepSeek, Qwen, MiniMax, Kimi, Grok — servis au prix catalogue du fournisseur via un point de terminaison compatible OpenAI, plus Anthropic Messages et une route Responses pour Codex. L'inscription est un simple formulaire par e-mail, mais l'appel d'enregistrement porte un jeton **Cloudflare Turnstile** et répond `403 __cf_chl_rt_tk` à tout ce qui n'est pas un navigateur, donc l'outil pilote un vrai Chrome et ne conserve que les clés qui passent un appel de chat en direct.

## 🎁 Offre gratuite — ce que vous obtenez

| Élément | Valeur |
| --- | --- |
| Crédit gratuit | **1,00 $ une fois par compte vérifié éligible**, accordé dans `POST /api/onboarding/key` (panneau : `trial_credit_usd: 1.0`, `trial_granted: true`) |
| Budget de la clé | la clé de configuration démarre avec un `max_budget: 1.0` (USD) strict |
| Limites de débit | **10 requêtes/min**, **250 000 jetons/min** (`rpm_limit: 10`, `tpm_limit: 250000` sur la ligne de la clé), 4 requêtes simultanées selon les conditions de l'offre |
| Expiration | **aucune** — `expires: null`, le crédit n'expire pas |
| Carte / téléphone | **sans carte, sans téléphone** — « No card needed. Signup and guided setup have no payment step. » |
| Éligibilité | e-mail vérifié + aucun rechargement payant antérieur, aucun crédit existant, aucune subvention de crédit de configuration antérieure (une subvention par compte, vérifiée en direct : `trial_eligible` passe à `false` après la création de la clé) |
| Après le 1 $ | paiement à l'usage uniquement, rechargement minimum de **5 $** (carte ou crypto), frais de rechargement de 0 $, 0 % de marge sur les jetons |

Le crédit promotionnel n'a aucune valeur monétaire et peut être retiré en cas d'abus — un compte, une clé, une subvention est l'unité qui passe à l'échelle.

> 💡 L'offre gratuite est définie par RouterPlex et peut changer. Vérifiez les chiffres en direct sur [routerplex.com](https://routerplex.com) — et laissez la propre barrière de l'outil décider :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modèles — les 72

`GET /v1/models` a répondu **200 avec 72 identifiants** sur une clé d'essai en direct (2026-10-21). Chaque clé que cet outil écrit a déjà répondu à une vraie complétion ; ces cinq ont été vérifiées de bout en bout par chat :

| ID du modèle | note |
| --- | --- |
| `deepseek-v4.1-flash` | la valeur par défaut de vérification — 200 `pong`, le moins cher de l'ensemble (0,18 $ / 0,73 $ par 1M) |
| `claude-haiku-4-5` | 200 |
| `gemini-2.5-flash-lite` | 200 |
| `MiniMax-M3` | 200 |
| `qwen3.8-flash` | 200 |

Le catalogue contient aussi `gpt-5.4`/`gpt-5.5`/`gpt-5.6-terra`, `gpt-6-sol`, `claude-sonnet-4-6`/`claude-opus-5`, `gemini-3.1-pro`/`gemini-3.5-flash`, `MiniMax-M3.1-flash`, `step-3.7-flash`, `doubao-seed-2.0-pro`, `mimo-v2.6-pro`, `deepseek-v4-pro`, `kimi-k3`, `glm-5.2`, `qwen3.7-max`/`qwen3.8-max`, `grok-4.7`, `LongCat-2.0`, `hy3`, `gpt-image-2` — ceux-ci n'ont **pas** été testés individuellement par chat ici ; lisez la liste en direct depuis `/v1/models` plutôt que de faire confiance à un ensemble codé en dur.

Un identifiant de modèle que la passerelle ne connaît pas est rejeté avant la facturation : `gpt-5.4-mini` → **400** `{"error":{"type":"invalid_request_error","code":400,"provider":"RouterPlex"}}`. Une mauvaise clé donne **401** `RouterPlex could not authenticate this API key.`

## 🧪 Comment utiliser l'API

URL de base **`https://api.routerplex.com/v1`** — complétions de chat compatibles OpenAI, plus `/v1/messages` (Anthropic) et une route Responses pour Codex ; l'exemple de la documentation elle-même est un appel bearer :

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

Les clés font 25 caractères, préfixées par `sk-`. Le trafic d'essai est plafonné à 10 RPM / 250k TPM / 4 simultanées, donc une rafale répond **429** ; espacez les appels.

## 🛠 Démarrage rapide

```bash
cd routerplex-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify

# or directly:
node src/cli.js --count 1        # one sign-up in a real Chrome (Turnstile), $1 credit, one key
node src/cli.js --verify-only    # re-test every key already in keys.txt
node src/cli.js --screen         # test the exit list against sign-up + the API
```

L'inscription nécessite un vrai Chrome visible : l'appel d'enregistrement porte un jeton Turnstile et Cloudflare répond `403 __cf_chl_rt_tk` aux clients HTTP simples. `keys.txt` n'est écrit qu'après `GET /v1/models` **et** une vraie complétion, et `accounts.json` conserve l'état du compte (e-mail, mot de passe, clé, outil). Un compte = une clé = une subvention de 1 $.

### 🖱️ Le lanceur

`node src/launcher.js` est un menu au-dessus des modules de tâches fournis par ce dépôt — **mint** (un nouveau compte, son e-mail vérifié, la clé de configuration de 1 $) et **verify** (relancer la barrière en direct sur `keys.txt`), avec le pool de proxys et le nombre de comptes conservés dans `launcher.config.json`. Chaque option ci-dessous est accessible directement depuis la CLI ; le lanceur n'est qu'un emballage pratique.

## ✅ Vérifié fonctionnel — chaque clé est testée

Toutes les vérifications ci-dessous ont été relancées le **2026-10-21** depuis la CLI fournie (sortie : une ligne résidentielle vérifiée du pool de l'opérateur — les sorties de datacenter chargent le formulaire mais ne montent jamais le widget, voir ci-dessous).

**verified working** —

| Vérification | Résultat |
| --- | --- |
| `--screen` (vérification de sortie) | **✔** — `routerplex.com/sign-up` **200** avec le vrai formulaire et l'API répondant à une sonde **à clé jetable** avec un JSON **401** (une sonde anonyme est défiée par Cloudflare avec un 403 même depuis une sortie qui fonctionne, donc la vérification la clé) |
| inscription dans un vrai Chrome | **✔ 201** `POST /api/auth/register` → `200 /api/auth/login` → `/dashboard/setup` |
| vérification de l'e-mail | **✔** — lien `verify?token=…` depuis la boîte de réception, `/api/auth/me` rapporte alors `is_verified: true` |
| `POST /api/onboarding` | **200** `trial_credit_usd: 1.0`, `trial_eligible: true` |
| `POST /api/onboarding/key` | **200** `{"key":"sk-…"}`, `trial_granted: true`, `access_mode: "trial"` |
| `GET /v1/models` par clé | **200**, 72 identifiants |
| `POST /v1/chat/completions` par clé avant son écriture | **200** — `deepseek-v4.1-flash` (`content \|\| reasoning_content`) ; aussi 200 sur `claude-haiku-4-5`, `gemini-2.5-flash-lite`, `MiniMax-M3`, `qwen3.8-flash` |
| ligne de la clé après création | `max_budget 1.0`, `rpm_limit 10`, `tpm_limit 250000`, `blocked false`, `expires null` |
| une clé qui échoue à sa vérification | jamais écrite dans `keys.txt` (la barrière réessaie la fenêtre 401 d'une nouvelle clé au lieu de la rejeter) |

Coût du premier appel : `0,00056328 $` sur `claude-haiku-4-5`, donc 1 $ représente beaucoup de trafic d'essai aux prix des modèles flash.

## 🧭 Comment ça marche

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: RouterPlex page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.routerplex.com/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Notes |
| --- | --- | --- |
| vérification | `GET routerplex.com/sign-up` + `GET api.routerplex.com/v1/models` | la vérification clé la sonde API (anonymement elle est défiée par un 403) et ignore une sortie qui reçoit une page de défi au lieu du formulaire, avant qu'une boîte mail ne soit dépensée |
| boîte mail | alias plus de temp.tf sur une vraie boîte `@hotmail.com`/`@outlook.com` | `/api/account` puis `POST /api/check` ; seul le courrier de `routerplex` est accepté (la boîte est un pool partagé) |
| formulaire | `/sign-up` dans un vrai Chrome | noms + e-mail + mot de passe + **case des conditions** ; la bannière de mesure optionnelle est fermée d'abord |
| captcha | le Turnstile propre à la page (managed, sitekey `0x4AAAAAAD0CGKtkBfp1Bvp6`) | se résout tout seul dans une fenêtre visible ; le jeton voyage dans le corps de l'enregistrement |
| enregistrement | `POST /api/auth/register` (201) puis `/api/auth/login` (200) | la page fait les deux et atterrit sur `/dashboard/setup` |
| vérification | ouvrir `https://routerplex.com/verify?token=…` depuis le mail | le lien se trouve dans le `href` du mail ; JWT `aud=fastapi-users:verify`, ~1 h |
| clé | `POST /api/onboarding {tool,model}` puis `POST /api/onboarding/key` | les routes propres à l'assistant ; le **1 $ arrive dans l'appel de la clé** |
| barrière | `GET /v1/models` + une complétion | un 200 avec contenu (ou raisonnement) est la seule chose qui écrit `keys.txt` |

Deux pièges mesurés : une **case des conditions non cochée rend la soumission silencieusement sans effet** (aucune requête, aucune erreur), et une **clé toute nouvelle peut répondre 401 pendant plusieurs minutes** pendant que la passerelle provisionne le compte — le panneau indique toujours `blocked: false`, donc la barrière attend plutôt que de déclarer la clé morte.

## ⚙️ Options de la CLI

```bash
node src/cli.js --count 5                  # five sign-ups, serial (one visible Chrome)
node src/cli.js --model claude-haiku-4-5   # model used for the live gate
node src/cli.js --tool opencode            # setup wizard tool that claims the trial
node src/cli.js --verify-only              # re-check keys.txt
node src/cli.js --screen                   # exit-pool self-test
node src/cli.js --connect-9router          # register provider + keys on a local 9Router
node src/cli.js --help
```

| Option | Défaut | Signification |
| --- | --- | --- |
| `--count N` | `1` | comptes à créer, en série |
| `--model <id>` | `deepseek-v4.1-flash` | modèle utilisé pour la barrière en direct |
| `--tool <id>` | `claude-code` | outil de l'assistant de configuration avec lequel l'essai est réclamé |
| `--pool <file>` | `proxies.txt` | pool de sorties, une ligne par proxy — facultatif |
| `--tries N` | `3` | candidats de sortie vérifiés par compte |
| `--mint-tries N` | `3` | tentatives d'inscription complètes (nouvelle boîte mail + Chrome) par sortie |
| `--link-timeout S` | `300` | secondes d'attente du mail de vérification |
| `--grant-wait S` | `150` | secondes pendant lesquelles la fenêtre 401 d'une nouvelle clé est attendue |
| `--gap MS` | `4000` | pause entre les comptes |
| `--keys <file>` | `keys.txt` | fichier de clés pour `--verify-only` / `--connect-9router` |
| `--headless` | désactivé | exécuter Chrome en mode headless (une fenêtre visible est le rail testé) |
| `--debug-port N` | auto | port Chrome DevTools |

## 🛰️ Derrière un proxy

**Facultatif — recommandé à grande échelle (limites par IP, bannissements).** L'outil fonctionne aussi sans proxy.

- **Avec un pool :** passez `--pool <file>` (ou définissez `ROUTERPLEX_PROXIES`) et chaque requête — le navigateur Chrome inclus — passe par une sortie de cette liste, en échec fermé : chaque candidat est d'abord vérifié (`routerplex.com/sign-up` 200 avec le vrai formulaire + l'hôte de l'API joignable) et l'exécution reste ensuite épinglée à cette sortie. Une ligne morte échoue à sa tentative et la CLI passe au candidat suivant.
- **Sans pool :** la CLI affiche `running WITHOUT a proxy (direct)` et se connecte directement. Rien ne change concernant l'inscription, la création de clé ou la vérification — seul le point de départ des paquets change.
- **La qualité de la sortie compte plus que d'habitude ici.** Le panneau est derrière Cloudflare : depuis une sortie de datacenter, la page d'inscription s'affiche toujours, mais `challenges.cloudflare.com` ne monte jamais le widget (`window.turnstile` reste indéfini, aucun jeton) et le POST d'enregistrement répond un 403 `Just a moment...`. Une ligne résidentielle/mobile obtient un jeton de 750-800 caractères et un 201 en quelques secondes, donc vérifiez avec un contrôle de widget avant de dépenser des boîtes mail.
- Les lignes SOCKS5 avec un nom d'utilisateur/mot de passe sont ignorées : Chrome ne peut pas s'y authentifier (les proxys HTTP avec identifiants conviennent — le navigateur répond au 407 via le domaine Fetch).
- La vérification est en échec fermé sur les deux hôtes : la page d'inscription doit être le vrai formulaire (une page de défi Cloudflare la fait échouer) et l'API doit répondre à une sonde à clé jetable avec du JSON, pas une page de défi.
- Lancez `--screen` contre l'un ou l'autre mode : il teste les sorties que vous avez (ou la route directe) contre la page d'inscription et l'API.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé vérifiée en direct par ligne — ignoré par git |
| `accounts.json` | état e-mail / mot de passe / clé / outil, y compris les tentatives échouées |
| `proxies.txt` | vos sorties — ignoré par git |
| `out/` | journal d'exécution, captures d'écran d'échec, registre `attempts.jsonl` — ignoré par git |

## 🔌 Se connecter à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé compatible OpenAI :

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Défauts : `--prefix routerplex`, `--base-url https://api.routerplex.com/v1`, `--model deepseek-v4.1-flash`. Les modèles sont servis sous `routerplex/<model id>`. La CLI peut faire la même chose en une seule fois : `node src/cli.js --connect-9router`.

## 🔑 Ce qu'une clé vous apporte

| | |
| --- | --- |
| 🏢 Fournisseur | **RouterPlex** — [routerplex.com](https://routerplex.com) |
| 🎁 Ce que le fournisseur donne | **1 $ de crédit d'essai par compte vérifié** (une subvention, sans carte, n'expire jamais) |
| 🔑 Ce qu'une clé vous apporte | le catalogue de 72 modèles sur `https://api.routerplex.com/v1` — plafonné à un budget de 1 $, 10 RPM / 250k TPM |
| 🌐 Forme de l'API | compatible OpenAI : `POST https://api.routerplex.com/v1/chat/completions` (+ Anthropic Messages, Responses) |
| 🔒 Vos données | seuls `routerplex.com` / `api.routerplex.com` et votre backend de boîte mail sont contactés |

## 🐞 Problèmes

Si RouterPlex modifie son formulaire d'inscription, la route d'onboarding ou le catalogue de modèles, l'outil s'arrête là et le signale. **[Ouvrez un ticket](../../issues)** avec la commande et la sortie exacte.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 routerplex-bulk-apikey contributors

</div>