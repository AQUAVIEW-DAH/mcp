---
name: sst-and-ocean-color
description: Use when the user asks about sea surface temperature, chlorophyll, ocean color, sea ice extent, or harmful algal blooms — phrases like "SST near …", "is there a HAB in …", "sea ice anomaly in …", "weekly chlorophyll over …", "warmest waters last week". Encodes which AQUAVIEW collection holds which variable, the canonical variable names, and how to assemble a multi-temporal stack.
---

# SST & ocean color

The variables in this skill are spread across several CoastWatch sub-collections plus POLARWATCH. Picking the right one depends on the user's region and product cadence.

## Collection map

| Variable | Region | Collection | Cadence |
|---|---|---|---|
| SST | Global, blended | `COASTWATCH` | Daily / weekly composites |
| SST | Gulf of Mexico, Caribbean | `COASTWATCH_CWCGOM` | Sub-daily / daily |
| SST | US West Coast | `COASTWATCH_WC` | Daily |
| SST | Polar / sea ice context | `POLARWATCH` | Daily |
| Chlorophyll-a | Global | `COASTWATCH` | Daily / 8-day / monthly composites |
| Chlorophyll-a | Gulf of Mexico, Caribbean | `COASTWATCH_CWCGOM` | Daily |
| Sea ice concentration / extent | Polar (both poles) | `POLARWATCH` | Daily |
| Ocean color (Rrs / nLw) | Global | `COASTWATCH` | Daily / 8-day |

See [`variables.md`](variables.md) for the canonical variable name to use in CQL2 filters and in `cube:variables` keys, plus the per-collection variants.

## Pattern: "current SST near X"

1. Pull the bbox via `bbox-from-region`
2. Default time window: last 7 days, daily composites preferred
3. Choose collection by region:
   - US Gulf / Caribbean → `COASTWATCH_CWCGOM`
   - US West Coast → `COASTWATCH_WC`
   - Anywhere else → `COASTWATCH`

```
search_datasets(
  collections=["COASTWATCH_CWCGOM"],   # Gulf of Mexico example
  bbox=<bbox>,
  datetime="<7-days-ago>/<today>",
  filter="properties->>'cube:variables'->>'sst'->>'mean' IS NOT NULL",
  filter_lang="cql2-text",
  limit=14
)
```

## Pattern: "is there a chlorophyll bloom in X"

Use a CQL2 threshold rather than fetching items and inspecting:

```
search_datasets(
  collections=["COASTWATCH"],
  bbox=<bbox>,
  datetime="<start>/<end>",
  filter="properties->>'cube:variables'->>'chl_a'->>'max' > 5",   # mg/m^3
  filter_lang="cql2-text",
  limit=10
)
```

A `max > 5` mg/m³ within the bbox is a strong bloom signal; `> 1.0` is "elevated"; `> 0.3` is the open-ocean baseline for healthy productive waters.

## Pattern: "sea ice extent change in the Arctic"

```
search_datasets(
  collections=["POLARWATCH"],
  bbox=[-180, 66.5, 180, 90],   # Arctic Ocean
  datetime="2020-01-01/2026-01-01",
  filter="properties->>'cube:variables'->>'ice_conc'->>'mean' IS NOT NULL",
  filter_lang="cql2-text",
  limit=200
)
```

For trend questions, prefer `aggregate(group_by="datetime", interval="1M")` to get monthly counts and means rather than pulling 5 years of items.

## Pattern: multi-temporal stack for analysis

```
1. search_datasets(...) with limit=50, sorted by datetime ascending
2. For each item, pull the SST or chlorophyll asset URL from item.assets
3. Open each asset with xarray (NetCDF) or rasterio (GeoTIFF)
4. Stack along a new time dimension
```

If the user is going to download more than ~30 scenes, suggest pagination via `aggregate` first (datetime histogram) so they can see how many to expect.

## Common gotchas

- **Variable name varies.** `sst` in `COASTWATCH` may be `analysed_sst` in another CoastWatch sub-collection. Always inspect `properties['cube:variables']` keys before authoring a CQL2 filter.
- **Composites differ from realtime.** Daily composites lag by 24-48h. For "right now," fall back to NDBC/COOPS in the `realtime-coastal-monitor` skill.
- **Polar projection.** POLARWATCH items are in stereographic projections. The bbox query still works (CRS-aware), but downloaded GeoTIFFs are not in WGS84 — note this if the user wants a direct overlay with other layers.
- **Cloud-affected pixels.** CoastWatch SST and chlorophyll products mask clouds out by default; missing pixels are not zero, they are nulls. Don't compute `mean` over a scene without first dropping nulls.
