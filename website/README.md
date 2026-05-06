# Aquaview MCP — Docusaurus website

This directory builds the Aquaview MCP docs site with [Docusaurus 3](https://docusaurus.io/).

The single source of truth for all content is the **repo root** (`README.md`, `INSTALL.md`, `CONTRIBUTING.md`, `docs/`, `examples/`, `notebooks/README.md`, `prompts/README.md`). On every build, `scripts/sync-content.mjs` copies and lightly transforms those files into `website/docs/` for Docusaurus to consume. The synced `website/docs/` is gitignored — never edit it directly.

## Local development

```bash
cd website
npm install
npm run start
```

This runs the sync script then opens a local dev server (typically at <http://localhost:3000/mcp/>). Edit any markdown at the repo root; restart the dev server to pick up changes (or just re-run `npm run sync`).

## Build

```bash
npm run build
```

Output goes to `website/build/` — a static site you can deploy anywhere.

## Deploy

A GitHub Action at `.github/workflows/docs-docusaurus.yml` builds and deploys this branch (`docs-docusaurus`) to GitHub Pages on every push and via manual `workflow_dispatch`.

> Only one of MkDocs (main branch) or Docusaurus (this branch) can be the live GitHub Pages site at a time. The Action on this branch deploys to the same Pages target, so when this branch is what GitHub Pages is configured to build from, Docusaurus is live; otherwise the workflow's build artifact is downloadable from the Actions tab for preview.

## Stack

- Docusaurus 3 (React + MDX)
- prism-react-renderer for code highlighting
- Inter / JetBrains Mono fonts
- Aquaview brand palette in `src/css/custom.css`

## Structure

```
website/
├── docusaurus.config.js   Site configuration
├── sidebars.js            Sidebar navigation
├── src/
│   ├── css/custom.css     Brand styling
│   └── pages/             Optional custom pages (none by default — landing comes from synced README.md)
├── static/
│   └── img/               Logo lives here after sync
├── scripts/
│   └── sync-content.mjs   Copies markdown from repo root → website/docs
├── docs/                  Generated; gitignored
├── package.json
└── README.md              This file
```
