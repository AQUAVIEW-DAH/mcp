---
name: argo-profile-explorer
description: Use when the user asks about Argo floats — phrases like "Argo profiles near …", "find floats that reached … dbar", "Core / Deep / BGC Argo", "subsurface temperature near {location}", or specific WMO float IDs. Encodes how to query the GADR collection with depth thresholds via CQL2 and how to distinguish Core / Deep / BGC programs.
---

# Argo profile explorer

The Global Argo Data Repository is exposed as the `GADR` collection. Argo provides ~4,000 active autonomous profiling floats globally, drifting at 1000 m parking depth and surfacing every 10 days.

## Argo programs

| Program | Depth | Variables | Float density |
|---|---|---|---|
| **Core Argo** | 0–2000 m | T, S, P | ~3,800 active floats globally |
| **Deep Argo** | 0–6000 m | T, S, P | ~250 active floats; concentrated in select basins |
| **BGC-Argo** | 0–2000 m | T, S, P + O₂, chlorophyll-a, NO₃, pH, suspended particles, irradiance | ~600 active floats globally |

To filter for one of these programs, combine bbox/time with a CQL2 depth or variable filter.

## Pattern: profiles near a region within a time window

```
search_datasets(
  collections=["GADR"],
  bbox=<bbox from `bbox-from-region`>,
  datetime="<start>/<end>",
  limit=25
)
```

The default returns up to 25 most-recent profiles within the scope.

## Pattern: depth-filtered (Deep Argo selection)

```
search_datasets(
  collections=["GADR"],
  bbox=<bbox>,
  datetime="<start>/<end>",
  filter="properties->>'cube:variables'->>'pres'->>'max' >= 2500",
  filter_lang="cql2-text",
  limit=25
)
```

`pres >= 2500` dbar is a strong proxy for a Deep Argo float (Core Argo tops out near 2000 dbar).

## Pattern: shallow profiles only

For boundary-layer / mixed-layer studies:

```
filter="properties->>'cube:variables'->>'pres'->>'max' < 200"
```

This catches truncated profiles that didn't dive (often during ice-cover season at high latitudes — useful for sea-ice avoidance algorithms).

## Pattern: BGC-Argo only

The BGC subset reports oxygen, chlorophyll, etc. To filter:

```
filter="properties->>'cube:variables'->>'oxygen'->>'mean' IS NOT NULL"
```

Or explicitly:

```
filter="properties->>'cube:variables'->>'chla'->>'mean' IS NOT NULL"
```

## Pattern: minimum-pressure threshold (e.g., "reached at least 1000 m")

```
filter="properties->>'cube:variables'->>'pres'->>'max' >= 1000"
```

## Looking up a specific float by WMO ID

If the user provides a float WMO (e.g., "float 5905028"), search by it directly:

```
search_datasets(
  collections=["GADR"],
  q="5905028",
  datetime="<wide range>",
  limit=200
)
```

The float ID typically appears in the item ID and in the `wmo` property.

## Argo vs WOD vs IOOS gliders

| Want | Collection | Skill |
|---|---|---|
| Real-time autonomous T/S profiles | `GADR` | this skill |
| Historical / reprocessed archive | `WOD` (cast type `PFL`) | `wod-profile-explorer` |
| Coastal underwater glider deployments | `IOOS`, `MARACOOS`, `OOI`, `SPRAY` | `glider-mission-tracker` |

## Variable cheatsheet for `cube:variables` filters

| Variable | Units | Notes |
|---|---|---|
| `temp` | °C | In-situ temperature |
| `psal` or `salinity` | PSU | Practical salinity |
| `pres` | dbar | Pressure (proxy for depth, ~1 dbar per meter) |
| `oxygen` or `doxy` | μmol/kg | BGC-Argo only |
| `chla` | mg/m³ | BGC-Argo only |
| `nitrate` | μmol/kg | BGC-Argo only, very sparse |
| `ph_in_situ_total` | unitless | BGC-Argo only |

(Verify with one item's `properties.cube:variables` keys before authoring filters.)

## Worked example

> "Find Argo float profiles within 200 km of Hawaii in March 2026 with min pressure under 10 dbar."

```
1. Get Hawaii bbox from `bbox-from-region` skill: [-160.5, 18.5, -154.5, 22.5]
2. search_datasets(
     collections=["GADR"],
     bbox=[-162.5, 16.5, -152.5, 24.5],   # ~200 km buffer
     datetime="2026-03-01/2026-03-31",
     filter="properties->>'cube:variables'->>'pres'->>'min' < 10",
     filter_lang="cql2-text",
     limit=20
   )
3. For each item, get_item to retrieve asset URLs, then download NetCDF
```
