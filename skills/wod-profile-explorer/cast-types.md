# WOD cast types

The World Ocean Database categorizes profile data by the instrument that collected it. Each cast type has different depth coverage, vertical resolution, accuracy, and historical timespan.

## Full cast-type table

| Code | Name | Vars typically reported | Vertical resolution | Depth coverage | Era | Comments |
|---|---|---|---|---|---|---|
| **CTD** | Conductivity-Temperature-Depth | T, S, P, O₂, fluorescence, turbidity, pH | 1 m or finer | 0–6000 m | 1970s–present | Modern gold standard. Shipboard sensor lowered through water column. |
| **OSD** | Ocean Station Data (bottle) | T, S, O₂, nutrients (NO₃, PO₄, SiO₃) | Discrete (typ. 10–20 levels) | 0–6000 m | 1900–present (mostly pre-1990) | Niskin/Nansen bottle samples. Slow but high-accuracy chemistry. |
| **XBT** | Expendable Bathythermograph | T only | ~1 m | 0–460 m (T7) or 0–760 m (T5) | 1965–present | Probe wire-paid out from underway ship. No salinity. Drift bias corrections needed. |
| **MBT** | Mechanical Bathythermograph | T only | ~5 m | 0–~270 m | 1940s–~1980 | Bourdon-tube T sensor. Now obsolete. |
| **PFL** | Profiling Float | T, S, P; sometimes O₂, chl, NO₃, pH (BGC) | 2–10 m | 0–2000 m (Core); 0–6000 m (Deep) | 1990s–present | Same data as GADR/Argo. WOD subset is reprocessed/QCed. |
| **APB** | Autonomous Pinniped Bathythermograph | T, S, P | Variable | 0–~1000 m | 2004–present | Seal-borne CTD tags. Useful for high-latitude winter coverage. |
| **GLD** | Glider | T, S, P, fluorescence, O₂ | ~1 m on dive | 0–~1000 m | 2003–present | Buoyancy-driven AUVs. Use `glider-mission-tracker` skill for live missions. |
| **DRB** | Drifting Buoy | T (sometimes S) | ~10 m intervals | 0–~150 m | 1990s–present | Surface drifters with thermistor strings. Lagrangian sampling. |
| **MRB** | Moored Buoy | T, S, currents (varies) | Fixed depths | Surface to anchor | 1980s–present | Use `NDBC` for US-coastal moorings. WOD covers the historical record. |
| **SUR** | Surface only (TSG / underway) | SST, SSS | Surface (0 m) | 0 m | 1960s–present | Continuous along-track underway sampling. Good for SST climatology. |
| **UOR** | Undulating Oceanographic Recorder | T, S, fluorescence | ~5 m on undulation | 0–~500 m | 1980s–present | Towed-undulating CTD. Sparse. |

## Picking a cast type

| User wants… | Pick |
|---|---|
| Best modern T/S profile | `CTD` |
| Pre-1970 historical record | `OSD` (or `MBT` for surface T only) |
| Continuous T-only timeseries since 1965 | `XBT` (with bias correction caveat) |
| Argo-era subsurface | `PFL` (or pull `GADR` directly) |
| High-latitude winter T/S | `APB` |
| Underway SST timeseries | `SUR` |
| Glider-derived | `GLD` (or use IOOS glider feeds via `glider-mission-tracker`) |

## Common combinations

- **Climatology baseline (1955–2010)**: combine `OSD` + `CTD` + `XBT` (drop `MBT` for accuracy). Apply XBT correction and depth-bin to standard levels (5, 10, 20, 30, ..., 1500 m).
- **Modern (2000–present)**: `CTD` + `PFL` + `GLD`.
- **Historical only (pre-1965)**: `OSD` + `MBT`. T/S accuracy is lower; treat as climatology, not point estimates.

## Combining with `GADR` (Argo)

WOD's `PFL` cast type overlaps with the live Argo fleet in `GADR`:

- Use `GADR` for **realtime / delayed-mode Argo profiles** (last 0-30 days)
- Use `WOD` `PFL` casts for the **reprocessed, QCed Argo archive**
- Don't dual-query the same period or you'll double-count

## Standard depth levels (WOA convention)

When binning profiles for climatology:

```
0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500,
550, 600, 650, 700, 750, 800, 850, 900, 950, 1000,
1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500
```

Values above 1500 m: 1550, 1600, ..., every 50 m to 2000; then 2100, 2200, ..., every 100 m to 5500.
