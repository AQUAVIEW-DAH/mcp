# Arctic ocean — sea surface temperature, sea ice, ocean color from PolarWatch

Find satellite-derived polar ocean products from NOAA PolarWatch and combine with in-situ observations.

## What this teaches

- The `POLARWATCH` collection's product family (SST, sea ice, ocean color, winds, salinity)
- Picking between daily / weekly / monthly composites
- Combining satellite polar products with Argo and IOOS-AOOS data for in-situ context

**Sources used**: `POLARWATCH`, `GADR`, `AOOS`

---

## Prompt

```
Show me satellite ocean products covering the Alaska / Bering Sea
region. I want sea surface temperature, sea ice coverage, and any
related polar oceanographic data.
```

## Transcript

### 1. Scope to PolarWatch

```python
search_datasets(
  collections = "POLARWATCH",
  q = "sea ice",
  limit = 5
)
```

> 147 matching products (free-text `sea ice` is OR-tokenised so it matches "sea" and "ice" hits broadly). Top of the list — the VIIRS SST series for the Alaska region:

| ID | Title | Resolution |
|---|---|---|
| `viirs_noaa20_ak_750m_daily` | SST, VIIRS NOAA-20, Alaska, 750 m, Science Quality Daily | 750 m |
| `viirs_noaa20_ak_750m_weekly` | Same product, weekly composite | 750 m |
| `viirs_noaa20_ak_750m_monthly` | Same product, monthly composite | 750 m |

Provider: NOAA/NESDIS/STAR/CoastWatch/PolarWatch. Bbox: `-179.99, 50.00 → -125.01, 74.99`. ERDDAP: `https://polarwatch.noaa.gov/erddap`.

PolarWatch also hosts sea-ice concentration / extent products (e.g., DMSP SSMIS, AMSR-2 derived) — narrow with `q = "sea ice concentration"`.

### 2. Combine with in-situ Argo

```python
search_datasets(
  collections = "GADR",
  bbox = "-180,55,-150,72",
  limit = 5
)
```

> Returns Argo profiling floats deployed in the Bering Sea / Gulf of Alaska that complement the satellite SST grid with vertical profile data.

### 3. AOOS for coastal moorings

```python
search_datasets(
  collections = "AOOS",
  bbox = "-180,55,-130,72",
  limit = 5
)
```

> Buoys, gliders, and HF radar from the Alaska Ocean Observing System — the regional IOOS RA for Alaska.

## Result the agent gave

> *"PolarWatch holds 147 items matching the Alaska / Bering Sea bbox + 'sea ice OR sea surface temperature' query. The top of the list is the **VIIRS NOAA-20 ACSPO SST series** for the Alaska region, processed by NOAA NESDIS / STAR / CoastWatch / PolarWatch:*
>
> - *`viirs_noaa20_ak_750m_daily` — daily composite, 750 m resolution*
> - *`viirs_noaa20_ak_750m_weekly` — weekly composite*
> - *`viirs_noaa20_ak_750m_monthly` — monthly composite*
>
> *Coverage bbox: -179.99°W to -125.01°W, 50.00°N to 74.99°N (Alaska + Bering + Gulf of Alaska + Arctic Coast). The data is derived via ACSPO (Advanced Clear-Sky Processor for Oceans). ERDDAP: https://polarwatch.noaa.gov/erddap.*
>
> *For sea-ice concentration / extent products specifically (e.g., DMSP SSMIS, AMSR-2 derived), narrow with `q='sea ice concentration'` — the broader query I ran also returns those, but they're below the SST hits in the result list.*
>
> *To complement the satellite SST with in-situ data, search `GADR` (global Argo) and `AOOS` (Alaska Ocean Observing System) with the same bbox. Note: the GADR collection indexes floats at the float-level with lifetime bbox, so use temperature `column_stats_summary` as a sanity check that the floats are actually subarctic — see [`05-argo-float-profiles/`](../05-argo-float-profiles/) for that gotcha."*

## Variations

- **Antarctic**: bbox `-180,-90,180,-60` for Southern Ocean PolarWatch products.
- **Sea ice trend**: aggregate by `datetime_frequency_interval = "month"` over a 5–10 year window.
- **Specific sensor**: filter `q = "AMSR-2"` or `q = "SSMIS"` for passive microwave sea-ice products only.

## Related examples

- [`05-argo-float-profiles/`](../05-argo-float-profiles/) — Argo data shape (apply to Bering Sea bbox)
- [`19-regional-deep-dives/`](../19-regional-deep-dives/) — AOOS deep dive
