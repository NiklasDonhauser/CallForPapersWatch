# Call for Papers Watch

Deadlines and call-for-papers information for NLP (and adjacent ML) conferences, hosted on GitHub Pages.

**Live:** https://niklasdonhauser.github.io/CallForPapersWatch/

## Features

- **No accounts** – default conferences ship with the repo; everything you add or change lives in your browser (localStorage)
- **Default set**: 12 NLP/ML venues with researched deadlines (season 2026/27, `infoAsOf` date and CFP source linked per entry); venues using ACL Rolling Review reference the ARR cycle deadline
- **Own entries**: create, edit and delete conferences via a form; a live countdown (days/hours/minutes/seconds) runs on each card and turns urgent below 14 days
- **Editable defaults**: spot a wrong date in a default entry? Edit it locally – the card gets an *Edited* badge and a ↺ button to restore the original repo data
- **Export / Import**: everything you changed locally (own entries + edits of defaults) can be downloaded as JSON and re-imported on another device
- **Share links**: the same data can be encoded in the URL (`#e=…`, base64url); whoever opens the link can import your view – nothing is sent to any server
- **Filters & search**: All / NLP / ML / Own plus full-text search over acronym, name and location
- **Dark / light theme**: follows your system setting by default, switchable in the header, no flash on reload
- **Bilingual UI**: German/English switcher, persisted

## Data model

Each entry in `src/data/conferences.json`:

```json
{
  "acronym": "ACL 2027",
  "name": "Annual Meeting of the ACL",
  "location": "Kyoto, Japan",
  "category": "nlp | ml",
  "website": "https://…",
  "dates": { "abstractDeadline": "…", "fullPaperDeadline": "…", "conferenceStart": "…", "conferenceEnd": "…" },
  "source": "https://…",
  "infoAsOf": "YYYY-MM-DD",
  "note": "optional caveat, e.g. projected dates"
}
```

- Deadline timestamps carry a timezone offset; NLP deadlines usually use **AoE** (Anywhere on Earth, UTC−12). The countdown priority is: abstract deadline → paper deadline → conference start. Statuses: countdown → deadline passed → conference running → ended → dates TBA.
- Conferences without announced dates show *Dates not announced yet* and sort last.
- `infoAsOf` older than ~6 months is flagged as stale (⚠).

## Data maintenance

Deadlines of the default entries are updated per commit. Verified against the official CFP pages / [ACL Rolling Review](https://aclrollingreview.org/dates). If a deadline looks wrong while browsing, you can fix it locally in the UI – contributions via PR are welcome too.

Backlog: a GitHub Action that mirrors [ccfddl](https://ccfddl.github.io) weekly and proposes the refreshed defaults as a pull request.

## Development

```bash
npm install
npm run dev

npm run build      # type-checks with vue-tsc, then builds to dist/
npm run preview
```

Requires Node ≥ 16.18 (Vite 4; upgrade to Node LTS and modern Vite versions without code changes). Local dev serves the site under `/CallForPapersWatch/` — same as on GitHub Pages.

**Stack:** Vue 3 SFCs + TypeScript, Vite, no UI framework, no backend. State lives in plain reactive modules (`src/store/`), all UI strings in `src/i18n/{en,de}.ts`.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds and deploys to GitHub Pages.

GitHub Pages must be enabled once under **Settings → Pages → Source: GitHub Actions**.
