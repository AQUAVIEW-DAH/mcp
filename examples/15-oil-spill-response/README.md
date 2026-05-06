# Oil spill response and marine pollution incidents

Find NOAA-tracked marine pollution incidents — oil spills, vessel groundings, fires — and the contaminant / bioassay observations that follow them.

## What this teaches

- Two complementary collections: `INCIDENT_NEWS` (event reports) and `NOAA_ORR` (DIVER environmental monitoring)
- How to scope to a region + time window for a specific event search
- When `INCIDENT_NEWS` is signal vs. noise (see [prompting guide](../../docs/prompting-guide.md))

**Sources used**: `INCIDENT_NEWS`, `NOAA_ORR`

---

## Prompt

```
Show me NOAA-reported oil spill and marine pollution incidents in the
Florida Keys / Gulf of Mexico region from the last several years.
Include any environmental contaminant follow-up data.
```

## Transcript

### 1. Search the incident reports

```python
search_datasets(
  collections = "INCIDENT_NEWS",
  bbox = "-83,24,-80,25.5",
  limit = 5
)
```

Real items:

| ID | Title | Date |
|---|---|---|
| `9719` | Vessel Paradise Grounding, Key West, FL | 2018-04-30 |
| `9685` | F/V OLE BETTS SEA fire, 22 mi NE of Dry Tortugas | 2018-03-18 |
| `1306` | Tank Truck Accident, Seven-Mile Bridge, Marathon, FL | 2005-10-05 |
| `1164` | Tug taking on water, SE of Marquesas Key, FL | 2004-03-26 |

Each report carries `aquaview:platform_type = "Incident Response"`, a description with the threat type (typically "Oil"), the commodity involved, and a link back to `https://incidentnews.noaa.gov/`.

### 2. Pull environmental contaminant follow-up

```python
search_datasets(
  collections = "NOAA_ORR",
  bbox = "-83,24,-80,25.5",
  limit = 5
)
```

> NOAA ORR's DIVER program tracks contaminant monitoring data — sediment, water, tissue samples — that follow major incidents. Records include sample IDs, analyte concentrations, QA flags.

## Result the agent gave

> *"NOAA Incident News records 4+ marine pollution events in the Florida Keys area:*
>
> *1. **Vessel Paradise grounding (Apr 2018)** — 55-ft vessel aground at Rock Key Sanctuary Preservation Area off Key West with ~550 gal diesel + 15–20 gal lube oil onboard. No release reported; salvage delayed by sea state.*
> *2. **F/V Ole Betts Sea fire (Mar 2018)** — fishing vessel caught fire 22 mi NE of Dry Tortugas with 7,000 gal diesel onboard. ORR provided trajectory + fate analysis.*
> *3. **Seven-Mile Bridge tank-truck crash (Oct 2005)** — fatal collision released gasoline and AFFF firefighting foam into the Florida Keys National Marine Sanctuary. ORR issued biological-impact report.*
> *4. **Tug incident SE of Marquesas Key (Mar 2004)** — vessel taking on water, no spill, NOAA provided weather support.*
>
> *Each links back to https://incidentnews.noaa.gov/ for the full incident file. For follow-up environmental monitoring, NOAA_ORR's DIVER program holds the contaminant / bioassay records."*

## Variations

- **Specific event**: filter `q = "Deepwater Horizon"` for the 2010 spill response data.
- **Time window**: combine bbox with `datetime` for incidents during a specific year.
- **Avoid INCIDENT_NEWS noise on broad queries**: use `exclude_collections = "INCIDENT_NEWS"` when you want ocean data, *not* incident reports.

## Related examples

- [`14-vessel-traffic-ais/`](../14-vessel-traffic-ais/) — pair incident locations with vessel-track context
- [`16-biogeochemistry/`](../16-biogeochemistry/) — biogeochemical monitoring data
