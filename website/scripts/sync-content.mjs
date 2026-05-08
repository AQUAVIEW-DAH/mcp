// Copies markdown content from the repo root into website/docs/ before Docusaurus builds.
// Source of truth stays at the repo root; Docusaurus only consumes what this script produces.
//
// What this does:
// - Wipes website/docs/ and rebuilds it from scratch.
// - Mirrors README.md, INSTALL.md, CONTRIBUTING.md, docs/, examples/, notebooks/README.md,
//   and prompts/README.md into a flat-ish docs/ tree under sensible URLs.
// - Adds Docusaurus front matter (sidebar_position, title, slug) where helpful.
// - Rewrites relative links of the form `../foo-bar/` (which GitHub renders correctly but
//   Docusaurus does not match) to their explicit README.md targets, then strips `/README.md`
//   so the final URL is /examples/foo-bar.
// - Copies the logo into static/img.

import { promises as fs, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const websiteRoot = path.resolve(__dirname, "..");
const docsOut = path.join(websiteRoot, "docs");
const staticImgOut = path.join(websiteRoot, "static", "img");

async function rmrf(p) {
  await fs.rm(p, { recursive: true, force: true });
}

async function copyFile(src, dest) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
}

async function readMd(p) {
  return fs.readFile(p, "utf8");
}

async function writeMd(p, body) {
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, body, "utf8");
}

function addFrontMatter(body, fm) {
  const lines = ["---"];
  for (const [k, v] of Object.entries(fm)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && (v.includes(":") || v.includes("'"))) {
      lines.push(`${k}: ${JSON.stringify(v)}`);
    } else {
      lines.push(`${k}: ${v}`);
    }
  }
  lines.push("---", "");
  return lines.join("\n") + body;
}

// Rewrite the GitHub-style relative links into Docusaurus absolute paths.
// IDs in Docusaurus auto-strip a leading `NN-` numeric prefix, so the URL slugs
// are e.g. /examples/quickstart, /examples/sea-surface-temperature.
const GITHUB_REPO = "https://github.com/AQUAVIEW-DAH/mcp";

