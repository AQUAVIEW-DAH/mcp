# Quickstart — your first AQUAVIEW query

Confirm your client is connected and the catalog is responding. Two minutes from cold start to your first dataset.

## What this teaches

- How to verify AQUAVIEW is wired up
- The shape of `list_collections` and `search_datasets` results
- How to ask follow-up questions in plain English

**Sources used**: any (uses `list_collections` + a free-text `search_datasets`)

---

## Prompt

```
List the AQUAVIEW collections. Then find me one example dataset from
NDBC, one from GADR, and one from GOES_R, with a one-sentence summary
of each.
```

## Transcript

### 1. Enumerate collections

```python
list_collections()
```

Returns 68 rows including `id`, `title`, `bbox`, `keywords`, and a description.

### 2. Sample item from each requested source

```python
search_datasets(collections = "NDBC", limit = 1)
search_datasets(collections = "GADR", limit = 1)
search_datasets(collections = "GOES_R", limit = 1)
```

Live responses (NDBC has 1,506 items, GADR has 15,469, GOES_R has 203):

| Collection | Example item ID | What it is |
|---|---|---|
| `NDBC` | `ndbc_grcm4` | GLRC Observatory in Lake Superior, owned by Michigan Tech — full meteorology + water quality (chlorophyll, dissolved O2, pH, turbidity) + waves |
| `GADR` | `argo_nmdis_2901633` | Argo profiling float deployed by China NMDIS; 6,840 obs in the western North Pacific (131–139°E, 25–28°N), pressure to 2029 dbar, temperature -2.0 to 30.9 °C |
| `GOES_R` | `goes19_abi_l2_ctpf` | GOES-19 ABI Cloud Top Pressure (full disk) — derived from infrared channels |

## Result the agent gave

> *"AQUAVIEW has 68 collections covering ocean, atmospheric, and marine data from NOAA, IOOS, the World Ocean Database, ESA, IFREMER, and dozens of other institutions.*
>
> *Three sample datasets, one per requested collection:*
>
> - **`ndbc_grcm4`** *(NDBC) — the GLRC Observatory buoy in Lake Superior, owned by Michigan Tech. It's a full instrument suite: meteorology (air temp, pressure, wind), wave height + period, plus water-quality channels including chlorophyll, dissolved oxygen, pH, salinity, and turbidity.*
> - **`argo_nmdis_2901633`** *(GADR) — an Argo profiling float deployed by China NMDIS in the western North Pacific. Across its lifetime it recorded 6,840 observations down to ~2029 dbar with temperatures spanning -2.0 °C to 30.9 °C and salinity 29.3 to 34.9.*
> - **`goes19_abi_l2_ctpf`** *(GOES_R) — a GOES-19 ABI Cloud Top Pressure full-disk product, derived from infrared channels by NOAA NESDIS and hosted on Google Cloud Storage.*"

## Variations

- Replace any of `NDBC`, `GADR`, `GOES_R` with another collection ID — try `NEXRAD_L2`, `WOD`, or `MARACOOS`.
- Ask for a CSV summary: *"Format the result as a Markdown table."*
- Ask the model to call `aggregate(collection_frequency)` instead — it will return per-source item counts across the entire catalog.

## Related examples

- [`02-sea-surface-temperature/`](../02-sea-surface-temperature/) — your first real research query
- [`../docs/prompting-guide.md`](../../docs/prompting-guide.md) — how to ask AQUAVIEW good questions
