---
name: satellite-imagery-finder
description: Use when the user wants satellite scenes — phrases like "Sentinel-2 imagery of X", "least cloudy scene over Y", "SAR coverage of an oil spill", "Landsat-Sentinel timeseries", "land cover classification". Encodes which AQUAVIEW collection matches which question (optical / SAR / harmonized / land cover) and the right CQL2 patterns for cloud cover and SAR polarization filtering.
---

# Satellite imagery finder

AQUAVIEW exposes four global satellite imagery collections. Picking the wrong one wastes time. Use this decision tree:

| User wants… | Collection | Why |
|---|---|---|
| Optical RGB / NDVI / coastal water color (10–20m) | `sentinel-2-l2a` | 10m bands, surface reflectance, frequent revisit |
| Multi-temporal Landsat-Sentinel harmonized stack | `hls2-l30` | HLS L30 = harmonized 30m, perfect for change detection |
| Radar / cloud-penetrating / oil slicks / ship detection / sea ice | `sentinel-1-grd` | C-band SAR, works through clouds and at night |
| Land cover / coastline / habitat classification | `esa-worldcover` | Pre-classified 10m global land cover |

See [`mission-cheatsheet.md`](mission-cheatsheet.md) for full mission-specific guidance (revisit, polarization modes, band definitions).

## Standard query pattern

For a single best-scene lookup:

```
search_datasets(
  collections=["sentinel-2-l2a"],
  bbox=<bbox from user>,
  datetime="<start>/<end>",
  filter="properties.eo:cloud_cover < 20",
  filter_lang="cql2-text",
  sort_by="properties.eo:cloud_cover ASC",   # least-cloudy first
  limit=10
)
```

For SAR (always cloud-free, so no cloud filter):

```
search_datasets(
  collections=["sentinel-1-grd"],
  bbox=<bbox>,
  datetime="<start>/<end>",
  filter="properties.sar:instrument_mode = 'IW'",   # IW = Interferometric Wide (most common ocean mode)
  filter_lang="cql2-text",
  limit=10
)
```

For an HLS time-aligned stack:

```
search_datasets(
  collections=["hls2-l30"],
  bbox=<bbox>,
  datetime="<start>/<end>",
  filter="properties.eo:cloud_cover < 30",
  filter_lang="cql2-text",
  limit=50
)
```

## Cloud cover guidance

- **< 5%** — pristine, rare, only useful for "best possible scene" requests
- **< 10–20%** — typical "good scene" threshold for most user requests
- **< 30–40%** — acceptable for change detection where you can mask clouds
- **No filter** — for SAR or for users who want the full timeseries with cloud masking handled downstream

## SAR polarization quick reference

- **VV** — single-pol, common for ocean / wave / wind retrieval
- **VH** — cross-pol, sensitive to volume scattering (vegetation, ice roughness)
- **VV+VH** — dual-pol IW mode, most common for Sentinel-1 GRD over oceans
- **HH / HH+HV** — used at high latitudes (sea ice) and over very rough ocean

For oil-slick detection and ship detection, prefer dual-pol VV+VH IW scenes.

## Always pair with `bbox-from-region`

If the user gave a region name (not coordinates), call into the `bbox-from-region` skill first. Don't ask Sentinel for "the Mid-Atlantic Bight" with no bbox — you'll get the entire L2A archive paginated forever.

## Output formats

- Sentinel-2 L2A and HLS scenes have `assets` for individual band TIFFs (B02, B03, B04, B08, etc.). Tell the user to download the bands they need rather than the entire scene.
- Sentinel-1 GRD has VV / VH GeoTIFF assets and a calibration metadata XML.
- ESA WorldCover has a single `map` asset (classified GeoTIFF).
