# Prompting Guide

Aquaview works with any MCP-enabled LLM, but a few prompting habits make a big difference in result quality and tool-call efficiency. This page collects what we've learned shipping example walkthroughs across Claude, GPT, and Gemini.

## The five habits

### 1. Lead with the question, not the schema

Don't try to tell the model which tool to call or how. The four tools are small and well-described — the model picks the right one if you frame the *question* clearly.

| ✗ Less effective | ✓ More effective |
|---|---|
| *"Call `search_datasets` with `q=hurricane` and `bbox=...`"* | *"Find buoy data near Hurricane Ian's track in September 2022."* |

### 2. Specify region and time explicitly

The catalog is global and decades-long. The two pieces of context the model can't infer are **where** and **when**.

> "Show me **sea surface temperature** in the **Florida Keys** for the **last 7 days**."

If the user query lacks one or both, the model will often make a defensible default (today, global) — but if you care about a specific window, say so.

### 3. Mention the source family when you know it

Naming a source by name short-circuits the catalog scan. The model will pass `collections=` and skip free-text scoring.

> "Find **Argo float profiles** within 200 km of Hawaii." → uses `GADR`
> "Show **NEXRAD radar** scans during Hurricane Helene in Asheville." → uses `NEXRAD_L2`
> "Pull **NDBC buoy** wave heights." → uses `NDBC`

### 4. Use aggregation for shape questions, search for items

Asking *"how many?"* or *"where are the hot spots?"* should use `aggregate`, not `search_datasets` with a high limit.

| Question shape | Use |
|---|---|
| "What datasets exist for X?" | `search_datasets` |
| "How many?" | `aggregate(total_count)` |
| "Per month / per year?" | `aggregate(datetime_frequency)` |
| "Where are they concentrated?" | `aggregate(geometry_geohash_grid_frequency)` |
| "Per source breakdown?" | `aggregate(collection_frequency)` |

A well-prompted agent will scope first with `aggregate` to confirm the question is answerable, then deepen with `search_datasets`.

### 5. Ask for download links explicitly when you want them

By default `search_datasets` omits the asset records to save tokens (the agent only sees an `asset_keys` hint column). If you want actual download URLs, ask:

> "Get me the NetCDF download URLs for the top 10 results."

The model will follow up each search result with a `get_item` call, which returns full asset records including `href`.

---

## Prompt patterns by question type

### "Tell me what's available"

```
What ocean and atmospheric data sources does Aquaview have for the Gulf of Maine?
```

The model will call `list_collections` and either filter to ones with relevant keywords (`NERACOOS`, `NDBC`, `MARACOOS`, `NEFSC`) or use `aggregate(collection_frequency, bbox=...)` to rank by item count.

### Region + variable + time window

```
Find sea surface temperature observations in the Caribbean from August 2024.
Group results by source.
```

The model will likely call `aggregate(collection_frequency, q="sea surface temperature", bbox="-88,8,-58,25", datetime="2024-08-01/2024-08-31")` to discover the relevant sources, then `search_datasets` for actual items.

### Track / trajectory

```
Plot the trajectory of Argo float 7900596 over the last year.
```

`search_datasets(collections="GADR", filter={...})` filtered by float WMO ID, with results sorted by `+properties.datetime`.

### Hot spot / heatmap

```
Where in the Pacific did Argo floats descend below 1500 dbar in 2025?
Give me a geohash heatmap.
```

`aggregate(geometry_geohash_grid_frequency, collections="GADR", filter={col_stats: pressure.max >= 1500}, precision=3)`

### Cross-source correlation

```
Compare NDBC buoy wave heights and HF radar surface currents off
California during the storm of January 5, 2024.
```

The model will issue parallel `search_datasets` calls for `NDBC` and `IOOS_HFRADAR`, both scoped to the bbox and date.

---

## Common pitfalls

### Region name in `q` instead of `bbox`

If you ask *"data in the Gulf of Mexico"*, a naive prompt may put `"Gulf of Mexico"` in the free-text query. The catalog is heterogeneous — some titles include the region name, many don't. Bbox is far more reliable.

> **Fix**: prompt with explicit coordinates or named regions the model recognizes ("Gulf of Mexico" + the model converts to bbox `-98,18,-80,31`).

### Asking for "all" results

`search_datasets` returns up to 100 items per page. With 700K+ items, "all" is rarely what you want. Ask for the page size that matches your downstream task, or use `aggregate` to summarize without enumerating.

### Conflating `INCIDENT_NEWS` with research data

The `INCIDENT_NEWS` collection contains text-heavy oil-spill incident reports. Free-text queries like *"oil and water"* can pull these in noisily. Use `exclude_collections="INCIDENT_NEWS"` on broad searches.

### Asking the agent to compute statistics it can't see

`column_stats_summary` gives min/max/mean/count per variable — that's enough to filter, but not enough to compute the *time series itself*. If you need the actual numeric series, the agent should `get_item` and direct you (or download the asset).

---

## Few-shot prompts you can borrow

Copy these into the prompt or system message of your agent application:

> *Aquaview MCP gives you access to a unified STAC catalog of ocean and atmospheric data. When the user asks about a region, prefer `bbox` over including the region name in `q`. When the user asks "how many" or "where are the hot spots," prefer `aggregate` over `search_datasets`. When the user asks for actual download links, follow up search results with `get_item`. Always cite the collection ID and item ID for any specific dataset you mention.*

For agent applications targeting researchers, also include:

> *Prefer to scope searches to specific collection IDs when you know the source family. Use `column_stats_summary.variables.<NAME>.{min,max,mean,count}` to filter on per-variable stats without downloading files.*

---

## See also

- [`tools-reference.md`](tools-reference.md) — exact parameters for each tool
- [`data-model.md`](data-model.md) — the STAC item shape and CQL2 grammar
- [`collections.md`](collections.md) — picking the right source family
