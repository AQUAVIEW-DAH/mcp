// @ts-check
import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Aquaview MCP",
  tagline:
    "Query 700,000+ ocean & atmospheric datasets from inside Claude, ChatGPT, Gemini, Cursor, and any MCP client.",
  favicon: "img/aquaview-logo.png",

  url: "https://aquaview-dah.github.io",
  baseUrl: "/mcp/",

  organizationName: "AQUAVIEW-DAH",
  projectName: "mcp",
  trailingSlash: false,

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  // Source content is plain CommonMark (it's also rendered by GitHub and MkDocs).
  // Disable MDX to avoid strict-XML errors on autolinks, badge HTML, etc.
  markdown: {
    format: "md",
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: "docs",
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
          editUrl: "https://github.com/AQUAVIEW-DAH/mcp/edit/main/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/aquaview-logo.png",
      colorMode: {
        defaultMode: "light",
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: "Aquaview MCP",
        logo: {
          alt: "Aquaview",
          src: "img/aquaview-logo.png",
        },
        items: [
          { to: "/install", label: "Install", position: "left" },
          {
            type: "docSidebar",
            sidebarId: "referenceSidebar",
            label: "Reference",
            position: "left",
          },
          {
            type: "docSidebar",
            sidebarId: "examplesSidebar",
            label: "Examples",
            position: "left",
          },
          { to: "/notebooks", label: "Notebooks", position: "left" },
          { to: "/prompts", label: "Prompts", position: "left" },
          {
            href: "https://aquaview.org",
            label: "Platform",
            position: "right",
          },
          {
            href: "https://github.com/AQUAVIEW-DAH/mcp",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              { label: "Install", to: "/install" },
              { label: "Tools Reference", to: "/reference/tools-reference" },
              { label: "Collections", to: "/reference/collections" },
              { label: "Examples", to: "/examples" },
            ],
          },
          {
            title: "More",
            items: [
              { label: "Aquaview platform", href: "https://aquaview.org" },
              { label: "MCP overview", href: "https://aquaview.org/mcp-overview" },
              { label: "Model Context Protocol", href: "https://modelcontextprotocol.io" },
            ],
          },
          {
            title: "Project",
            items: [
              { label: "GitHub", href: "https://github.com/AQUAVIEW-DAH/mcp" },
              { label: "Issues", href: "https://github.com/AQUAVIEW-DAH/mcp/issues" },
              { label: "Contributing", to: "/contributing" },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Aquaview. Released under the MIT License.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ["bash", "json", "yaml", "python"],
      },
    }),
};

export default config;
