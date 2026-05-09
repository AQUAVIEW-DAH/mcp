# Worked example: Deepwater Horizon (April-September 2010)

A complete pollution-event workflow using AQUAVIEW MCP. The Deepwater Horizon explosion occurred on **2010-04-20** at the Macondo well (28.738°N, 88.366°W) in the Gulf of Mexico, with continuous oil release until **2010-07-15** capping.

## Step 1 — Incident reports

```python
search_datasets(
  collections=["INCIDENT_NEWS", "NOAA_ORR"],
  bbox=[-90.0, 27.0, -86.0, 30.0],
  datetime="2010-04-20/2010-09-30",
  q="Deepwater Horizon oil spill",
  limit=20
)
```

Expected: NOAA Office of Response and Restoration response logs, weekly incident reports through cap-and-recovery phase.

## Step 2 — SAR slick mapping

The spill produced one of the most documented oil-slick signatures in remote-sensing history. Sentinel-1 wasn't yet operational (launched 2014), so for 2010 you'd substitute Envisat ASAR. For the purpose of this skill, document the pattern:

```python
search_datasets(
  collections=["sentinel-1-grd"],
  bbox=[-90.0, 27.0, -86.0, 30.0],
  datetime="2014-10-01/<later>",   # post-launch only
  filter="properties.sar:instrument_mode = 'IW'",
  filter_lang="cql2-text",
  limit=20
)
```

For 2010-era SAR, the same pattern holds but data sourcing is via Envisat archives (not in AQUAVIEW directly).

## Step 3 — Vessel activity around the platform

```python
search_datasets(
  collections=["MARINECADASTRE_AIS"],
  bbox=[-89.0, 28.0, -87.5, 29.5],   # tight area around Macondo
  datetime="2010-04-20T00:00Z/2010-04-22T00:00Z",
  limit=500
)
```

Expected: response vessels arriving in the 24-48h after the explosion, plus pre-incident baseline traffic. Aggregate by `vessel_type` to identify the response fleet.

## Step 4 — Surface currents for spill drift

```python
hf = search_datasets(
  collections=["IOOS_HFRADAR"],
  bbox=[-90.0, 27.0, -85.0, 30.5],
  datetime="2010-04-22/2010-09-30",
  limit=50
)
```

The Loop Current was a critical factor — it transported oil east toward Florida. Expected: time-series of HF radar grids capturing the loop's shifts during summer 2010.

## Step 5 — Atmospheric forcing

```python
hrrr = search_datasets(
  collections=["HRRR"],
  bbox=[-92.0, 25.0, -84.0, 31.0],
  datetime="2010-04-22/2010-09-30",
  limit=30
)
```

Note: HRRR went operational in 2014. For 2010 you'd substitute NARR or ERA5 reanalysis (not in AQUAVIEW). The pattern stands for present-day spills.

## Step 6 — Synthesize

What the user gets:

- Incident timeline (response logs)
- SAR signature of the slick (post-2014 events; substitute for older)
- Vessel response fleet (MMSIs of skimmers, Coast Guard, response vessels)
- Surface current trajectory (Loop Current orientation week by week)
- Wind regime during summer 2010

## Adapted for a present-day spill

For a hypothetical spill *today* in the same area, all five steps would return live data:

1. `INCIDENT_NEWS` would have the report within 24-72h
2. `sentinel-1-grd` would have the next SAR pass within 6-12 days
3. `MARINECADASTRE_AIS` returns near-real-time vessel positions
4. `IOOS_HFRADAR` provides current grids within hours
5. `HRRR` provides hourly atmospheric analysis

This is the strength of the cross-domain skill: it composes 5 sources without requiring the user to know which collection holds what.

## Variations

- **Smaller spill (port grounding):** drop `IOOS_HFRADAR` (often no coastal radar coverage in tight bays); use `COOPS` PORTS currents instead.
- **Pipeline / platform leak (no ship source):** drop the AIS step.
- **Beach-impact prediction:** add `BATHYMETRY` for the shoreline geometry and `COOPS` for tide-driven beach exposure.
- **Long-duration spill:** loop steps 2-5 daily for the duration; use `aggregate(group_by="datetime", interval="1D")` to summarize without pulling thousands of items.
