# Ocean color, chlorophyll, and harmful algal blooms

Find satellite-derived chlorophyll, ocean color, and harmful-algal-bloom (HAB) forecast products for a coastal region.

## What this teaches

- Discovering CoastWatch's HAB and ocean-color product family
- Combining gridded satellite ocean color with in-situ measurements
- Reading product variable lists for derived fields (`chla_filled`, reflectances, etc.)

**Sources used**: `COASTWATCH`, `COASTWATCH_WC`, `NEFSC`

---

## Prompt

```
Find satellite ocean-color and chlorophyll products for the U.S. West
Coast. I want products that include harmful algal bloom indicators if
available.
```

## Transcript

### 1. Free-text + scoped collections

```python
search_datasets(
  q = "chlorophyll",
  collections = "COASTWATCH,COASTWATCH_WC,NEFSC",
  limit = 5
)
```

Real top hit:

| ID | Title |
|---|---|
| `wvcharmV3_3day_LonPM180` | *C-HARM v3.1 3-Day Forecast — Pseudo-nitzschia, cellular & particulate domoic acid, gap-filled chlorophyll-a, 486 nm and 551 nm reflectances, salinity, water temperature — California & Southern Oregon coast, 2022-present* |
| `wvcharmV3_3day` | (same product, alternate longitude convention) |
| `wvcharmV3_2day_LonPM180` | C-HARM 2-day forecast variant |

Provider: NOAA NMFS SWFSC ERD / CoastWatch West Coast. ERDDAP host: `https://coastwatch.pfeg.noaa.gov/erddap`. Coverage bbox: `-127.5, 31.3, -117.0, 43.0` (CA + S. Oregon).

The C-HARM product blends near-real-time S-NPP VIIRS gap-filled chlorophyll, 486/551 nm reflectance, and SST/salinity/currents from the WCOFS ROMS model to produce probability-of-Pseudo-nitzschia and probability-of-domoic-acid grids.

### 2. Get the ERDDAP form

```python
get_item(collection = "COASTWATCH_WC", item_id = "wvcharmV3_3day_LonPM180")
```

> Returns ERDDAP griddap URL with all access formats (`asc`, `csv`, `csvp`, `dods`, `nc`, `geotif`, `kml`, `json`, …).

## Result the agent gave

> *"544 chlorophyll-tagged items across the three queried collections. Top of the list is the **C-HARM v3.1** product family from CoastWatch West Coast (NOAA NMFS SWFSC ERD):*
>
> - *`wvcharmV3_3day_LonPM180` and `wvcharmV3_3day` — 3-day forecast variants*
> - *`wvcharmV3_2day_LonPM180` — 2-day forecast variant*
>
> *C-HARM is California / Southern Oregon's operational HAB forecast. It outputs probability of Pseudo-nitzschia exceeding 10,000 cells/L, probability of particulate domoic acid > 500 ng/L, and probability of cellular domoic acid > 10 pg/cell. Inputs blended into the model include S-NPP VIIRS gap-filled chlorophyll-a, 486 nm and 551 nm reflectance, surface salinity / SST / currents from the WCOFS ROMS regional model. Coverage bbox: -127.5°W to -117.0°W, 31.3°N to 43.0°N. ERDDAP griddap form: https://coastwatch.pfeg.noaa.gov/erddap/griddap/wvcharmV3_3day_LonPM180.html — supports NetCDF, GeoTIFF, KML, CSV, OPeNDAP.*
>
> *For non-HAB chlorophyll across other coastal regions, narrow the search by changing `q` (e.g., `q='VIIRS chlorophyll'`) and `bbox` for your region."*

## Variations

- **East Coast**: replace West-Coast collections with `NEFSC` and `COASTWATCH` for similar HAB+chlorophyll products in the Northeast.
- **Just chlorophyll, no HAB**: `q = "chlorophyll"` with `exclude_collections = "INCIDENT_NEWS"` and filter to `q` keyword `MODIS` or `VIIRS`.
- **Validation with in-situ**: also include `BCODM` (BCO-DMO) for cruise-based chlorophyll measurements.

## Related examples

- [`02-sea-surface-temperature/`](../02-sea-surface-temperature/) — pair SST with chlorophyll for upwelling analysis
- [`16-biogeochemistry/`](../16-biogeochemistry/) — in-situ biogeochemical observations
