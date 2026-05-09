# Skills

Bundled workflow skills for working with **AQUAVIEW MCP**. Each skill encodes non-obvious knowledge — the right tool sequence, syntax patterns for CQL2 filters, regional naming conventions, multi-source recipes — so an LLM agent gets useful results on the first attempt instead of grinding through trial and error.

## What is a skill?

A skill is a directory under `skills/` containing a `SKILL.md` file and (optionally) supporting reference files. The `SKILL.md` frontmatter has a `name` and a `description` that tells the agent **when** to load the skill. The body tells the agent **how** to act once loaded.

Skills load on demand — they are lightweight context that ships with the repo but is only consumed when a relevant query comes in.

## Index

### Foundational
| Skill | Use when |
|---|---|
| [`ocean-data-explorer`](ocean-data-explorer/) | The user is exploring what data exists for a region, variable, or time period |
| [`cql2-filter-builder`](cql2-filter-builder/) | The user wants to filter on numerical thresholds (waves > 6m, SST > 28°C, etc.) |
| [`bbox-from-region`](bbox-from-region/) | The user mentions a named ocean/marine region (Gulf of Mexico, Mid-Atlantic Bight, etc.) |

### Satellite imagery
| Skill | Use when |
|---|---|
| [`satellite-imagery-finder`](satellite-imagery-finder/) | The user wants Sentinel / HLS / WorldCover scenes |
| [`sst-and-ocean-color`](sst-and-ocean-color/) | The user asks about SST, chlorophyll, ocean color, sea ice extent, or HABs |

### In-situ / autonomous platforms
| Skill | Use when |
|---|---|
| [`wod-profile-explorer`](wod-profile-explorer/) | The user wants World Ocean Database casts (CTD/XBT/MBT/PFL/OSD) |
| [`argo-profile-explorer`](argo-profile-explorer/) | The user wants Argo float profiles (core / Deep / BGC) |
| [`glider-mission-tracker`](glider-mission-tracker/) | The user mentions gliders, Slocum/Spray/Seaglider, or active missions |

### Specialized workflows
| Skill | Use when |
|---|---|
| [`storm-event-reconstruction`](storm-event-reconstruction/) | The user wants to reconstruct a hurricane or extreme weather event from multiple sources |
| [`fisheries-survey-finder`](fisheries-survey-finder/) | The user mentions NMFS surveys, bottom trawls, stock assessments, or ichthyoplankton |
| [`vessel-traffic-analyzer`](vessel-traffic-analyzer/) | The user wants AIS / vessel traffic / shipping density |
| [`deep-sea-rov-explorer`](deep-sea-rov-explorer/) | The user wants ROV dives, deep-sea video, Okeanos Explorer, or SeaTube |

### Real-time + cross-domain
| Skill | Use when |
|---|---|
| [`realtime-coastal-monitor`](realtime-coastal-monitor/) | The user wants current/recent observations from buoys, tide gauges, or sensors |
| [`hf-radar-currents`](hf-radar-currents/) | The user wants surface currents from HF radar |
| [`oil-spill-response`](oil-spill-response/) | The user wants oil spill / marine pollution response workflows |

## Installing skills

These skills are written for any agent runtime that supports Claude Code-style skill bundles. To use them locally with Claude Code:

```bash
# Copy a skill into your project's .claude/skills/ directory
mkdir -p .claude/skills
cp -r skills/ocean-data-explorer .claude/skills/
```

Or copy individual skills into your global skills directory at `~/.claude/skills/`.

For other MCP-aware runtimes, treat each `SKILL.md` as a system-prompt addendum loaded when the description matches the user's intent.

## Contributing a skill

A useful skill clears this bar: **"Would the agent make a worse decision if this skill weren't loaded?"**

If the answer is no — the workflow is obvious from the tool descriptions alone — the skill is noise. If the answer is yes, write a skill with:

1. A specific `description` in the frontmatter so the agent triggers it correctly
2. A short body that gives the **decision** the agent should make (which tool first, which filter pattern, which collection) rather than restating tool docs
3. Optional reference files (cookbooks, lookup tables, helper scripts) for content that's too long for the body

Open a PR with your skill in its own directory.
