# Adrex Verity Lite

Adrex Verity Lite is a local-first Chrome extension that helps people check AI answers before acting on them.

Paste an answer from ChatGPT, Claude, Gemini, Grok, Perplexity, or another AI tool. Adrex extracts claims, checks public evidence, flags high-risk language, and produces a Trust Score.

**Important:** Adrex does not prove an answer is true. It helps users see evidence, uncertainty, and risk before making a decision.

## Features

- Trust Score from 15–95
- Claim detection
- High-risk claim warnings
- Automatic Wikipedia and Google News evidence checks
- Source-quality labels: Government, Medical, Academic, News, Wiki, Other
- Manual trusted-source addition
- Markdown verification report export
- Private local Vault
- No account required

## Install

1. Download or clone this repository.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Click **Load unpacked**.
5. Select the `adrex-verity-lite` folder.

## Privacy

Adrex Verity Lite stores verification history locally in your browser. It does not require an account and does not send your answers to an Adrex server.

Automatic checks query Wikipedia and Google News. If you add a manual source, that source remains stored locally.

## Disclaimer

Adrex Verity Lite is not a fact-checking authority and does not provide medical, legal, financial, or safety advice. Always verify important claims with qualified professionals and authoritative sources.

## License

MIT License. See `LICENSE`.