---
name: realtime-coastal-monitor
description: Use when the user asks for current / recent / live observations — phrases like "current conditions at …", "right now", "latest reading from …", "this week's tides at …", "live wave heights off …", "real-time wind speed near …". Encodes which collection has which kind of in-situ feed (NDBC for offshore, COOPS for tide gauges, IOOS_SENSORS for regional aggregator, CDIP for waves).
---

# Real-time coastal monitor

For "current conditions" questions, AQUAVIEW has four overlapping in-situ feeds. Picking the right one matters because freshness and station density differ.

See [`station-types.md`](station-types.md) for the per-collection station inventory.

## Collection picker

| Question | Best collection |
|---|---|
| Wave heights / wind / SST in offshore waters | `NDBC` |
| Tide / water level / surge at a coastal city | `COOPS` (or `NOS_COOPS`) |
| Currents at a coastal location | `COOPS` (PORTS program) |
| Wave-only data with directional spectra | `CDIP` |
| Multi-variable regional aggregator | `IOOS_SENSORS` |
| Right-now wind/temp/precip over CONUS | `HRRR` (model — not in-situ) |

## Pattern: "current conditions at {location}"

```
1. bbox = small area around the location (~10-30 km radius)
2. search_datasets(
     collections=["NDBC"],
     bbox=bbox,
     datetime="<24-hours-ago>/<now>",
     limit=10
   )
3. If empty → expand collections to ["NDBC", "COOPS", "IOOS_SENSORS"]
4. Sort by datetime desc → return most recent reading
```

## Pattern: "tide forecast / current tide at X"

```
search_datasets(
  collections=["COOPS"],
  bbox=<small bbox around the city/port>,
  datetime="<now>/<+7-days>",
  q="water level forecast",
  limit=10
)
```

CO-OPS provides both observations (past) and predictions (future tide forecast). The `q` field disambiguates.

## Pattern: "find a working buoy near X"

When the user wants a specific station for a long-term study:

```
1. aggregate(
     collections=["NDBC"],
     bbox=<broad search bbox>,
     datetime="<30-days-ago>/<now>",
     group_by="station_id"
   )
2. Sort by recent count → top station_id is the most-recently-active
3. search_datasets specific to that station_id for the user's actual time window
```

This avoids the trap of recommending an offline station.

## Pattern: regional aggregator (IOOS_SENSORS)

`IOOS_SENSORS` is a meta-collection covering all 11 IOOS RAs' sensor feeds. Use it when:

- You don't know which specific RA covers the user's region
- You want a one-stop multi-variable pull

```
search_datasets(
  collections=["IOOS_SENSORS"],
  bbox=<bbox>,
  datetime="<24h>/<now>",
  q="<variable, e.g., wave height>",
  limit=20
)
```

Drop down to a specific RA collection (`MARACOOS`, `CENCOOS`, etc.) once you know which one is responding.

## Pattern: realtime wave + direction (CDIP)

CDIP specializes in wave buoys with directional spectra (the `wave_direction`, `wave_period`, `wave_spectrum` triplet). Use it when:

- The user asks about "swell direction"
- They want spectrum data (not just bulk Hs)

```
search_datasets(
  collections=["CDIP"],
  bbox=<bbox>,
  datetime="<24h>/<now>",
  limit=15
)
```

## Freshness vs latency

| Source | Typical latency |
|---|---|
| `NDBC` | 6-30 min |
| `COOPS` | 6 min - 1 hour |
| `CDIP` | 30 min |
| `IOOS_SENSORS` | 15 min - 1 hour |
| Satellite SST / chl (CoastWatch) | 24-48 hours |

If the user wants "right now" data and the satellite source has 48h latency, fall back to in-situ buoys.

## Worked example

> "What's the current wave height and wind speed at the entrance to San Francisco Bay?"

```
1. bbox = [-122.7, 37.7, -122.4, 37.95]   (Golden Gate area)
2. search_datasets(
     collections=["NDBC", "COOPS"],
     bbox=bbox,
     datetime="<6-hours-ago>/<now>",
     limit=10
   )
3. From returned items, extract:
   - Most recent NDBC buoy reading (waves, wind)
   - Most recent COOPS gauge reading (water level, current at PORTS station)
4. Report timestamp + values
```

## Common gotchas

- **Don't query the future.** Setting `datetime="<now>/<+1d>"` for `NDBC` returns nothing (observations only go up to "now"). Use `COOPS` water-level forecasts for predictions.
- **Tide vs water level.** "Tide" usually means the astronomical prediction. "Water level" includes tide + storm surge + wind setup. CO-OPS provides both — check the asset metadata.
- **Buoy gaps.** A specific buoy may be out for maintenance for weeks. If a known station is silent, recommend a fallback nearby station.
