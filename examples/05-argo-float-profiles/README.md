# Argo float profiles around Hawaii

A real research prompt — and a valuable lesson in catalog interpretation.

## What this teaches

- The `GADR` collection indexes Argo floats at the **float level** (one item per float, lifetime bbox), not per-profile
- Why a Hawaii bbox query can return Southern Ocean floats — and how to spot the mismatch using `column_stats_summary`
- When to escalate from AQUAVIEW's discovery layer to the underlying GDAC's spatial index

**Source used**: `GADR` — Global Argo Data Repository, NOAA NCEI

---

## Prompt

```
Find Argo float profiles within 200 km of Hawaii from March 2026. I want
profiles where the float reached at least 1500 dbar pressure (deep dives).
Summarize the temperature range observed and give me a few download links.
```

## Transcript

### 1. Scope to GADR + Hawaii bbox + March 2026 + deep dives

```python
search_datasets(
  collections = "GADR",
  bbox = "-161,18,-154,23",
  datetime = "2026-03-01T00:00:00Z/2026-03-31T23:59:59Z",
  filter = {
    "op": ">=",
    "args": [
      {"property": "aquaview:column_stats_summary.variables.Pressure.max"},
      1500
    ]
  }
)
```

> Returns 6 floats. Sample of the top 5:

| ID | Deployer | Pressure max (dbar) | Temp range (°C) | Salinity range |
|---|---|---|---|---|
| `argo_jma_7900868` | JMA | 3783.0 | -1.84 to 3.02 | 33.72–34.75 |
| `argo_coriolis_6902814` | French Coriolis Centre | 3551.1 | -1.87 to 2.35 | 33.79–34.74 |
| `argo_coriolis_3902129` | French Coriolis Centre | 3366.0 | -1.87 to 1.93 | 33.62–34.74 |
| `argo_aoml_7900678` | NOAA AOML | 4605.3 | -1.86 to 3.51 | 33.06–34.75 |
| `argo_aoml_5905269` | NOAA AOML | 4789.4 | -1.86 to 4.49 | 33.74–34.75 |

### 2. Sanity check — these don't look like Hawaiian water

The temperature ranges (`-1.87 to 2.35 °C` etc.) are oceanographically inconsistent with Hawaii. Hawaiian surface waters run 23–27 °C; profiles in the central N. Pacific don't get colder than ~2 °C until well below 1500 m, and even then the surface min is far above zero. These are **Southern Ocean / Antarctic floats**.

Inspecting the bbox of `argo_jma_7900868`: `116.11°E, -63.76°S, -81.0°W, 90.0°N`. That's a polygon spanning from the western Pacific across the antimeridian to South America, latitudes from -64°S to 90°N — basically half the globe. That's how a Southern Ocean float ended up matching a Hawaii spatial filter.

### 3. Why this happens

AQUAVIEW's `GADR` collection stores **one STAC item per Argo float**, with `bbox` being the rectangular envelope of all profile locations across the float's lifetime. Highly-mobile floats (and floats with antimeridian-crossing trajectories) can have bboxes that encompass huge regions they never actually visited. Six items match the Hawaii bbox; none of them are oceanographically near Hawaii.

### 4. The right tool for this prompt

AQUAVIEW is a **discovery** layer for Argo at the float level. To find profiles geographically near Hawaii in March 2026, the right path is:

1. Use AQUAVIEW to **discover candidate floats and grab their GDAC URLs** (we did that — got the JMA / Coriolis / AOML floats).
2. Pull the per-profile NetCDF from GDAC and filter on actual `latitude` / `longitude` of each profile cycle. The IFREMER GDAC at <https://data-argo.ifremer.fr/dac/> provides per-cycle profile files.
3. Or use the Argo project's spatial selection tool at <https://erddap.ifremer.fr/erddap/> which queries on per-profile coordinates rather than lifetime bboxes.

## Result the agent gave

> *"Important caveat first: the prompt asks for Argo profiles 'within 200 km of Hawaii' but AQUAVIEW's `GADR` collection indexes floats at the float level, with `bbox` set to each float's lifetime trajectory envelope. Six floats match the Hawaii spatial + March 2026 temporal filter (and the deep-dive pressure constraint), but inspecting their `column_stats_summary` reveals temperature ranges of -1.87 to 4.49 °C — these are Southern Ocean / Antarctic floats whose bboxes happen to cross the antimeridian and encompass Hawaii. None of them are oceanographically near Hawaii.*
>
> *The catalog returns:*
> - *`argo_jma_7900868` (JMA), `argo_aoml_7900678`, `argo_aoml_5905269` (NOAA AOML), `argo_coriolis_6902814`, `argo_coriolis_3902129` (French Coriolis), and one more.*
> - *All have polar lifetime bboxes (e.g. `116°E to -81°W, -64°S to 90°N`) and tropical-incompatible temperature ranges.*
>
> *To answer the original question — Argo profiles actually near Hawaii in March 2026 — pull profile-level data from the IFREMER GDAC (https://data-argo.ifremer.fr/dac/) and filter on per-cycle latitude/longitude. AQUAVIEW's value here is identifying the float catalog and providing per-float download URLs; profile-level spatial filtering is the GDAC's job.*
>
> *Lesson: when a `column_stats_summary` field looks oceanographically wrong for the region you queried, you've probably hit the lifetime-bbox-envelope artifact. Use temperature as a sanity check and escalate to the source's per-profile index."*

## Variations

- **Filter on temperature** to enforce tropical: add a clause `aquaview:column_stats_summary.variables.Temperature.min >= 15`.
- **Different region**: California Current `-127,32,-117,42` — narrow, less polar-bbox contamination.
- **Specific float by WMO ID**: `q = "argo 7900869"`, no bbox.
- **All deep dives globally last year**: drop `bbox`, set `datetime = "2025-01-01T00:00:00Z/2025-12-31T23:59:59Z"`, filter `Pressure.max >= 4000`. Useful for finding abyssal-depth profilers without spatial scoping.

## Related examples

- [`07-glider-missions/`](../07-glider-missions/) — same idea, different platform (gliders vs floats)
- [`12-arctic-sea-ice/`](../12-arctic-sea-ice/) — Argo data combined with PolarWatch sea ice
- [`advanced/cql2-filtering.md`](../advanced/cql2-filtering.md) — more on `column_stats_summary` filters
