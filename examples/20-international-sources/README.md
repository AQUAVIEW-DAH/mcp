# International ocean data sources

Find ocean and marine data from non-U.S. observing systems and research data centers — IFREMER, EMODnet, Marine Institute Ireland, Ocean Networks Canada, and others.

## What this teaches

- Which collections cover non-U.S. waters
- How to combine U.S. and international sources for global coverage
- The format conventions of European ERDDAP servers (often metric, ISO time, CF conventions)

**Sources used**: `IFREMER`, `CORIOLIS`, `EMODNET_PHYSICS`, `MARINE_IRELAND`, `SEATUBE`, `APDRC`, `VOICE_OF_THE_OCEAN`

---

## The map

Live coverage from `aggregate(collection_frequency)`:

| Region | Collection | Provider | Items in Aquaview |
|---|---|---|---|
| Sweden / Baltic | `VOICE_OF_THE_OCEAN` | VOTO Foundation glider data | 654 |
| Canada / Pacific deep sea | `SEATUBE` | Ocean Networks Canada ROV/SeaTube | 484 |
| Asia-Pacific | `APDRC` | Asia-Pacific Data Research Center, U. Hawaii | 169 |
| Pan-European | `EMODNET_PHYSICS` | European Marine Observation & Data Network | 74 |
| France (CORIOLIS) | `CORIOLIS` | IFREMER's CORIOLIS in-situ ERDDAP | 45 |
| Ireland | `MARINE_IRELAND` | Marine Institute Ireland | 25 |
| (NSF biological/chemical) | `BCODM` | BCO-DMO at WHOI (US-funded but international science) | 15 |
| France / Atlantic Europe | `IFREMER` | French Research Institute for Exploitation of the Sea | 4 |
| Salish Sea | `SALISH_SEA_UBC` | UBC | (not aggregated above) |

## Prompt patterns

### European in-situ data

```
Show me in-situ buoy and glider data in the North Atlantic east of
35°W from EMODnet and IFREMER for the last year.
```

The agent will:

1. `search_datasets(collections="EMODNET_PHYSICS,IFREMER,CORIOLIS", bbox="-35,30,15,65", datetime=...)` and return a mix of moored buoys, glider tracks, and ferrybox lines.
2. Note that variables follow CF conventions (e.g., `sea_water_temperature`, `sea_water_salinity`).
3. Provide ERDDAP form URLs at `https://www.ifremer.fr/erddap/` and `https://erddap.emodnet-physics.eu/erddap/`.

### Salish Sea cabled observatory

```
What does Ocean Networks Canada have for the Salish Sea / Strait of
Georgia? I'm interested in the cabled observatory data.
```

> Pulls from `SEATUBE` (ROV dives + sensor) and `SALISH_SEA_UBC` (ocean model output + observations from UBC).

### VOTO glider missions

```
List Voice of the Ocean glider missions in the Skagerrak / Kattegat.
```

> Returns `VOICE_OF_THE_OCEAN` items with deployment metadata, mission tracks, and CTD profile data.

### Asia-Pacific climate context

```
Show me Asia-Pacific climate datasets from APDRC — sea level rise,
ENSO indices, and reanalysis products.
```

> APDRC is broader than ocean — it includes climate, atmospheric, and reanalysis indices distributed by U. Hawaii. Free-text queries work well here.

## Format / convention tips

- **Time**: ISO 8601 with explicit `Z` is universally accepted. Some European servers also accept `+00:00`.
- **Variables**: most international ERDDAP follow CF Standard Names. The CF table at `https://cfconventions.org/standard-names.html` is authoritative.
- **Coordinate order**: bbox is always `west,south,east,north` regardless of provider.
- **Licenses**: vary by provider. EMODnet is generally CC-BY 4.0; IFREMER's CORIOLIS varies by program. Always check `properties.license` or the provider's terms-of-use page.

## Cross-source synthesis prompts

```
Compare in-situ ocean temperature observations in the Bay of Biscay
between IFREMER's CORIOLIS network and the Argo Global Repository (GADR)
for January 2024.
```

```
Show me all glider missions in Northern European seas — combine VOTO,
IFREMER, EMODnet, and Marine Institute Ireland.
```

## Related examples

- [`05-argo-float-profiles/`](../05-argo-float-profiles/) — Argo (GADR) is global; pair with regional in-situ
- [`13-deep-sea-exploration/`](../13-deep-sea-exploration/) — SeaTube ROV dives
- [`19-regional-deep-dives/`](../19-regional-deep-dives/) — the U.S. counterpart to this guide
