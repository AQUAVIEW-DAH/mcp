# Contributing

Thanks for considering a contribution! This repo is **examples-only** — the MCP server itself lives elsewhere. The most valuable contributions here are:

1. **New examples** — research questions you've answered with AQUAVIEW and want to share
2. **Prompt recipes** — short, copy-pasteable prompts for the `prompts/` folder
3. **Integration guides** — setup walkthroughs for MCP clients we don't cover yet
4. **Doc fixes** — typos, broken links, out-of-date item IDs

## Adding a new example

1. Pick the next available number (e.g., `examples/22-…`).
2. Copy the structure of [`02-sea-surface-temperature/`](examples/02-sea-surface-temperature/) as a template.
3. Each example's `README.md` has these sections, in this order:
   - **Question** (one-line research question, used as the H1)
   - **What this teaches** + **Sources used**
   - **Prompt** (copy-pasteable)
   - **Transcript** (real tool calls — not invented; capture them while running the example yourself)
   - **Result** (what the agent returned, abbreviated for clarity)
   - **Variations** (3–5 ways to remix the same question)
   - **Related examples** (internal cross-links)
4. Run the prompt yourself against `claude-opus-4-7` (or any model with MCP support) and paste real tool calls/results. **Don't fabricate transcripts** — readers will copy the prompts and notice mismatches.
5. Update [`examples/README.md`](examples/README.md) and the README's [`Try these prompts`](README.md#try-these-prompts) section if your example is showcase-worthy.

## Style

- Markdown only (no HTML except in the README hero).
- Default to no emojis (none in our existing files — keep it that way).
- Code samples use **Python** for tool-call signatures and `bash` for shell commands.
- Don't introduce new dependencies in notebooks beyond the provider's official SDK.
- Prefer concrete data over generic placeholders. Use a real bbox, real datetime, real collection ID.

## What we won't accept

- Synthetic transcripts that don't match what AQUAVIEW actually returns.
- Examples requiring private auth, paid APIs, or local data files.
- Mirroring upstream provider documentation. Link to it instead.

## Running locally

There's nothing to build — this is a docs repo. To preview Markdown:

```bash
# any local Markdown previewer; here's one option
npx serve .
```

To run the link checker locally:

```bash
brew install lychee
lychee --no-progress --exclude '^https://mcp\.aquaview\.org' './**/*.md'
```

## License

By contributing, you agree your contribution will be licensed under the [MIT license](LICENSE).
