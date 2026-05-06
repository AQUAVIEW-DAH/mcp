# Deep-sea exploration — Okeanos Explorer & Ocean Networks Canada

Find ROV (remotely operated vehicle) dive missions and the deep-sea video footage they collected.

## What this teaches

- Two complementary sources for deep-sea video: NOAA `HYPERION` (Okeanos Explorer) and `SEATUBE` (Ocean Networks Canada)
- The dive-as-item structure (one STAC item per dive)
- Asset key `video_chunks` for accessing segmented dive video

**Sources used**: `HYPERION`, `SEATUBE`

---

## Prompt

```
Find NOAA Okeanos Explorer ROV dives in the Pacific. List the missions
and tell me how to access the dive video.
```

## Transcript

### 1. List recent Okeanos Explorer dives

```python
search_datasets(collections = "HYPERION", limit = 5)
```

Real items include:

| ID | Mission / Dive | Location | Date |
|---|---|---|---|
| `cHJpdmF0ZS9QUzI1MjMvUk9WMDI` | PS2523 — ROV02 | -118.24, 34.05 | 2025-08-10 |
| `cHJpdmF0ZS9QUzI1MjMvUk9WMDE` | PS2523 — ROV01 | -118.25, 34.05 | 2025-08-11 |
| `cHVibGljL0VYMTcwOC9FWDE3MDhfRElWRTE1XzIwMTcwOTIx` | EX1708 — DIVE15 | -161.67, 28.69 | 2017-09-21 |

> Note: item IDs are base64-encoded GCS paths. Each item is a single dive with associated video chunks.

Asset keys: `video_chunks` (list of MP4 segments). The provider links back to NOAA's Ocean Exploration Data Atlas at `https://www.ncei.noaa.gov/maps/ocean-exploration-data-atlas/`.

### 2. Get a dive's video manifest

```python
get_item(collection = "HYPERION", item_id = "cHVibGljL0VYMTcwOC9FWDE3MDhfRElWRTE1XzIwMTcwOTIx")
```

> Returns the dive item with `video_chunks` asset (MP4 segments) plus the catalog-level metadata.

### 3. Cross-source: Ocean Networks Canada SeaTube

```python
search_datasets(collections = "SEATUBE", limit = 5)
```

> Same dive-as-item shape, but ROV expeditions from ONC's SeaTube platform (different geographic focus — ONC's coverage is heavy in BC, the Salish Sea, and Pacific deep-sea cabled observatories).

## Result the agent gave

> *"HYPERION currently indexes 14 ROV dive items. Three notable from a `limit=5` sample:*
>
> - ***EX1708 / DIVE15*** *(item ID `cHVibGljL0VYMTcwOC9FWDE3MDhfRElWRTE1XzIwMTcwOTIx`) — Okeanos Explorer expedition EX1708, dive 15, 2017-09-21. Single-point geometry at -161.67°W, 28.69°N (central North Pacific). Public dataset.*
> - ***PS2523 / ROV02*** *(`cHJpdmF0ZS9QUzI1MjMvUk9WMDI`) — 2025-08-10. Title carries `(Private)` suffix. Bbox -118.24°W to -118.24°W, 34.05°N to 34.06°N — Southern California coastal.*
> - ***PS2523 / ROV01*** *(`cHJpdmF0ZS9QUzI1MjMvUk9WMDE`) — 2025-08-11, paired with the dive above.*
>
> *Item IDs are base64-encoded GCS paths (the prefix `cHVibGljLw` decodes to `public/`, `cHJpdmF0ZS8` to `private/`). Each dive's primary asset is `video_chunks` — a list of MP4 segment URLs. The catalog landing page links to NOAA's Ocean Exploration Data Atlas at https://www.ncei.noaa.gov/maps/ocean-exploration-data-atlas/ for dive maps, expedition reports, and contextual metadata.*
>
> *For complementary ROV coverage in the Pacific Northwest and Salish Sea — Ocean Networks Canada's cabled observatory program — query the `SEATUBE` collection."*

## Variations

- **Specific mission ID**: `q = "EX1708"` to find all dives from that expedition.
- **Specific region**: tighten the bbox to e.g. the Mariana Trench, Hawaiian seamounts, or a specific feature.
- **Public-only dives**: SeaTube dives are fully public; HYPERION mixes public and private — check the title for the `(Private)` suffix.

## Related examples

- [`17-bathymetry/`](../17-bathymetry/) — pair dive locations with hydrographic surveys
- [`16-biogeochemistry/`](../16-biogeochemistry/) — combine dive observations with cruise biogeochemistry
