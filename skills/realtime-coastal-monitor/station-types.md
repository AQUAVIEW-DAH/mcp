# Station type reference

Per-collection station inventory and what each is good for.

## NDBC — National Data Buoy Center

Offshore moored buoys + Coastal-Marine Automated Network (C-MAN) shore stations. Operated by NOAA.

| Variable | Coverage |
|---|---|
| Wave height (Hs) | All NDBC buoys |
| Wave period (Tp / Tm) | Most NDBC buoys |
| Wave direction | ~60% of buoys (directional Waverider type) |
| Wind speed / direction / gust | All NDBC buoys |
| SST | All NDBC buoys |
| Air temp / pressure | All NDBC buoys + C-MAN |
| Subsurface T (thermistor strings) | A subset of moored buoys |
| Currents | A subset (ADCP-equipped) |

Station-ID convention: 5 digits (e.g., `46042` = Monterey Bay; `42022` = Eastern Gulf).

## COOPS — NOAA Center for Operational Oceanographic Products and Services

Coastal tide gauges + PORTS sensor packages.

| Variable | Coverage |
|---|---|
| Water level (verified, prelim, predicted) | All CO-OPS stations |
| Currents (PORTS only) | ~20-30 major US ports |
| Air temp / wind / pressure | All stations |
| SST | All stations |
| Conductivity / salinity | A subset |

Station-ID convention: 7 digits (e.g., `8725520` = Fort Myers, FL).

`NOS_COOPS` is the legacy ERDDAP-style name; both collections cover the same data.

## CDIP — Coastal Data Information Program

UCSD/Scripps wave-buoy network — specializes in directional wave spectra.

| Variable | Coverage |
|---|---|
| Hs, Tp, Tm | All CDIP buoys |
| Directional wave spectrum | Most CDIP buoys |
| Surface temp | Most |
| Surface currents (limited) | A subset |

Station-ID convention: 3-digit (e.g., `100` = Torrey Pines outer, `132` = San Nicolas Island).

## IOOS_SENSORS

Aggregates all 11 regional associations' sensor feeds. Variables span the union of all RAs:

| Variable | Notes |
|---|---|
| All NDBC variables | Plus regional moorings |
| Tide gauges | Some regional small-port gauges not in CO-OPS |
| HF radar grids | Not point sensors per se but indexed similarly |
| Glider observations | (also see `glider-mission-tracker`) |
| Buoy + autonomous platform | Multi-source |

If unsure which RA covers the user's region, query `IOOS_SENSORS` first and inspect the returned items to identify the regional association.

## Per-RA collections

| Collection | Region |
|---|---|
| `MARACOOS` | Mid-Atlantic (NJ → VA) |
| `NERACOOS` | Northeast (ME → NY) |
| `SECOORA` | Southeast (NC → FL) |
| `CARICOOS` | Caribbean (PR, USVI) |
| `CENCOOS` | Central California |
| `CALOOS` | Southern California |
| `NANOOS` | Pacific Northwest (OR + WA) |
| `AOOS` | Alaska |
| `PacIOOS` | Pacific Islands (Hawaii + territories) |
| `GLOS` | Great Lakes |
| `GCOOS_HIST` | Gulf of Mexico (historical) |

For "live" Gulf of Mexico data, prefer `IOOS_SENSORS` or the relevant per-state collection — `GCOOS_HIST` is the historical archive.

## Picking quickly

| User request mentions… | Pick |
|---|---|
| "buoy", "offshore", "wave height", "wind" | `NDBC` |
| "tide", "water level", "storm surge", "port" | `COOPS` |
| "wave spectrum", "swell direction" | `CDIP` |
| Unknown region or multi-variable | `IOOS_SENSORS` first |
| Specific RA name (e.g., "MARACOOS") | That RA's collection directly |
