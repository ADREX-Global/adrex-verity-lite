# Adrex Verity Lite

Adrex Verity Lite is a local-first Chrome and Edge extension that helps people check AI answers before acting on them.

Paste an answer from ChatGPT, Claude, Gemini, Grok, Perplexity, or another AI tool. Adrex extracts claims, checks public evidence, flags high-risk language, and produces a Trust Score.

**Important:** Adrex does not prove an answer is true. It helps users see evidence, uncertainty, and risk before making a decision.

## Live website

https://adrex-global.github.io/adrex-verity-lite/

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

## How it works

1. Copy an AI answer.
2. Paste it into Adrex Verity.
3. Click **Verify answer**.
4. Review the Trust Score, detected claims, evidence sources, and risk warnings.
5. Add a trusted source manually if needed.
6. Export a Markdown report or save the check to your local Vault.

## Install in Chrome or Edge

1. Open this repository.
2. Click **Code** → **Download ZIP**.
3. Extract the ZIP file.
4. Open Chrome or Edge.
5. Go to `chrome://extensions` or `edge://extensions`.
6. Enable **Developer mode**.
7. Click **Load unpacked**.
8. Select the inner folder named `adrex-verity-lite`.
9. Pin Adrex Verity to your toolbar.

## Privacy

Adrex Verity Lite stores verification history locally in your browser. It does not require an account and does not send your answers to an Adrex server.

Automatic checks query Wikipedia and Google News. If you add a manual source, that source remains stored locally.

## Disclaimer

Adrex Verity Lite is not a fact-checking authority and does not provide medical, legal, financial, or safety advice. Always verify important claims with qualified professionals and authoritative sources.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT License. See [LICENSE](LICENSE).
