---
name: storm-event-reconstruction
description: Use when the user wants to reconstruct a hurricane, tropical storm, atmospheric river, bomb cyclone, or extreme wave/wind event from multiple data sources — phrases like "reconstruct Hurricane {Name}", "buoys during {Storm} landfall", "satellite imagery for {Event}", "storm surge at {Location} during {Storm}". Encodes the multi-source composition pattern (in-situ + satellite + track + surge + atmospheric) and the time/space windowing heuristic.
---

# Storm event reconstruction

A storm reconstruction is a multi-source composition workflow. Done well, it answers "what happened on the ground / in the water during this event" by stitching together in-situ buoys, satellite imagery, official track data, water-level gauges, and atmospheric model output.

See [`recipe.md`](recipe.md) for a full Hurricane Ian (2022) walkthrough.

## The five sources to compose

| Source | Collection | What you get |
|---|---|---|
| **In-situ waves / wind / SST** | `NDBC` (offshore), `CDIP` (wave-specific) | Time-series buoy observations |
| **Satellite imagery** | `GOES_R` (visible/IR every 1–10 min), `sentinel-1-grd` (SAR for cloud-penetrating views) | Geostationary IR + SAR |
| **Track and intensity** | `NOAA_AOML_HDB` | Best-track lat/lon, MSW, MSLP per 6-hour fix |
| **Storm surge / water level** | `COOPS`, `NOS_COOPS` | Coastal tide gauges with surge anomalies |
| **Atmospheric forecast / reanalysis** | `HRRR` | Hourly 3km CONUS atmospheric model fields |

## Time and space windowing heuristic

For a storm that made landfall at time T and location L:

| Source | Time window | Spatial window |
|---|---|---|
| Track (`NOAA_AOML_HDB`) | T - 7 days → T + 2 days (full lifecycle) | Whole-basin bbox |
| Buoys (`NDBC`) | T - 48h → T + 24h | Storm radius × 2 around the track |
| GOES (`GOES_R`) | T - 24h → T + 12h | Bbox covering the eye + outer bands |
| Surge (`COOPS`) | T - 24h → T + 48h | Coastal stations within 200 km of L |
| HRRR (`HRRR`) | T - 24h → T + 12h | Same as GOES bbox |

Storm radius scales with intensity: Cat 1 ~50–100 km, Cat 5 ~100–200 km. Double it for the bbox.

## Pattern: multi-tool composition

```
# 1. Get the official track first (sets time/space scope for everything else)
track = search_datasets(
  collections=["NOAA_AOML_HDB"],
  q="<storm name>",
  datetime="<basin season>",
  limit=10
)

# 2. From the track, derive bbox (max storm extent) and landfall time T

# 3. NDBC buoys near the track during the eyewall passage
ndbc = search_datasets(
  collections=["NDBC"],
  bbox=<storm bbox>,
  datetime="<T-48h>/<T+24h>",
  filter="properties->>'cube:variables'->>'wave_height'->>'max' > 4",
  filter_lang="cql2-text",
  limit=30
)

# 4. GOES-R imagery during eyewall passage
goes = search_datasets(
  collections=["GOES_R"],
  bbox=<storm bbox>,
  datetime="<T-12h>/<T+6h>",
  limit=20
)

# 5. Coastal water-level gauges along the landfall coast
surge = search_datasets(
  collections=["COOPS"],
  bbox=<coastal strip near landfall>,
  datetime="<T-24h>/<T+48h>",
  q="water level",
  limit=20
)

# 6. (optional) HRRR atmospheric reanalysis for environment
hrrr = search_datasets(
  collections=["HRRR"],
  bbox=<storm bbox>,
  datetime="<T-24h>/<T+12h>",
  limit=10
)
```

## Variable thresholds for "extreme" filters

If the user asks for buoys that recorded **extreme** conditions:

| Variable | Cat 1 threshold | Cat 3+ threshold |
|---|---|---|
| `wave_height` (max) | 4 m | 6 m |
| `wind_speed` (max) | 33 m/s | 50 m/s |
| `pressure` (min) | 990 hPa | 950 hPa |
| `gust` (max) | 40 m/s | 60 m/s |

Use `cql2-filter-builder` for the actual CQL2 syntax.

## Multi-storm comparisons

If the user wants to compare two storms:

1. Run the above pattern for each storm separately
2. Don't try to compose both into a single search (different bboxes, different time windows)
3. In the output, normalize by relative time (`T - landfall_time`) for cross-storm comparison

## Atmospheric river / bomb cyclone variants

Same pattern, but:

- Drop `NOAA_AOML_HDB` (no tropical track data)
- Add `GOES_R` for water vapor channel + cloud features
- Add `HRRR` early (it's the workhorse atmospheric source for non-tropical events)
- Use longer time windows (atmospheric rivers persist 3–7 days)

## Output expectations

Tell the user upfront:

- "I'll need to make 4-5 tool calls to fully reconstruct this event."
- "Buoy availability depends on which buoys were operational and within the storm's path."
- "Some buoys go offline during eyewall passage (lost data), which itself is a signal."
