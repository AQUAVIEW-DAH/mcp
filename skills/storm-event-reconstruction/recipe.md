# Worked example: Hurricane Ian (September 2022)

A complete reconstruction of Hurricane Ian's landfall using AQUAVIEW MCP. Ian made Florida landfall as a Cat 4 near Cayo Costa, FL on **2022-09-28 at ~19:35 UTC** with sustained winds of ~67 m/s (150 mph).

## Step 1 — Fetch the official track

```python
search_datasets(
  collections=["NOAA_AOML_HDB"],
  q="Ian",
  datetime="2022-09-15/2022-10-05",
  limit=20
)
```

Expected: best-track items spanning 2022-09-23 (formation) → 2022-10-01 (post-tropical). Each item has lat/lon, MSW, MSLP, intensity classification.

From the returned track, identify:

- Landfall time `T = 2022-09-28T19:35Z`
- Landfall location `L = (26.6°N, 82.2°W)` (Cayo Costa)
- Storm radius near landfall `R = ~150 km` (Cat 4 hurricane)

## Step 2 — Set bboxes

```python
# Storm bbox during Florida approach (T-48h to T+12h)
storm_bbox = [-87.0, 23.0, -79.0, 28.5]   # Eastern Gulf + Florida

# Coastal strip for surge (Naples → Tampa Bay, ~200 km of coast)
coast_bbox = [-83.0, 26.0, -82.0, 28.5]
```

## Step 3 — NDBC buoys during the storm

```python
ndbc = search_datasets(
  collections=["NDBC"],
  bbox=storm_bbox,
  datetime="2022-09-26T00:00Z/2022-09-29T12:00Z",
  filter="properties->>'cube:variables'->>'wave_height'->>'max' > 4",
  filter_lang="cql2-text",
  limit=30
)
```

Expected: buoys 42022 (Eastern Gulf), 42036 (West Tampa), 42039 (Pulley Ridge) likely return wave_height > 4 m. Buoy 42022 reports up to 11 m peak wave height during eyewall passage.

## Step 4 — GOES-R imagery during landfall

```python
goes = search_datasets(
  collections=["GOES_R"],
  bbox=storm_bbox,
  datetime="2022-09-28T00:00Z/2022-09-29T12:00Z",
  limit=20
)
```

Expected: many items per channel (visible, IR, water vapor) since GOES-R refreshes every 1–10 min. Filter to a sensible cadence (1 image per hour) downstream.

## Step 5 — Coastal storm surge from CO-OPS

```python
surge = search_datasets(
  collections=["COOPS"],
  bbox=coast_bbox,
  datetime="2022-09-27T00:00Z/2022-09-30T00:00Z",
  q="water level",
  limit=20
)
```

Expected: stations Fort Myers (8725520), Naples (8725110), and Port Manatee (8726384) report storm surge anomalies of 2–4+ m at peak.

## Step 6 — Atmospheric environment (HRRR)

```python
hrrr = search_datasets(
  collections=["HRRR"],
  bbox=storm_bbox,
  datetime="2022-09-28T12:00Z/2022-09-29T00:00Z",
  limit=10
)
```

Expected: HRRR analysis fields for the landfall window (winds, temperature, MSLP). Useful for context — what was the steering flow, ridge position, etc.

## Step 7 — Synthesize

Tell the user:

- "Track: 6-hourly fixes from formation through Florida landfall."
- "Buoys: 4 NDBC stations recorded waves > 4 m during eyewall passage; peak wave at 42022 was 11.0 m."
- "GOES-R: 1-min visible imagery available throughout landfall day."
- "Surge: peak water level at Fort Myers was +X m (relative to MHHW) on 2022-09-28T22Z."
- "Atmospheric context: ridge to the north steered Ian on a NE track after landfall."

Provide direct download URLs for the key items (one per source) so the user can do their own analysis.

## How long this takes

If running in series, this is 5 search_datasets + 5–10 get_item calls. Budget: ~30s for the LLM round-trips. If the user wants to download files, that's bandwidth-bound separately.

## Variations

- **Other Atlantic Cat 4/5 storms (Helene 2024, Milton 2024, Idalia 2023):** same pattern, different storm name + date.
- **Pacific typhoons:** swap `NDBC` for `IOOS_HFRADAR` (limited Pacific buoy coverage), use `GOES_R` only if the storm crossed the eastern Pacific.
- **Pre-2017 storms:** `GOES_R` data starts in 2017; for older events, fall back to historical GOES products via `COASTWATCH`.
