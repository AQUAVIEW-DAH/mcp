# AIS vessel type codes

The AIS protocol defines numeric type codes (0-99). Below is the practical reference for the most common codes you'll see in `MARINECADASTRE_AIS`.

## Code groups

| Code | Category | Examples |
|---|---|---|
| 0 | Not available / not specified | — |
| 1–19 | Reserved | — |
| **20–29** | **Wing-in-ground / WIG** | Specialty craft |
| **30** | **Fishing** | Trawlers, longliners, seiners |
| **31** | **Towing** | Tugs, supply boats |
| **32** | Towing with long tow | Heavy tow tugs |
| **33** | Dredging or underwater ops | Dredgers, cable-layers |
| **34** | Diving operations | Survey / construction divers |
| **35** | Military operations | Naval vessels |
| **36** | Sailing | Yachts, sail-only |
| **37** | Pleasure craft | Recreational boats |
| 38–39 | Reserved | — |
| **40–49** | **High-speed craft (HSC)** | Fast ferries, hydrofoils |
| **50** | Pilot vessel | Harbor pilots |
| **51** | Search and rescue | USCG / SAR |
| **52** | Tug | (different from 31 — sometimes both used) |
| **53** | Port tender | Port-area service craft |
| **54** | Anti-pollution | Spill response vessels |
| **55** | Law enforcement | USCG cutters, harbor police |
| **58** | Medical transport | Hospital ships |
| **59** | Noncombatant (per RR Resolution No. 18) | — |
| **60–69** | **Passenger** | 60=passenger, 61–69 vary |
| **70–79** | **Cargo** | 70=cargo (general), 71=hazardous A, 72=hazardous B, etc. |
| **80–89** | **Tanker** | 80=tanker, 81=hazardous A, 82=hazardous B, etc. |
| **90–99** | **Other** | 90=other, 91=hazardous A, etc. |

## Common codes you'll encounter

| Code | Vessel type | Notes |
|---|---|---|
| 30 | Fishing | Most-used filter — commercial fishing fleet |
| 31, 32, 52 | Tugs / towing | Significant near ports |
| 36 | Sailing | Pleasure / racing |
| 37 | Pleasure craft | Recreational, dominant in coastal waters |
| 50 | Pilot vessel | Always near major ports |
| 60 | Passenger | Cruise ships, ferries |
| 70 | Cargo | Container ships, bulk carriers, general cargo |
| 80 | Tanker | Oil / chemical / LNG tankers |
| 90 | Other | Catch-all; verify with `vessel_name` |

## Cargo subdivision (70-79)

| Code | Description |
|---|---|
| 70 | Cargo, all ships of this type |
| 71 | Cargo carrying DG, HS, or MP, IMO Hazard category A |
| 72 | Cargo carrying DG, HS, or MP, IMO Hazard category B |
| 73 | Cargo carrying DG, HS, or MP, IMO Hazard category C |
| 74 | Cargo carrying DG, HS, or MP, IMO Hazard category D |
| 79 | Cargo, no additional information |

## Tanker subdivision (80-89)

| Code | Description |
|---|---|
| 80 | Tanker, all ships of this type |
| 81 | Tanker carrying DG, HS, or MP, IMO Hazard category A |
| 82 | Tanker carrying DG, HS, or MP, IMO Hazard category B |
| 83 | Tanker carrying DG, HS, or MP, IMO Hazard category C |
| 84 | Tanker carrying DG, HS, or MP, IMO Hazard category D |
| 89 | Tanker, no additional information |

## Filter recipes

```
# Fishing only
filter="properties.ais:vessel_type = 30"

# All cargo (any subdivision)
filter="properties.ais:vessel_type >= 70 AND properties.ais:vessel_type <= 79"

# All tankers
filter="properties.ais:vessel_type >= 80 AND properties.ais:vessel_type <= 89"

# Passenger + cargo + tanker (commercial only)
filter="properties.ais:vessel_type IN (60, 70, 71, 72, 73, 74, 79, 80, 81, 82, 83, 84, 89)"

# Exclude pleasure / sailing (hide rec traffic)
filter="properties.ais:vessel_type NOT IN (36, 37)"
```

## Vessel status codes (separate from type)

The `ais:nav_status` field has its own code set:

| Code | Status |
|---|---|
| 0 | Under way using engine |
| 1 | At anchor |
| 2 | Not under command |
| 3 | Restricted maneuverability |
| 4 | Constrained by draught |
| 5 | Moored |
| 6 | Aground |
| 7 | Engaged in fishing |
| 8 | Under way sailing |
| 9–14 | Reserved / regional |
| 15 | Default (not defined) |

Useful filter for "actively fishing":

```
filter="properties.ais:nav_status = 7"
```
