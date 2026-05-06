# Tides and storm surge — Charleston, SC

Find tide-gauge water levels, predictions, and meteorological observations for a specific U.S. coastal station.

## What this teaches

- Scoping to a specific point with a small `bbox`
- Reading `column_stats_summary` for a multi-variable station
- The `COOPS` collection's asset structure (water level CSVs, hourly height, high/low predictions)

**Source used**: `COOPS` (NOAA CO-OPS Tides and Currents)

---

## Prompt

```
Find the NOAA CO-OPS tide gauge at Charleston, SC. Show me the variables
it records, recent water level extremes, and the asset URLs to download
the water level time series.
```

## Transcript

### 1. Scope to the Charleston coast

```python
search_datasets(
  collections = "COOPS",
  bbox = "-80.2,32.5,-79.5,33.0",
  limit = 3
)
```

> Returns one item: `coops_8665530` — *CO-OPS Station 8665530 (Charleston, SC)*.

The `column_stats_summary` shows:

| Variable | Min | Max |
|---|---|---|
| Water Level | -0.352 m | 2.10 m |
| Mean Sea Level | 0.428 m | 1.325 m |
| Air Temperature | -6.1 °C | 23.8 °C |
| Water Temperature | 6.7 °C | 13.8 °C |
| Wind Speed | 0.0 | 12.8 m/s |
| Wind Gust | 0.0 | 20.7 m/s |
| Barometric Pressure | 1006.4 | 1031.9 mbar |
| Wind Direction | 0° | 360° |

Eight variables, 7,394 observations summarized, source URL `https://tidesandcurrents.noaa.gov/map/index.html?id=8665530`.

### 2. Get the asset URLs

```python
get_item(collection = "COOPS", item_id = "coops_8665530")
```

Real asset list — 26 keys. Each `href` points at the CO-OPS data API. Excerpt:

| Key | Format | URL |
|---|---|---|
| `water_level_csv` | CSV | `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=8665530&product=water_level&format=csv&time_zone=gmt&units=metric&datum=MLLW&date=recent&application=AquaView_STAC_Indexer` |
| `hourly_height_csv` | CSV | same base, `product=hourly_height` |
| `high_low_csv` | CSV | same base, `product=high_low` |
| `predictions_csv` | CSV | same base, `product=predictions` |
| `wind_csv` | CSV | same base, `product=wind` |

Plus parallel JSON / XML variants for every product, an `overview` PNG preview, a `thumbnail`, and a `column_stats` JSON.

Item-level temporal extent: **start_datetime 1899-09-13**, **end_datetime 2026-02-26 19:27 UTC** — the station has 127 years of records.

## Result the agent gave

> *"NOAA CO-OPS station 8665530 (Charleston, SC) is at 32.78°N, 79.92°W. The catalog reports the station has continuous data from 1899-09-13 to 2026-02-26, indexed by Aquaview from `https://tidesandcurrents.noaa.gov/map/index.html?id=8665530`.*
>
> ***Variables (8 with summary stats):** Water Level (-0.35 to 2.10 m), Mean Sea Level (0.43 to 1.33 m), Air Temperature (-6.1 to 23.8 °C), Water Temperature (6.7 to 13.8 °C), Wind Speed (0 to 12.8 m/s), Wind Gust (0 to 20.7 m/s ≈ 46 mph), Wind Direction (0–360°), Barometric Pressure (1006.4 to 1031.9 mbar). The 2.10 m water level is consistent with a major storm-surge event.*
>
> ***Download URLs (CSV, recent 72 h):***
> - *Water Level: https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=8665530&product=water_level&format=csv&time_zone=gmt&units=metric&datum=MLLW&date=recent*
> - *Hourly Height: same URL with `product=hourly_height`*
> - *High/Low Tide Times: `product=high_low`*
> - *Tide Predictions: `product=predictions`*
> - *Wind / Air Pressure / Air Temp / Water Temp: change `product=` accordingly*
>
> *For specific date ranges (e.g., a hurricane window), swap `date=recent` for `begin_date=YYYYMMDD&end_date=YYYYMMDD` in any of the URLs above."*

## Variations

- **Different station**: change `bbox` — for The Battery, NY use `-74.05,40.65,-74.0,40.75`.
- **Region survey**: drop `bbox`, use `q = "tide gauge Florida"` to scan the whole state.
- **Storm-day data**: combine with `datetime = "2024-09-26T00:00:00Z/2024-09-29T23:59:59Z"` (Hurricane Helene approach) for surge analysis.
- **Predictions only**: filter assets to `high_low_*` keys after `get_item`.

## Related examples

- [`03-hurricane-tracking/`](../03-hurricane-tracking/) — combine CO-OPS surge with storm context
- [`19-regional-deep-dives/`](../19-regional-deep-dives/) — IOOS regional associations and their tide-gauge networks
