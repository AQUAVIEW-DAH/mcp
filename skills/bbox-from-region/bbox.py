#!/usr/bin/env python3
"""
bbox.py — look up the bounding box for a named ocean / marine region.

Usage:
    python bbox.py "Gulf of Mexico"
    python bbox.py "Florida Keys"
    python bbox.py mid-atlantic                # fuzzy match

Bboxes are [west, south, east, north] in WGS84 decimal degrees.
"""
from __future__ import annotations

import sys
from difflib import get_close_matches

REGIONS: dict[str, list[float]] = {
    # US coastal
    "gulf of mexico": [-98.0, 18.0, -80.5, 31.0],
    "florida keys": [-82.0, 24.4, -80.0, 25.4],
    "florida straits": [-82.5, 23.5, -79.5, 25.5],
    "mid-atlantic bight": [-77.0, 35.0, -68.0, 41.5],
    "gulf of maine": [-71.0, 41.5, -65.5, 45.5],
    "chesapeake bay": [-77.5, 36.5, -75.5, 39.5],
    "long island sound": [-74.0, 40.5, -71.5, 41.5],
    "new york bight": [-74.5, 39.0, -71.0, 41.0],
    "cape hatteras": [-76.5, 34.5, -74.5, 35.5],
    "outer banks": [-76.5, 34.5, -75.0, 36.5],
    "south atlantic bight": [-82.0, 27.0, -76.0, 35.0],
    "pacific northwest coast": [-126.0, 41.0, -122.5, 49.0],
    "puget sound": [-125.0, 47.0, -122.0, 49.5],
    "salish sea": [-125.0, 47.0, -122.0, 49.5],
    "central california": [-124.0, 35.0, -120.0, 39.0],
    "southern california bight": [-121.0, 32.0, -117.0, 35.0],
    "monterey bay": [-122.5, 36.5, -121.5, 37.0],
    "san francisco bay": [-123.0, 37.4, -121.8, 38.4],
    "gulf of alaska": [-160.0, 54.0, -132.0, 62.0],
    "bering sea": [-180.0, 53.0, -157.0, 66.0],
    "beaufort sea": [-156.0, 69.0, -141.0, 76.0],
    "chukchi sea": [-180.0, 65.0, -156.0, 75.0],

    # Lakes
    "lake superior": [-92.5, 46.5, -84.0, 49.0],
    "lake michigan": [-88.5, 41.5, -84.5, 46.0],
    "lake huron": [-84.5, 43.0, -79.5, 46.5],
    "lake erie": [-83.5, 41.4, -78.5, 43.0],
    "lake ontario": [-79.5, 43.0, -76.0, 44.5],
    "great lakes": [-92.5, 41.4, -76.0, 49.0],

    # Ocean regions
    "hawaii eez": [-180.0, 15.0, -150.0, 30.0],
    "hawaii": [-160.5, 18.5, -154.5, 22.5],
    "pacific islands eez": [-180.0, -20.0, -150.0, 30.0],
    "caribbean": [-90.0, 9.0, -60.0, 25.0],
    "north atlantic subpolar": [-60.0, 45.0, -10.0, 65.0],
    "sargasso sea": [-65.0, 25.0, -50.0, 35.0],
    "gulf stream": [-80.0, 32.0, -60.0, 42.0],
    "equatorial pacific": [-180.0, -10.0, -80.0, 10.0],
    "north pacific subtropical": [-180.0, 20.0, -120.0, 40.0],

    # International
    "sea of cortez": [-115.5, 22.5, -108.5, 31.5],
    "mediterranean sea": [-6.0, 30.0, 36.0, 46.0],
    "north sea": [-4.0, 51.0, 12.0, 62.0],
    "baltic sea": [10.0, 53.0, 30.0, 66.0],
    "black sea": [27.0, 40.0, 42.0, 47.5],
    "sea of japan": [127.0, 33.0, 142.0, 51.0],
    "east china sea": [117.0, 24.0, 131.0, 33.0],
    "south china sea": [105.0, 0.0, 122.0, 23.0],
    "coral triangle": [120.0, -10.0, 145.0, 10.0],
    "great barrier reef": [142.0, -24.0, 154.0, -10.0],
    "southern ocean": [-180.0, -78.0, 180.0, -50.0],
    "arctic ocean": [-180.0, 66.5, 180.0, 90.0],
    "drake passage": [-70.0, -65.0, -55.0, -55.0],
    "labrador sea": [-65.0, 53.0, -45.0, 65.0],
    "norwegian sea": [-5.0, 62.0, 20.0, 75.0],
}


def lookup(query: str) -> tuple[str, list[float]] | None:
    q = query.lower().strip()
    if q in REGIONS:
        return q, REGIONS[q]

    matches = get_close_matches(q, REGIONS.keys(), n=1, cutoff=0.6)
    if matches:
        return matches[0], REGIONS[matches[0]]

    for key in REGIONS:
        if q in key or key in q:
            return key, REGIONS[key]

    return None


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__)
        return 1

    query = " ".join(argv[1:])
    result = lookup(query)
    if result is None:
        print(f"No match for '{query}'.")
        print(f"Try one of: {', '.join(sorted(REGIONS.keys())[:8])}, ...")
        return 2

    name, bbox = result
    print(f"Region: {name}")
    print(f"bbox:   {bbox}  # [west, south, east, north]")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
