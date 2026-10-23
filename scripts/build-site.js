const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const OUT = path.resolve(__dirname, "..", "dist", "site");
const ROOT = path.resolve(__dirname, "..");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Refresh each sitemap <lastmod> from the matching file's modification time, so the
// dates stay honest without being hand-maintained. The source URL path maps directly
// to a file under dist/site (the root "/" maps to index.html).
function updateSitemapLastmod() {
  const sitemapPath = path.join(OUT, "sitemap.xml");
  if (!fs.existsSync(sitemapPath)) return;
  let xml = fs.readFileSync(sitemapPath, "utf8");
  xml = xml.replace(/<url>[\s\S]*?<\/url>/g, (block) => {
    const locMatch = block.match(/<loc>https:\/\/tempis\.dev\/([^<]*)<\/loc>/);
    if (!locMatch) return block;
    const rel = locMatch[1] === "" ? "index.html" : locMatch[1];
    const filePath = path.join(OUT, rel);
    if (!fs.existsSync(filePath)) return block;
    const mtime = fs.statSync(filePath).mtime.toISOString().slice(0, 10);
    if (/<lastmod>[^<]*<\/lastmod>/.test(block)) {
      return block.replace(/<lastmod>[^<]*<\/lastmod>/, "<lastmod>" + mtime + "</lastmod>");
    }
    return block.replace(/(<\/loc>)/, "$1\n    <lastmod>" + mtime + "</lastmod>");
  });
  fs.writeFileSync(sitemapPath, xml);
  console.log("Refreshed sitemap lastmod dates from file mtimes.");
}

// Build the browser bundle and copy to lib/.
console.log("Building browser bundle...");
execSync("npm run build:web --workspace=packages/tempis-timeline", { cwd: ROOT, stdio: ["inherit", "inherit", "pipe"] });
fs.mkdirSync(path.join(ROOT, "lib"), { recursive: true });
fs.copyFileSync(
  path.join(ROOT, "packages", "tempis-timeline", "dist", "tempis_timeline.js"),
  path.join(ROOT, "lib", "tempis_timeline.js")
);

// Clean the output directory.
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// Copy site/ -> dist/site/.
copyDir(path.join(ROOT, "site"), OUT);

// Copy examples/ -> dist/site/examples/.
copyDir(path.join(ROOT, "examples"), path.join(OUT, "examples"));

// Copy lib/ -> dist/site/lib/.
const libDest = path.join(OUT, "lib");
fs.mkdirSync(libDest, { recursive: true });
fs.copyFileSync(path.join(ROOT, "lib", "tempis_timeline.js"), path.join(libDest, "tempis_timeline.js"));

// Copy LICENSE -> dist/site/LICENSE.
fs.copyFileSync(path.join(ROOT, "LICENSE"), path.join(OUT, "LICENSE"));

// Post-process the built output.
updateSitemapLastmod();

console.log("Built site -> dist/site/");