function rewriteLinks(body) {
  return (
    body
      // ====== Notebook .ipynb links FIRST (before generic NN-foo handling) ======
      .replace(
        /\]\((?:[./]+)?notebooks\/(\d{2}-[a-z0-9-]+\.ipynb)\)/g,
        `](${GITHUB_REPO}/blob/main/notebooks/$1)`
      )
      .replace(
        /\]\((\d{2}-[a-z0-9-]+\.ipynb)\)/g,
        `](${GITHUB_REPO}/blob/main/notebooks/$1)`
      )

      // ====== Cross-example links — handle ALL prefix variants ======
      // (../NN-foo/), (../NN-foo/README.md), (NN-foo/), (NN-foo/README.md),
      // (examples/NN-foo/), (examples/NN-foo/README.md), (../examples/NN-foo/...)
      .replace(
        /\]\((?:\.\.?\/)*(?:examples\/)?(\d{2})-([a-z0-9-]+)\/(?:README\.md)?\)/g,
        "](/examples/$2)"
      )

      // ====== Advanced subfolder ======
      .replace(
        /\]\((?:\.\.?\/)*(?:examples\/)?advanced\/([a-z0-9-]+)\.md\)/g,
        "](/examples/advanced/$1)"
      )
      // From examples/README.md the path is `advanced/foo.md` (no ../ prefix)
      .replace(/\]\(advanced\/([a-z0-9-]+)\.md\)/g, "](/examples/advanced/$1)")
      .replace(/\]\(advanced\/?\)/g, "](/examples/advanced/cql2-filtering)")

      // ====== Reference docs ======
      .replace(
        /\]\((?:\.\.?\/)*docs\/([a-z0-9-]+)\.md\)/g,
        "](/reference/$1)"
      )

      // ====== Top-level pages ======
      .replace(/\]\((?:\.\.?\/)*INSTALL\.md\)/g, "](/install)")
      .replace(/\]\((?:\.\.?\/)*CONTRIBUTING\.md\)/g, "](/contributing)")
      .replace(/\]\((?:\.\.?\/)+README\.md\)/g, "](/)")
      .replace(/\]\((?:\.\.?\/)*examples\/README\.md\)/g, "](/examples)")
      .replace(/\]\((?:\.\.?\/)*notebooks\/README\.md\)/g, "](/notebooks)")
      .replace(/\]\((?:\.\.?\/)*prompts\/README\.md\)/g, "](/prompts)")

      // ====== Bare directory references (from root README's nav block) ======
      .replace(/\]\(docs\/?\)/g, "](/reference/tools-reference)")
      .replace(/\]\(examples\/?\)/g, "](/examples)")
      .replace(/\]\(notebooks\/?\)/g, "](/notebooks)")
      .replace(/\]\(prompts\/?\)/g, "](/prompts)")

      // ====== LICENSE → GitHub ======
      .replace(
        /\]\((?:\.\.?\/)*LICENSE\)/g,
        `](${GITHUB_REPO}/blob/main/LICENSE)`
      )

      // ====== Issues — `../../issues` from README ======
      .replace(/\]\(\.\.\/\.\.\/issues\)/g, `](${GITHUB_REPO}/issues)`)

      // ====== Strip any remaining trailing /README.md as a safety net ======
      .replace(/\]\(([^)]+)\/README\.md\)/g, "]($1)")

      // ====== Same rewrites but for HTML href="..." attributes ======
      // These appear in the README's hero block.
      .replace(/href="(?:\.\.?\/)*INSTALL\.md"/g, 'href="/install"')
      .replace(/href="(?:\.\.?\/)*CONTRIBUTING\.md"/g, 'href="/contributing"')
      .replace(/href="(?:\.\.?\/)*examples\/README\.md"/g, 'href="/examples"')
      .replace(/href="(?:\.\.?\/)*notebooks\/README\.md"/g, 'href="/notebooks"')
      .replace(/href="(?:\.\.?\/)*prompts\/README\.md"/g, 'href="/prompts"')
      .replace(
        /href="(?:\.\.?\/)*docs\/([a-z0-9-]+)\.md"/g,
        'href="/reference/$1"'
      )
      .replace(/href="docs\/?"/g, 'href="/reference/tools-reference"')
      .replace(/href="examples\/?"/g, 'href="/examples"')
      .replace(/href="notebooks\/?"/g, 'href="/notebooks"')
      .replace(/href="prompts\/?"/g, 'href="/prompts"')

      // ====== Anchor links pointing back to the README index ======
      // CONTRIBUTING.md links to README.md#try-these-prompts
      .replace(/\]\((?:\.\.?\/)*README\.md(#[a-z0-9-]+)?\)/g, "](/$1)")
  );
}

async function dirExists(p) {
  try {
    const s = await fs.stat(p);
    return s.isDirectory();
  } catch {
    return false;
  }
}

