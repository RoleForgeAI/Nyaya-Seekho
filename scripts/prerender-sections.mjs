// Runs automatically after `vite build` (package.json "postbuild").
// Writes a real HTML page for every section — dist/bns/103/index.html,
// dist/constitution/21/index.html, … — each with its own <title>, meta
// description, canonical link and the section text inside #root (React
// replaces it as soon as the app loads). Also writes sitemap.xml, robots.txt
// and 404.html. Section data comes straight from src/App.jsx via
// getSitePages(), so there is nothing extra to keep in sync.
//
// Site address: set SITE_URL when the site moves to its own domain, e.g.
//   SITE_URL=https://www.example.in npm run build
// (and change `base` in vite.config.js to "/").

import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, process.argv[2] || "dist");
const viteConfig = readFileSync(join(root, "vite.config.js"), "utf8");
const BASE = (viteConfig.match(/base:\s*["'`]([^"'`]+)["'`]/) || [, "/"])[1];
const SITE_URL = (process.env.SITE_URL || "https://roleforgeai.github.io/Nyaya-Seekho").replace(/\/+$/, "");
const SITE_ORIGIN = new URL(SITE_URL).origin;

// 1. Bundle App.jsx for Node just far enough to call getSitePages().
// Kept inside the project (not the OS temp dir) so the bundle can still find node_modules.
const tmp = join(root, "node_modules", ".cache", `nyaya-prerender-${process.pid}`);
mkdirSync(tmp, { recursive: true });
const outFile = join(tmp, "site-pages.mjs");
await build({
  stdin: {
    contents: `export { getSitePages } from ${JSON.stringify(join(root, "src/App.jsx"))};`,
    resolveDir: root,
    loader: "js",
  },
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: outFile,
  jsx: "automatic",
  loader: { ".js": "jsx", ".jsx": "jsx" },
  packages: "external",
  define: { "import.meta.env": JSON.stringify({ BASE_URL: BASE }) },
  logLevel: "error",
});
const { getSitePages } = await import(pathToFileURL(outFile).href);
const pages = getSitePages();
rmSync(tmp, { recursive: true, force: true });

// 2. Template = the built index.html (keeps the hashed JS/CSS asset links).
const template = readFileSync(join(distDir, "index.html"), "utf8");

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const paras = (s) =>
  String(s || "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${esc(p)}</p>`)
    .join("");

function renderPage({ title, description, canonical, body }) {
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta\s+name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`);
  const headExtra = [
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="Nyaya Seekho" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
  ].join("\n    ");
  html = html.replace(/<link rel="canonical"[^>]*>\s*/g, "").replace("</head>", `    ${headExtra}\n  </head>`);
  return html.replace(/<div id="root"><\/div>/, `<div id="root">${body}</div>`);
}

const wrapStyle =
  "max-width:760px;margin:0 auto;padding:24px 18px 60px;font-family:Georgia,serif;color:#211b16;background:#f6f1e6;line-height:1.65";

let written = 0;
const slugsSeen = new Set();
for (const p of pages) {
  if (slugsSeen.has(p.path)) throw new Error(`Two sections share the same address: ${p.path}`);
  slugsSeen.add(p.path);
  const canonical = SITE_ORIGIN + p.path;
  const body = [
    `<article style="${wrapStyle}">`,
    `<p style="font:12px sans-serif;letter-spacing:1px;text-transform:uppercase;color:#7c2233">${esc(p.actLabel)}${p.chapterLabel ? " › " + esc(p.chapterLabel) : ""}</p>`,
    `<h1 style="font-size:24px;margin:6px 0 10px">${esc(p.heading)}</h1>`,
    p.oldLaw ? `<p><strong>Old law:</strong> ≈ ${esc(p.oldLaw)}</p>` : "",
    paras(p.text),
    p.plain ? `<h2 style="font-size:17px">In Plain English</h2>${paras(p.plain)}` : "",
    p.whatChanged ? `<h2 style="font-size:17px">What changed from the old law</h2>${paras(p.whatChanged)}` : "",
    `</article>`,
  ].join("");
  if (!p.path.startsWith(BASE)) throw new Error(`Section address ${p.path} does not start with the site base ${BASE}`);
  const out = join(distDir, p.path.slice(BASE.length));
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "index.html"), renderPage({ title: p.title, description: p.description, canonical, body }));
  written++;
}

// 3. Home page: better title + canonical; 404.html lets unknown deep links still load the app.
const homeTitle = "Nyaya Seekho — Bare Acts for Indian Law Students (BNS, BNSS, BSA, CPC, Constitution)";
const homeDesc =
  "Free bare-Act reader for Indian law students: BNS, BNSS, BSA with old IPC/CrPC/Evidence Act section numbers, CPC, Constitution and 15+ civil Acts, with plain-English explanations and landmark cases.";
const home = renderPage({ title: homeTitle, description: homeDesc, canonical: SITE_ORIGIN + BASE, body: "" });
writeFileSync(join(distDir, "index.html"), home);
writeFileSync(join(distDir, "404.html"), home.replace(/<link rel="canonical"[^>]*>\s*/, ""));

// 4. sitemap.xml + robots.txt
const today = new Date().toISOString().slice(0, 10);
const urls = [SITE_ORIGIN + BASE, ...pages.filter((p) => p.inSitemap).map((p) => SITE_ORIGIN + p.path)];
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${esc(u)}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
  `\n</urlset>\n`;
writeFileSync(join(distDir, "sitemap.xml"), sitemap);
writeFileSync(join(distDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}${BASE}sitemap.xml\n`);

console.log(`prerender: ${written} section pages, sitemap with ${urls.length} URLs → ${distDir}`);
