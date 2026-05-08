# Hurricane tracking — Hurricane Ian, September 2022

Reconstruct a major hurricane's track and intensity from buoy, satellite, and tropical-cyclone-heat-potential data.

## What this teaches

- How to combine multiple complementary collections in one analysis
- Using `aggregate` with `geometry_geohash_grid_frequency` to find observation hot-spots
- Using `column_stats_summary` to filter buoys by extreme wave heights
- Following the same storm across in-situ and satellite sources

**Sources used**: `NDBC`, `GOES_R`, `NOAA_AOML_HDB`, `NOAA_GDP`

---

## Prompt

```
Hurricane Ian made landfall in southwest Florida on September 28, 2022.
Find me NDBC buoys along its track that recorded wave heights over 6 meters
during the storm, GOES-R satellite imagery for that day, and any tropical
cyclone heat potential data from AOML for the days leading up to landfall.
Also tell me which Global Drifter Program drifters were in the path.
```

## Transcript

### 1. Aggregate first — find observation density along the track

```python
aggregate(
  aggregations = "collection_frequency",
  bbox = "-86,24,-80,30",
  datetime = "2022-09-26T00:00:00Z/2022-10-01T00:00:00Z"
)
```

> 2,448 items across 34 collections. Top contributors:
> - `IOOS_SENSORS` — 1,420 items
> - `SECOORA` — 207
> - `UAF` — 200
> - `GOES_R` — 153 (product-family items)
> - `POLARWATCH` — 65
> - `COASTWATCH` — 56
> - `NOAA_AOML_HDB` — 42
> - `NDBC` — 6, `NOAA_GDP` — 2

### 2. NDBC buoys with wave heights over 6 m

```python
search_datasets(
  collections = "NDBC",
  bbox = "-86,24,-80,30",
  datetime = "2022-09-26T00:00:00Z/2022-10-01T00:00:00Z",
  filter = {
    "op": ">=",
    "args": [
      {"property": "aquaview:column_stats_summary.variables.Wave Height.max"},
      6.0
    ]
  },
  limit = 10
)
```

Returns **one** buoy:

| Buoy | Location | Lifetime max wave height (`column_stats_summary`) |
|---|---|---|
| `ndbc_42097` | Pulley Ridge, FL (25.7°N, 83.7°W) | 6.5 m across 2,137 observations since 2016 |

> ⚠ **Caveat**: 6.5 m is the buoy's lifetime max — not confirmed for Sep 28, 2022 specifically. The catalog filter narrows you to the right candidate buoy; you confirm the storm-day value by pulling the timeseries from https://www.ndbc.noaa.gov/data/realtime2/42097.txt or the NDBC THREDDS archive.

### 3. GOES-R imagery for landfall day

```python
search_datasets(
  collections = "GOES_R",
  bbox = "-86,24,-80,30",
  datetime = "2022-09-28T00:00:00Z/2022-09-28T23:59:59Z",
  fields = "id,properties.datetime,assets",
  include_assets = true,
  limit = 20
)
```

> Returns 153 GOES-R **product items** (e.g., `goes18_abi_l2_dmwm` Derived Motion Winds Mesoscale, `goes18_abi_l2_ctpf` Cloud Top Pressure Full Disk). Each item represents a *product family* across the bbox/time, not an individual scene. Each product's `gcs_data` asset points to its bucket — actual NetCDF scenes for Sep 28, 2022 (day-of-year 271) are at paths like `gs://gcp-public-data-goes-16/ABI-L2-CMIPF/2022/271/`.

### 4. Tropical cyclone heat potential leading up to landfall

```python
search_datasets(
  collections = "NOAA_AOML_HDB",
  bbox = "-90,15,-80,30",
  datetime = "2022-09-20T00:00:00Z/2022-09-28T23:59:59Z",
  limit = 10
)
```

