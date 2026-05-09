# Glider platform types

Three platforms dominate the US glider fleet. Knowing which is in a deployment helps interpret data quirks (vertical resolution, depth limits, variable defaults).

## Slocum (Teledyne Webb Research)

| Property | Value |
|---|---|
| Origin | Webb Research / Teledyne, USA |
| Buoyancy mechanism | Battery-powered piston pump |
| Typical depth | 200 m (shallow), 1000 m (deep) |
| Speed | 0.25–0.5 m/s |
| Mission duration | 4–8 weeks per battery set |
| Sensors | CTD (Sea-Bird), often + WET Labs ECO Triplet (chl, CDOM, backscatter), Aanderaa O₂ optode |
| Notable feature | Dead-reckoning + GPS-fix gives depth-averaged current vector per dive |
| Common deployers | MARACOOS, NERACOOS, CENCOOS, SECOORA |

## Spray (Scripps / Bluefin)

| Property | Value |
|---|---|
| Origin | Scripps Institution of Oceanography, USA |
| Buoyancy mechanism | Hydraulic pump |
| Typical depth | 1500 m |
| Speed | 0.25 m/s |
| Mission duration | 6+ months per deployment (very long endurance) |
| Sensors | CTD, Aanderaa O₂; some with chlorophyll fluorometer |
| Notable feature | Very long range, useful for transbasin sections (Hawaii–California, etc.) |
| Common deployers | Scripps `SPRAY` collection, some `CENCOOS` |

## Seaglider (UW APL / Kongsberg)

| Property | Value |
|---|---|
| Origin | University of Washington Applied Physics Lab, USA |
| Buoyancy mechanism | Pumped oil reservoir (variable buoyancy) |
| Typical depth | 1000 m |
| Speed | 0.25 m/s |
| Mission duration | 6–8 months per deployment |
| Sensors | Sea-Bird CTD, often O₂, fluorescence, optical backscatter |
| Notable feature | Best vertical resolution near the surface; favored for biogeochemistry-heavy studies |
| Common deployers | NANOOS, OOI, university operators |

## Quick comparison

| Need | Best platform |
|---|---|
| Long endurance (6+ months) | Spray or Seaglider |
| Shallow shelf seas (< 200 m) | Slocum 200m |
| Deepest dives (1000–1500 m) | Spray |
| Best near-surface vertical resolution | Seaglider |
| Built-in depth-averaged current | Slocum |
| Highest-quality biogeochem suite | Seaglider |

## Identifying platform from item metadata

Look in the item properties for fields like:

- `platform` or `platform_type` — sometimes set to `slocum`, `spray`, `seaglider`
- `instrument` — model number / serial
- The deployment ID often encodes the platform (e.g., `ru32` = Rutgers Slocum #32)

If the field is missing, the deployer / collection is a strong hint:

- `MARACOOS` → mostly Slocum
- `SPRAY` → all Spray
- `OOI` → mix of Slocum and Seaglider depending on array
