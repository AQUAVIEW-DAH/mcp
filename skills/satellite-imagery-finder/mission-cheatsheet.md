# Satellite mission cheatsheet

Per-mission specifics for the four AQUAVIEW global imagery collections.

## `sentinel-2-l2a` — Sentinel-2 Multispectral Surface Reflectance (Level 2A)

| Property | Value |
|---|---|
| Operator | ESA Copernicus |
| Resolution | 10 m (B02/03/04/08), 20 m (red-edge / SWIR), 60 m (atmospheric) |
| Revisit | ~5 days at equator, ~2-3 days mid-latitudes (S2A + S2B combined) |
| Bands | 12 spectral bands + cloud probability mask |
| Time coverage | 2015-06 → present |
| Best for | Coastal water clarity, chlorophyll proxies, NDVI, change detection, coastline mapping |

**Common assets:** `B01` … `B12`, `SCL` (scene classification), `WVP`, `AOT`, `visual` (true-color preview).

## `hls2-l30` — Harmonized Landsat-Sentinel-2 (L30)

| Property | Value |
|---|---|
| Operator | NASA |
| Resolution | 30 m (Landsat-derived; harmonized to L8/L9 grid) |
| Revisit | ~2-3 days globally (HLS = combined Landsat-8/9 + Sentinel-2 reflectance) |
| Bands | 6 surface reflectance + Fmask quality |
| Time coverage | 2013 → present |
| Best for | Multi-decade change detection, drought, vegetation-water indices, where you need both Landsat heritage AND Sentinel-2 cadence |

Use HLS when the time range crosses the Sentinel-2 launch boundary (pre-2015) or when you want a unified product. Use Sentinel-2 directly for highest spatial resolution.

## `sentinel-1-grd` — Sentinel-1 Ground Range Detected (C-band SAR)

| Property | Value |
|---|---|
| Operator | ESA Copernicus |
| Resolution | 10 m (IW mode, GRD-H) |
| Revisit | ~6-12 days |
| Modes | IW (most common, swath 250 km), EW (extra-wide 400 km, polar), SM (stripmap 80 km), WV (wave mode, oceans) |
| Polarizations | VV, VH, HH, HV (depends on mode + ocean/land) |
| Time coverage | 2014-10 → present |
| Best for | Oil slicks, ship detection, sea ice classification, flood mapping, all-weather surface roughness |

**Common assets:** `vv`, `vh` (or `hh`, `hv` for high-latitude scenes), thumbnail.

**SAR signal-to-physics translation:**

- Low backscatter (dark) on water = smooth surface → oil slick, calm sea, fresh-water plume
- Bright backscatter (light) on water = rough surface → wind, waves, ships
- Speckle pattern = needs multi-look averaging for clean visualization

## `esa-worldcover` — ESA WorldCover 10m Land Cover

| Property | Value |
|---|---|
| Operator | ESA |
| Resolution | 10 m |
| Revisit | Annual snapshot (2020, 2021) |
| Classes | 11 (tree cover, shrubland, grassland, cropland, built-up, bare/sparse, snow/ice, permanent water, herbaceous wetland, mangroves, moss/lichen) |
| Best for | Coastline mapping, watershed land-use context, mangrove inventory, urban encroachment |

**Common assets:** `map` (classified GeoTIFF with the class codes above).

## When to use which

- Want true color of a coastline? → **Sentinel-2 L2A**
- Tracking deforestation since 2015? → **HLS L30** (longer baseline)
- Looking for an oil slick after a vessel grounding? → **Sentinel-1 GRD**
- Need land cover context for a coastal study site? → **ESA WorldCover**
