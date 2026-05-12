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

// Build the browser bundle and copy to lib/
console.log("Building browser bundle...");
execSync("npm run build:web --workspace=packages/tempis-timeline", { cwd: ROOT, stdio: ["inherit", "inherit", "pipe"] });
fs.mkdirSync(path.join(ROOT, "lib"), { recursive: true });
fs.copyFileSync(
  path.join(ROOT, "packages", "tempis-timeline", "dist", "tempis_timeline.js"),
  path.join(ROOT, "lib", "tempis_timeline.js")
);

// Clean
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// Copy site/ -> dist/site/
copyDir(path.join(ROOT, "site"), OUT);

// Copy examples/ -> dist/site/examples/
copyDir(path.join(ROOT, "examples"), path.join(OUT, "examples"));

// Copy lib/ -> dist/site/lib/
const libSrc = path.join(ROOT, "lib", "tempis_timeline.js");
const libDest = path.join(OUT, "lib");
fs.mkdirSync(libDest, { recursive: true });
fs.copyFileSync(libSrc, path.join(libDest, "tempis_timeline.js"));

// Copy LICENSE -> dist/site/LICENSE
fs.copyFileSync(path.join(ROOT, "LICENSE"), path.join(OUT, "LICENSE"));

console.log("Built site -> dist/site/");
