# 🔐 SecurePass

**Generate strong, secure, and memorable passwords — all in your browser.**
👉 [Try it now](https://securepass.pages.dev)

---

## ✨ Features

- 🔄 Generate random passwords using:
  - Lowercase letters
  - Uppercase letters
  - Digits
  - Punctuation
- 🧠 Generate memoizable passphrases using real English words
  - Based on [EFF's Dice-Generated Passphrases](https://www.eff.org/dice)
- ⚙️ Customize password length and character types
- 🚫 No tracking — fully **client-side**
- ⚡ Fast, lightweight, and open-source

---

## 🌐 Website

[https://securepass.pages.dev](https://securepass.pages.dev)

**Routes:**

- `/` – Random character-based passwords
- `/words` – Diceware-style passphrases

---

## 🛠️ Tech Stack

- **HTML**, **CSS**, **JavaScript**
- [`nanoid`](https://github.com/ai/nanoid) (via CDN) for secure ID/password generation
  → CDN: [`https://cdn.jsdelivr.net/npm/nanoid@5.1.5/index.browser.min.js`](https://cdn.jsdelivr.net/npm/nanoid@5.1.5/index.browser.min.js)
- **Wrangler** for Cloudflare Pages routing

---

## 🚀 Getting Started

### 1. Clone and install

```bash
git clone https://github.com/azraftaohid/securepass.git
cd securepass
yarn install
```

### 2. Development server

```bash
yarn dev
```

Starts a local development server with routing support via Wrangler.

### 3. Deployment

```bash
yarn deploy
```

Deploys to Cloudflare Pages.

> Make sure you're authenticated with Cloudflare.

## 🔓 License

MIT License — free to use, modify, and distribute.

## 🙏 Credits

- [EFF Dice-Generated Passphrases](https://www.eff.org/dice)
- [nanoid](https://github.com/ai/nanoid)
- [Cloudflare Pages](https://pages.cloudflare.com/)
