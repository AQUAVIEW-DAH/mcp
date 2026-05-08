# Advanced — Aggregations cookbook

The `aggregate` tool runs server-side bucket queries on AQUAVIEW's STAC catalog. It's the right choice for *shape* questions — counts, distributions, hot-spot maps — that don't require enumerating individual items.

## Available aggregations

| Type | What it returns |
|---|---|
| `total_count` | Single integer — how many items match |
| `datetime_min` | Earliest item datetime in the matched set |
| `datetime_max` | Latest item datetime |
| `datetime_frequency` | Histogram of items binned by `datetime_frequency_interval` (`day`, `month`, `year`, …) |
| `collection_frequency` | Per-collection counts |
| `geometry_geohash_grid_frequency` | Geohash-bucketed counts (heatmap) |
| `geometry_geotile_grid_frequency` | Geotile-bucketed counts (slippy-map style) |

All `aggregate` calls accept the same scoping parameters as `search_datasets`: `q`, `bbox`, `datetime`, `collections`, `exclude_collections`, `filter`.

## Recipes

### Total observations in a region+time window

```python
aggregate(
  aggregations = "total_count",
  bbox = "-98,18,-80,31",
  datetime = "2024-09-01T00:00:00Z/2024-09-30T23:59:59Z"
)
```

> "How many items are in AQUAVIEW from the Gulf of Mexico in September 2024?"

### Per-collection breakdown for a search

```python
aggregate(
  aggregations = "collection_frequency",
  q = "wave height",
  bbox = "-77,35,-69,42"
)
```

> "Where in AQUAVIEW can I find wave-height data for the Mid-Atlantic?" — returns `NDBC: 14`, `MARACOOS: 8`, `CDIP: 5`, etc.

### Monthly histogram (Argo coverage)

```python
aggregate(
  aggregations = "datetime_frequency",
  collections = "GADR",
  bbox = "-160,18,-152,24",
  datetime_frequency_interval = "month"
)
```

> Bucketed counts of Argo profiles per month around Hawaii — useful for "is this region under-sampled in March?" questions.

### Geohash heatmap (vessel density)

```python
aggregate(
  aggregations = "geometry_geohash_grid_frequency",
  collections = "MARINECADASTRE_AIS",
  bbox = "-118.5,33.5,-117.7,34.0",
  precision = 6
)
```

> Returns geohash buckets and counts. At `precision=6`, each bucket is roughly 1.2 km on a side — good for port-approach density maps. `precision=4` is ~20 km buckets, good for regional context.

### Geotile heatmap (slippy-map friendly)

```python
aggregate(
  aggregations = "geometry_geotile_grid_frequency",
  collections = "GOES_R",
  precision = 5
)
```

> Returns z/x/y tile buckets. Easy to overlay on Mapbox / Leaflet / OpenLayers.

### Time bounds of a collection's coverage in a region

```python
aggregate(
  aggregations = "datetime_min,datetime_max",
  collections = "NDBC",
  bbox = "-98,24,-80,31"
)
```

> "When does NDBC's Gulf of Mexico coverage start, and is it current?"

### Multi-aggregation in one call

```python
aggregate(
  aggregations = "total_count,collection_frequency,datetime_max",
  q = "hurricane",
  exclude_collections = "INCIDENT_NEWS"
)
```

> One call, three useful answers.

## Choosing the right `precision`

Geohash precision controls bucket size:

| Precision | ~Bucket size | Use when |
|---|---|---|
| 1 | continent | "Where in the world?" |
| 3 | ~150 km | Regional / basin-scale heatmaps |
| 4 | ~40 km | Mesoscale ocean features |
| 5 | ~5 km | Coastal cell-scale |
| 6 | ~1.2 km | Port approach / urban scale |
| 7+ | <300 m | Detailed local; expensive — rarely worth it |

Geotile precision is the standard slippy-map z level (0–18). Higher = more detail.

## Why aggregate instead of search?

Counting via `search_datasets(limit=1000)` and tallying client-side is slow, expensive, and capped (max 100 per page). `aggregate` runs server-side and returns the answer in one tool call.

## Composing `aggregate` with `filter`

All CQL2 filters from `search_datasets` work in `aggregate` too. Combine to ask very specific questions:

```python
aggregate(
  aggregations = "geometry_geohash_grid_frequency",
  collections = "NDBC",
  filter = {
    "op": ">=",
    "args": [
      {"property": "aquaview:column_stats_summary.variables.Wave Height.max"},
      6.0
    ]
  },
  precision = 4
)
```

> "Where in the world have NDBC buoys recorded extreme (≥6 m) wave heights?" — answers with a global heatmap.

## See also

- [`cql2-filtering.md`](cql2-filtering.md) — how to build the `filter` payload
- [`../docs/tools-reference.md`](../../docs/tools-reference.md) — `aggregate` parameter reference
- [`pagination-and-large-queries.md`](pagination-and-large-queries.md) — when you do need to enumerate items
