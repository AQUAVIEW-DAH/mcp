# Sea surface temperature near the Florida Keys

Discover and download recent satellite SST products and in-situ buoy temperatures for a coastal region.

## What this teaches

- How to scope a free-text query with `bbox` for a coastal region
- Why `exclude_collections` matters for free-text searches
- How to combine satellite-derived (CoastWatch) and in-situ (NDBC) sources
- How to follow up with `get_item` to retrieve actual file URLs

**Sources used**: `COASTWATCH`, `COASTWATCH_CWCGOM`, `NDBC`

---

## Prompt

```
Find me sea surface temperature data near the Florida Keys for the last
two weeks, both from satellite and from NOAA buoys. Give me the actual
download URLs for the top three results.
```

## Transcript

The agent's tool calls, in order:

### 1. First search — discovers noise

```python
search_datasets(
  q = "sea surface temperature",
  bbox = "-83,24,-80,25.5",
  datetime = "2026-04-21T00:00:00Z/2026-05-05T00:00:00Z",
  limit = 5
)
```

> Returned 8,396 matches but the top results are oil-spill incident reports
> (`INCIDENT_NEWS`) and a regulatory boundary layer (`MARINECADASTRE_AIS`).
> The free-text query is matching descriptions that mention "sea" and
> "temperature" in unrelated contexts.

### 2. Refined search — scope to SST sources

```python
search_datasets(
  q = "sea surface temperature",
  bbox = "-83,24,-80,25.5",
  datetime = "2026-04-21T00:00:00Z/2026-05-05T23:59:59Z",
  collections = "COASTWATCH,COASTWATCH_CWCGOM,NDBC",
  limit = 10
)
```

> 32 matches. Real top hits (the noise is gone):

| ID | Collection | Title | Most-recent datetime |
|---|---|---|---|
| `noaacwLEOACSPOSSTL3SnrtPMNight` | `COASTWATCH` | NOAA ACSPO Daily Global 0.02° Gridded SST + thermal fronts (PM Night) | 2026-04-19 |
| `noaacwLEOACSPOSSTL3SnrtPMDay` | `COASTWATCH` | NOAA ACSPO Daily Global 0.02° Gridded SST + thermal fronts (PM Day) | 2026-04-18 |
| `noaacwOHC14na` | `COASTWATCH` | Ocean Heat Content (North Atlantic) — includes SST, SSHA, isotherm depths | 2024-01-15 |
| `noaacwOHC14np` | `COASTWATCH` | Ocean Heat Content (North Pacific) — same product, different basin | 2024-01-15 |
| `noaacweddymesidaily` | `COASTWATCH` | Multiparameter Eddy Significance Index (uses SST as input) | 2020-05-05 |

The two ACSPO products are the real SST grids — 0.02° resolution, near-real-time, separate Day/Night composites with thermal-front detection.

### 3. NDBC buoys near the Florida Keys

```python
search_datasets(
  collections = "NDBC",
  bbox = "-83,24,-80,25.5",
  limit = 5
)
```

> 50 matches. Real responses include:

| Buoy ID | Location | Owner | Water temp range |
|---|---|---|---|
| `ndbc_jbyf1` | Joe Bay, FL (25.22°N, 80.54°W) | Everglades NP | 10.8 – 26.7 °C |
| `ndbc_thrf1` | Thursday Point, FL (25.20°N, 80.37°W) | Everglades NP | 11.4 – 26.6 °C |
| `ndbc_bbsf1` | BBCW10, Biscayne Bay (25.47°N, 80.35°W) | Everglades NP | (full water-quality suite) |
| `ndbc_42095` | Satan Shoal, FL (24.41°N, 81.97°W) | USACE | 21.4 – 25.8 °C |
| `ndbc_42079` | Bahia Honda Key, FL (24.54°N, 81.24°W) | USACE | (moored buoy with met + waves) |

### 4. Get download URLs for top three

```python
get_item(collection = "COASTWATCH", item_id = "noaacwLEOACSPOSSTL3SnrtPMDay")
get_item(collection = "NDBC", item_id = "ndbc_42095")
get_item(collection = "NDBC", item_id = "ndbc_jbyf1")
```

> Each `get_item` returns the full `assets` block. NDBC items expose realtime CSV at `https://www.ndbc.noaa.gov/data/realtime2/<STATION>.txt` and historical NetCDF on the NDBC THREDDS server. CoastWatch items expose ERDDAP griddap (NetCDF, GeoTIFF, KML, etc.) via `https://coastwatch.noaa.gov/erddap/griddap/<DATASET>.html`.

## Result the agent gave

> *"For SST near the Florida Keys, last two weeks (datetime-filtered to April 21 – May 5 2026):*
>
> *Satellite — `noaacwLEOACSPOSSTL3SnrtPMDay` and `noaacwLEOACSPOSSTL3SnrtPMNight` are the real-time SST products you want. NOAA NESDIS/OSPO produces these daily at 0.02° global resolution, separating PM Day and PM Night composites. The most recent items I see are dated April 18–19. Both deliver SST + thermal-front gradients via ERDDAP at https://coastwatch.noaa.gov/erddap.*
>
> *In-situ — five NDBC buoys cover the Keys area: `ndbc_jbyf1` (Joe Bay), `ndbc_thrf1` (Thursday Point), and `ndbc_bbsf1` (BBCW10) are Everglades NP water-quality stations with full chlorophyll/DO/pH/turbidity suites; `ndbc_42095` (Satan Shoal) and `ndbc_42079` (Bahia Honda Key) are USACE wave + met buoys. Realtime CSVs are at https://www.ndbc.noaa.gov/data/realtime2/<station>.txt — e.g., https://www.ndbc.noaa.gov/data/realtime2/42095.txt for Satan Shoal.*
>
> *Bonus — `noaacwOHC14na` is a great companion product if you want SST plus 20°C / 26°C isotherm depths and ocean heat content for the North Atlantic basin context."*

## Variations

- **Different region**: change the `bbox`. For Gulf of Maine: `-71,41,-65,45`.
- **Different time window**: `datetime = "2024-09-01T00:00:00Z/2024-09-30T23:59:59Z"` for September 2024.
- **Just the gridded product**: `collections = "COASTWATCH,COASTWATCH_CWCGOM"`.
- **Only buoys with active wave-height records**: add `filter` on `aquaview:column_stats_summary.variables.Wave Height.count > 0`.

## Related examples

- [`03-hurricane-tracking/`](../03-hurricane-tracking/) — same region, storm context
- [`08-ocean-color-chlorophyll/`](../08-ocean-color-chlorophyll/) — pair SST with chlorophyll
- [`19-regional-deep-dives/secoora/`](../19-regional-deep-dives/) — deep dive on the Southeast IOOS RA
