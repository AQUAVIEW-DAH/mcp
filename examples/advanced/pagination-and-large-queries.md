# Advanced — Pagination and large queries

`search_datasets` returns at most **100 items per call**. With 700K+ items in the catalog, naive "give me all matching results" prompts won't work. This page covers the patterns that scale.

## When you need to page

- Listing all NDBC buoys (~600 total) — not paginated, fits in 6 calls
- Listing all Argo floats globally (~12,000+) — page through
- Listing all Sentinel-2 scenes for the Gulf of Mexico last year (~100K+) — page through with caution

## When you don't need to page

If you only need a *count* or *summary*, use `aggregate` instead. See [`aggregations-cookbook.md`](aggregations-cookbook.md).

If you only need the top-N (most recent, highest wave height, etc.), set `sortby` and `limit` and you're done.

## The `next_token` pattern

Every paginated response includes a `next_token` field. Pass it as `token` on the next call to continue. Other parameters do not need to be repeated — the token captures them.

### First page

```python
search_datasets(
  collections = "GADR",
  bbox = "-180,-90,180,90",
  limit = 100,
  sortby = "+properties.datetime"
)
# → response.next_token = "WzE3Nzc5MTA3OTM4NTIsIlMyQl8xN..."
```

### Subsequent pages

```python
search_datasets(token = "WzE3Nzc5MTA3OTM4NTIsIlMyQl8xN...")
```

> The token captures the original query — don't repeat `collections`, `bbox`, etc.

### Loop pattern (Python, direct MCP client)

```python
all_items = []
next_token = None

while True:
    params = {"collections": "GADR", "limit": 100}
    if next_token:
        params = {"token": next_token}

    result = await session.call_tool("search_datasets", params)
    page = json.loads(result.content[0].text)

    all_items.extend(page["features"])
    next_token = page.get("next_token")

    if not next_token or len(page["features"]) == 0:
        break
```

## Field projection

The fastest way to make pagination cheaper is to reduce per-item payload size.

```python
search_datasets(
  collections = "GADR",
  fields = "id,collection,properties.datetime",
  limit = 100
)
```

In `csv` mode, `fields` drops the canonical columns and emits only your projected ones. In `json` mode, the response contains only the requested keys. This often cuts response size by 70–90%.

## Sorting for stable pagination

Pagination tokens are stable across calls *as long as the catalog doesn't change*. For long-running pages, sort on a stable field:

```python
search_datasets(
  collections = "NDBC",
  sortby = "+id",     # alphabetical ID — stable
  limit = 100
)
```

Sorting on `+properties.datetime` is also stable for read-only collections.

## Large-result strategies

### Strategy 1: aggregate first, search later

If you don't know the result size, aggregate first:

```python
aggregate(aggregations = "total_count", collections = "GADR")
# → 12,847
```

Now decide whether to enumerate or sample.

### Strategy 2: tile by region

Instead of one query for the whole globe, split by bbox tiles:

```python
for region_bbox in [
    "-180,-90,-90,0",   # SW quarter
    "-90,-90,0,0",      # SE quarter
    ...
]:
    page_through(collections="GADR", bbox=region_bbox)
```

Each per-region query stays under the practical limit and parallelizes naturally.

### Strategy 3: tile by time

For high-volume sources (NEXRAD, Sentinel-2), split the time range:

```python
for month_start in monthly_windows("2024-01-01", "2024-12-31"):
    datetime = f"{month_start}T00:00:00Z/{month_end}T23:59:59Z"
    page_through(collections="sentinel-2-l2a", datetime=datetime)
```

### Strategy 4: filter aggressively

Tight filters cut result size by orders of magnitude. Use `filter` on column stats, narrow `bbox`, and tight `datetime` windows. A query that returns 100K items often becomes one that returns 100 useful items with one well-placed `filter`.

## Token best practices

- **Don't store tokens long-term**. They're tied to the catalog state at the time of the original query.
- **Don't share tokens across users**. They're session-scoped.
- **If a token returns an error**, restart the query with the original parameters — the catalog may have changed.

## Common pitfalls

### Asking the LLM to "list all"

If your prompt is *"list all NDBC buoys"*, the agent will issue one `search_datasets` call, get 100 results back, and call it done. You'll get the first 100 alphabetically — not the actual answer.

**Fix**: ask for a count first (`aggregate(total_count)`) and explicitly request paging if the count is large.

### Combining limit + sortby + token

`limit` and `sortby` are captured in the *first* call. You don't need to repeat them with `token`. If you do, the catalog will ignore them.

### Forgetting `bbox` on a global collection

A free-text search across `GADR` returns ~200K items globally. Always combine with `bbox` or `datetime` unless you really do want the whole world.

## See also

- [`../docs/tools-reference.md`](../../docs/tools-reference.md) — `search_datasets` parameter reference
- [`aggregations-cookbook.md`](aggregations-cookbook.md) — when not to enumerate at all
- [`../../notebooks/01-claude-mcp-agent.ipynb`](../../notebooks/01-claude-mcp-agent.ipynb) — multi-turn pattern with the Anthropic SDK
