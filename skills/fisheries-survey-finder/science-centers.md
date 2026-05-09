# NMFS science centers

Detailed survey type matrix per center. Use this to validate "this center has this survey type" before authoring queries.

## AFSC — Alaska Fisheries Science Center

**Geographic scope:** Bering Sea, Gulf of Alaska, Aleutian Islands, Arctic Chukchi/Beaufort.

| Survey | Cadence | Notes |
|---|---|---|
| EBS Bottom Trawl Survey (BS) | Annual, June–July | 376 stations across Bering Sea shelf; longest continuous Bering record |
| GOA Bottom Trawl Survey | Biennial | Gulf of Alaska shelf and slope groundfish |
| Aleutian Islands Bottom Trawl | Biennial | Walleye pollock, Atka mackerel, Pacific Ocean perch |
| Acoustic-Trawl (Pollock) | Annual summer | Walleye pollock biomass via echosounder + verification trawls |
| Longline Survey | Annual | Sablefish, Pacific cod, sharks |
| Marine Mammal Aerial | Multi-annual | Pinnipeds, cetaceans |
| Ichthyoplankton (EcoFOCI) | Annual | Pollock larvae, recruitment indices |

**bbox:** `[-180, 51, -130, 75]`

## NEFSC — Northeast Fisheries Science Center

**Geographic scope:** Maine to Cape Hatteras, NC. Includes Georges Bank, Gulf of Maine, Mid-Atlantic Bight.

| Survey | Cadence | Notes |
|---|---|---|
| Northeast Bottom Trawl Survey | Spring + Fall, annual | Longest US groundfish series (1968–) |
| Ecosystem Monitoring (EcoMon) | 4×/year | CTD + plankton + chlorophyll along standard transects |
| Cooperative Shark Tagging | Continuous | Mark-recapture for HMS sharks |
| Sea Scallop Dredge Survey | Annual | Sea scallop biomass + recruitment |
| Pelagic Longline (Atlantic HMS) | Annual | Tuna, swordfish, sharks |
| Right Whale Aerial | Continuous (NARW only) | Critically endangered species monitoring |
| Ichthyoplankton (MARMAP) | Quarterly | Egg/larval distributions |

**bbox:** `[-77, 35, -65, 45]`

## NWFSC — Northwest Fisheries Science Center

**Geographic scope:** US West Coast (CA, OR, WA), with focus on Pacific salmon, groundfish, and Columbia River.

| Survey | Cadence | Notes |
|---|---|---|
| Pacific Coast Groundfish Bottom Trawl | Annual | West Coast slope and shelf trawls |
| Pacific Hake Acoustic-Trawl | Biennial (joint US/Can) | Pacific hake (whiting) biomass |
| Salmon Smolt Surveys | Annual | Juvenile Pacific salmon, Columbia/Salish |
| Pre-Recruit (Larval) Survey | Annual | Rockfish, sablefish recruitment |
| Marine Mammal Surveys | Multi-annual | Cetacean line-transect |

**bbox:** `[-126, 32, -120, 49]`

## PIFSC — Pacific Islands Fisheries Science Center

**Geographic scope:** Hawaii, American Samoa, Mariana Islands, Pacific Remote Islands.

| Survey | Cadence | Notes |
|---|---|---|
| Reef Assessment & Monitoring (RAMP) | Multi-annual | Reef fish, corals, invertebrates via diver-based RVC |
| Pelagic Longline (Hawaii HMS) | Continuous (observer) | Tuna, billfish, sharks |
| Hawaiian Monk Seal | Annual | Endangered species — population census |
| Bottomfish Survey | Annual | Deep-water snappers, jacks, groupers |

**bbox:** `[-180, -20, -150, 30]`

## SEFSC — Southeast Fisheries Science Center

**Geographic scope:** US South Atlantic (NC → FL), Gulf of Mexico, Caribbean (Puerto Rico, USVI).

| Survey | Cadence | Notes |
|---|---|---|
| SEAMAP Groundfish | Annual | Gulf of Mexico shrimp + groundfish |
| SEAMAP Reef Fish | Annual | Snappers, groupers (Gulf + Atlantic) |
| Pelagic Longline (Atlantic HMS) | Annual | Joint with NEFSC |
| Reef Visual Census (RVC) | Annual | Coral reef fish (Florida + Caribbean) |
| Ichthyoplankton (SEAMAP) | Bi-annual | Egg/larval surveys |
| Marine Mammal Surveys | Multi-annual | Manatees, cetaceans |
| Sea Turtle Stranding (STSSN) | Continuous | Stranding network database |

**bbox (US Atlantic + Gulf):** `[-98, 18, -75, 36]`

## Cross-center species

| Species | Centers |
|---|---|
| Atlantic bluefin tuna | NEFSC, SEFSC |
| Pacific salmon (Chinook, sockeye, coho) | NWFSC, AFSC |
| Pacific cod | AFSC, NWFSC |
| Walleye pollock | AFSC |
| Skipjack/yellowfin tuna | PIFSC, SEFSC |
| Atlantic sea scallop | NEFSC |
| Red snapper | SEFSC, NWFSC (rare) |
| Coral reef fishes | SEFSC, PIFSC |

## Naming conventions

NMFS uses American Fisheries Society common names where unambiguous; ITIS taxonomic codes otherwise. When in doubt:

- Common name first (e.g., "Pacific cod") — most metadata is written for managers / public
- Scientific name as fallback (e.g., "Gadus macrocephalus")
- Species code (e.g., 21720) only when working programmatically with cross-center records
