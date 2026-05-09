---
name: oil-spill-response
description: Use when the user asks about oil spills, vessel groundings, marine pollution, hazardous spill incidents, or trajectory forecasts — phrases like "oil spill in …", "vessel grounding at …", "trajectory of a slick from …", "incident reports near …", "Deepwater Horizon-style analysis". Encodes the cross-domain workflow combining INCIDENT_NEWS / NOAA_ORR (incident reports), Sentinel-1 SAR (slick detection), MARINECADASTRE_AIS (nearby vessels), and IOOS_HFRADAR + HRRR (drift forecast).
---

# Oil-spill response

This is a cross-domain skill — pollution events require composing data from at least 4 of AQUAVIEW's collections. Doing it well is what separates a quick answer from a useful one.

See [`workflow.md`](workflow.md) for a Deepwater Horizon-style worked example.

## The four-source composition

| Step | Source | What it gives |
|---|---|---|
| **1. Incident metadata** | `INCIDENT_NEWS`, `NOAA_ORR` | Reports of pollution events, discharge type, status |
| **2. Slick detection** | `sentinel-1-grd` | C-band SAR — oil signature is dark patches on water (low backscatter) |
| **3. Source identification** | `MARINECADASTRE_AIS` | Vessels in the area at the incident time |
| **4. Drift forecast** | `IOOS_HFRADAR` + `HRRR` | Surface currents + winds for trajectory modeling |

## Pattern: investigating a known spill location

```
1. INCIDENT REPORTS
   search_datasets(
     collections=["INCIDENT_NEWS", "NOAA_ORR"],
     bbox=<bbox>,
     datetime="<start>/<end>",
     q="oil spill",
     limit=10
   )

2. SAR IMAGERY (search for slick signature)
   search_datasets(
     collections=["sentinel-1-grd"],
     bbox=<bbox>,
     datetime="<incident-T-12h>/<incident-T+72h>",
     filter="properties.sar:instrument_mode = 'IW'",
     filter_lang="cql2-text",
     limit=10
   )

3. NEARBY VESSELS (source candidates)
   search_datasets(
     collections=["MARINECADASTRE_AIS"],
     bbox=<bbox + ~10 km buffer>,
     datetime="<incident-T-6h>/<incident-T+6h>",
     limit=200
   )
   # Then: filter for tankers (type 80-89) and cargo (70-79) in the 6-hour window

4. DRIFT FORECAST DATA
   hf  = search_datasets(collections=["IOOS_HFRADAR"], bbox=<extended bbox>, datetime="<T>/<T+72h>", limit=20)
   wind = search_datasets(collections=["HRRR"],         bbox=<extended bbox>, datetime="<T>/<T+72h>", limit=20)
```

## Pattern: "find spills along the Gulf Coast"

For exploratory queries:

```
search_datasets(
  collections=["INCIDENT_NEWS", "NOAA_ORR"],
  bbox=[-98.0, 24.0, -80.5, 31.0],
  datetime="<start>/<end>",
  q="oil",
  limit=50
)
```

Don't drop `INCIDENT_NEWS` for this skill — this is the rare case where it's the *primary* signal, not noise.

## SAR oil-slick interpretation

In Sentinel-1 SAR imagery, oil produces:

- **Low backscatter** (dark patches) — oil dampens capillary waves, reducing surface roughness
- **Distinct boundary** with surrounding ocean (ocean is bright due to wave-induced backscatter)
- **Elongated shape** following wind / current alignment

False positives:

- **Wind shadows** behind islands or platforms (also dark)
- **Algal blooms** (also dampen waves slightly)
- **Fresh water plumes** from rivers
- **Calm-water patches** (low wind areas, e.g., wind less than 3 m/s anywhere)

Cross-check with:

- AIS data (was a vessel there?)
- Wind speed (slicks are clearer in 3-10 m/s wind)
- Repeated SAR passes (slicks persist; wind shadows move with weather)

## Pattern: dark-vessel detection

For "vessels potentially involved but not transmitting AIS":

1. Identify SAR scenes covering the slick
2. Pull AIS for the same bbox + time window
3. Cross-reference SAR-detected ship signatures (bright spots on water) with AIS records
4. Bright SAR returns *without* a corresponding AIS report → "dark vessels"

This is a research-grade workflow. AQUAVIEW provides the inputs (SAR + AIS); the actual ship-detection on SAR is a downstream image-processing step (e.g., constant false-alarm rate detection).

## Common collections-to-skill cross-references

- For SAR specifics: see `satellite-imagery-finder`
- For AIS filtering: see `vessel-traffic-analyzer`
- For drift modeling currents: see `hf-radar-currents`
- For storm-driven spreading: see `storm-event-reconstruction`

## Worked scope: small coastal spill

> "Investigate a reported oil spill at the entrance to Tampa Bay on 2024-08-15."

```
1. bbox = [-82.85, 27.50, -82.50, 27.85]   # Tampa Bay entrance + outer
2. T = 2024-08-15

3. Incident:
   search_datasets(
     collections=["INCIDENT_NEWS", "NOAA_ORR"],
     bbox=bbox,
     datetime="2024-08-14/2024-08-16",
     q="oil spill",
     limit=10
   )

4. SAR scenes (S1 revisits ~6-12 days):
   search_datasets(
     collections=["sentinel-1-grd"],
     bbox=bbox,
     datetime="2024-08-14/2024-08-22",
     filter="properties.sar:instrument_mode = 'IW'",
     filter_lang="cql2-text",
     limit=10
   )

5. AIS at the time:
   search_datasets(
     collections=["MARINECADASTRE_AIS"],
     bbox=bbox,
     datetime="2024-08-15T00:00Z/2024-08-15T23:00Z",
     filter="properties.ais:vessel_type >= 70 AND properties.ais:vessel_type <= 89",
     filter_lang="cql2-text",
     limit=200
   )

6. Drift forecast inputs:
   search_datasets(collections=["IOOS_HFRADAR"], bbox=bbox, datetime="2024-08-15/2024-08-18", limit=15)
   search_datasets(collections=["HRRR"],         bbox=bbox, datetime="2024-08-15/2024-08-18", limit=15)
```

## Pitfalls

- **Reporting lag.** `INCIDENT_NEWS` and `NOAA_ORR` ingest reports as they are published — not in real time. For a spill that happened today, expect 24–72h before it appears.
- **SAR revisit gap.** Sentinel-1 has 6–12 day revisit. If the user wants imagery within 24h of the spill, SAR may not be available.
- **AIS blanking.** Vessels can turn off transponders. The lack of an AIS record near a slick is suggestive, not conclusive.