async function main() {
  console.log("[sync] wiping", docsOut);
  await rmrf(docsOut);
  await fs.mkdir(docsOut, { recursive: true });

  // 1. Logo
  const logoSrc = path.join(repoRoot, "assets", "aquaview-logo.png");
  if (existsSync(logoSrc)) {
    await copyFile(logoSrc, path.join(staticImgOut, "aquaview-logo.png"));
    console.log("[sync] logo → static/img/aquaview-logo.png");
  }

  // 2. README.md → intro.md (the homepage of /docs)
  {
    const src = path.join(repoRoot, "README.md");
    const body = rewriteLinks(await readMd(src));
    const out = addFrontMatter(body, {
      sidebar_position: 1,
      slug: "/",
      title: "AQUAVIEW MCP",
      description:
        "Query 700,000+ ocean and atmospheric datasets from inside Claude, ChatGPT, Gemini, Cursor, and any MCP client.",
    });
    await writeMd(path.join(docsOut, "intro.md"), out);
    console.log("[sync] README.md → docs/intro.md");
  }

  // 3. INSTALL.md
  {
    const body = rewriteLinks(await readMd(path.join(repoRoot, "INSTALL.md")));
    const out = addFrontMatter(body, {
      sidebar_position: 2,
      title: "Install",
      slug: "/install",
    });
    await writeMd(path.join(docsOut, "install.md"), out);
  }

  // 4. CONTRIBUTING.md
  {
    const body = rewriteLinks(await readMd(path.join(repoRoot, "CONTRIBUTING.md")));
    const out = addFrontMatter(body, {
      sidebar_position: 99,
      title: "Contributing",
      slug: "/contributing",
    });
    await writeMd(path.join(docsOut, "contributing.md"), out);
  }

  // 5. Reference pages — docs/*.md → reference/*.md
  const refMap = [
    ["tools-reference", "Tools Reference", 1],
    ["collections", "Collections", 2],
    ["data-model", "Data Model", 3],
    ["prompting-guide", "Prompting Guide", 4],
    ["output-formats", "Output Formats", 5],
    ["faq", "FAQ", 6],
  ];
  await fs.mkdir(path.join(docsOut, "reference"), { recursive: true });
  await writeMd(
    path.join(docsOut, "reference", "_category_.json"),
    JSON.stringify(
      {
        label: "Reference",
        position: 3,
        link: { type: "generated-index", description: "API reference and conceptual guides for AQUAVIEW MCP." },
      },
      null,
      2
    )
  );
  for (const [name, title, pos] of refMap) {
    const src = path.join(repoRoot, "docs", `${name}.md`);
    if (!existsSync(src)) continue;
    const body = rewriteLinks(await readMd(src));
    const out = addFrontMatter(body, { sidebar_position: pos, title });
    await writeMd(path.join(docsOut, "reference", `${name}.md`), out);
  }

  // 6. Examples — examples/NN-foo/README.md → examples/NN-foo.md
  await fs.mkdir(path.join(docsOut, "examples"), { recursive: true });
  await writeMd(
    path.join(docsOut, "examples", "_category_.json"),
    JSON.stringify(
      {
        label: "Examples",
        position: 4,
        link: {
          type: "doc",
          id: "examples/index",
        },
      },
      null,
      2
    )
  );
  // examples/README.md → examples/index.md
  {
    const src = path.join(repoRoot, "examples", "README.md");
    const body = rewriteLinks(await readMd(src));
    const out = addFrontMatter(body, { sidebar_position: 0, title: "Overview", slug: "/examples" });
    await writeMd(path.join(docsOut, "examples", "index.md"), out);
  }
  const examplesDir = path.join(repoRoot, "examples");
  const exampleEntries = (await fs.readdir(examplesDir)).filter((n) =>
    /^\d{2}-[a-z0-9-]+$/.test(n)
  );
  exampleEntries.sort();
  for (const dir of exampleEntries) {
    const src = path.join(examplesDir, dir, "README.md");
    if (!existsSync(src)) continue;
    const body = rewriteLinks(await readMd(src));
    const num = parseInt(dir.slice(0, 2), 10);
    const titleSlug = dir
      .slice(3)
      .split("-")
      .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
      .join(" ");
    const out = addFrontMatter(body, {
      sidebar_position: num,
      title: `${dir.slice(0, 2)} — ${titleSlug}`,
    });
    await writeMd(path.join(docsOut, "examples", `${dir}.md`), out);
  }

  // 7. Examples / advanced
  await fs.mkdir(path.join(docsOut, "examples", "advanced"), { recursive: true });
  await writeMd(
    path.join(docsOut, "examples", "advanced", "_category_.json"),
    JSON.stringify({ label: "Advanced", position: 99 }, null, 2)
  );
  if (await dirExists(path.join(examplesDir, "advanced"))) {
    const advFiles = await fs.readdir(path.join(examplesDir, "advanced"));
    let pos = 1;
    for (const f of advFiles) {
      if (!f.endsWith(".md")) continue;
      const body = rewriteLinks(await readMd(path.join(examplesDir, "advanced", f)));
      const titlePart = f
        .replace(/\.md$/, "")
        .split("-")
        .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
        .join(" ");
      const out = addFrontMatter(body, { sidebar_position: pos, title: titlePart });
      await writeMd(path.join(docsOut, "examples", "advanced", f), out);
      pos += 1;
    }
  }

  // 8. Notebooks index
  {
    const src = path.join(repoRoot, "notebooks", "README.md");
    const body = rewriteLinks(await readMd(src));
    const out = addFrontMatter(body, { sidebar_position: 5, title: "Notebooks", slug: "/notebooks" });
    await writeMd(path.join(docsOut, "notebooks.md"), out);
  }

  // 9. Prompts index
  {
    const src = path.join(repoRoot, "prompts", "README.md");
    const body = rewriteLinks(await readMd(src));
    const out = addFrontMatter(body, { sidebar_position: 6, title: "Prompts", slug: "/prompts" });
    await writeMd(path.join(docsOut, "prompts.md"), out);
  }

  console.log("[sync] done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
