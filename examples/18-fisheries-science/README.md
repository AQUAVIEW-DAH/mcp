# Fisheries science — NOAA NMFS science centers

Find datasets from the five regional NMFS Fisheries Science Centers — bottom trawl surveys, hydrographic profiles, ecosystem monitoring.

## What this teaches

- The five NMFS center collections: `AFSC`, `NEFSC`, `NWFSC`, `PIFSC`, `SEFSC`
- Cross-source synthesis (e.g., NEFSC bottom temperature + Argo + satellite SST)
- Reading multi-decade modeled bottom-temperature products

**Sources used**: `NEFSC`, `AFSC`, `NWFSC`, `PIFSC`, `SEFSC`

---

## Prompt

```
Find bottom temperature observations on the Northeast U.S. continental
shelf — both observed (from fishing-industry sensors) and modeled.
```

## Transcript

### 1. Search across NMFS centers

```python
search_datasets(
  collections = "AFSC,NEFSC,NWFSC,PIFSC,SEFSC",
  q = "bottom temperature",
  limit = 5
)
```

Real hits:

| ID | Center | What it is |
|---|---|---|
| `ondeckdata_erddap_4319_ff7a_72eb` | `NEFSC` | **FIShBOT** — Fishing Industry Shared Bottom Oceanographic Timeseries: gridded daily bottom temperature, salinity, dissolved oxygen, contributed by fishing-industry sensors via CFRF + GOMLF cooperation, 2000–present |
| `duPontavice_bottom_temp` | `NEFSC` | **Bias-corrected ROMS-NWA + GLORYS12v1** modeled bottom temperature, 1/12° daily, 1959–2020 — the long-term reference product (du Pontavice et al. 2023) |

ERDDAP host for both: `https://comet.nefsc.noaa.gov/erddap`. Full QC variables: each FIShBOT cell carries min/max/std/count alongside the daily mean.

### 2. Check coverage across all five NMFS centers

```python
aggregate(
  aggregations = "total_count,collection_frequency",
  collections = "AFSC,NEFSC,NWFSC,PIFSC,SEFSC"
)
```

> **Important finding**: Only 10 items total across the five NMFS center collections, and all 10 are in `NEFSC`. The `AFSC`, `NWFSC`, `PIFSC`, and `SEFSC` collections are registered but currently have zero indexed items in the Aquaview catalog. This is a coverage gap to flag.

## Result the agent gave

> *"For Northeast Shelf bottom temperature, two complementary products cover different needs:*
>
> *1. **FIShBOT (NEFSC)** — the operational, observed gridded bottom temperature from the cooperative fishing-industry sensor network. Daily, 2000-present. Use this for recent operational ecosystem monitoring. ERDDAP: https://comet.nefsc.noaa.gov/erddap/tabledap/ondeckdata_erddap_4319_ff7a_72eb*
>
> *2. **du Pontavice modeled bottom temperature** — 1/12° daily product from ROMS-NWA bias-corrected with GLORYS12v1, spanning 1959–2020. Use this for long-term context, climate decomposition, and pre-FIShBOT historical analysis.*
>
> ***Coverage caveat**: The other four NMFS Science Center collections (AFSC, NWFSC, PIFSC, SEFSC) are listed in `list_collections` but currently have zero items indexed by Aquaview. For Alaska bottom-trawl groundfish, Pacific Hake, Hawaii bottomfish, or SE Atlantic / Gulf of Mexico fisheries data, you'll need to query the source ERDDAPs directly (e.g., AFSC's data portal at https://www.fisheries.noaa.gov/alaska/science-data) or wait for those collections to be populated.*
>
> *Each NMFS center publishes parallel products for its region — the AFSC equivalent in the Bering Sea is the `goa_bts` and `ebs_bts` bottom-trawl-survey series."*

## Variations

- **Specific species**: free-text the species name (`q = "Atlantic cod"`) within the relevant center.
- **NWFSC Pacific Hake**: classic example for the Northwest Center.
- **PIFSC Hawaii bottomfish**: tropical / Hawaiian island stocks.
- **Modeling vs. observation**: the FIShBOT/du Pontavice pair is a great template for "compare modeled with observed" prompts.

## Related examples

- [`16-biogeochemistry/`](../16-biogeochemistry/) — biogeochemical context for fisheries habitat
- [`19-regional-deep-dives/`](../19-regional-deep-dives/) — IOOS RAs hosting parallel fisheries-relevant data
