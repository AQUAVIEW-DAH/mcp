# Canonical variable names

Use these when authoring CQL2 filters. The leftmost name is the most common across AQUAVIEW collections; the right column lists per-collection variants (verify by inspecting the first item's `cube:variables` keys before authoring a filter).

## Sea surface temperature

| Canonical | Variants seen in items |
|---|---|
| `sst` | `analysed_sst`, `sea_surface_temperature`, `SST_filled`, `temp` |

Units: degrees Celsius (most products) or Kelvin (some L4 blended products — check `cube:variables.<var>.unit`).

## Chlorophyll-a

| Canonical | Variants seen in items |
|---|---|
| `chl_a` | `chlor_a`, `chlorophyll_a`, `CHL`, `chlor_a_log` |

Units: milligrams per cubic meter (mg/m³).

## Ocean color reflectance

| Canonical | Variants seen in items |
|---|---|
| `rrs` | `Rrs_412`, `Rrs_443`, `Rrs_490`, `Rrs_555`, `Rrs_670` (per-band) |
| `nLw` | normalized water-leaving radiance, similar per-band split |

For these, you usually filter on `chl_a` or a derived index instead of raw Rrs.

## Sea ice

| Canonical | Variants seen in items |
|---|---|
| `ice_conc` | `sea_ice_fraction`, `ice_concentration`, `sic` |
| `ice_thickness` | `sea_ice_thickness`, `sit` |
| `ice_extent` | derived; usually computed downstream rather than as a per-item stat |

Ice concentration is fractional (0-1) or percentage (0-100) — check `cube:variables.<var>.unit`.

## Sea surface height / anomaly

| Canonical | Variants seen in items |
|---|---|
| `ssh` | `sea_surface_height`, `adt` (absolute dynamic topography) |
| `ssha` | `sea_surface_height_anomaly`, `sla` (sea level anomaly) |

## Wind (over ocean, satellite-derived)

| Canonical | Variants seen in items |
|---|---|
| `wind_speed` | `wind_spd`, `ws10` (10-m), `wind_speed_avg` |
| `wind_direction` | `wind_dir`, `wd10` |
| `u10` / `v10` | wind vector components |

## Reading an item's variable list (one-liner)

If unsure which name to use, search for one item and inspect:

```
result = search_datasets(collections=["COASTWATCH"], bbox=..., datetime=..., limit=1)
item = result["items"][0]
print(list(item["properties"]["cube:variables"].keys()))
```

This is cheap and prevents authoring filters with the wrong name.
