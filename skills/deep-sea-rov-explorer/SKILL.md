---
name: deep-sea-rov-explorer
description: Use when the user asks about ROV dives, deep-sea video, NOAA Okeanos Explorer, SeaTube, submersibles, hydrothermal vents, abyssal exploration, or specifies very deep targets (>1000 m, "deep sea", "midwater", "benthic"). Encodes how to query HYPERION (Okeanos Explorer) and SEATUBE (Ocean Networks Canada video archive), the dive metadata model, and depth filtering via CQL2.
---

# Deep-sea ROV explorer

Two AQUAVIEW collections cover ROV / deep-submersible operations:

| Collection | Source | What's in it |
|---|---|---|
| `HYPERION` | NOAA Okeanos Explorer | Dive metadata, navigation, sample logs, annotation streams |
| `SEATUBE` | Ocean Networks Canada (ONC) | ROV / submersible video archive with timestamped annotations |

See [`dive-data-model.md`](dive-data-model.md) for the per-dive data structure.

## Quick collection picker

| User wants… | Collection |
|---|---|
| US-led deep-sea expeditions (Pacific, Atlantic, GoM) | `HYPERION` |
| Northeast Pacific cabled-observatory video, BC waters | `SEATUBE` |
| Both | Search both collections |

## Pattern: "ROV dives near X" / "deep-sea video off Y"

```
search_datasets(
  collections=["HYPERION", "SEATUBE"],
  bbox=<bbox>,
  datetime="<start>/<end>",
  limit=25
)
```

Each item represents one dive (Okeanos) or one video segment (SeaTube).

## Pattern: depth-filtered dives

> "ROV dives below 2000 m off the West Coast."

```
search_datasets(
  collections=["HYPERION"],
  bbox=[-128, 40, -120, 48],
  datetime="<start>/<end>",
  filter="properties->>'cube:variables'->>'depth'->>'max' >= 2000",
  filter_lang="cql2-text",
  limit=20
)
```

Or filter on dive `max_depth_m` if exposed as a direct property:

```
filter="properties.dive:max_depth_m >= 2000"
```

(Inspect a sample item to confirm the property path.)

## Pattern: feature-targeted (vents, seamounts, methane seeps)

The `q` field works well for feature types:

```
search_datasets(
  collections=["HYPERION"],
  q="hydrothermal vent",
  datetime="2010-01-01/2024-12-31",
  limit=30
)
```

Common feature keywords:
- "hydrothermal vent", "black smoker"
- "seamount", "guyot"
- "methane seep", "cold seep", "brine pool"
- "coral garden", "deep-sea coral"
- "abyssal plain", "abyssal hill"
- "trench" (Mariana, Tonga, Kermadec, Puerto Rico)
- "canyon" (Monterey, Hudson, etc.)

## Dive metadata model

A typical dive item contains:

- **Identity:** dive ID (e.g., `EX2204_DIVE05` for Okeanos), expedition ID, ship name
- **Spatial:** bbox of dive track (start → max-depth → end), max depth, dive duration
- **Navigation:** dense lat/lon/depth track, often as a separate asset
- **Annotations:** timestamped biological / geological observations
- **Samples:** physical samples collected (rock, sediment, biological), with sample IDs
- **Video:** master recording link (often HD or 4K)

For `SEATUBE`, items are usually individual video segments with annotations attached, not full dives.

## Cross-reference with bathymetry

For context on what's at the dive site:

```
1. Get dive site bbox
2. search_datasets(
     collections=["BATHYMETRY"],
     bbox=<small bbox around dive>,
     limit=5
   )
3. Combine to interpret what features the dive crossed (canyon walls, ridge crest, etc.)
```

## Common variables

For dives that include CTD-on-ROV data:

- `temp` — water temperature (°C)
- `salinity` — practical salinity
- `oxygen` — dissolved oxygen (μmol/kg or mg/L)
- `depth` — depth (m); same as pressure for practical purposes
- `turbidity` — typically NTU
- `chlorophyll` — fluorometer-derived

## Output assets to expect

- **Navigation tracks**: CSV or NetCDF with timestamped lat/lon/depth
- **Annotation logs**: CSV with timestamp, observer, taxon / feature label, comments
- **Sample manifests**: CSV listing each sample collected with metadata
- **Video links**: typically links to NOAA Ocean Exploration archive or ONC SeaTube portal (streaming, not direct download)

## Worked example

> "List ROV dives by NOAA Okeanos Explorer with deep-sea video in 2023."

```
search_datasets(
  collections=["HYPERION"],
  datetime="2023-01-01/2023-12-31",
  q="ROV dive",
  limit=30
)
```

Then for each item:
- Summarize: dive ID, expedition, region, max depth, duration
- Pull video link from `assets`
- Optionally: count annotations to highlight scientifically dense dives

## Pitfalls

- **Live cruises lag in the catalog.** Okeanos data appears in `HYPERION` after post-cruise processing — typically 3-12 months after the dive.
- **Video files are large.** Don't suggest downloading raw video unless the user asks. Provide the streaming link instead.
- **SEATUBE is mostly Northeast Pacific.** For Atlantic / Gulf coverage, prefer `HYPERION`.
