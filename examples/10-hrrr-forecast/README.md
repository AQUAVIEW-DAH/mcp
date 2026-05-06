# HRRR weather forecast — 3 km hourly model output

Find NOAA's High-Resolution Rapid Refresh (HRRR) numerical weather model and locate the GRIB2 files for a specific date.

## What this teaches

- Reading the variable list of a major NWP model
- Navigating the GCS folder layout for HRRR (`hrrr.YYYYMMDD/conus/...`)
- Choosing between CONUS and Alaska domains

**Source used**: `HRRR`

---

## Prompt

```
What variables does NOAA's HRRR model produce, and where can I download
GRIB2 files for May 1, 2026 over CONUS?
```

## Transcript

### 1. List HRRR domains

```python
search_datasets(collections = "HRRR", limit = 5)
```

> Two items — one per domain:

| ID | Domain | Bbox | Resolution |
|---|---|---|---|
| `hrrr_conus` | CONUS + S. Canada + N. Mexico | -134.1, 21.1 → -60.9, 52.6 | 3 km |
| `hrrr_alaska` | Alaska + Bering / GoA / Arctic | -176.0, 40.0 → -126.0, 75.0 | 3 km |

Variables (excerpt): 2-m temperature (T2M), dewpoint (TD2M), 10-m wind (U10M, V10M), wind gust (GUST), precipitation (APCP, PRATE), categorical rain/snow/freezing rain/sleet (CRAIN/CSNOW/CFRZR/CICEP), CAPE, CIN, helicity (HLCY), MSLP, total cloud cover (TCDC), composite reflectivity (REFC), echo top, snow depth (SNOD), soil temperature/moisture, downward/upward radiation, near-surface smoke concentration.

### 2. Get the asset paths

```python
get_item(collection = "HRRR", item_id = "hrrr_conus")
```

> Assets: `gcs_browse` (console URL) and `gcs_data` (bucket path `gs://high-resolution-rapid-refresh/`).
>
> The HRRR archive on GCS is laid out as `hrrr.YYYYMMDD/conus/`. For May 1, 2026 that's `gs://high-resolution-rapid-refresh/hrrr.20260501/conus/`. File types per cycle:
>
> - `wrfnatf{HH}.grib2` — native level fields (~640 MB each)
> - `bufrsnd.tar.gz` — BUFR soundings
> - `class1.bufr.tm00` — surface observations used as input

## Result the agent gave

> *"HRRR produces 24 forecast cycles per day, each running out 18 hours (48 hours for the 00z, 06z, 12z, 18z synoptic cycles). It covers CONUS and Alaska at 3 km horizontal resolution.*
>
> *Variables include the standard NWP suite — temperature, wind, dewpoint, MSLP, cloud cover — plus storm-relevant fields like CAPE, helicity, composite reflectivity, and operationally important specials like near-surface smoke (for wildfire forecasting).*
>
> *For May 1, 2026 CONUS GRIB2 files:*
>
> *Browse: https://console.cloud.google.com/storage/browser/high-resolution-rapid-refresh/hrrr.20260501/conus*
> *Bucket path: gs://high-resolution-rapid-refresh/hrrr.20260501/conus/*
>
> *Open with cfgrib (xarray), pygrib, or wgrib2."*

## Variations

- **Alaska**: switch to `hrrr_alaska` for the Alaska domain.
- **Specific cycle hour**: the GCS folder lists files like `hrrr.t{HH}z.wrfnatf{FH}.grib2` — `HH` is the run hour, `FH` is the forecast hour.
- **Aviation use case**: filter the variable list for ceiling height (HGT_ceiling), visibility (VIS), and turbulence (TKE).
- **Smoke / wildfire**: HRRR-Smoke fields are in the same archive — `near-surface smoke concentration` is the key variable.

## Related examples

- [`09-nexrad-severe-weather/`](../09-nexrad-severe-weather/) — verify HRRR forecasts against radar
- [`03-hurricane-tracking/`](../03-hurricane-tracking/) — HRRR is run inside the GFS-driven cyclone forecast pipeline
