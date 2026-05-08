# IOOS Regional Associations — deep dives

Quick-start guides for each of the eleven U.S. Integrated Ocean Observing System Regional Associations.

## What this teaches

- The 11 IOOS RAs and what each one is best at
- A consistent pattern for exploring any regional ocean observing system

**Sources used**: all IOOS RA collections

---

## The eleven RAs

The current AQUAVIEW catalog item count for each, ordered by coverage (live snapshot from `aggregate(collection_frequency)`):

| RA | Collection ID | Region | Items in AQUAVIEW |
|---|---|---|---|
| **Southeast Coastal OOS** | `SECOORA` | SE U.S. coast + GoM | 1,268 |
| **Alaska OOS** | `AOOS` | Alaska, Arctic | 1,053 |
| **Central & Northern California OOS** | `CENCOOS` | OR border to Pt. Conception | 519 |
| **Mid-Atlantic Regional ACOOS** | `MARACOOS` | Cape Cod to Cape Hatteras | 421 |
| **Northeast Regional ACOOS** | `NERACOOS` | Gulf of Maine, NE | 199 |
| **IOOS HF Radar** | `IOOS_HFRADAR` | Nationwide (cross-cutting) | 172 |
| **Caribbean Coastal OOS** | `CARICOOS` | Puerto Rico, USVI | 92 |
| **IOOS Glider DAC** | `IOOS` | Nationwide (cross-cutting) | 53 |
| **Great Lakes OS** | `GLOS` | Great Lakes | 41 |
| **California OOS** | `CALOOS` | California state-wide | 39 |
| **Pacific Islands OOS** | `PacIOOS` | Hawaii, Pacific Islands | 17 |
| **Pacific Northwest OOS** | `NANOOS` | Oregon, Washington | 8 |
| **Coastal Data Information Program** | `CDIP` | Coastal U.S. (Scripps + USACE) | 5 |

> AQUAVIEW's RA coverage is uneven — SECOORA, AOOS, and CENCOOS have rich coverage; CDIP and NANOOS are thinly indexed at the moment. For RAs with low item counts, consult the upstream ERDDAP directly (links in `list_collections`).

## A repeatable prompt pattern

For any RA, this prompt skeleton works:

```
Show me what {RA NAME} ({COLLECTION_ID}) has for {REGION OR VARIABLE}
in {TIME RANGE}. Group by data type and give me a sample item from each.
```

Examples:

```
Show me what MARACOOS has for glider deployments in 2024–2025.
```

```
Show me what NANOOS has for ocean acidification monitoring on the
Oregon coast.
```

```
Show me what AOOS has for Bering Sea ice and weather buoys this winter.
```

The agent will scope the search to the right collection ID, apply the bbox/datetime, and return regional data products.

## What makes each RA distinct

- **AOOS** — only Arctic / Alaska coverage; pair with `POLARWATCH` for satellite ice.
- **CALOOS / CENCOOS** — strong on HF radar and kelp ecosystem data. Pair with `IOOS_HFRADAR` for cross-region radar consistency.
- **CARICOOS** — coral reef and tropical storm focus; pair with `NOAA_AOML_HDB` for hurricane heat potential.
- **GLOS** — only freshwater RA; pair with `GLERL`.
- **MARACOOS** — strongest glider density on the U.S. east coast.
- **NANOOS** — strong on tsunami detection and Columbia River plume monitoring.
- **NERACOOS** — Gulf of Maine, Casco Bay long-term moorings (NERACOOS-A01 etc.).
- **PacIOOS** — Hawaii coastal + tropical Pacific atolls.
- **SECOORA** — strong on coastal SE & GoM, includes `SUNRISE` cabled observatory.

## Cross-cutting notes

- IOOS-coordinated networks (`IOOS`, `IOOS_HFRADAR`, `IOOS_OFFICE`, `IOOS_SENSORS`) cut across regions and may duplicate per-RA data. Use them when you want a national view.
- Each RA exposes its data via an ERDDAP endpoint — `aquaview:source_url` carries the URL for direct query.

## Related examples

- [`06-hf-radar-surface-currents/`](../06-hf-radar-surface-currents/) — uses CALOOS / CENCOOS HF radar
- [`07-glider-missions/`](../07-glider-missions/) — uses MARACOOS-region gliders
- [`11-great-lakes/`](../11-great-lakes/) — uses GLOS
