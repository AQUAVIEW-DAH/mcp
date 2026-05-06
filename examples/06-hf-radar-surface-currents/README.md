# HF radar surface currents — Southern California

Find high-frequency radar surface current measurements along a coast — the upper 0.3–2.5 m of the water column, every hour, for thousands of grid cells.

## What this teaches

- Querying the IOOS HF Radar network (`IOOS_HFRADAR`)
- Reading radial-sweep variable lists (VELU, VELV, ESPC, etc.)
- Combining HF radar with satellite SST or wind to interpret surface flow

**Source used**: `IOOS_HFRADAR` (IOOS HF Radar ERDDAP)

---

## Prompt

```
Show me HF radar surface current stations off Southern California with
recent data. List their variables and link me to ERDDAP for one of them.
```

## Transcript

### 1. Scope to the SoCal Bight

```python
search_datasets(
  collections = "IOOS_HFRADAR",
  bbox = "-127,32,-117,42",
  limit = 5
)
```

> 64 matching items along the West Coast. Top results in the SoCal area:

| ID | Title | Bbox |
|---|---|---|
| `USC_SCTB` | Radials for SCTB | -119.13, 33.22 → -117.66, 34.42 |
| `USC_SCPF` | Radials for SCPF | -118.78, 33.30 → -117.81, 34.11 |
| `USC_SCNB` | Radials for SCNB | -118.41, 33.20 → -117.50, 33.81 |

All three are USC (University of Southern California) stations on the IOOS HF Radar ERDDAP at `https://hfradar.ioos.us/erddap`.

Variables per radial sweep include: `time`, `flag`, `station`, `antenna_lat`, `antenna_lon`, `VELU`, `VELV` (the u/v current components), `VFLG` (velocity flag), `ESPC`, `ETMP`, `EDTP`, `EASN` (error metrics), `MAXV`, `MINV`, `RNGE`, `BEAR`, `VELO`, `HEAD`, `SPRC`.

### 2. Get the ERDDAP form URL

```python
get_item(collection = "IOOS_HFRADAR", item_id = "USC_SCTB")
```

The asset list typically includes `asc`, `csv`, `csv0`, `csvp`, `das`, `dataTable`, `dds`, `dods`, `htmlTable`, `nc`, and the dataset's ERDDAP HTML form.

## Result the agent gave

> *"64 IOOS HF radar items match the U.S. West Coast bbox. The ones currently active in the SoCal Bight are all USC-operated:*
>
> - ***USC_SCTB*** *— bbox -119.13°W to -117.66°W, 33.22°N to 34.42°N (Santa Catalina / Channel Islands toward Long Beach), most-recent obs 2025-06-05*
> - ***USC_SCPF*** *— bbox -118.78°W to -117.81°W, 33.30°N to 34.11°N (Palos Verdes / San Pedro Bay), most-recent obs 2025-06-19*
> - ***USC_SCNB*** *— bbox -118.41°W to -117.50°W, 33.20°N to 33.81°N (Newport Beach inner Bight), most-recent obs 2025-06-05*
>
> *Each is a `RadialSweep` dataset with u/v velocity components (VELU, VELV) and a full set of quality / error flags (VFLG, ESPC, ETMP, EDTP, EASN, MAXV, MINV, ERSC, ERTC). The spatial framing is radial-from-antenna rather than gridded — for a gridded total-currents product, search the same collection with q='totals'.*
>
> *Download via the IOOS HF Radar ERDDAP at https://hfradar.ioos.us/erddap — for example https://hfradar.ioos.us/erddap/tabledap/USC_SCTB.html exposes the form for CSV / NetCDF / OPeNDAP output."*

## Variations

- **Different region**: Mid-Atlantic Bight bbox `-77,35,-69,42` returns Rutgers / U-Mass / U-Delaware stations.
- **Aggregated current grid product**: search `q = "totals"` within `IOOS_HFRADAR` for the gridded total-current (not radial) products.
- **Combine with wind**: add `NDBC` to the collections list to compare HF radar surface flow with measured wind at nearby buoys.

## Related examples

- [`02-sea-surface-temperature/`](../02-sea-surface-temperature/) — combine SST gradient with HF radar flow
- [`19-regional-deep-dives/`](../19-regional-deep-dives/) — CalOOS and CeNCOOS networks include other radar nodes
