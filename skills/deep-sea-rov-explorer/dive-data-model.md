# Dive data model

Reference for the per-dive data structures returned by `HYPERION` and `SEATUBE`.

## Item types

### Okeanos Explorer dive (`HYPERION`)

One item per dive (typical 4–8 hour dive on a 30-day cruise).

```
{
  "id": "EX2204_DIVE05",
  "properties": {
    "expedition_id": "EX2204",
    "dive_id": "DIVE05",
    "vehicle": "D2",                    # ROV Deep Discoverer
    "ship": "Okeanos Explorer",
    "max_depth_m": 2843,
    "dive_duration_h": 6.5,
    "datetime_on_bottom": "2022-07-15T13:42Z",
    "datetime_off_bottom": "2022-07-15T20:15Z",
    "feature_target": "Cretaceous Seamount",
    "annotation_count": 412,
    "sample_count": 18,
    "cube:variables": {
      "depth": {"min": 1500, "max": 2843},
      "temp":  {"min": 1.7, "max": 4.2}
    }
  },
  "assets": {
    "navigation": {...},          # CSV of lat/lon/depth/time
    "annotations": {...},          # CSV of timestamped observations
    "sample_manifest": {...},
    "video": {...},                # streaming link
    "preview": {...}               # thumbnail
  }
}
```

### SeaTube video segment (`SEATUBE`)

One item per annotated video segment (typically 15-60 min).

```
{
  "id": "SEATUBE_<dive>_<segment>",
  "properties": {
    "dive_id": "...",
    "datetime_start": "...",
    "datetime_end": "...",
    "depth_at_start_m": 1850,
    "annotation_count": 23,
    "annotators": ["..."],
    "tags": ["coral", "rockfish", "geological"]
  },
  "assets": {
    "video_segment": {...},
    "annotations": {...}
  }
}
```

## Annotation types

Annotations are the scientific output of a dive. Common annotation categories:

| Category | Examples |
|---|---|
| Biological | Coral species, fish observations, invertebrates, microbial mats |
| Geological | Pillow lavas, fault scarps, sediment cover, vent chimneys |
| Habitat | Hard substrate, soft substrate, biocover percent |
| Behavior | Feeding, burrowing, schooling |
| Sampling | Rock collected, biological collected, sediment push core |

Each annotation typically has:

- Timestamp (UTC)
- Lat/lon/depth (interpolated from navigation)
- Observer initials
- Taxonomic identification (where applicable, with WoRMS ID)
- Feature label / category
- Free-text comment

## Sample types

Samples collected during a dive:

| Type code | Description |
|---|---|
| ROCK | Rock chunk via manipulator arm |
| BIO | Biological specimen |
| WATER | Water bottle (Niskin) |
| PUSH | Sediment push core |
| MET | Microbial mat |
| GAS | Gas / fluid |
| TARGET | Calibration target |

Each sample has a sample ID (e.g., `EX2204_05_BIO04` = expedition 2204, dive 05, biological sample 04).

## Navigation track structure

```
time_utc, lat, lon, depth_m, heading, pitch, roll
2022-07-15T13:42:00Z, 26.34521, -82.45123, 2843.2, 045.1, -3.2, 0.5
2022-07-15T13:42:01Z, 26.34520, -82.45124, 2842.8, 045.0, -3.3, 0.4
...
```

Sampling rate is typically 1 Hz. Total points per dive: ~25,000 for a 7-hour dive.

## Cross-walk: dive ID → annotations → samples → video

The full chain:

```
1. get_item(dive_id)                                 # full dive metadata
2. Download `annotations` asset                      # CSV with all observations
3. Download `sample_manifest` asset                  # sample IDs + locations
4. Use `video` asset URL to play matching segments   # streaming
5. (optional) Cross-reference annotations with WoRMS for taxonomy
```

## Worked join

To map "all coral observations from EX2204 dive 5":

```python
import pandas as pd
ann = pd.read_csv(annotations_url)
coral = ann[ann["category"] == "biological"][ann["taxon"].str.contains("coral", case=False)]
print(coral[["time_utc", "lat", "lon", "depth_m", "taxon", "comment"]])
```
