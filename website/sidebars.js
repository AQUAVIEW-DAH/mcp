// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Note: Docusaurus auto-strips numeric prefixes from filenames when generating doc IDs,
  // so `examples/01-quickstart.md` → id `examples/quickstart`. The URL will follow the id.

  // Catch-all sidebar (used as default for /docs)
  defaultSidebar: [
    "intro",
    "install",
    {
      type: "category",
      label: "Reference",
      link: { type: "generated-index" },
      items: [
        "reference/tools-reference",
        "reference/collections",
        "reference/data-model",
        "reference/prompting-guide",
        "reference/output-formats",
        "reference/faq",
      ],
    },
    {
      type: "category",
      label: "Examples",
      link: { type: "doc", id: "examples/index" },
      items: [
        "examples/quickstart",
        "examples/sea-surface-temperature",
        "examples/hurricane-tracking",
        "examples/tides-and-storm-surge",
        "examples/argo-float-profiles",
        "examples/hf-radar-surface-currents",
        "examples/glider-missions",
        "examples/ocean-color-chlorophyll",
        "examples/nexrad-severe-weather",
        "examples/hrrr-forecast",
        "examples/great-lakes",
        "examples/arctic-sea-ice",
        "examples/deep-sea-exploration",
        "examples/vessel-traffic-ais",
        "examples/oil-spill-response",
        "examples/biogeochemistry",
        "examples/bathymetry",
        "examples/fisheries-science",
        "examples/regional-deep-dives",
        "examples/international-sources",
        "examples/satellite-imagery",
        {
          type: "category",
          label: "Advanced",
          items: [
            "examples/advanced/cql2-filtering",
            "examples/advanced/aggregations-cookbook",
            "examples/advanced/pagination-and-large-queries",
          ],
        },
      ],
    },
    "notebooks",
    "prompts",
    "contributing",
  ],

  // Reference-only sidebar for the navbar dropdown
  referenceSidebar: [
    "reference/tools-reference",
    "reference/collections",
    "reference/data-model",
    "reference/prompting-guide",
    "reference/output-formats",
    "reference/faq",
  ],

  // Examples-only sidebar for the navbar dropdown
  examplesSidebar: [
    "examples/index",
    "examples/quickstart",
    "examples/sea-surface-temperature",
    "examples/hurricane-tracking",
    "examples/tides-and-storm-surge",
    "examples/argo-float-profiles",
    "examples/hf-radar-surface-currents",
    "examples/glider-missions",
    "examples/ocean-color-chlorophyll",
    "examples/nexrad-severe-weather",
    "examples/hrrr-forecast",
    "examples/great-lakes",
    "examples/arctic-sea-ice",
    "examples/deep-sea-exploration",
    "examples/vessel-traffic-ais",
    "examples/oil-spill-response",
    "examples/biogeochemistry",
    "examples/bathymetry",
    "examples/fisheries-science",
    "examples/regional-deep-dives",
    "examples/international-sources",
    "examples/satellite-imagery",
    {
      type: "category",
      label: "Advanced",
      items: [
        "examples/advanced/cql2-filtering",
        "examples/advanced/aggregations-cookbook",
        "examples/advanced/pagination-and-large-queries",
      ],
    },
  ],
};

export default sidebars;