> 42 matches. Top items:
>
> - `xbt_ax7_2022` — Expandable Bathythermograph data along the AX7 transect line, 2022
> - `ships_atlantic_5days`, `ships_atlantic_7days` — SHIPS (Statistical Tropical Cyclone Intensity) forecast products with SST, OHC, isotherm depths (CD20, CD26), wind shear, intensity history
> - `ships_eastpacific_5days`, `ships_eastpacific_7days` — same for East Pacific basins
>
> The SHIPS series carries the storm-context oceanographic fields (Tropical Cyclone Heat Potential proxies via `COHC`, `CD26`).

### 5. Drifters in the path

```python
search_datasets(
  collections = "NOAA_GDP",
  bbox = "-86,24,-80,30",
  datetime = "2022-09-26T00:00:00Z/2022-10-01T00:00:00Z",
  limit = 12
)
```

> Returns 2 items, both **product-level** (`drifter_hourly_qc` and `drifter_6hour_qc` — the entire interpolated QC drifter products). AQUAVIEW indexes GDP at the product level, not per-drifter. To list which specific drifters were in Ian's path on Sep 28, download one of these products from https://erddap.aoml.noaa.gov/gdp/erddap and filter trajectories by lat/lon/time.

## Result the agent gave

> *"Hurricane Ian made landfall as a Category 4 storm near Cayo Costa, FL on Sep 28, 2022. AQUAVIEW indexes 2,448 items in the eastern Gulf bbox during the storm window, distributed across 34 collections.*
>
> ***Buoys** — Filtering NDBC items in the bbox/time-window for lifetime max wave height ≥ 6 m returns one buoy: **`ndbc_42097` (Pulley Ridge, FL, 25.7°N, 83.7°W)**, U.S. Army Corps of Engineers-owned. Its `column_stats_summary` shows max wave height 6.5 m across 2,137 observations since 2016. I can't confirm from the catalog alone that the 6.5 m was hit during Ian — that requires pulling the timeseries from https://www.ndbc.noaa.gov/data/realtime2/42097.txt and checking Sep 27–28.*
>
> ***Satellite** — 153 GOES-R items match. Each is a product family (Cloud Top Pressure full disk and CONUS, Derived Motion Winds at full-disk / CONUS / mesoscale, etc.) covering both GOES-18 (West) and GOES-19. Per-scene NetCDFs for Sep 28, 2022 are at `gs://gcp-public-data-goes-16/ABI-L2-CMIPF/2022/271/` and the equivalent paths for GOES-18.*
>
> ***AOML** — 42 items in the basin/window. The most useful for Ian's intensification context are the SHIPS forecasting products (`ships_atlantic_5days`, `ships_atlantic_7days`), which include OHC, isotherm depths (CD20, CD26), and SST fields used for tropical-cyclone intensity prediction. Plus 2022 XBT line data along AX7.*
>
> ***GDP** — AQUAVIEW indexes the Global Drifter Program at the product level (2 items: hourly and 6-hourly QC products), not per-drifter. To enumerate drifters in Ian's path, download `drifter_hourly_qc` from https://erddap.aoml.noaa.gov/gdp/erddap and filter by trajectory.*
>
> *AQUAVIEW narrows the search to the right collections and product families very quickly, and `column_stats_summary` is enough to identify the candidate buoy. Confirming time-specific extreme values still requires the source data."*

## Variations

- **Hurricane Helene 2024**: `bbox = "-86,28,-80,36"`, `datetime = "2024-09-25T00:00:00Z/2024-09-28T23:59:59Z"`
- **Just the eyewall**: tighten `bbox` and use `geometry_geohash_grid_frequency` at `precision=5` to map observation density
- **Pre-storm baseline**: same bbox, shift `datetime` 14 days earlier
- **Compare two storms**: run the same query with two different `datetime` ranges

## Related examples

- [`02-sea-surface-temperature/`](../02-sea-surface-temperature/) — SST in the same region
- [`09-nexrad-severe-weather/`](../09-nexrad-severe-weather/) — radar volumes during landfall
- [`04-tides-and-storm-surge/`](../04-tides-and-storm-surge/) — CO-OPS storm surge records
