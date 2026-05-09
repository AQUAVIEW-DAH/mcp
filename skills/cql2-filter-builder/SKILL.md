---
name: cql2-filter-builder
description: Use when the user wants to filter AQUAVIEW search results on numerical thresholds for ocean/atmospheric variables — phrases like "waves over 6 m", "SST above 28°C", "min pressure under 10 dbar", "salinity between 34 and 35", "wind speed greater than 25 m/s". Encodes CQL2 syntax for STAC item statistics so the agent emits valid filters on the first try.
---

# CQL2 filter builder

AQUAVIEW indexes per-variable statistics on every STAC item under `properties.cube:variables`. CQL2 lets you filter on those stats without fetching items first.

## The path pattern

For any variable `<VAR>`, the filterable paths are:

```
properties->>'cube:variables'->>'<VAR>'->>'min'
properties->>'cube:variables'->>'<VAR>'->>'max'
properties->>'cube:variables'->>'<VAR>'->>'mean'
properties->>'cube:variables'->>'<VAR>'->>'std'
```

For STAC-standard properties (cloud cover, instrument, off-nadir), use direct property paths:

```
properties.eo:cloud_cover
properties.platform
properties.sar:instrument_mode
properties.sar:polarizations
```

## Comparison + composition

CQL2-Text uses SQL-like syntax:

```
properties->>'cube:variables'->>'wave_height'->>'max' > 6
```

Combine with `AND` / `OR`:

```
properties->>'cube:variables'->>'wave_height'->>'max' > 6
AND properties->>'cube:variables'->>'wind_speed'->>'mean' > 15
```

Pass to `search_datasets` as `filter="<CQL2>"` with `filter_lang="cql2-text"`.

## Common gotchas

- **Variable name casing matters.** It's `sst`, not `SST`. It's `wave_height`, not `Wave_Height`. When unsure, run `search_datasets` once with `limit=1` and inspect `properties['cube:variables']` keys before authoring the filter.
- **Per-collection naming differs.** `sst` in COASTWATCH may be `analysed_sst` in another collection. The skill `sst-and-ocean-color` has the canonical mapping.
- **`min`/`max` are per-item stats** (across the item's spatial/temporal extent), not per-pixel. To filter "any pixel above X," use `max > X`. To filter "all pixels above X," use `min > X`.
- **NaN/null variables** simply don't match comparisons. There is no `IS NULL` shortcut — assume missing means "not in scope."
- **Don't quote numeric thresholds.** `> 6` is correct; `> "6"` will fail.

## Worked examples

See [`examples.md`](examples.md) for 10 fully-worked CQL2 filters mapped from plain English.
