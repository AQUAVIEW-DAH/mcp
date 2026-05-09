---
name: bbox-from-region
description: Use whenever the user mentions a named ocean, sea, coastal region, or marine area — e.g. "Gulf of Mexico", "Mid-Atlantic Bight", "Sea of Cortez", "Florida Keys", "California Current System", "Arctic", "Hawaii EEZ", "Bering Sea", "Mediterranean". Provides the bbox to pass to AQUAVIEW MCP tools so the agent doesn't have to guess coordinates (which models do poorly for marine regions).
---

# Bbox from region

When the user names a marine region, look it up in the table below and pass the bbox as `[west, south, east, north]` to `search_datasets`, `aggregate`, or `get_item`.

If the region isn't in the table, you can:

1. Run `python skills/bbox-from-region/bbox.py "<region name>"` for a fuzzy match
2. Fall back to constructing a bbox from a known landmark (e.g., "near Hawaii" → small bbox around `[-160, 18, -154, 23]`)
3. Ask the user to confirm coordinates if precision matters

## Lookup table

### US coastal regions

| Region | bbox (W, S, E, N) |
|---|---|
| Gulf of Mexico | `[-98.0, 18.0, -80.5, 31.0]` |
| Florida Keys | `[-82.0, 24.4, -80.0, 25.4]` |
| Florida Straits | `[-82.5, 23.5, -79.5, 25.5]` |
| Mid-Atlantic Bight | `[-77.0, 35.0, -68.0, 41.5]` |
| Gulf of Maine | `[-71.0, 41.5, -65.5, 45.5]` |
| Chesapeake Bay | `[-77.5, 36.5, -75.5, 39.5]` |
| Long Island Sound | `[-74.0, 40.5, -71.5, 41.5]` |
| New York Bight | `[-74.5, 39.0, -71.0, 41.0]` |
| Cape Hatteras | `[-76.5, 34.5, -74.5, 35.5]` |
| Outer Banks | `[-76.5, 34.5, -75.0, 36.5]` |
| South Atlantic Bight | `[-82.0, 27.0, -76.0, 35.0]` |
| Pacific Northwest coast | `[-126.0, 41.0, -122.5, 49.0]` |
| Puget Sound / Salish Sea | `[-125.0, 47.0, -122.0, 49.5]` |
| Central California | `[-124.0, 35.0, -120.0, 39.0]` |
| Southern California Bight | `[-121.0, 32.0, -117.0, 35.0]` |
| Monterey Bay | `[-122.5, 36.5, -121.5, 37.0]` |
| San Francisco Bay | `[-123.0, 37.4, -121.8, 38.4]` |
| Gulf of Alaska | `[-160.0, 54.0, -132.0, 62.0]` |
| Bering Sea | `[-180.0, 53.0, -157.0, 66.0]` |
| Beaufort Sea (US) | `[-156.0, 69.0, -141.0, 76.0]` |
| Chukchi Sea | `[-180.0, 65.0, -156.0, 75.0]` |

### Lakes

| Region | bbox (W, S, E, N) |
|---|---|
| Lake Superior | `[-92.5, 46.5, -84.0, 49.0]` |
| Lake Michigan | `[-88.5, 41.5, -84.5, 46.0]` |
| Lake Huron | `[-84.5, 43.0, -79.5, 46.5]` |
| Lake Erie | `[-83.5, 41.4, -78.5, 43.0]` |
| Lake Ontario | `[-79.5, 43.0, -76.0, 44.5]` |
| Great Lakes (all) | `[-92.5, 41.4, -76.0, 49.0]` |

### Pacific / Atlantic ocean regions

| Region | bbox (W, S, E, N) |
|---|---|
| Hawaii EEZ | `[-180.0, 15.0, -150.0, 30.0]` |
| Hawaii main islands | `[-160.5, 18.5, -154.5, 22.5]` |
| Pacific Islands EEZ | `[-180.0, -20.0, -150.0, 30.0]` |
| Caribbean | `[-90.0, 9.0, -60.0, 25.0]` |
| North Atlantic (subpolar) | `[-60.0, 45.0, -10.0, 65.0]` |
| Sargasso Sea | `[-65.0, 25.0, -50.0, 35.0]` |
| Gulf Stream core | `[-80.0, 32.0, -60.0, 42.0]` |
| Equatorial Pacific | `[-180.0, -10.0, -80.0, 10.0]` |
| North Pacific subtropical | `[-180.0, 20.0, -120.0, 40.0]` |

### International / foreign

| Region | bbox (W, S, E, N) |
|---|---|
| Sea of Cortez | `[-115.5, 22.5, -108.5, 31.5]` |
| Mediterranean Sea | `[-6.0, 30.0, 36.0, 46.0]` |
| North Sea | `[-4.0, 51.0, 12.0, 62.0]` |
| Baltic Sea | `[10.0, 53.0, 30.0, 66.0]` |
| Black Sea | `[27.0, 40.0, 42.0, 47.5]` |
| Sea of Japan | `[127.0, 33.0, 142.0, 51.0]` |
| East China Sea | `[117.0, 24.0, 131.0, 33.0]` |
| South China Sea | `[105.0, 0.0, 122.0, 23.0]` |
| Coral Triangle | `[120.0, -10.0, 145.0, 10.0]` |
| Great Barrier Reef | `[142.0, -24.0, 154.0, -10.0]` |
| Southern Ocean | `[-180.0, -78.0, 180.0, -50.0]` |
| Arctic Ocean | `[-180.0, 66.5, 180.0, 90.0]` |
| Drake Passage | `[-70.0, -65.0, -55.0, -55.0]` |
| Labrador Sea | `[-65.0, 53.0, -45.0, 65.0]` |
| Norwegian Sea | `[-5.0, 62.0, 20.0, 75.0]` |

## Notes on bbox semantics

- Bbox is `[west, south, east, north]` in WGS84 decimal degrees
- For regions crossing the antimeridian (180°/-180°), AQUAVIEW accepts a bbox that extends across — e.g., the Bering Sea entry above
- Bbox is inclusive — items even partially overlapping are returned
- Smaller bboxes are faster; for tight questions (e.g., "off the Big Sur coast"), a bbox of ~1°×1° is often enough
