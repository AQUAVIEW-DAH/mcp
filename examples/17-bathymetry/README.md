# Bathymetry — hydrographic surveys and seafloor mapping

Find NOAA hydrographic surveys, bathymetric attributed grids (BAGs), and elevation models for a coastal region.

## What this teaches

- The `BATHYMETRY` collection (NCEI surveys + Office of Coastal Survey)
- Pairing with `DIGITALCOAST` for lidar / DEM coverage
- Reading the `_DR_pdf` and `_bag` asset keys (Descriptive Report and BAG files)

**Sources used**: `BATHYMETRY`, `DIGITALCOAST`

---

## Prompt

```
Find NOAA hydrographic surveys covering the Florida Keys with download
links to the bathymetric grids.
```

## Transcript

### 1. Scope to the Keys

```python
search_datasets(
  collections = "BATHYMETRY",
  bbox = "-83,24,-80,25.5",
  limit = 5
)
```

Real top hits:

| Survey ID | Title | Platform | Date |
|---|---|---|---|
| `W00424` | Straits of Florida — Alligator Reef to Sand Key, FL | NOAA Ship Nancy Foster | 2011-09-14 |
| `W00406` | Coastal Florida 16 NM SW of Marquesas Keys | NOAA Ship Nancy Foster | 2015-06-07 |
| `W00397` | Dry Tortugas — Tortugas Bank | NOAA Ship Nancy Foster | 2008-08-09 |

Each survey is one STAC item. Asset keys include `landing-page` (NCEI catalog page like `https://www.ngdc.noaa.gov/nos/W00001-W02000/W00424.html`), `<id>_DR_pdf` (Descriptive Report), `<id>_DR_xml` (DR metadata), `Download_<id>_xml` (full survey package), and one or more `<id>_MB_<resolution>_MLLW_<n>of<m>_bag` files (Bathymetric Attributed Grids at multiple resolutions, typically 1 m / 2 m / 4 m / 8 m / 16 m).

### 2. Get a survey's full asset list

```python
get_item(collection = "BATHYMETRY", item_id = "W00406")
```

> Returns landing page, Descriptive Report PDF, all BAG resolutions, and survey metadata XML.

### 3. Pair with Digital Coast for topo+lidar

```python
search_datasets(
  collections = "DIGITALCOAST",
  bbox = "-83,24,-80,25.5",
  q = "lidar",
  limit = 5
)
```

> Digital Coast covers the topo / shoreline side — DEMs, lidar point clouds, ortho imagery, land cover.

## Result the agent gave

> *"26 hydrographic surveys cover the Florida Keys bbox in the BATHYMETRY collection. The three most relevant from a `limit=5` sample:*
>
> - ***`W00424`*** *(Sep 14, 2011 — Straits of Florida, Alligator Reef to Sand Key) — three BAG resolutions: 4 m, 8 m, 16 m. Survey platform: NOAA Ship Nancy Foster. Includes acoustic backscatter (per the keywords).*
> - ***`W00406`*** *(Jun 7, 2015 — Coastal Florida, 16 NM SW of Marquesas Keys) — four BAG resolutions: 2 m, 4 m, 8 m, 16 m. Broader bbox covering more of the lower Keys / Tortugas region. Same survey platform.*
> - ***`W00397`*** *(Aug 9, 2008 — Dry Tortugas Tortugas Bank) — five BAGs at 1 m, 2 m, 8 m resolutions. Same survey platform.*
>
> *Each survey delivers BAG files (Bathymetric Attributed Grid, the standard exchange format) at multiple resolutions, plus a Descriptive Report PDF.*
>
> *For shallow-water topobathy, also pull DIGITALCOAST lidar — better for the shoreline / dry-land side."*

## Variations

- **Different region**: New England (`-70,40,-67,43`), Pacific NW (`-125,46,-122,49`).
- **Latest surveys only**: sort by `-properties.datetime`.
- **Resolution filter**: filter on the description for specific resolutions, or look at the `asset_keys` to confirm a 1 m or 2 m BAG is included.

## Related examples

- [`13-deep-sea-exploration/`](../13-deep-sea-exploration/) — combine ROV dive locations with seafloor maps
- [`14-vessel-traffic-ais/`](../14-vessel-traffic-ais/) — vessel routing measures + bathymetry for safety
