# Output Formats

AQUAVIEW tools accept an `output_format` parameter with three values: **`csv`**, **`toon`**, and **`json`**. This page shows what each looks like and when to pick which.

## TL;DR

| Tool | Default | Use `csv` for | Use `toon` for | Use `json` for |
|---|---|---|---|---|
| `list_collections` | `csv` | LLM consumption | rare | structured pipelines |
| `search_datasets` | `csv` | LLM consumption (most cases) | single-record dumps | Python / TS code |
| `aggregate` | `csv` | LLM consumption | rare | dashboards / charts |
| `get_item` | `toon` | rare | LLM consumption (default) | code |

The defaults are tuned: tabular tools default to `csv` because it costs ~20–50% fewer tokens than `toon` for the same content; `get_item` defaults to `toon` because there's only one record and tabular framing wastes tokens.

## `csv` — sectioned CSV (LLM-friendly)

AQUAVIEW emits a sectioned CSV — multiple `## name` blocks each followed by a header row and data rows. The agent doesn't have to call a separate "list assets" tool because the assets are either summarized inline (`asset_keys` hint column) or appended as their own section.

```
## items
# rows: 3
id,collection,datetime,geometry,asset_keys
ndbc_41001_2024-09-15,NDBC,2024-09-15T00:00:00Z,"POINT(-72.6 34.7)",realtime;hist;column_stats
ndbc_41002_2024-09-15,NDBC,2024-09-15T00:00:00Z,"POINT(-74.8 32.3)",realtime;hist;column_stats
...

## next_token
abc123def456...
```

When you set `include_assets=true`, a separate `## assets` section is appended:

```
## assets
item_id,key,href,type,title
ndbc_41001_2024-09-15,realtime,https://www.ndbc.noaa.gov/.../41001.txt,text/plain,Realtime data
ndbc_41001_2024-09-15,hist,https://www.ndbc.noaa.gov/.../41001h2024.txt,text/plain,Historical data
...
```

This is the densest format for any LLM that has to reason over many results.

## `toon` — token-optimized object notation

YAML-like indentation, optimized for visual scanning of single records.

```
id: wod_xbt_ZZ144579
collection: WOD
datetime: 1998-04-12T14:33:00Z
geometry: { type: Point, coordinates: [-65.1, 38.7] }
properties:
  aquaview:institution: NOAA/NCEI
  aquaview:instrument_type: XBT
  aquaview:column_stats_summary:
    variables:
      Temperature: { min: 4.2, max: 24.6, mean: 12.8, count: 412 }
      Salinity:    { min: 34.1, max: 36.9, mean: 35.5, count: 410 }
assets:
  netcdf:
    href: https://www.ncei.noaa.gov/data/oceans/woa/.../ZZ144579.nc
    type: application/netcdf
```

Default for `get_item`. Use it when reading a single record matters more than processing many.

## `json` — STAC API native

The native [STAC API](https://stacspec.org/) shape — strict, predictable, machine-readable. Use this when you're consuming AQUAVIEW from Python, TypeScript, or any non-LLM data pipeline.

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "wod_xbt_ZZ144579",
      "collection": "WOD",
      "geometry": {"type": "Point", "coordinates": [-65.1, 38.7]},
      "bbox": [-65.1, 38.7, -65.1, 38.7],
      "properties": {
        "datetime": "1998-04-12T14:33:00Z",
        "aquaview:institution": "NOAA/NCEI",
        "aquaview:instrument_type": "XBT",
        "aquaview:column_stats_summary": {
          "variables": {
            "Temperature": {"min": 4.2, "max": 24.6, "mean": 12.8, "count": 412}
          }
        }
      },
      "assets": {
        "netcdf": {
          "href": "https://www.ncei.noaa.gov/data/oceans/woa/.../ZZ144579.nc",
          "type": "application/netcdf"
        }
      }
    }
  ],
  "links": [],
  "next_token": "abc123..."
}
```

## Token cost comparison

A `search_datasets` call returning 25 items costs approximately:

| Format | Tokens | Notes |
|---|---|---|
| `csv` (no assets) | ~1.0× (baseline) | with `asset_keys` hint column |
| `csv` (with assets) | ~1.6× | adds `## assets` section |
| `toon` | ~1.2× | per-row object framing |
| `json` | ~1.5× | structural braces, quoted keys |

Numbers vary with payload, but the ordering is stable: `csv` < `toon` < `json` for tabular results.

## Field projection

Whatever format you pick, you can shrink the payload further by passing `fields=` on `search_datasets`:

```
search_datasets(
  q = "argo",
  fields = "id,collection,properties.datetime",
  output_format = "csv"
)
```

In `csv` mode this drops the canonical columns and emits only your projected ones (no `asset_keys` hint, no `## assets` section). In `json` mode the response contains only the requested keys.

## Choosing the right format in code

```python
# LLM agent — let the default ride
result = await session.call_tool("search_datasets", {"q": "argo"})

# Python data pipeline — get JSON, parse to Pydantic
result = await session.call_tool("search_datasets", {
    "q": "argo",
    "output_format": "json"
})
data = json.loads(result.content[0].text)
features = data["features"]
```
