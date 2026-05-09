---
name: vessel-traffic-analyzer
description: Use when the user asks about AIS / vessel traffic — phrases like "vessel traffic in …", "shipping density near …", "fishing vessels off …", "port approaches to …", "tracks of MMSI {N}", "container ships in {region}". Encodes the MARINECADASTRE_AIS query patterns, the geohash-aggregate-first rule for density questions, and vessel-type filtering.
---

# Vessel traffic analyzer

AIS data lives in the `MARINECADASTRE_AIS` collection — NOAA's archive of US-coastal AIS feeds, with global coverage where vessels report through US-monitored receivers.

See [`vessel-types.md`](vessel-types.md) for the AIS vessel type code reference.

## The cardinal rule: aggregate before fetch

AIS items are **dense** — a busy port produces millions of points per day. Always start with `aggregate` for density / spatial questions. Only fall through to `search_datasets` for specific vessel tracks.

```
aggregate(
  collections=["MARINECADASTRE_AIS"],
  bbox=<bbox>,
  datetime="<start>/<end>",
  group_by="geohash",
  precision=5
)
```

This returns a heatmap-grade density grid in 1 call instead of 50.

## Pattern: "shipping density in X over Y"

```
1. bbox from user (use `bbox-from-region` if a named region)
2. aggregate(
     collections=["MARINECADASTRE_AIS"],
     bbox=bbox,
     datetime="<start>/<end>",
     group_by="geohash",
     precision=5  # ~5 km grid
   )
3. Plot or summarize the top N geohashes by count
```

For higher resolution, increase `precision` to 6 (~1 km) or 7 (~150 m); for coarser, decrease to 4 (~20 km).

## Pattern: "vessel types in X"

```
aggregate(
  collections=["MARINECADASTRE_AIS"],
  bbox=bbox,
  datetime="<start>/<end>",
  group_by="vessel_type"
)
```

Returns counts per AIS Type code. Map codes to names via [`vessel-types.md`](vessel-types.md).

## Pattern: "fishing vessels off X" (type-filtered)

```
search_datasets(
  collections=["MARINECADASTRE_AIS"],
  bbox=bbox,
  datetime="<start>/<end>",
  filter="properties.ais:vessel_type = 30",   # 30 = fishing
  filter_lang="cql2-text",
  limit=200
)
```

(`ais:vessel_type` is the standard property; verify on a sample item if unsure.)

## Pattern: specific MMSI lookup

```
search_datasets(
  collections=["MARINECADASTRE_AIS"],
  q="MMSI:<mmsi-number>",
  datetime="<wide range>",
  limit=500
)
```

Or if MMSI is exposed as a property:

```
filter="properties.ais:mmsi = '<mmsi>'"
```

## Pattern: port approach analysis

For "vessels approaching the Port of {X}":

1. Get a **tight** bbox around the port + outer approach zone (~5–10 km)
2. `aggregate(group_by="vessel_type")` to see breakdown
3. `search_datasets` with `limit=100` for specific tracks of cargo / tankers entering

Example for Port of Long Beach:

```
bbox = [-118.30, 33.65, -118.10, 33.80]
aggregate(collections=["MARINECADASTRE_AIS"], bbox=bbox, datetime="<7d>", group_by="vessel_type")
```

## Pattern: track reconstruction for a specific vessel

```
search_datasets(
  collections=["MARINECADASTRE_AIS"],
  filter="properties.ais:mmsi = '<mmsi>'",
  filter_lang="cql2-text",
  datetime="<start>/<end>",
  limit=2000   # AIS sends every few seconds; tracks are dense
)
```

Then sort items by timestamp and connect lat/lon points.

## Common AIS properties

| Property | Meaning |
|---|---|
| `ais:mmsi` | Maritime Mobile Service Identity (vessel identifier) |
| `ais:imo` | International Maritime Organization number (more permanent than MMSI) |
| `ais:vessel_type` | Vessel type code (see vessel-types.md) |
| `ais:vessel_name` | Free-text name |
| `ais:flag_country` | Vessel flag state |
| `ais:length`, `ais:width` | Dimensions (m) |
| `ais:draft` | Draft (m) |
| `ais:sog` | Speed over ground (knots) |
| `ais:cog` | Course over ground (degrees) |
| `ais:heading` | True heading (degrees) |
| `ais:nav_status` | Navigational status code (0=under way, 1=at anchor, 5=moored, 7=fishing, etc.) |

## Common pitfalls

- **AIS coverage is patchy offshore.** The `MARINECADASTRE_AIS` archive is biased toward US-coast receiver coverage. For Indian Ocean / Pacific open-water, expect gaps.
- **MMSIs change** when a vessel changes flag / owner. IMO numbers are more stable for long-term tracking.
- **Spoofing exists.** AIS can be falsified (fishing vessels turning off transponders, dark fleets). Treat AIS as one signal, not ground truth.
- **Class A vs Class B.** Larger commercial vessels (Class A) report every 2–10s; pleasure craft (Class B) every 30s–3min. Density estimates skew toward Class A.

## Cross-source workflow ideas

- **AIS + Sentinel-1 SAR**: detect "dark vessels" (visible on SAR but absent from AIS). See `oil-spill-response` for a worked example.
- **AIS + bathymetry (`BATHYMETRY`)**: identify vessels grounded or anchored over hazardous depths.
- **AIS + COOPS tide gauges**: anchored vessels' apparent drift correlates with tide flow — useful for current calibration in narrow channels.

## Worked example

> "Vessel traffic density in the approaches to the Port of Long Beach over the last week."

```
1. bbox = [-118.35, 33.60, -118.00, 33.85]
2. aggregate(
     collections=["MARINECADASTRE_AIS"],
     bbox=bbox,
     datetime="<7-days-ago>/<today>",
     group_by="geohash",
     precision=6
   )
3. Sort returned geohashes by count; report top 10 + cumulative density
4. (optional) Break out by vessel_type with a second aggregate call
```
