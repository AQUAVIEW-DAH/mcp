# CQL2 cookbook — 10 worked examples

Each example shows the user's plain-English request, the variable name to use, and the CQL2 filter string to pass as `filter="…"` with `filter_lang="cql2-text"`.

## 1. Big waves

> "Find buoy data where waves were over 6 metres."

Variable: `wave_height` (NDBC, CDIP)

```
properties->>'cube:variables'->>'wave_height'->>'max' > 6
```

## 2. Warm SST

> "SST above 28°C anywhere in the scene."

Variable: `sst` (COASTWATCH) or `analysed_sst` (some COASTWATCH_* sub-collections)

```
properties->>'cube:variables'->>'sst'->>'max' > 28
```

## 3. Hurricane-force winds

> "Items with wind speeds over 33 m/s — hurricane-force."

Variable: `wind_speed` (NDBC, HRRR, COOPS)

```
properties->>'cube:variables'->>'wind_speed'->>'max' > 33
```

## 4. Argo float depth

> "Argo profiles that reached at least 2000 dbar."

Variable: `pres` (GADR)

```
properties->>'cube:variables'->>'pres'->>'max' >= 2000
```

## 5. Argo shallow profiles only

> "Argo profiles where the float stayed shallower than 100 dbar."

```
properties->>'cube:variables'->>'pres'->>'max' < 100
```

## 6. Salty water

> "Items with mean salinity between 34 and 35 PSU."

Variable: `salinity` (WOD, GADR, NDBC, IOOS_SENSORS)

```
properties->>'cube:variables'->>'salinity'->>'mean' >= 34
AND properties->>'cube:variables'->>'salinity'->>'mean' <= 35
```

## 7. High chlorophyll (bloom-suspect)

> "Chlorophyll concentration above 5 mg/m³ — possible bloom."

Variable: `chl_a` (COASTWATCH, COASTWATCH_CWCGOM)

```
properties->>'cube:variables'->>'chl_a'->>'max' > 5
```

## 8. Cloud-free Sentinel-2

> "Sentinel-2 scenes with under 10% cloud cover."

Direct STAC property:

```
properties.eo:cloud_cover < 10
```

## 9. Sentinel-1 dual-pol SAR only

> "Sentinel-1 GRD scenes in dual-polarization mode (VV+VH)."

Direct STAC property:

```
properties.sar:polarizations = '[\"VV\",\"VH\"]'
```

(Pass the JSON-array string literal — quotes escaped for the filter expression.)

## 10. Combined multi-variable

> "NDBC items where waves were over 5 m AND wind speed was over 20 m/s AND mean SST was above 26°C — extreme storm conditions."

```
properties->>'cube:variables'->>'wave_height'->>'max' > 5
AND properties->>'cube:variables'->>'wind_speed'->>'max' > 20
AND properties->>'cube:variables'->>'sst'->>'mean' > 26
```

## Tips

- Always pass `bbox` and `datetime` alongside `filter` — CQL2 narrows results within the spatial/temporal scope, it doesn't replace it.
- If a filter returns nothing, drop one condition at a time to find which condition is too tight (or which variable name is wrong).
- For complex `OR` groups, parenthesize: `(A OR B) AND C`.
