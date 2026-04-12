const fs = require("fs");
const path = require("path");

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

console.log("Built site -> dist/site/");
