# Biogeochemistry — BCO-DMO and cruise-based observations

Find biological and chemical oceanography datasets from research cruises and NSF-funded projects.

## What this teaches

- The `BCODM` collection (Biological & Chemical Oceanography DMO at WHOI)
- Combining cruise data with satellite remote-sensing for context
- Using `q` to scope by analyte (chlorophyll, nitrate, oxygen, alkalinity, etc.)

**Sources used**: `BCODM`, `WOD`

---

## Prompt

```
Find biogeochemistry datasets — nitrate, oxygen, alkalinity, primary
production — from research cruises in the North Atlantic. Prefer
recent NSF-funded studies.
```

## Transcript

### 1. Search BCO-DMO with free-text + bbox

```python
search_datasets(
  collections = "BCODM",
  q = "nitrate alkalinity primary production",
  bbox = "-80,25,-30,55",
  limit = 5
)
```

> Returns **0 items**. The multi-word free-text search across `BCODM` titles/descriptions doesn't match this combination. AQUAVIEW's `BCODM` indexing in this bbox is sparse — the search needs to drop `q` and inspect all the available items.

### 2. Drop the free-text — see what BCO-DMO actually covers

```python
search_datasets(
  collections = "BCODM",
  bbox = "-80,25,-30,55",
  limit = 5
)
```

> Returns 6 items total. Top hits (real responses):

| ID | Title summary | Period |
|---|---|---|
| `bcodmo_dataset_3918` | **BATS / Hydrostation S CTD profiles** — Bermuda Atlantic Time-Series, decibar-averaged CTD with pressure, T, S, dissolved O2, beam attenuation, fluorescence, PAR | 1988 → ongoing |
| `bcodmo_dataset_937008_v1` | BAIT — Aerosol Fe stable-isotope composition at Tudor Hill, Bermuda | Nov 2018–Mar 2020 |
| `bcodmo_dataset_781545` | AE1918 cruise — continuous MOCNESS net-tow data, R/V Atlantic Explorer | Jul 2019 |
| `bcodmo_dataset_780092` | Squidpop predation experiment, Back Sound, NC | Jul 2017 |
| `bcodmo_dataset_777838` | AE1910 cruise — MOCNESS continuous data | May 2019 |

The standout is **BATS** (`bcodmo_dataset_3918`) — the Bermuda Atlantic Time-Series, monthly CTD profiles at 31° 40' N 64° 10' W since 1988, plus biweekly cruises to Hydrostation S (32° 10' N, 64° 30' W).

### 3. Cross-source: World Ocean Database for archival profiles

```python
search_datasets(
  collections = "WOD",
  bbox = "-80,25,-30,55",
  q = "oxygen",
  limit = 5
)
```

> WOD complements BCO-DMO with multi-decade bottle, CTD, and float profile data — the long-term reference for biogeochemical analytes.

## Result the agent gave

> *"For North Atlantic biogeochemistry, BCO-DMO's coverage in AQUAVIEW is sparse — only 6 items match the bbox -80°W to -30°W, 25°N to 55°N, and the multi-word free-text query for 'nitrate alkalinity primary production' returns zero (BCO-DMO titles use project-name framing, not analyte names).*
>
> *The most valuable item by far is **`bcodmo_dataset_3918`** — the **Bermuda Atlantic Time-Series (BATS)** CTD profile dataset. Monthly hydrographic cruises to 31° 40' N, 64° 10' W since 1988, plus biweekly cruises to a neighboring location (Hydrostation S, 32° 10' N, 64° 30' W). Variables: pressure, depth, temperature, conductivity, salinity, dissolved oxygen, beam attenuation, fluorescence, PAR. ERDDAP: https://erddap.bco-dmo.org/erddap.*
>
> *Other items in the bbox are project-specific (BAIT aerosol Fe isotopes, MOCNESS net tows from R/V Atlantic Explorer, a North Carolina squidpop predation experiment) — useful for specific research questions, less for survey-style biogeochemistry.*
>
> ***Caveat**: BCO-DMO's full North Atlantic catalog is far larger than 6 datasets. AQUAVIEW's coverage of BCO-DMO is partial; for a complete catalog search, use BCO-DMO's own portal at https://www.bco-dmo.org/. For a multi-decade complement, the **World Ocean Database (WOD)** has bottle, CTD, and float profiles back to 1770 with broader analyte coverage."*

## Variations

- **Different region**: California Current `-127,32,-117,42`, North Pacific `-180,30,-130,60`.
- **Specific PI / project**: include the PI's last name in `q` — BCO-DMO records often title datasets by lead investigator.
- **Specific analyte**: e.g., `q = "alkalinity"` for ocean acidification context.

## Related examples

- [`08-ocean-color-chlorophyll/`](../08-ocean-color-chlorophyll/) — satellite chlorophyll context
- [`05-argo-float-profiles/`](../05-argo-float-profiles/) — biogeochemical Argo (BGC-Argo) floats also discoverable via GADR
