/**
 * Test script for @tempis/node.
 * Run with: node test.mjs
 *
 * Outputs timeline images to the current directory.
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { renderTimeline, registerFont } = require("./dist/index.js");
import { writeFileSync } from "fs";

// Test 1: Basic render with fixed height
console.log("Test 1: Fixed height render...");
const result1 = await renderTimeline({
    width: 1200,
    height: 400,
    items: [
        { id: 1, label: "Design", start: "2026-01-05", end: "2026-01-15", grouping: "Frontend" },
        { id: 2, label: "Build", start: "2026-01-12", end: "2026-01-28", grouping: "Frontend" },
        { id: 3, label: "Launch", start: "2026-01-30", grouping: "Frontend" },
        { id: 4, label: "API", start: "2026-01-08", end: "2026-01-25", grouping: "Backend" },
        { id: 5, label: "Database", start: "2026-01-10", end: "2026-01-20", grouping: "Backend" },
    ],
    range: { start: "2026-01-01", end: "2026-02-01", position: "bottom" },
    grouping: { collapsible: true },
});
writeFileSync("test-output-fixed.png", result1.buffer);
console.log(`  Output: test-output-fixed.png (${result1.width}x${result1.height}, ${(result1.buffer.length / 1024).toFixed(1)} KB)`);

// Test 2: Auto height (content-derived)
console.log("Test 2: Auto height render...");
const result2 = await renderTimeline({
    width: 1200,
    items: [
        { id: 1, label: "Sprint 1", start: "2026-01-05", end: "2026-01-19", grouping: "Team A", category: "dev" },
        { id: 2, label: "Sprint 2", start: "2026-01-19", end: "2026-02-02", grouping: "Team A", category: "dev" },
        { id: 3, label: "Sprint 3", start: "2026-02-02", end: "2026-02-16", grouping: "Team A", category: "dev" },
        { id: 4, label: "Design Review", start: "2026-01-10", end: "2026-01-14", grouping: "Team B", category: "design" },
        { id: 5, label: "User Testing", start: "2026-01-20", end: "2026-01-28", grouping: "Team B", category: "design" },
        { id: 6, label: "Release", start: "2026-02-16", grouping: "Team A", category: "dev" },
        { id: 7, label: "Retrospective", start: "2026-02-18", end: "2026-02-19", grouping: "Team B", category: "design" },
    ],
    categories: [
        { name: "dev", label: "Development", style: { backgroundColor: "#6366f1" } },
        { name: "design", label: "Design", style: { backgroundColor: "#f43f5e" } },
    ],
    range: { start: "2026-01-01", end: "2026-03-01", position: "bottom" },
    legend: { position: "top" },
});
writeFileSync("test-output-auto.png", result2.buffer);
console.log(`  Output: test-output-auto.png (${result2.width}x${result2.height}, ${(result2.buffer.length / 1024).toFixed(1)} KB)`);

// Test 3: High DPR (retina)
console.log("Test 3: 2x DPR render...");
const result3 = await renderTimeline({
    width: 800,
    height: 300,
    dpr: 2,
    items: [
        { id: 1, label: "Task A", start: "2026-03-01", end: "2026-03-10" },
        { id: 2, label: "Task B", start: "2026-03-05", end: "2026-03-15" },
        { id: 3, label: "Task C", start: "2026-03-12", end: "2026-03-20" },
    ],
    range: { start: "2026-02-25", end: "2026-03-25", position: "bottom" },
});
writeFileSync("test-output-2x.png", result3.buffer);
console.log(`  Output: test-output-2x.png (${result3.width}x${result3.height} @2x, ${(result3.buffer.length / 1024).toFixed(1)} KB)`);

// Test 4: JPEG with background colour
console.log("Test 4: JPEG with background...");
const result4 = await renderTimeline({
    width: 1000,
    height: 350,
    format: "jpeg",
    quality: 0.85,
    backgroundColor: "#1a1a2e",
    style: {
        gridColor: "#ffffff",
        item: { backgroundColor: "#e8594f", fontColor: "#ffffff" },
    },
    items: [
        { id: 1, label: "Phase 1", start: "2026-04-01", end: "2026-04-15" },
        { id: 2, label: "Phase 2", start: "2026-04-10", end: "2026-04-25" },
        { id: 3, label: "Phase 3", start: "2026-04-20", end: "2026-05-05" },
    ],
    range: { start: "2026-03-28", end: "2026-05-10", position: "bottom" },
});
writeFileSync("test-output-dark.jpg", result4.buffer);
console.log(`  Output: test-output-dark.jpg (${result4.width}x${result4.height}, ${(result4.buffer.length / 1024).toFixed(1)} KB)`);

console.log("\nAll tests complete!");
