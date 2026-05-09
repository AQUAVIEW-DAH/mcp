---
name: hf-radar-currents
description: Use when the user asks about surface currents — phrases like "HF radar", "ocean surface currents", "drift forecast", "tidal circulation", "{location} surface flow", or "where would a buoy / debris drift". Encodes the IOOS_HFRADAR query patterns, the regional networks behind it, and resolution / coverage tradeoffs.
---

# HF radar surface currents

The IOOS HF Radar network produces gridded ocean surface currents derived from coastal HF radar stations. Coverage is patchy globally but dense along most US coasts and select international sites.

## Primary collection

`IOOS_HFRADAR` is the unified national feed. Regional aggregator collections also expose HF radar:

| Collection | Region |
|---|---|
| `IOOS_HFRADAR` | Unified US national feed |
| `MARACOOS` | Mid-Atlantic regional grids |
| `CENCOOS` | Central California (San Francisco approach, Monterey) |
| `CALOOS` | Southern California Bight |
| `SECOORA` | US Southeast |
| `NANOOS` | Pacific Northwest |
| `CARICOOS` | Caribbean (Puerto Rico, USVI) |

Default to `IOOS_HFRADAR` unless the user specifies a region's RA.

## Resolution tradeoffs

The network produces grids at three resolutions; pick by use case:

| Grid | Use for |
|---|---|
| **6 km** | Regional / synoptic circulation (basin-scale flow patterns) |
| **2 km** | Coastal current studies (continental shelf, alongshore flow) |
| **1 km** | Bay / estuary / harbor entrances (highest detail, smallest footprint) |

Items in the catalog are typically tagged with the resolution. Filter to your scale of interest.

## Pattern: "current surface flow off X"

```
search_datasets(
  collections=["IOOS_HFRADAR"],
  bbox=<bbox>,
  datetime="<24-hours-ago>/<now>",
  q="6km",   # or "2km", "1km"
  limit=10
)
```

For an animation / timeseries, expand the time window:

```
datetime="<7-days-ago>/<now>"
limit=50
```

## Pattern: drift trajectory forecast

For "where would something released at point P drift over Δt":

1. Pull a sequence of HF radar grids (6 km is usually enough)
2. Combine with surface wind from `HRRR` (wind drift component)
3. Use a Lagrangian particle integrator downstream (`OceanDrift` / `OpenDrift`)

This is a multi-tool workflow — call out to the user that you'll need both currents and winds:

```
hf = search_datasets(collections=["IOOS_HFRADAR"], bbox=..., datetime=..., limit=20)
wind = search_datasets(collections=["HRRR"], bbox=..., datetime=..., limit=20)
```

## Variable conventions

| Variable | Meaning |
|---|---|
| `u` (or `u_water`) | Eastward velocity component (m/s) |
| `v` (or `v_water`) | Northward velocity component (m/s) |
| `current_speed` | Magnitude (m/s) — derived |
| `current_direction` | Direction (degrees) — derived |
| `qc_flag` | Per-cell quality flag (NaN = bad / no data) |

Most HF radar files distribute u/v components, not speed/direction. To compute:

```python
speed = np.sqrt(u**2 + v**2)
direction = (np.degrees(np.arctan2(v, u)) + 360) % 360
```

## Coverage and gap-filling

HF radar coverage **gaps** are real:

- **Outside the radar arc:** typically 30-200 km offshore depending on frequency
- **Behind headlands:** geometric blanking
- **During radio interference:** time-varying

Many products include a `qc_flag` raster — drop cells where `qc_flag != 0` before any analysis.

For users who need "every cell filled," recommend an OMA (Open-boundary Modal Analysis) or DCT-based gap-fill in post-processing. Don't try to gap-fill at query time.

## Common collections it pairs with

- **`HRRR`** — atmospheric winds for drift modeling
- **Glider data (`MARACOOS` / `CENCOOS` / etc.)** — Eulerian-Lagrangian comparison
- **`COOPS`** — moored ADCP at PORTS stations for ground-truth subsurface currents
- **`MARINECADASTRE_AIS`** — vessel drift validation

## Worked example

> "Map HF radar surface currents off the California coast right now."

```
1. bbox = [-124.0, 32.0, -117.0, 39.0]   (CA coastal bounds)
2. search_datasets(
     collections=["IOOS_HFRADAR"],
     bbox=bbox,
     datetime="<6-hours-ago>/<now>",
     q="6km",
     limit=10
   )
3. Pull the most recent grid; download NetCDF; plot u/v as quivers
```

## Pitfalls

- **Tidal vs sub-tidal currents.** HF radar measures total surface velocity — a tidal cycle dominates short-window queries. For "mean flow" questions, average over ≥48h to remove tides.
- **Grid edges are noisy.** First and last 5–10 km of each grid are often biased.
- **Direction conventions vary.** Some products use oceanographic ("flowing toward") direction; others meteorological ("coming from"). Always check metadata.
