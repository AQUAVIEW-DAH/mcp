# Collections

Aquaview's catalog unifies **68 source collections** spanning **~700,000 datasets** of ocean, atmospheric, and marine data. Every source is normalized to the [STAC](https://stacspec.org/) item model, so you can search, filter, aggregate, and fetch across all of them with the same four tools.

This page lists every collection grouped by provider family. Use the **ID** column with the `collections` parameter of `search_datasets` and `aggregate`.

> Counts and bbox coverage shown below are global where the underlying source serves global data; many regional sources still have global bounding boxes because the catalog stores spatial extent at the collection level rather than the typical observation footprint.

## Quick navigation

- [NOAA core programs](#noaa-core-programs)
- [NOAA satellite & weather](#noaa-satellite--weather)
- [NOAA laboratories & global programs](#noaa-laboratories--global-programs)
- [NOAA NMFS fisheries science centers](#noaa-nmfs-fisheries-science-centers)
- [IOOS Regional Associations & coordinated networks](#ioos-regional-associations--coordinated-networks)
- [International partners](#international-partners)
- [Universities & research programs](#universities--research-programs)
- [Global satellite imagery](#global-satellite-imagery)

---

## NOAA core programs

National observation networks operated directly by NOAA line offices.

| ID | Title | What's inside |
|---|---|---|
| `NOAA` | NOAA ERDDAP (NCEI) | Catch-all NCEI ERDDAP — climate and ocean datasets |
| `NDBC` | NOAA National Data Buoy Center | Wave height, wind, water/air temp, pressure from active and historical buoys; realtime and THREDDS/OpenDAP archives |
| `COOPS` | NOAA CO-OPS Tides and Currents | 200+ stations: water level, tide predictions, currents, met observations |
| `NOS_COOPS` | NOAA NOS CO-OPS ERDDAP | CO-OPS data via the NOS ERDDAP endpoint |
| `COOP` | NOAA COOP Hourly Precipitation | Hourly precipitation from the volunteer Cooperative Observer network |
| `BATHYMETRY` | NOAA Bathymetry Surveys | Hydrographic surveys, BAGs, DEMs, acoustic backscatter from NCEI + Office of Coastal Survey |
| `DIGITALCOAST` | NOAA Digital Coast | Ortho imagery, DEMs, lidar point clouds, land cover for coastal U.S. |
| `MARINECADASTRE_AIS` | NOAA MarineCadastre & AIS | Nationwide AIS vessel traffic, transit counts, density maps; 90+ geospatial layers |
| `INCIDENT_NEWS` | NOAA Incident News | Oil spill and marine pollution incident reports from ORR |
| `NOAA_ORR` | NOAA ORR DIVER | Environmental contaminant and bioassay data from Office of Response & Restoration |
| `HYPERION` | Hyperion / Okeanos Explorer | Deep-sea ROV mission data from NOAA Okeanos Explorer expeditions |

## NOAA satellite & weather

Satellite-derived products and weather model output.

| ID | Title | What's inside |
|---|---|---|
| `GOES_R` | NOAA GOES-R Satellites | GOES-16/17/18/19 ABI imagery, GLM lightning, fire detection, aerosol, SST, space weather (NetCDF on GCS) |
| `HRRR` | NOAA HRRR Weather Model | 3 km hourly NWP for CONUS + Alaska; GRIB2 archive 2014–present (GCS) |
| `NEXRAD` | NOAA NEXRAD Level III | Processed reflectivity, velocity, precipitation products per WSR-88D station |
| `NEXRAD_L2` | NOAA NEXRAD Level II | Raw radar volume scans incl. dual-pol; 1991–present archive |
| `COASTWATCH` | NOAA CoastWatch ERDDAP | Satellite ocean and coastal monitoring products (chlorophyll, SST, ocean color) |
| `COASTWATCH_CWCGOM` | CoastWatch Caribbean / Gulf of Mexico | AOML CWCGOM node — satellite + ocean datasets focused on the Caribbean/GoM |
| `COASTWATCH_WC` | CoastWatch West Coast (ERD) | NESDIS West Coast node co-located with NOAA ERD; SST and model products |
| `POLARWATCH` | NOAA PolarWatch | Arctic/Antarctic sea ice, SST, ocean color, wind, salinity |

## NOAA laboratories & global programs

Long-running observational programs and research labs.

| ID | Title | What's inside |
|---|---|---|
| `PMEL` | NOAA PMEL ERDDAP | Pacific Marine Environmental Laboratory — ocean and atmospheric science datasets |
| `PMEL_GENERIC` | PMEL Generic ERDDAP | Additional PMEL data holdings on the generic endpoint |
| `GLERL` | NOAA GLERL ERDDAP | Great Lakes — water temp, ice cover, water levels, currents, ecosystem |
| `NOAA_GLERL` | NOAA GLERL (alt endpoint) | GLERL data via the NOAA-flavored endpoint |
| `NOAA_AOML_HDB` | AOML Tropical Cyclone Heat Potential | Hurricane / tropical cyclone heat-potential datasets from AOML's Historical Oceanographic Database |
| `NOAA_GDP` | Global Drifter Program (6h interpolated) | ~1,000+ active SVP drifters: 15-m current velocity + SST since 1979 |
| `GADR` | Global Argo Data Repository | QC'd profile observations from ~4,000 Argo floats: temperature, salinity, pressure |
| `UAF` | NOAA GEO-IDE UAF ERDDAP | Aggregator hosted by SWFSC ERD with 9,000+ datasets across providers |
| `GOOS` | Global Ocean Observing System | NOAA + WMO coordinated global ocean observation datasets |

## NOAA NMFS fisheries science centers

Five regional NMFS centers.

| ID | Title | Region |
|---|---|---|
| `AFSC` | Alaska Fisheries Science Center | Alaska / Bering Sea / Arctic |
| `NEFSC` | Northeast Fisheries Science Center | NE U.S. shelf (hydro profiles, bottom temps, ocean color, SST) |
| `NWFSC` | Northwest Fisheries Science Center | Pacific Northwest |
| `PIFSC` | Pacific Islands Fisheries Science Center | Hawaii / Pacific Islands |
| `SEFSC` | Southeast Fisheries Science Center | Gulf of Mexico / Atlantic SE |

## IOOS Regional Associations & coordinated networks

The eleven U.S. Integrated Ocean Observing System Regional Associations plus IOOS-coordinated networks.

| ID | Title | Region |
|---|---|---|
| `AOOS` | Alaska Ocean Observing System | Alaska, Arctic |
| `CALOOS` | California Ocean Observing System | California (state-wide) |
| `CARICOOS` | Caribbean Coastal OOS | Puerto Rico, USVI |
| `CDIP` | Coastal Data Information Program | Wave/SST nearshore (Scripps + USACE) |
| `CENCOOS` | Central & Northern California OOS | Oregon border to Point Conception |
| `GLOS` | Great Lakes Observing System | Laurentian Great Lakes |
| `IOOS` | IOOS Glider Data Assembly Center | Underwater glider deployments nationwide |
| `IOOS_HFRADAR` | IOOS HF Radar Network | Surface currents, U.S. coasts |
| `IOOS_OFFICE` | IOOS Program Office ERDDAP | Coastal observation datasets |
| `IOOS_SENSORS` | IOOS Sensor Observation Service | Sensor network observations |
| `MARACOOS` | Mid-Atlantic Regional ACOOS | Cape Cod to Cape Hatteras (Rutgers) |
| `NANOOS` | Northwest Association of Networked OOS | Pacific Northwest |
| `NERACOOS` | Northeast Regional ACOOS | Gulf of Maine, New England |
| `PacIOOS` | Pacific Islands OOS | Hawaii, Pacific Islands |
| `SECOORA` | Southeast Coastal OOS Regional Association | U.S. Southeast coast + GoM |

## International partners

Non-U.S. observing systems and research data centers.

| ID | Title | Provider |
|---|---|---|
| `APDRC` | Asia-Pacific Data Research Center | University of Hawaii |
| `BCODM` | Biological & Chemical Oceanography DMO | NSF / WHOI |
| `CORIOLIS` | CORIOLIS ERDDAP | IFREMER (France) |
| `IFREMER` | IFREMER ERDDAP | French Research Institute for Exploitation of the Sea |
| `EMODNET_PHYSICS` | EMODnet Physics ERDDAP | European Marine Observation & Data Network |
| `MARINE_IRELAND` | Marine Institute Ireland ERDDAP | Marine Institute (Ireland) |
| `SEATUBE` | Ocean Networks Canada — SeaTube | ONC ROV deep-sea video and dive data |
| `VOICE_OF_THE_OCEAN` | Voice of the Ocean ERDDAP | VOTO Foundation glider data |

## Universities & research programs

Major academic and program-driven observatories.

| ID | Title | Provider |
|---|---|---|
| `OOI` | Ocean Observatories Initiative ERDDAP | NSF |
| `OOI_GOLDCOPY` | OOI Gold Copy ERDDAP | NSF — long-term archive |
| `NWEM` | Northwest Environmental Moorings | UW Applied Physics Lab |
| `SALISH_SEA_UBC` | Salish Sea ERDDAP | UBC |
| `SPRAY` | Spray Underwater Glider | Scripps / UCSD |
| `GCOOS_HIST` | GCOOS Historical Collections | Texas A&M (archival GoM CTD/mooring/ship/float data) |
| `WOD` | World Ocean Database | NOAA NCEI — bottle, CTD, XBT, float, glider profiles 1770–present |

## Global satellite imagery

Earth observation imagery indexed alongside ocean data for combined analyses (e.g., correlating SST with chlorophyll, or vessel traffic with land cover).

| ID | Title | Provider |
|---|---|---|
| `sentinel-1-grd` | Sentinel-1 GRD | ESA — C-band SAR, 6-day revisit |
| `sentinel-2-l2a` | Sentinel-2 L2A | ESA — multispectral surface reflectance |
| `hls2-l30` | Harmonized Landsat Sentinel-2 (Landsat L30) | NASA / USGS |
| `esa-worldcover` | ESA WorldCover | 10 m global land cover, 2020 + 2021 |

---

## How to choose collections

- **Region first?** Pick the relevant IOOS Regional Association — they curate buoys, gliders, HF radar, and forecasts for their region.
- **Variable first?** Use free-text `q` and let the catalog span all sources, or scope to the right family: `GADR` for Argo, `NDBC` for buoys, `COOPS` for tides, `GOES_R` for satellite imagery, `NEXRAD_L2` for radar volumes.
- **Time series across decades?** `WOD` (1770→), `NDBC` (historical archives), `NEXRAD_L2` (1991→), `HRRR` (2014→), `NOAA_GDP` (1979→).
- **Don't know what's available?** Run `list_collections` then ask the model to scope from there.

The [`prompting-guide.md`](prompting-guide.md) page walks through choosing the right collections for common research questions.
