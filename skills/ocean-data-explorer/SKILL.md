---
name: ocean-data-explorer
description: Use when the user is exploring what AQUAVIEW data is available for a region, variable, or time period — phrases like "what data does AQUAVIEW have for…", "what's available in…", "is there data for…", "show me sources covering…". Encodes the discovery progression so the agent doesn't burn tokens on overly broad searches.
---

# Ocean data explorer

When the user is asking "what's available," resist the urge to call `search_datasets` immediately. The catalog spans 700,000+ items across 68 collections — a broad search returns noise.

## The discovery progression

Use the four MCP tools in this order:

1. **`list_collections`** — first, to enumerate which of the 68 sources have data for the user's domain (use `keywords` filter if available)
2. **`aggregate`** — second, with the user's spatial/temporal scope but **no free-text query**, broken down by `collection_id`. This shows which collections actually have populated items in scope
3. **`search_datasets`** — third, only after scoping is tight. Pass an explicit `collections=[…]` list pulled from step 2
4. **`get_item`** — fourth, only when the user asks for download links or specific item details

## Mandatory scoping rules

- **Always pass `bbox`** when the user names a region. Do not put region names in the free-text `q` — STAC text indexes don't always have place-name expansion.
- **Pass `datetime`** for any time-bounded question. Default to `"<start>/<end>"` ISO ranges.
- **Always set `exclude_collections=["INCIDENT_NEWS", "NOAA_ORR"]`** on broad searches *unless the user is asking about incidents or pollution events*. These collections include thousands of regulatory boundary layers and incident reports that pollute SST / fisheries / weather queries.
- **Cap `limit` at 25** for first-pass searches. Pagination via `token` if more is needed.

## When to deviate

- If the user names a specific collection ID (e.g., "show me NDBC data for…"), skip step 1 and go straight to `search_datasets` with `collections=["NDBC"]`.
- If the user asks "how many" / "where are the hot spots" / "break it down by X" — use `aggregate` and never escalate to `search_datasets`.
- If the user is doing satellite imagery, fisheries, AIS, gliders, ROV, storms, oil spills, or HF radar — load the corresponding domain skill instead, which has tighter recipes than this generic flow.

## Example

> "What ocean and atmospheric data does AQUAVIEW have for the Florida Keys for September 2022?"

```
1. list_collections(keywords="ocean")            # see candidate collections
2. aggregate(
     bbox=[-82.0, 24.4, -80.0, 25.4],
     datetime="2022-09-01/2022-09-30",
     exclude_collections=["INCIDENT_NEWS", "NOAA_ORR"],
     group_by="collection_id"
   )                                              # which collections actually have data here?
3. search_datasets(
     bbox=[-82.0, 24.4, -80.0, 25.4],
     datetime="2022-09-01/2022-09-30",
     collections=[...top 3-5 from step 2],
     limit=25
   )                                              # representative items
4. (optional) get_item for any item the user wants to download
```

This sequence answers the user's question in 3-4 tool calls instead of 30+ floundering searches.
