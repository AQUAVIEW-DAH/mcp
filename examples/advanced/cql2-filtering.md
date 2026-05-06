# Advanced — CQL2 filtering on column statistics

The `filter` parameter on `search_datasets` and `aggregate` accepts CQL2-JSON. The killer feature is filtering on `aquaview:column_stats_summary` — Aquaview's per-variable summary that lets you *narrow by data values without downloading any files*.

## What's in `column_stats_summary`?

For every item that has tabular data, Aquaview pre-computes:

```yaml
aquaview:column_stats_summary:
  version: "1.0.0"
  variable_count: 6
  observation_count: 7394
  variables:
    Wave Height:
      min: 0.1
      max: 6.5
      mean: 1.4
      count: 7102
    Water Temperature:
      min: 12.9
      max: 25.1
      mean: 22.3
      count: 7394
    Wind Speed:
      min: 0.0
      max: 19.0
      mean: 4.2
      count: 7398
    ...
```

You can filter on any of these.

## Operators

`=` `<>` `<` `>` `<=` `>=` `like` `between` `in` `and` `or` `not`

## Common patterns

### "Storm-strength buoys"

```json
{
  "op": ">=",
  "args": [
    {"property": "aquaview:column_stats_summary.variables.Wave Height.max"},
    6.0
  ]
}
```

Returns NDBC buoys whose lifetime max wave height was at least 6 m.

### "Deep-diving Argo floats"

```json
{
  "op": ">=",
  "args": [
    {"property": "aquaview:column_stats_summary.variables.Pressure.max"},
    4000
  ]
}
```

Returns floats that reached abyssal depths.

### "Cold-water profiles only"

```json
{
  "op": "<=",
  "args": [
    {"property": "aquaview:column_stats_summary.variables.Temperature.min"},
    -1.5
  ]
}
```

Polar / sub-zero water (Argo, glider, mooring profiles).

### Combined: "extreme-event station-days"

```json
{
  "op": "and",
  "args": [
    {"op": ">=", "args": [{"property": "aquaview:column_stats_summary.variables.Wind Speed.max"}, 30]},
    {"op": ">=", "args": [{"property": "aquaview:column_stats_summary.variables.Wave Height.max"}, 6]}
  ]
}
```

Only buoys that hit *both* hurricane-force winds and major sea state.

### Range with `between`

```json
{
  "op": "between",
  "args": [
    {"property": "aquaview:column_stats_summary.variables.Salinity.mean"},
    34.0,
    35.5
  ]
}
```

Filter to typical open-ocean salinity (rule out brackish / hyper-saline).

### Membership with `in`

```json
{
  "op": "in",
  "args": [
    {"property": "aquaview:instrument_type"},
    ["XBT", "CTD", "Glider"]
  ]
}
```

Multiple instrument types in one query.

## Combining `filter` with everything else

`filter` composes with `q`, `bbox`, `datetime`, `collections`, and `exclude_collections`. They all AND together.

```python
search_datasets(
  collections = "GADR",
  bbox = "-180,40,-130,60",
  datetime = "2025-01-01T00:00:00Z/2025-12-31T23:59:59Z",
  filter = {
    "op": "and",
    "args": [
      {"op": ">=", "args": [{"property": "aquaview:column_stats_summary.variables.Pressure.max"}, 1500]},
      {"op": "<=", "args": [{"property": "aquaview:column_stats_summary.variables.Temperature.min"}, 0]}
    ]
  }
)
```

This finds Argo floats in the Bering Sea that both dove deep AND profiled sub-zero water — i.e., the deep-water column of the Bering / Gulf of Alaska in 2025.

## Property-path tips

- The path uses `.` to descend nested dicts.
- Variable names with spaces (`Wave Height`, `Water Temperature`) are valid — quote them inside the path string.
- Variable name casing matches what's stored in the catalog. Check via `get_item` first if unsure.

## Watch-outs

- `column_stats_summary` is computed per-item across the *entire* lifetime of that item's data — for an Argo float that might be 6 years globally. The min/max are not bbox/datetime-restricted. Use bbox/datetime to scope *which floats* you see, but the per-variable stats still describe the float globally.
- Items without tabular data (e.g., satellite scenes, ROV video) don't have `column_stats_summary`. Filtering on it will exclude them.
- `like` patterns use `%` as wildcard, not `*`.

## See also

- [`../docs/data-model.md`](../../docs/data-model.md) — full property catalog
- [`../docs/tools-reference.md`](../../docs/tools-reference.md) — `search_datasets` and `aggregate` parameters
