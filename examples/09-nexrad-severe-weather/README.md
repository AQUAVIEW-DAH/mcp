# NEXRAD severe weather radar — Asheville during Hurricane Helene

Find Level-II base radar volumes and Level-III processed products for a specific location and event window.

## What this teaches

- Discovering NEXRAD radar stations by location (`bbox`)
- Reading the per-station coverage polygon (~230 km radar range)
- The asset structure for NEXRAD on Google Cloud Storage
- Combining Level-II (raw volumes) with Level-III (processed products)

**Sources used**: `NEXRAD_L2`, `NEXRAD`

---

## Prompt

```
Hurricane Helene caused catastrophic flooding in Asheville, NC in late
September 2024. Show me the nearest NEXRAD radar stations to Asheville
and how to access their archived data for that storm window.
```

## Transcript

### 1. Find radar stations near Asheville

```python
search_datasets(
  collections = "NEXRAD_L2",
  bbox = "-83,35,-82,36",
  limit = 5
)
```

Real results — three stations cover Asheville's airspace:

| Station ID | Title | Location | Elevation |
|---|---|---|---|
| `nexrad_l2_kmrx` | KMRX — Knoxville | Hamblen, TN | 437 m |
| `nexrad_l2_kjkl` | KJKL — Jackson | Breathitt, KY | 445 m |
| `nexrad_l2_kgsp` | KGSP — Greer | Spartanburg, SC | 326 m |

Each station's bbox is the ~230 km radar range polygon. Variables (Level II, dual-pol since 2013): reflectivity, radial velocity, spectrum width, differential reflectivity (ZDR), correlation coefficient (CC, RhoHV), differential phase (PhiDP).

### 2. Get one station's asset URLs

```python
get_item(collection = "NEXRAD_L2", item_id = "nexrad_l2_kgsp")
```

> Asset keys: `gcs_browse` (Google Cloud Storage console), `gcs_data` (raw archive bucket path), `ncei_viewer` (NCEI's web viewer).
>
> The GCS path is `gs://gcp-public-data-nexrad-l2/<YYYY>/<MM>/<DD>/<STATION>/` — for KGSP on Sep 27 2024 that's `gs://gcp-public-data-nexrad-l2/2024/09/27/KGSP/`. Files are gzipped Level-II Archive II files, one per volume scan (~5 minutes).

## Result the agent gave

> *"Six NEXRAD Level II stations match the Asheville bbox; the three with coverage polygons that intersect Asheville (~35.6°N, 82.6°W) are:*
>
> - ***`nexrad_l2_kgsp`*** *— KGSP (Greer, Spartanburg County, SC). Elevation 326 m. Bbox -84.74°W to -79.70°W, 32.82°N to 36.95°N — Asheville is well within range to the NW.*
> - ***`nexrad_l2_kmrx`*** *— KMRX (Knoxville, Hamblen County, TN). Elevation 437 m. Bbox -85.96°W to -80.84°W, 34.10°N to 38.23°N — covers Asheville from the west.*
> - ***`nexrad_l2_kjkl`*** *— KJKL (Jackson, Breathitt County, KY). Elevation 445 m. Bbox -85.92°W to -80.71°W, 35.52°N to 39.66°N — covers Asheville from the NNW.*
>
> *Each station is operational since 1991 and provides the full dual-pol Level II suite: reflectivity, radial velocity, spectrum width, ZDR, correlation coefficient (RhoHV), differential phase (PhiDP).*
>
> ***Asset keys**: `gcs_browse` (Google Cloud Storage console), `gcs_data` (raw archive bucket), `ncei_viewer` (NCEI web viewer).*
>
> ***GCS path layout**: `gs://gcp-public-data-nexrad-l2/<YYYY>/<MM>/<DD>/<STATION>/` — files are gzipped Archive II volume scans, ~5 min cadence per file.*
>
> *For Hurricane Helene's Asheville-area window (Sep 26–27, 2024):*
> - *KGSP, Sep 27: gs://gcp-public-data-nexrad-l2/2024/09/27/KGSP/*
> - *KMRX, Sep 27: gs://gcp-public-data-nexrad-l2/2024/09/27/KMRX/*
> - *KJKL, Sep 27: gs://gcp-public-data-nexrad-l2/2024/09/27/KJKL/*
>
> *Open the .gz files with Py-ART (`pyart.io.read_nexrad_archive(...)`) or GR2Analyst. AQUAVIEW is the discovery layer; storm-relative interpretation requires the actual radar volumes."*

## Variations

- **Different storm**: change the `datetime` filter window. Hurricane Ian 2022 landfall day: `2022-09-28T00:00:00Z/2022-09-29T00:00:00Z`.
- **Tornado event**: bbox a Plains state and pull KOUN, KFWS, KTLX volumes for the affected day.
- **Level III only**: switch `NEXRAD_L2` → `NEXRAD` for processed products (precipitation accumulation, storm-relative velocity, hail index, etc.).
- **Composite**: aggregate by `geometry_geotile_grid_frequency` to map radar coverage gaps.

## Related examples

- [`03-hurricane-tracking/`](../03-hurricane-tracking/) — combine NEXRAD with NDBC, GOES, and TCHP
- [`10-hrrr-forecast/`](../10-hrrr-forecast/) — HRRR forecasts for the same storm window
