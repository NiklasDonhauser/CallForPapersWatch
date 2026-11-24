# Call for Papers Watch

Deadlines and call-for-papers information for NLP (and adjacent ML) conferences, hosted on GitHub Pages.

- Static site, no accounts: default conferences ship with the repo, your own entries live in your browser (localStorage).
- German/English UI switcher.
- Live countdown to the next relevant deadline (AoE, "Anywhere on Earth", where applicable).

## Development

```bash
npm install
npm run dev

npm run build      # type-checks with vue-tsc, then builds to dist/
npm run preview
```

Requires Node >= 16.18 (Vite 4). For local development the site is served under `/CallForPapersWatch/` — same as on GitHub Pages.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds and deploys to GitHub Pages. The site then lives at `https://<user>.github.io/CallForPapersWatch/`.

GitHub Pages must be enabled once under **Settings → Pages → Source: GitHub Actions**.

## Status

⚠ Dates in `src/data/conferences.json` are placeholders while the project is in milestone 1; they are verified against the official CFP pages later.
