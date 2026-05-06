# Vessel traffic — MarineCadastre AIS

Find Automatic Identification System (AIS) vessel-track datasets, density grids, transit counts, and maritime boundary layers for U.S. waters.

## What this teaches

- The breadth of `MARINECADASTRE_AIS` — far more than just AIS tracks (90+ layers including boundaries, routing measures, protected areas)
- How to scope to a specific port approach
- Using `aggregate(geometry_geohash_grid_frequency)` to make a vessel-density heatmap

**Source used**: `MARINECADASTRE_AIS`

---

## Prompt

```
Show me vessel traffic and AIS data covering the approaches to the Port
of Long Beach, CA. I want vessel tracks, density grids if available,
and any relevant boundary or routing layers.
```

## Transcript

### 1. Scope to the port approach

```python
search_datasets(
  collections = "MARINECADASTRE_AIS",
  bbox = "-118.5,33.6,-118.0,33.9",
  limit = 5
)
```

> 264 matching layers in the SoCal area. Top hits:

| ID | Title | Year |
|---|---|---|
| `mc_west_coast_ais_vessel_tracks_2011_48946` | West Coast AIS Vessel Tracks 2011 | 2011 |
| `mc_dataset_67919` | Vessel Routing Measures (IMO traffic separation, etc.) | 2024 |
| `mc_u_s_state_submerged_lands_48928` | U.S. State Submerged Lands (regulatory boundary) | 2006 |

Each item links back to MarineCadastre at `https://marinecadastre.gov/data/` with InPort metadata at `https://www.fisheries.noaa.gov/inport/item/<id>`.

### 2. Aggregate transit density

```python
aggregate(
  aggregations = "geometry_geohash_grid_frequency",
  collections = "MARINECADASTRE_AIS",
  bbox = "-118.5,33.5,-117.7,34.0",
  precision = 6
)
```

> Returns geohash buckets and counts — a heatmap of where AIS records are concentrated. At `precision=6` each bucket is ~1.2 km on a side.

### 3. Get one tracks dataset

```python
get_item(
  collection = "MARINECADASTRE_AIS",
  item_id = "mc_west_coast_ais_vessel_tracks_2011_48946"
)
```

> Returns NOAA Office for Coastal Management metadata + asset URL pointing at the MarineCadastre download portal. Track data are typically distributed as zipped GeoTIFFs / GeoPackage files for desktop GIS analysis.

## Result the agent gave

> *"For Port of Long Beach approaches:*
>
> *1. **Vessel tracks** — annual track-line products from MarineCadastre. The 2011 West Coast tracks file (mc_west_coast_ais_vessel_tracks_2011_48946) covers the SoCal Bight including the LA / Long Beach approaches. Newer years are available — search with a `datetime` filter.*
>
> *2. **Vessel routing measures** — IMO traffic separation schemes and recommended routes (mc_dataset_67919). Useful overlay for vessel-track interpretation.*
>
> *3. **Regulatory boundaries** — U.S. State Submerged Lands and Exclusive Economic Zone polygons.*
>
> *To make a density heatmap, use the aggregate query above; downstream visualization with folium or kepler.gl works well."*

## Variations

- **Different port**: Houston (`-95.5,29.5,-94.5,30.0`), New York (`-74.3,40.4,-73.9,40.7`), Seattle (`-122.5,47.5,-122.2,47.8`).
- **Specific year**: search with `datetime = "2022-01-01T00:00:00Z/2022-12-31T23:59:59Z"`.
- **Beyond AIS**: MarineCadastre also includes benthic habitat, offshore wind lease blocks, sediment sampling, marine mammal density. Use free-text `q` within the same collection.

## Related examples

- [`17-bathymetry/`](../17-bathymetry/) — combine vessel tracks with depth for navigation safety
- [`19-regional-deep-dives/`](../19-regional-deep-dives/) — IOOS regional associations also have port observatories
