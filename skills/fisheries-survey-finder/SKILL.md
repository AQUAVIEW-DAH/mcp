---
name: fisheries-survey-finder
description: Use when the user asks about fisheries data — phrases like "bottom trawl survey", "stock assessment", "ichthyoplankton", "groundfish", "longline survey", "{species} catch records", or any NMFS science center mention (AFSC, NEFSC, NWFSC, PIFSC, SEFSC). Encodes which science center covers which region and what survey types live where.
---

# Fisheries survey finder

The five NOAA NMFS regional science centers operate distinct survey programs. Picking the right one is essentially a geography question.

See [`science-centers.md`](science-centers.md) for the full survey-type matrix.

## Region → Science center

| Region | Center | Collection ID |
|---|---|---|
| Alaska / Bering Sea / Aleutians | **AFSC** | `AFSC` |
| Northeast US (Maine → Cape Hatteras) | **NEFSC** | `NEFSC` |
| Northwest US / Pacific (CA, OR, WA) | **NWFSC** | `NWFSC` |
| Pacific Islands / Hawaii | **PIFSC** | `PIFSC` |
| Southeast US / Gulf of Mexico / Caribbean | **SEFSC** | `SEFSC` |

If the user names a region, look up the matching center first. If they name a species, use multiple centers (most species are surveyed by 2+ centers).

## Survey type quick reference

Each center runs different survey types. The most common are:

| Survey type | What it samples | Typical centers |
|---|---|---|
| **Bottom trawl** | Demersal fish, crabs, groundfish abundance | AFSC, NEFSC, NWFSC, SEFSC |
| **Longline** | Sharks, swordfish, tunas, large pelagics | NEFSC, SEFSC, PIFSC |
| **Acoustic / hydroacoustic** | Pelagic fish biomass (anchovy, herring, hake) | AFSC, NWFSC, NEFSC |
| **Ichthyoplankton (egg/larvae)** | Spawning ecology, recruitment indices | NEFSC, SEFSC, AFSC |
| **Reef Visual Census (RVC)** | Coral reef fish abundance | SEFSC (Caribbean), PIFSC |
| **Marine mammal / seabird** | Pinniped, cetacean, seabird abundance | NEFSC, SEFSC, AFSC, PIFSC |
| **Trap / pot** | Crabs, lobsters, fish traps | AFSC, NEFSC, SEFSC |

## Pattern: "what fisheries data exists for X"

```
1. Identify region from user → pick center collection
2. aggregate(collections=["AFSC"], group_by="datetime", interval="1Y", bbox=<region bbox>)
   to see survey time coverage
3. search_datasets(collections=["AFSC"], bbox=<bbox>, datetime=<window>, q="<survey type>", limit=25)
```

## Pattern: species-specific query

> "Find Pacific cod data from Alaska bottom trawls in 2023."

```
search_datasets(
  collections=["AFSC"],
  bbox=[-180, 51, -130, 65],   # Bering Sea + Gulf of Alaska
  datetime="2023-06-01/2023-09-30",   # AFSC bottom trawl summer survey
  q="Pacific cod bottom trawl",
  limit=25
)
```

The `q` field can take both common and scientific names. When the user uses a common name, search with both:

```
q="Pacific cod"             # common name
q="Gadus macrocephalus"     # scientific name
```

Try the common name first — most NMFS metadata is written for non-specialists.

## Pattern: stock assessment data

For population estimates / stock status:

- AQUAVIEW exposes the **survey** data, which feeds stock assessments — not the assessments themselves
- For published stock-status outputs, point users to NOAA Fisheries (fisheries.noaa.gov) or NMFS-specific portals
- Use AQUAVIEW for the input data: catch-per-unit-effort, length distributions, abundance indices

## Multi-region species

Many species are surveyed by multiple centers (e.g., bluefin tuna by NEFSC + SEFSC; salmon by NWFSC + AFSC). Search across centers:

```
search_datasets(
  collections=["NEFSC", "SEFSC", "PIFSC"],
  q="bluefin tuna",
  datetime="2020-01-01/2024-12-31",
  limit=50
)
```

## Common variables in fisheries items

| Variable | Notes |
|---|---|
| `catch_kg` or `catch_n` | Catch weight or count (per haul / station) |
| `species_code` | NMFS species code (e.g., 21720 = Pacific cod) |
| `bottom_depth_m` | Trawl depth |
| `tow_duration_min` | Standardized to compute CPUE |
| `length_cm` | Per-fish length, where individual records are reported |
| `sex`, `age` | Sex/age data, sparse |

## Output formats

Most NMFS fisheries data in AQUAVIEW comes as CSV (per-haul records) or NetCDF (gridded survey indices). Tell the user that direct download links resolve to either format depending on the survey program.

## Worked example

> "Show me bottom trawl groundfish data from the Bering Sea for 2023."

```
1. AFSC region; bbox = [-180, 53, -158, 66] (eastern Bering Sea)
2. search_datasets(
     collections=["AFSC"],
     bbox=[-180, 53, -158, 66],
     datetime="2023-06-01/2023-08-31",
     q="bottom trawl groundfish",
     limit=25
   )
3. Returned items represent stations / hauls; each has CSV asset with per-tow catch
```
