# Underwater glider missions — Mid-Atlantic Bight & Gulf Stream

Find autonomous underwater glider deployments in a region, with full QARTOD-flagged variable lists and per-mission metadata.

## What this teaches

- Using the `IOOS` collection (Glider Data Assembly Center)
- Reading mission-level metadata (institution, deployment dates, project)
- Filtering on a wide bbox spanning shelf and open ocean

**Source used**: `IOOS` (IOOS Glider Data Assembly Center, ERDDAP)

---

## Prompt

```
Show me underwater glider missions in the Mid-Atlantic / Gulf Stream
region. I'm interested in long deployments and shelf surveys. Give me
the mission metadata and ERDDAP links.
```

## Transcript

### 1. Scope to Mid-Atlantic + Gulf Stream

```python
search_datasets(
  collections = "IOOS",
  bbox = "-77,35,-69,42",
  limit = 10
)
```

Real results include:

| Mission ID | Institution | Description |
|---|---|---|
| `sp213-20260317T1523` | Woods Hole Oceanographic Institution | *Spray glider Gulf Stream crossing — mission spanning Miami to Cape Cod, ~100 days, 6–10 stream crossings, 800+ profiles to 1000 m* |
| `ru28-20140815T1405` | Rutgers University | *NJ shelf dissolved-oxygen survey, August 2014* |
| `ru28-20140717T1432` | Rutgers University | *NJ shelf dissolved-oxygen survey, July 2014* |

Each mission is a STAC `TrajectoryProfile` item with QARTOD-flagged variables: `temperature`, `salinity`, `conductivity`, `density`, `pressure`, `chlorophyll_a` (mission-dependent), `doxy` (dissolved oxygen, mission-dependent), and full `qartod_*_primary_flag` quality columns.

### 2. Get a sample mission's ERDDAP page

```python
get_item(collection = "IOOS", item_id = "sp213-20260317T1523")
```

> Asset includes the ERDDAP tabledap form, NetCDF download, CSV/JSON variants, and ISO 19115 metadata XML.

## Result the agent gave

> *"13 glider missions in the Mid-Atlantic / Gulf Stream bbox. Most recent + most notable:*
>
> - ***`sp213-20260317T1523`*** *— Woods Hole Oceanographic Institution Spray glider, mission deployed 2026-03-17. Per the catalog description, this is part of the **Gliders in the Gulf Stream** project: each mission lasts ~100 days, with the glider being advected from Miami to Cape Cod while making 6–10 stream crossings and returning ~800 profiles to 1000 m or seafloor depth. The bbox -80.26°W to -50.24°W, 20.37°N to 35.92°N reflects the ambitious downstream advection.*
> - ***`ru28-20140815T1405`*** *and ***`ru28-20140717T1432`*** *— Rutgers University deployments on the NJ shelf in summer 2014, described as 'measure dissolved oxygen levels in the shallow coastal waters of New Jersey.' Smaller bboxes (-74.78°W to -73.84°W) reflecting shelf-only operation.*
>
> *Each item is a STAC `TrajectoryProfile` carrying QARTOD-flagged variables (temperature, salinity, conductivity, density, pressure, plus chlorophyll/dissolved-oxygen depending on payload). Download via the IOOS Glider DAC ERDDAP at https://gliders.ioos.us/erddap — select dataset → variable subset → format (NetCDF, CSV, OPeNDAP, ISO 19115)."*

## Variations

- **Specific platform**: filter `q = "spray"` for Spray gliders only, `q = "slocum"` for Slocum gliders.
- **Active missions only**: combine with a recent `datetime = ".."` open-ended range.
- **Cross-source**: also include `SPRAY` (Scripps Spray Data Server) and `VOICE_OF_THE_OCEAN` (VOTO Foundation) for non-IOOS glider data.
- **Variables filter**: filter on `aquaview:column_stats_summary.variables.Dissolved Oxygen.count > 0` to find missions that recorded DO.

## Related examples

- [`05-argo-float-profiles/`](../05-argo-float-profiles/) — Argo floats vs. gliders, similar idea different platform
- [`19-regional-deep-dives/`](../19-regional-deep-dives/) — MARACOOS hosts a strong Mid-Atlantic glider program
