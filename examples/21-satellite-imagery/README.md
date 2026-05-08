# Satellite imagery — Sentinel-1 SAR, Sentinel-2 multispectral, HLS, ESA WorldCover

Find global Earth-observation imagery for combined ocean / land analyses — from radar SAR for oil-slick detection to optical scenes for coastal-zone monitoring.

## What this teaches

- The four imagery collections in AQUAVIEW: `sentinel-1-grd`, `sentinel-2-l2a`, `hls2-l30`, `esa-worldcover`
- Reading Sentinel scene IDs (e.g., `S2B_17QMG_20260504_1_L2A`) and tile / orbit conventions
- Pairing imagery with ocean data for coastal-zone use cases

**Sources used**: `sentinel-1-grd`, `sentinel-2-l2a`, `hls2-l30`, `esa-worldcover`

---

## Prompt

```
Find Sentinel-2 cloud-free scenes covering the Florida Keys for May 2026.
Give me the COG download URLs.
```

## Transcript

### 1. Search Sentinel-2 L2A

```python
search_datasets(
  collections = "sentinel-2-l2a",
  bbox = "-83,24,-80,25.5",
  datetime = "2026-05-01T00:00:00Z/2026-05-31T23:59:59Z",
  limit = 5
)
```

Real items:

| Scene ID | Tile | Date | Bbox |
|---|---|---|---|
| `S2B_17QMG_20260504_1_L2A` | 17QMG | 2026-05-04 16:06 UTC | -81.94, 23.42 → -80.91, 24.30 |
| `S2B_17QNG_20260504_1_L2A` | 17QNG | 2026-05-04 16:06 UTC | -81.00, 23.42 → -79.92, 24.18 |
| `S2B_17QPG_20260504_0_L2A` | 17QPG | 2026-05-04 16:06 UTC | -80.02, 23.54 → -78.93, 24.41 |

Provider: ESA. Distributor: AWS Earth Search v1 at `https://earth-search.aws.element84.com/v1`. Each scene has 30+ assets covering all spectral bands as separate COGs (`coastal`, `blue`, `green`, `red`, `nir`, `nir08`, `swir16`, `swir22`, etc.) plus thumbnail and granule metadata XML.

### 2. Get the COG URLs

```python
get_item(collection = "sentinel-2-l2a", item_id = "S2B_17QMG_20260504_1_L2A")
```

> Returns full asset list. Each asset's `href` is a direct AWS S3 URL pattern like `s3://sentinel-cogs/sentinel-s2-l2a-cogs/17/Q/MG/2026/5/S2B_17QMG_20260504_1_L2A/B04.tif` (red band) — use `--no-sign-request` with the AWS CLI for free public access.

## Result the agent gave

> *"135 Sentinel-2 L2A scenes cover the Florida Keys bbox in May 2026. Three Sentinel-2B scenes from a single overpass on May 4, 2026 (16:06 UTC) provide cross-Keys coverage:*
>
> - ***`S2B_17QMG_20260504_1_L2A`*** *— bbox -81.94°W to -80.91°W, 23.42°N to 24.30°N (western Keys including Marquesas / Dry Tortugas region)*
> - ***`S2B_17QNG_20260504_1_L2A`*** *— bbox -81.00°W to -79.92°W, 23.42°N to 24.18°N (central Keys around Key West)*
> - ***`S2B_17QPG_20260504_0_L2A`*** *— bbox -80.02°W to -78.93°W, 23.54°N to 24.41°N (eastern Keys / Florida Strait)*
>
> *Each scene exposes 30+ assets covering all 13 spectral bands as cloud-optimized GeoTIFFs (`coastal`, `blue`, `green`, `red`, `nir`, `nir08`, `swir16`, `swir22`, plus the `visual` true-color composite, AOT, cloud mask, and granule metadata) hosted on AWS Open Data via Element 84's earth-search STAC API. Asset hrefs follow the AWS S3 layout under `s3://sentinel-cogs/sentinel-s2-l2a-cogs/17/Q/MG/2026/5/...`. Use the AWS CLI with `--no-sign-request` for free public access."*

## Variations

- **Sentinel-1 SAR (oil slick detection, sea ice, ship detection)**: switch to `sentinel-1-grd`. SAR works through clouds and at night.
- **Harmonized Landsat-Sentinel for time-series**: use `hls2-l30` for Landsat-8/9 surface reflectance gridded to MGRS tiles.
- **Land cover context**: `esa-worldcover` for 10 m global land-cover maps (2020 + 2021), useful for shoreline change and coastal-zone assessment.
- **Cloud cover filter**: combine with a `filter` on `properties.eo:cloud_cover` (CQL2) — e.g., `<= 10` for cloud-free scenes.

## Related examples

- [`14-vessel-traffic-ais/`](../14-vessel-traffic-ais/) — pair Sentinel-1 SAR with AIS for ship detection
- [`02-sea-surface-temperature/`](../02-sea-surface-temperature/) — pair Sentinel-2 ocean color with CoastWatch SST
- [`12-arctic-sea-ice/`](../12-arctic-sea-ice/) — Sentinel-1 SAR is the workhorse for Arctic sea-ice tracking
