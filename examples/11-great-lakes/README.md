# Great Lakes — Lake Michigan buoys and limnology

Find Great Lakes monitoring buoys, water-temperature data, and ecosystem records — the freshwater equivalent of the marine NDBC/CO-OPS workflow.

## What this teaches

- Combining `GLERL`, `NOAA_GLERL`, and `GLOS` for Great Lakes coverage
- Reading the wide variable list typical of multi-instrument buoys
- Finding coastal monitoring stations near a specific city (Waukegan / Winthrop Harbor)

**Sources used**: `GLERL`, `NOAA_GLERL`, `GLOS`

---

## Prompt

```
Show me real-time water temperature, wave, and current monitoring buoys
in southwest Lake Michigan near Chicago / Waukegan.
```

## Transcript

### 1. Scope to SW Lake Michigan

```python
search_datasets(
  collections = "GLERL,NOAA_GLERL,GLOS",
  bbox = "-90,41,-83,46",
  limit = 5
)
```

Real top hits in the Waukegan area:

| ID | Title | Location | Sensor |
|---|---|---|---|
| `obs_88_adcp_latest` | Winthrop Harbor Buoy 45187 | -87.78, 42.49 | ADCP currents |
| `obs_87_latest` | Waukegan coastal monitoring buoy 45186 | -87.80, 42.37 | Met + waves + SST |
| `obs_87_adcp_latest` | Waukegan buoy 45186 | -87.80, 42.37 | ADCP currents |

Both buoys are operated by the Illinois State Geological Survey (Univ. of Illinois) with funding from Illinois CMP and ongoing service by LimnoTech. Variables include `air_pressure`, `air_temperature`, `sea_surface_temperature`, `sea_surface_wave_significant_height`, `sea_surface_wave_period_at_variance_spectral_density_maximum`, `wind_speed`, `wind_speed_of_gust`, plus full ADCP velocity profiles (`eastward/northward/upward_sea_water_velocity` by depth bin).

### 2. Get a buoy's ERDDAP page

```python
get_item(collection = "GLOS", item_id = "obs_87_latest")
```

> Asset list includes the ERDDAP tabledap form (`https://seagull-erddap.glos.org/erddap/tabledap/obs_87_latest.html`) plus all standard formats (CSV, NetCDF, JSON, ISO 19115).

## Result the agent gave

> *"Two buoys near the southwestern Lake Michigan shore:*
>
> - ***Buoy 45186 (Waukegan)*** — full meteorological + wave + temperature suite, plus ADCP current profiles. Live data: https://seagull-erddap.glos.org/erddap/tabledap/obs_87_latest.html*
> - ***Buoy 45187 (Winthrop Harbor)*** — ADCP currents (eastward, northward, upward velocity by depth). Live data: https://seagull-erddap.glos.org/erddap/tabledap/obs_88_adcp_latest.html*
>
> *Both are owned by the Illinois State Geological Survey at the University of Illinois Urbana-Champaign, deployed annually since 2018."*

## Variations

- **Lake Erie / Lake Ontario**: change bbox — for Lake Erie use `-83.5,41.3,-78.8,43.0`.
- **Ice cover**: query `q = "ice cover"` within `GLERL,NOAA_GLERL` to find seasonal ice products.
- **Long-term water levels**: `COOPS` includes Great Lakes tide-gauge-equivalent stations (e.g., `coops_9087031` Calumet Harbor).
- **Ecosystem / harmful algal blooms**: GLERL operates HAB tracking products in western Lake Erie.

## Related examples

- [`04-tides-and-storm-surge/`](../04-tides-and-storm-surge/) — the marine equivalent (CO-OPS)
- [`08-ocean-color-chlorophyll/`](../08-ocean-color-chlorophyll/) — Great Lakes also have HAB products
