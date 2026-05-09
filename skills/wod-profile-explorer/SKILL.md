---
name: wod-profile-explorer
description: Use when the user asks about World Ocean Database, WOD, historical T/S casts, ocean climatology, or specific cast types (CTD, XBT, MBT, PFL, OSD, GLD, DRB, MRB, SUR, UOR, APB). Encodes WOD's cast-type taxonomy, quality-flag handling, and how WOD complements GADR/Argo for the pre-1980s historical record.
---

# WOD profile explorer

The World Ocean Database (`WOD` collection) is the canonical archive for in-situ oceanographic profile data going back to the late 1700s, with the bulk of data from 1950 onward. It is broader and deeper in time than the Argo network (which starts ~2000) but heterogeneous in instrumentation and quality.

## When to prefer WOD

| User intent | Best collection |
|---|---|
| Long-term climatology (pre-1980s) | `WOD` |
| Real-time / recent autonomous profiles | `GADR` (Argo) |
| Glider deployments | `IOOS`, `MARACOOS`, `OOI`, `SPRAY` (see `glider-mission-tracker`) |
| US coastal stations | `NDBC`, `COOPS`, `IOOS_SENSORS` |
| Both historical + modern combined | Use both `WOD` AND `GADR` and merge in post-processing |

## WOD cast types

WOD partitions data by instrument (cast type). This matters because quality and depth coverage vary dramatically across types.

See [`cast-types.md`](cast-types.md) for the full taxonomy. Quick reference:

| Code | Instrument | Typical depth | Notes |
|---|---|---|---|
| **CTD** | Conductivity-Temp-Depth | 0–6000 m | Highest accuracy; modern shipboard |
| **OSD** | Ocean Station Data (bottle) | 0–6000 m | Discrete-depth Niskin/Nansen casts; pre-1990s standard |
| **XBT** | Expendable Bathythermograph | 0–760 m typ. | T only, no S; common for navy/fisheries surveys |
| **MBT** | Mechanical Bathythermograph | 0–270 m | Pre-1970 surface T profile |
| **PFL** | Profiling Float (Argo-style) | 0–2000 m typ. | Subset overlaps with GADR |
| **APB** | Autonomous Pinniped Bathy. | 0–1000 m | Seal-borne sensors; gappy spatial coverage |
| **GLD** | Glider | 0–1000 m | Deployment-scale; superseded by IOOS glider feeds |
| **DRB** | Drifting Buoy | 0–~150 m | Surface drifters with thermistor strings |
| **MRB** | Moored Buoy | Fixed depths | NDBC-style; check `NDBC` first |
| **SUR** | Surface only | 0 m | TSG underway data; useful for SST-along-track |
| **UOR** | Undulating Oceanographic Recorder | 0–500 m | Towed-undulating CTD; sparse |

## Pattern: long-term temperature climatology

```
search_datasets(
  collections=["WOD"],
  bbox=<bbox>,
  datetime="1950-01-01/1980-12-31",
  filter="properties->>'cube:variables'->>'temp'->>'min' IS NOT NULL",
  filter_lang="cql2-text",
  limit=50
)
```

For coverage stats first (better than pulling 50 years of items), use `aggregate`:

```
aggregate(
  collections=["WOD"],
  bbox=<bbox>,
  datetime="1950-01-01/2024-12-31",
  group_by="datetime",
  interval="1Y"
)
```

## Pattern: cast-type filtered query

If the user wants only "modern, high-quality" casts:

```
search_datasets(
  collections=["WOD"],
  bbox=<bbox>,
  datetime="2000-01-01/2024-12-31",
  filter="properties.wod:cast_type = 'CTD'",
  filter_lang="cql2-text",
  limit=50
)
```

(The exact property name `wod:cast_type` may vary — inspect a sample item with `get_item` first if the filter returns empty.)

## Combining WOD + Argo for full record

For a continuous T/S profile timeseries:

1. Query `WOD` for `1950-01-01/1999-12-31` (pre-Argo era)
2. Query `GADR` for `2000-01-01/<today>` (Argo era)
3. Merge by depth/time/lat-lon

Don't query both for the overlap period (2000-present) — you'll double-count.

## Quality flag awareness

WOD uses WOA-2018 quality-control flags. When reading a downloaded WOD item, filter:

- T/S values where the QC flag is `0` (good) or `1` (acceptable)
- Drop values with QC flag `2` or higher (questionable / bad)

This is a per-asset post-processing step — AQUAVIEW returns the full item, but the user (or the agent's downstream pandas/xarray code) needs to apply the QC filter.

## Variables to expect

- `temp` — temperature (°C)
- `salinity` — practical salinity (PSU)
- `oxygen` — dissolved oxygen (μmol/kg)
- `nitrate`, `phosphate`, `silicate` — nutrients (μmol/kg) — sparse outside CTD/OSD
- `chlorophyll`, `pH`, `alkalinity` — even sparser; mostly modern CTD
- `pressure` — dbar (depth proxy)
