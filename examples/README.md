# Examples

Real walkthroughs of asking AQUAVIEW MCP questions you'd actually ask. Each folder contains:

- The plain-English **prompt**
- The **transcript** of the agent's tool calls
- The **result** the agent returned
- **Variations** to try
- **Sources used**

| # | Folder | Question | Sources |
|---|---|---|---|
| 01 | [`01-quickstart/`](01-quickstart/) | Verify the wiring; first dataset | any |
| 02 | [`02-sea-surface-temperature/`](02-sea-surface-temperature/) | SST near the Florida Keys | `COASTWATCH`, `NDBC` |
| 03 | [`03-hurricane-tracking/`](03-hurricane-tracking/) | Track and intensity of Hurricane Ian | `NDBC`, `GOES_R`, `NOAA_AOML_HDB`, `NOAA_GDP` |
| 04 | [`04-tides-and-storm-surge/`](04-tides-and-storm-surge/) | CO-OPS tide gauge at Charleston, SC | `COOPS` |
| 05 | [`05-argo-float-profiles/`](05-argo-float-profiles/) | Argo profiles around Hawaii | `GADR` |
| 06 | [`06-hf-radar-surface-currents/`](06-hf-radar-surface-currents/) | Surface currents off SoCal | `IOOS_HFRADAR` |
| 07 | [`07-glider-missions/`](07-glider-missions/) | Underwater glider deployments | `IOOS` |
| 08 | [`08-ocean-color-chlorophyll/`](08-ocean-color-chlorophyll/) | Chlorophyll & HAB forecasts | `COASTWATCH`, `COASTWATCH_WC` |
| 09 | [`09-nexrad-severe-weather/`](09-nexrad-severe-weather/) | NEXRAD radar during Hurricane Helene | `NEXRAD_L2`, `NEXRAD` |
| 10 | [`10-hrrr-forecast/`](10-hrrr-forecast/) | NOAA HRRR weather model output | `HRRR` |
| 11 | [`11-great-lakes/`](11-great-lakes/) | Lake Michigan buoys near Chicago | `GLERL`, `GLOS` |
| 12 | [`12-arctic-sea-ice/`](12-arctic-sea-ice/) | Polar SST + sea ice from Alaska | `POLARWATCH`, `GADR`, `AOOS` |
| 13 | [`13-deep-sea-exploration/`](13-deep-sea-exploration/) | Okeanos Explorer ROV dives | `HYPERION`, `SEATUBE` |
| 14 | [`14-vessel-traffic-ais/`](14-vessel-traffic-ais/) | AIS + MarineCadastre layers | `MARINECADASTRE_AIS` |
| 15 | [`15-oil-spill-response/`](15-oil-spill-response/) | Marine pollution incidents | `INCIDENT_NEWS`, `NOAA_ORR` |
| 16 | [`16-biogeochemistry/`](16-biogeochemistry/) | Cruise-based BGC + WOD profiles | `BCODM`, `WOD` |
| 17 | [`17-bathymetry/`](17-bathymetry/) | Hydrographic surveys, BAGs, DEMs | `BATHYMETRY`, `DIGITALCOAST` |
| 18 | [`18-fisheries-science/`](18-fisheries-science/) | Bottom temperature & NMFS centers | `NEFSC`, `AFSC`, `NWFSC`, `PIFSC`, `SEFSC` |
| 19 | [`19-regional-deep-dives/`](19-regional-deep-dives/) | 11 IOOS Regional Associations | all IOOS RAs |
| 20 | [`20-international-sources/`](20-international-sources/) | IFREMER, EMODnet, ONC, VOTO, etc. | `IFREMER`, `EMODNET_PHYSICS`, `SEATUBE`, ... |
| 21 | [`21-satellite-imagery/`](21-satellite-imagery/) | Sentinel-1/2, HLS, ESA WorldCover | `sentinel-1-grd`, `sentinel-2-l2a`, `hls2-l30`, `esa-worldcover` |

## Advanced

Deeper, technique-focused guides in [`advanced/`](advanced/):

- [`advanced/cql2-filtering.md`](advanced/cql2-filtering.md) — filter on `column_stats_summary` and other nested properties
- [`advanced/aggregations-cookbook.md`](advanced/aggregations-cookbook.md) — counts, histograms, geohash heatmaps
- [`advanced/pagination-and-large-queries.md`](advanced/pagination-and-large-queries.md) — paging patterns and field projection

## How to run an example

1. Make sure AQUAVIEW MCP is connected to your client — see [`../INSTALL.md`](../INSTALL.md).
2. Open the example's `README.md`.
3. Copy the **prompt** into your chat.
4. Compare what your agent does against the transcript.

The tool calls and responses shown in each transcript section were captured live against `mcp.aquaview.org/mcp`. The "Result the agent gave" sections are written by `claude-opus-4-7` working with the catalog through the same MCP. Different models / different runs will phrase the answer differently, and the catalog itself changes over time as new datasets are indexed — so the exact item IDs, counts, and statistics you see when you copy a prompt may differ from the snapshot here.
