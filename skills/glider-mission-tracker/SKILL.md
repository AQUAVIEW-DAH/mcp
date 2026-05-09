---
name: glider-mission-tracker
description: Use when the user asks about underwater gliders — phrases like "active glider missions in …", "Slocum / Spray / Seaglider", "glider profiles near {location}", "glider data for {variable}", or any IOOS regional glider question. Encodes which collection holds which regional glider feed and how to filter live vs archived deployments.
---

# Glider mission tracker

Underwater gliders are buoyancy-driven AUVs that dive in a sawtooth pattern collecting profiles for weeks-to-months at a time. AQUAVIEW exposes glider data through several IOOS-region-aligned collections.

## Where gliders live in the catalog

| Region / network | Collection | Notes |
|---|---|---|
| US national glider feed (multi-region) | `IOOS` | Aggregated across regional associations |
| US Mid-Atlantic | `MARACOOS` | Heavy Slocum activity off NJ/MD/VA shelf |
| US Pacific Northwest | `NANOOS` | NANOOS-ASSET glider deployments |
| US West Coast (CA / OR / WA) | `CENCOOS`, `CALOOS` | UCSD / Scripps Spray gliders + CENCOOS Slocums |
| US Northeast | `NERACOOS` | Gulf of Maine deployments |
| US Southeast / Caribbean | `SECOORA`, `CARICOOS` | |
| Open ocean / global | `OOI`, `OOI_GOLDCOPY` | Ocean Observatories Initiative endurance arrays |
| US Spray glider archive | `SPRAY` | Scripps Spray glider program archive |

Don't search all regional collections at once — pick one by user's region. Use `bbox-from-region` to get the bbox, then choose the matching IOOS RA.

See [`mission-types.md`](mission-types.md) for Slocum / Spray / Seaglider differences.

## Pattern: "active gliders in X"

For currently-deployed gliders:

```
search_datasets(
  collections=["MARACOOS"],   # adjust per region
  bbox=<bbox>,
  datetime="<7-days-ago>/<today>",
  limit=20
)
```

Items returned in the last 7 days are usually active deployments. Check `properties.deployment_status` if exposed.

## Pattern: archived missions over a time range

```
search_datasets(
  collections=["IOOS"],
  bbox=<bbox>,
  datetime="2020-01-01/2024-12-31",
  q="glider",
  limit=50
)
```

The free-text `q="glider"` helps disambiguate from buoy / mooring data in the IOOS aggregate feed.

## Pattern: variable-filtered glider data

> "Find Slocum glider deployments off New Jersey with chlorophyll fluorescence."

```
search_datasets(
  collections=["MARACOOS"],
  bbox=[-75.0, 38.0, -73.0, 40.0],
  datetime="<start>/<end>",
  filter="properties->>'cube:variables'->>'chl_a'->>'mean' IS NOT NULL",
  filter_lang="cql2-text",
  limit=20
)
```

## Common variables (per-mission)

Glider variables differ by sensor payload. Typical:

- `temp`, `salinity`, `pressure` — universal (CTD)
- `chl_a` (fluorescence) — common
- `oxygen` (DO sensor) — often
- `cdom` (colored dissolved organic matter), `bb_700` (backscatter) — BGC-equipped only
- `density` — derived
- `u_water`, `v_water` — depth-averaged currents (Slocum derives from dead-reckoning vs GPS fix)

## Glider data structure

Glider items in AQUAVIEW are typically organized at the **deployment level** — one item per multi-week deployment, with the entire deployment NetCDF as a single asset. To inspect a single profile:

1. `get_item(id=<deployment_id>)` to fetch the asset URL
2. Download the NetCDF (`xarray.open_dataset(...)`)
3. The dataset has time/profile/depth dimensions; index by profile number

If the user wants per-profile data without downloading the whole deployment, fall back to ERDDAP-direct queries (mention it as a workflow option, not via AQUAVIEW).

## Cross-reference patterns

- **Glider + HF radar surface currents** for an Eulerian-Lagrangian comparison: see `hf-radar-currents`
- **Glider + Argo** for shelf-to-deep handoff: glider on the shelf, Argo offshore
- **Glider + satellite SST/chl** for surface-to-subsurface comparison: see `sst-and-ocean-color`

## Worked example

> "Show me all active glider missions in the Mid-Atlantic Bight."

```
1. bbox = [-77.0, 35.0, -68.0, 41.5]   (from `bbox-from-region`)
2. search_datasets(
     collections=["MARACOOS"],
     bbox=bbox,
     datetime="<14-days-ago>/<today>",
     q="glider",
     limit=30
   )
3. For each item, summarize: deployment ID, lat/lon range, variables, days deployed
```
