# Tools Reference

AQUAVIEW MCP exposes four tools. The catalog is built on the [STAC](https://stacspec.org/) specification — every dataset is a STAC item with stable `id`, `collection`, `geometry`, `properties`, and `assets`.

| Tool | Purpose | Typical use |
|---|---|---|
| [`list_collections`](#list_collections) | Enumerate the 68 source collections | "What's available?" |
| [`search_datasets`](#search_datasets) | Find items via free-text + bbox + datetime + CQL2 | "Find SST data near Florida last week" |
| [`aggregate`](#aggregate) | Server-side counts, histograms, geo grids | "How many items per month? Where are the hot spots?" |
| [`get_item`](#get_item) | Full record with download URLs | "Get me the actual file" |

All tools accept an `output_format` parameter: `csv` (default for tabular tools, ~20-50% fewer tokens), `toon` (human-readable), or `json` (deterministic, structured). Use `json` for programmatic consumers.

---

## `list_collections`

Enumerate all available data collections (sources) with ID, title, spatial/temporal extent, keywords, and description.

### Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `output_format` | `csv` \| `json` \| `toon` | `csv` | Response encoding |

### Returns

A list of collections. Each collection has:

- `id` — short stable identifier (e.g., `NDBC`, `GADR`, `GOES_R`)
- `title` — human-readable name
- `bbox` — spatial extent as `[west, south, east, north]`
- `temporal` — temporal extent
- `keywords` — semicolon-separated tags
- `description` — full prose description

### Example

```
> list_collections

id,title,bbox,temporal,keywords,description
AFSC,NOAA NMFS Alaska Fisheries Science Center ERDDAP,"-180,-90,180,90",|,...
AOOS,AOOS ERDDAP,"-180,-90,180,90",|,...
...
WOD,World Ocean Database,"-180,-90,180,90",|,...
```

Use the returned IDs to scope subsequent `search_datasets` or `aggregate` calls via the `collections` parameter.

---

## `search_datasets`

The workhorse. Searches the unified STAC catalog of 700K+ items. You must provide at least one of: `q`, `bbox`, `datetime`, `collections`, `filter`, or `token`.

### Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `q` | string | — | Free-text search across title, description, keywords. Multi-word queries OR-combined. |
| `bbox` | string | — | `"west,south,east,north"` — e.g., `"-98,24,-80,31"` for the Gulf of Mexico. |
| `datetime` | string | — | Single instant, range (`"2020-01-01T00:00:00Z/2024-12-31T23:59:59Z"`), or open-ended (`"../2024-01-01T00:00:00Z"`). |
| `collections` | string | — | Comma-separated collection IDs to scope to (e.g., `"NDBC,COOPS"`). |
| `exclude_collections` | string | — | Comma-separated collection IDs to omit (composes with `filter` as a NOT). |
| `filter` | object \| string | — | CQL2-JSON filter — see [Filtering](#filtering-with-cql2). |
| `fields` | string | — | Comma-separated field projection (e.g., `"id,geometry,properties.title"`). Reduces response size. |
| `include_assets` | boolean | `false` | If true, return full asset records inline. Default omits assets but emits an `asset_keys` hint column. |
| `limit` | int | 10 | 1–100. |
| `sortby` | string | — | `"+field,-field"` syntax — `+` ascending, `-` descending. |
| `token` | string | — | Pagination token from `next_token` in a previous response. |
| `output_format` | `csv` \| `json` \| `toon` | `csv` | |

### Returns

A page of STAC items. In `csv` mode you get a sectioned CSV with `id`, `collection`, `geometry`, common properties, and an `asset_keys` hint column. In `json` mode you get a STAC API `FeatureCollection` with `next_token` for paging.

### Filtering with CQL2

The `filter` parameter accepts a CQL2-JSON object. Operators: `=`, `<>`, `<`, `>`, `<=`, `>=`, `like`, `between`, `in`, `and`, `or`, `not`.

**Flat property:**

```json
{"op": "=", "args": [{"property": "aquaview:institution"}, "NOAA/NCEI"]}
```

**Nested property** (per-variable column statistics):

```json
{"op": "<=", "args": [{"property": "aquaview:column_stats_summary.variables.Pressure.min"}, 10]}
```

**Combined:**

```json
{
  "op": "and",
  "args": [
    {"op": "=", "args": [{"property": "aquaview:institution"}, "NOAA"]},
    {"op": ">=", "args": [{"property": "aquaview:column_stats_summary.variables.WaveHeight.max"}, 6.0]}
  ]
}
```

See [`docs/data-model.md`](data-model.md) for the full property catalog.

### Examples

**Free-text + region + time:**

```
search_datasets(
  q = "sea surface temperature",
  bbox = "-98,24,-80,31",
  datetime = "2024-09-01T00:00:00Z/2024-09-30T23:59:59Z",
  limit = 25
)
```

**Scope to specific collections, drop noisy ones:**

```
search_datasets(
  q = "hurricane",
  collections = "NDBC,GOES_R,NOAA_AOML_HDB",
  exclude_collections = "INCIDENT_NEWS"
)
```

**Filter on per-variable stats:**

```
search_datasets(
  collections = "GADR",
  bbox = "-160,18,-152,24",
  filter = {
    "op": "<=",
    "args": [{"property": "aquaview:column_stats_summary.variables.Pressure.min"}, 10]
  }
)
```

**Project fields and page:**

```
search_datasets(
  q = "argo",
  fields = "id,geometry,properties.datetime",
  limit = 100,
  sortby = "+properties.datetime"
)
# Subsequent page:
search_datasets(q = "argo", token = "<next_token from previous response>")
```

---

## `aggregate`

Run server-side aggregations without fetching individual items. Cheap counts, histograms, geo grids.

### Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `aggregations` | string | **required** | Comma-separated. Valid: `total_count`, `datetime_max`, `datetime_min`, `datetime_frequency`, `collection_frequency`, `geometry_geohash_grid_frequency`, `geometry_geotile_grid_frequency`. |
| `q`, `bbox`, `datetime`, `collections`, `exclude_collections`, `filter` | — | — | Same scoping semantics as `search_datasets`. |
| `datetime_frequency_interval` | string | — | `"day"`, `"month"`, `"year"`, etc. — required for `datetime_frequency`. |
| `precision` | int | — | 1–12 grid precision for `geometry_*_grid_frequency` (higher = finer). |
| `output_format` | `csv` \| `json` \| `toon` | `csv` | |

### Examples

**Total count of Argo profiles in 2025:**

```
aggregate(
  aggregations = "total_count",
  collections = "GADR",
  datetime = "2025-01-01T00:00:00Z/2025-12-31T23:59:59Z"
)
```

**Per-collection breakdown of items containing "wave":**

```
aggregate(
  aggregations = "collection_frequency",
  q = "wave"
)
```

**Monthly histogram of NDBC observations in the Gulf of Mexico:**

```
aggregate(
  aggregations = "datetime_frequency",
  collections = "NDBC",
  bbox = "-98,24,-80,31",
  datetime_frequency_interval = "month"
)
```

**Geohash heatmap of buoy density at precision 4:**

```
aggregate(
  aggregations = "geometry_geohash_grid_frequency",
  collections = "NDBC",
  precision = 4
)
```

---

## `get_item`

Fetch a single dataset record with full properties and asset download URLs (hrefs to NetCDF, GRIB2, GeoTIFF, CSV, etc.).

### Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `collection` | string | **required** | Collection ID — e.g., `"NDBC"`, `"GADR"`, `"WOD"`. |
| `item_id` | string | **required** | Item identifier — e.g., `"wod_xbt_ZZ144579"`. From a search result. |
| `output_format` | `toon` \| `json` | `toon` | |

### Returns

A full STAC item including:

- `id`, `collection`, `bbox`, `geometry`, `datetime`
- `properties` — all metadata, per-variable column statistics, institution, processing level, etc.
- `assets` — keyed dict of downloadable artifacts; each asset has `href`, `type`, `title`, sometimes `roles`

### Example

```
get_item(collection = "WOD", item_id = "wod_xbt_ZZ144579")
```

```
id: wod_xbt_ZZ144579
collection: WOD
geometry: {type: Point, coordinates: [-65.1, 38.7]}
datetime: 1998-04-12T14:33:00Z
properties:
  aquaview:institution: NOAA/NCEI
  aquaview:instrument_type: XBT
  aquaview:column_stats_summary.variables.Temperature.min: 4.2
  aquaview:column_stats_summary.variables.Temperature.max: 24.6
  ...
assets:
  netcdf:
    href: https://www.ncei.noaa.gov/data/oceans/woa/.../ZZ144579.nc
    type: application/netcdf
  column_stats:
    href: https://...
    type: application/parquet
```

---

## Output format choice cheatsheet

| Need | Use |
|---|---|
| LLM consumption (default) | `csv` |
| Programmatic Python / TS | `json` |
| Human-readable single-record dump | `toon` |
| Smallest token footprint for tabular | `csv` |
| Smallest for single-item detail | `toon` (default for `get_item`) |

See [`docs/output-formats.md`](output-formats.md) for a deeper comparison.
