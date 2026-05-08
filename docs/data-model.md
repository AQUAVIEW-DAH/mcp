# Data Model

AQUAVIEW unifies 68 sources behind a single schema based on the [STAC](https://stacspec.org/) (SpatioTemporal Asset Catalog) specification. If you've used STAC before, this will be familiar; if not, the model is small.

## Three layers

```
Collection ─── many ───▶ Item ─── many ───▶ Asset
   "NDBC"               buoy 41001               .nc, .csv, column_stats
                         on 2024-09-15
```

| Layer | What it represents | AQUAVIEW tool |
|---|---|---|
| **Collection** | A source (NDBC, Argo/GADR, GOES-R, etc.) | `list_collections` |
| **Item** | A single dataset / observation / scene | `search_datasets`, `get_item` |
| **Asset** | A downloadable artifact (NetCDF, GRIB2, CSV, etc.) | inside `get_item` |

## Item shape

Every item, regardless of source, exposes the same top-level fields:

```yaml
id: <stable string>                 # unique within its collection
collection: <collection id>         # e.g. "NDBC"
geometry:                           # GeoJSON Point/Polygon/LineString
  type: Point
  coordinates: [-65.1, 38.7]
bbox: [west, south, east, north]
properties:
  datetime: 1998-04-12T14:33:00Z    # or start_datetime / end_datetime for ranges
  aquaview:institution: NOAA/NCEI
  aquaview:instrument_type: XBT
  aquaview:column_stats_summary: { ... }   # per-variable summary stats
  ...                                       # source-specific extras
assets:
  netcdf:
    href: https://...
    type: application/netcdf
  column_stats:
    href: https://...
    type: application/parquet
  ...
```

## The `aquaview:` properties

AQUAVIEW adds a stable namespace of properties on top of source-specific ones, so you can write filters that work across collections.

| Property | Meaning |
|---|---|
| `aquaview:institution` | Provider name (e.g., `NOAA/NCEI`, `IFREMER`) |
| `aquaview:instrument_type` | Sensor / platform type (e.g., `XBT`, `CTD`, `Glider`, `Drifter`) |
| `aquaview:processing_level` | L0 / L1 / L2 / L3 / L4 where applicable |
| `aquaview:variables` | List of measured variable names |
| `aquaview:column_stats_summary.variables.<NAME>.{min,max,mean,count}` | Per-variable summary stats — filter on these without downloading the file |

The column-stats summary is what makes "find all profiles where pressure went below 10 dbar" possible without fetching a single file. See the CQL2 examples below.

## CQL2 filtering

The `filter` parameter on `search_datasets` and `aggregate` accepts a [CQL2-JSON](https://docs.ogc.org/is/21-065r2/21-065r2.html) object.

### Operators

`=` `<>` `<` `>` `<=` `>=` `like` `between` `in` `and` `or` `not`

### Patterns

**Equality on a flat property:**

```json
{"op": "=", "args": [{"property": "aquaview:institution"}, "NOAA/NCEI"]}
```

**Range on a nested property:**

```json
{
  "op": "<=",
  "args": [
    {"property": "aquaview:column_stats_summary.variables.Pressure.min"},
    10
  ]
}
```

**Membership:**

```json
{"op": "in", "args": [{"property": "aquaview:instrument_type"}, ["CTD", "XBT"]]}
```

**LIKE wildcard:**

```json
{"op": "like", "args": [{"property": "properties.title"}, "%hurricane%"]}
```

**Combining with `and` / `or`:**

```json
{
  "op": "and",
  "args": [
    {"op": "=", "args": [{"property": "aquaview:institution"}, "NOAA"]},
    {
      "op": ">=",
      "args": [
        {"property": "aquaview:column_stats_summary.variables.WaveHeight.max"},
        6.0
      ]
    }
  ]
}
```

## Spatial scoping

The `bbox` parameter takes `"west,south,east,north"` in WGS84 longitude/latitude.

| Region | bbox |
|---|---|
| Gulf of Mexico | `-98,18,-80,31` |
| Florida Keys | `-83,24,-80,25.5` |
| California Current | `-127,32,-117,42` |
| Gulf of Maine | `-71,41,-65,45` |
| Hawaii / Main Hawaiian Islands | `-161,18,-154,23` |
| Puget Sound | `-123.5,47,-122,49` |
| Bering Sea | `-180,53,-156,66` |
| Caribbean | `-88,8,-58,25` |
| Mid-Atlantic Bight | `-77,35,-69,42` |
| Arctic Ocean | `-180,66,180,90` |

For irregular regions, use `bbox` for a coarse spatial filter and then refine in `filter` with a `geometry` property predicate.

## Temporal scoping

The `datetime` parameter accepts:

| Form | Meaning |
|---|---|
| `2024-09-15T00:00:00Z` | Single instant |
| `2024-09-01T00:00:00Z/2024-09-30T23:59:59Z` | Closed range |
| `../2024-01-01T00:00:00Z` | Open-ended on the left (everything before) |
| `2020-01-01T00:00:00Z/..` | Open-ended on the right (everything since) |

ISO 8601 with explicit `Z` (UTC) is recommended.

## Pagination

`search_datasets` returns at most `limit` items (max 100) per call. The response includes a `next_token` field; pass it as `token` on the next call to continue. Other parameters do not need to be repeated when paging — the token captures them.

## Output encoding

| Format | When to use |
|---|---|
| `csv` | Default for tabular tools — densest token cost for LLMs |
| `json` | Programmatic Python / TS consumers; deterministic STAC API shape |
| `toon` | Human-readable single-record dumps (default for `get_item`) |

See [`output-formats.md`](output-formats.md) for side-by-side examples.

## Asset types you'll see

| Media type | Content |
|---|---|
| `application/netcdf` | NetCDF (most ocean profile / model data) |
| `application/x-grib2` | GRIB2 (HRRR, weather model output) |
| `image/tiff; application=geotiff; profile=cloud-optimized` | COG (satellite imagery) |
| `text/csv` | CSV (buoy timeseries) |
| `application/parquet` | Parquet (column statistics, large tables) |
| `video/mp4` | ROV dive video (Hyperion, SeaTube) |
| `text/html` | Source landing pages |

AQUAVIEW does **not** rehost the underlying files — `href` always points at the authoritative provider (NCEI, GCS, AWS Open Data, ERDDAP, etc.). That makes AQUAVIEW a discovery and routing layer, not a data lake.
