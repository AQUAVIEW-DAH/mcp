# Prompt recipes

Short, copy-pasteable prompt templates for common Aquaview MCP scenarios. Drop these into Claude Desktop, ChatGPT, Cursor, or any MCP-enabled client.

## System prompt — research assistant

```
You are an ocean and atmospheric data research assistant with access to
Aquaview MCP, a unified STAC catalog of 700,000+ datasets across 68
sources (NOAA, IOOS, World Ocean Database, Argo, GOES-R, NEXRAD, ESA
Sentinel, IFREMER, EMODnet, Ocean Networks Canada, and more).

When the user asks about a region, prefer `bbox` over including the
region name in the free-text `q`. When the user asks "how many" or
"where are the hot spots," prefer `aggregate` over `search_datasets`.
When the user asks for download links, follow up search results with
`get_item`. Always cite the collection ID and item ID for any specific
dataset you reference.

Avoid free-text searches that aren't scoped to relevant collections —
they pull in unrelated incident reports and regulatory boundary layers.
Use `exclude_collections="INCIDENT_NEWS"` on broad searches.
```

## User prompts

### Region survey

```
What ocean and atmospheric data sources does Aquaview have for {REGION}?
Use an aggregation to break down by collection. Then list the top 3
collections with example item IDs.
```

### Realtime ask

```
What's the current {VARIABLE} near {LOCATION}? Give me the most recent
buoy or sensor reading along with the source URL.
```

### Storm reconstruction

```
{STORM NAME} made landfall near {LOCATION} on {DATE}. Find me NDBC
buoys along its track that recorded extreme {VARIABLE}, GOES-R imagery
for that day, and any tropical cyclone heat potential data from AOML
for the days leading up to landfall.
```

### Argo profile search

```
Find Argo float profiles {WITHIN N KM OF / IN BBOX} {LOCATION} from
{TIME RANGE} where the float reached at least {N} dbar pressure.
Summarize temperature/salinity ranges and provide download links for
the top three.
```

### Cross-source correlation

```
Compare {SOURCE_A} {VARIABLE_A} and {SOURCE_B} {VARIABLE_B} during
{EVENT} in {REGION}. Note any leads / lags between the two signals.
```

### Catalog scoping

```
List the Aquaview collections that contain {VARIABLE} measurements in
{REGION}. For each, give the temporal extent and an example item ID I
can fetch with get_item.
```

### Vessel traffic / AIS

```
Show vessel traffic density in the approaches to {PORT NAME}. Use the
MarineCadastre AIS collection. Give me a heatmap aggregation at
geohash precision 5.
```

### Bathymetry

```
What bathymetric surveys cover {REGION}? Give me the highest-resolution
DEMs available with download links.
```

### Sea ice trend

```
How has sea ice extent in the {ARCTIC / ANTARCTIC} changed over the
last {N} years? Use PolarWatch and aggregate annually.
```

### Satellite scene lookup

```
Find Sentinel-2 L2A scenes over {LOCATION} between {START} and {END}
with cloud cover under {N}%. Give me the COG URLs.
```

## Tips for crafting your own

- **Always include time and place** — they're the two things the agent can't infer.
- **Name the source family** if you know it (e.g., "Argo / GADR", "NDBC buoys", "GOES-R imagery") to short-circuit the catalog scan.
- **Ask for download URLs explicitly** when you want them — by default search results omit the asset hrefs to save tokens.
- **Use `aggregate` for shape questions** ("how many", "where are the hot spots", "per month"). Use `search_datasets` for actual items.

See [`../docs/prompting-guide.md`](../docs/prompting-guide.md) for the full guide.
