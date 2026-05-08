# FAQ

## What is AQUAVIEW?

AQUAVIEW is a unified discovery layer for ocean, atmospheric, and marine data. It indexes 700,000+ datasets across 68 authoritative sources (NOAA, IOOS, World Ocean Database, Argo, ESA, IFREMER, etc.) into a single STAC catalog and exposes that catalog as a Model Context Protocol (MCP) server so any LLM agent can query it directly.

Platform: <https://aquaview.org>
MCP overview: <https://aquaview.org/mcp-overview>

## Is the MCP server free?

The hosted endpoint at `https://mcp.aquaview.org/mcp` is currently free to use, no key required. Heavy production workloads should reach out via the homepage.

## Does AQUAVIEW host the actual data files?

No. AQUAVIEW indexes metadata and exposes asset links (`href`s) that point at the authoritative providers — NCEI, AWS Open Data, Google Cloud Storage, ERDDAP, and so on. Data ownership stays with the source institution. AQUAVIEW is the discovery and routing layer.

## What's the difference between AQUAVIEW MCP and ERDDAP / STAC API directly?

| Aspect | AQUAVIEW MCP | Direct ERDDAP / STAC API |
|---|---|---|
| Sources unified | 68 in one query | Per-server |
| Query language | Natural language → CQL2 | Custom per server |
| LLM-native | Yes (MCP) | No |
| Per-variable filtering | Yes (`column_stats_summary`) | Source-dependent |
| Aggregations | Native | Source-dependent |

AQUAVIEW ingests, normalizes, and re-publishes those upstream catalogs into a single schema. You give up some source-specific richness in exchange for unified search across decades of data and dozens of providers.

## Which LLMs are supported?

Any LLM with MCP support, including:

- **Claude** (Desktop, Code, Anthropic API direct)
- **ChatGPT** (Custom Connectors, OpenAI Agents SDK)
- **Gemini** (Google Gen AI SDK)
- **Grok** (xAI clients with MCP support)
- **Cursor**, **Cline**, **Continue**, **Zed**, and other MCP-enabled IDEs

See [`INSTALL.md`](../INSTALL.md) for setup per client.

## Will my queries be logged?

The hosted endpoint records request metadata (timestamps, tool names, parameters) for operational monitoring and abuse prevention. It does not record user-attributable identifiers unless you authenticate. See the privacy notice on aquaview.org for the canonical policy.

## What's the rate limit?

Currently soft-capped at a generous default per IP. Hard limits aren't published; if you hit one you'll get a 429 with a `Retry-After`. Open an issue if your legitimate use is being rate-limited.

## How fresh is the data?

| Source family | Update cadence |
|---|---|
| Realtime buoys (NDBC, NOS_COOPS) | Minutes-to-hourly |
| Satellite (GOES-R, Sentinel) | Hours after acquisition |
| Argo (GADR) | Daily near-real-time + delayed-mode reprocessing |
| Weather model (HRRR) | Hourly |
| Archive (WOD, NEXRAD historical) | Periodic batches |

AQUAVIEW re-indexes on a rolling schedule. Item-level "last modified" is preserved from the source.

## Can I add a source?

Yes — open an issue with a link to the upstream catalog and a short description. AQUAVIEW prioritizes sources with stable APIs and authoritative provenance.

## What does the `aquaview:` property prefix mean?

These are normalized properties AQUAVIEW adds on top of source-specific ones (which retain their original names). The normalization makes cross-source filtering possible. See [`data-model.md`](data-model.md).

## Does AQUAVIEW support GraphQL / REST in addition to MCP?

This repo focuses on MCP. The underlying STAC API is also exposed; ask on the homepage for access.

## My agent is calling `search_datasets` with `q="Gulf of Mexico"` and getting weird results

That's a known prompting pitfall — region names in free text are unreliable. Use `bbox`. See [`prompting-guide.md`](prompting-guide.md#region-name-in-q-instead-of-bbox).

## My agent's response includes oil-spill incident reports when I asked about ocean temperatures

`INCIDENT_NEWS` is text-heavy and over-matches free-text searches. Add `exclude_collections="INCIDENT_NEWS"`. See [`prompting-guide.md`](prompting-guide.md#conflating-incident_news-with-research-data).

## How do I download the actual NetCDF / GRIB2 / CSV file?

Either ask the LLM directly (*"give me the download URL for that item"*) or call `get_item(collection, item_id)` to receive the full asset list. The `href` on each asset is a direct download URL at the source provider.

## I'm seeing 68 collections but the docs mention "15 sources" elsewhere

"Sources" sometimes refers to source organizations (e.g., NOAA), and "collections" refers to the per-program subdivisions (NDBC, COOPS, GOES-R, etc., are all NOAA but are separate collections). The number of collections is the more useful figure for filtering: **68**.

## How do I cite AQUAVIEW in academic work?

Cite the underlying data source — AQUAVIEW is a discovery layer, not a primary publisher. AQUAVIEW's catalog records preserve `aquaview:institution`, original DOIs where available, and asset URLs back to the authoritative provider. We recommend citing both: the original dataset, and AQUAVIEW as the discovery tool ("dataset discovered via aquaview.org").
