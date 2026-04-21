const { execSync } = require("child_process");
const chokidar = require("chokidar");

function build() {
  try {
    execSync("node scripts/build-site.js", { stdio: "inherit" });
  } catch (e) {
    console.error("Build failed:", e.message);
  }
}

build();

const watcher = chokidar.watch(["site", "examples"], {
  ignoreInitial: true,
  ignored: ["**/dist/**"],
  awaitWriteFinish: { stabilityThreshold: 200 },
});

let timeout;
watcher.on("all", () => {
  clearTimeout(timeout);
  timeout = setTimeout(build, 300);
});

console.log("Watching site/, examples/ for changes...");
