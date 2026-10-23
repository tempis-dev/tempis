# Tempis Timeline Site Review

Outstanding work only. Items already actioned have been removed. Covers SEO, conversion (licence sales), accessibility, technical robustness, documentation polish, and content tone.

Scope of the review: `index.html`, `pricing.html`, `get-started.html`, `examples.html`, `changelog.html`, `api.html`, `llms.txt`, `sitemap.xml`, `robots.txt`, and the full `api/core`, `api/react`, `api/vue` doc set.

---

## 1. SEO

### 1.1 Social share image
Every page uses `images/logo.png` as the OG image. A bare logo makes a poor social card for a visual product.

Create a 1200x630 `og-image.png` showing a real timeline screenshot with the wordmark. Reference it from `og:image` and `twitter:image` on every page, and switch `twitter:card` from `summary` to `summary_large_image`.

### 1.2 Structured data is thin and home-only
Only `index.html` has JSON-LD (`SoftwareSourceCode`).

- Add `SoftwareApplication` schema with `offers` (the £30/mo commercial licence and the £0 community tier) so pricing can surface as a rich result.
- Add `BreadcrumbList` JSON-LD to API doc pages.
- Add `FAQPage` schema on `pricing.html` (it already has a well-structured FAQ, ideal for FAQ rich snippets).

### 1.3 Per-page meta on API docs
Confirm each core/react/vue doc page has a unique `<title>`, `<meta name="description">`, and `<link rel="canonical">`. Duplicate or missing descriptions across 30+ doc pages waste crawl budget and dilute ranking. Add where missing.

### 1.4 Keyword targeting
The homepage title "Canvas-powered timeline for the web" is brand-led. High-intent searches are "javascript gantt chart library", "react timeline component", "vue timeline component", "canvas timeline library". Work "Gantt", "scheduling", "React timeline component" and "Vue timeline component" naturally into H2s and meta descriptions.

### 1.5 Sitemap hygiene
`sitemap.xml` has no `lastmod` dates. Add `<lastmod>` to each URL and automate it in the build/deploy if possible.

---

## 2. Conversion and licence sales

This is the weakest area relative to the product's quality. It is a paid, source-available library, but the site mostly reads like a free OSS project.

### 2.1 No social proof
There is a live GitHub star count in the nav, but no testimonials, no "used by" logos, no download/usage numbers, no case studies. Add a social-proof strip to the homepage (even npm download count). Once there are real users, add 2-3 short testimonials near the pricing CTA.

### 2.2 Pricing page under-sells
The FAQ is solid, but the page leads with constraints ("Not for use in anything that generates revenue"), and the commercial card lists only four features, none quantifying value.

- Lead the commercial card with outcome value ("Ship Tempis in production, one flat price for the whole org, no seat counting").
- Add comparison framing against build-it-yourself cost and against other commercial timeline/Gantt libraries (many charge per developer; "unlimited developers" is a genuine differentiator, make it loud).
- Surface the cancel-anytime reassurance near the buy button (currently only in the FAQ).

### 2.3 Weak calls to action for buyers
The homepage CTA is "Give it a try / Get started / API reference", with no path pointing a commercial evaluator toward pricing. Add a secondary "Using it at work? See licensing" link in the closing CTA band.

### 2.4 Annual billing gap
The FAQ says annual billing is "coming soon". Annual plans improve LTV and cash flow and suit business procurement. Prioritise adding an annual option (often with ~2 months free) in Lemon Squeezy.

---

## 3. Accessibility

Strengths already present: the hero typewriter has a proper `sr-only` full phrase and respects `prefers-reduced-motion`; nav has ARIA labels; the library ships keyboard/ARIA support.

To do:
- **Canvas demos**: the homepage has many `<canvas>` elements with no text alternative. Add `aria-hidden="true"` to purely decorative demo canvases, or an `aria-label` summarising what each shows.
- **Colour contrast**: verify the muted text tokens (`--text-3`, `--ink-3`) meet WCAG AA (4.5:1), especially the pale grey hints and tile badges.
- **Focus states**: confirm visible keyboard focus rings on nav links, buttons, and the pricing CTAs.

Full WCAG conformance needs manual testing with assistive tech and expert review; the above is a first pass.

---

## 4. Technical robustness

- **GitHub API rate limits**: both the nav star count (`index.html`) and the entire `changelog.html` fetch from the unauthenticated GitHub API (60 requests/hour/IP). On a busy day this rate-limits and the changelog shows its error state. Cache release data at build time, or use a small serverless proxy with a token.
- **Changelog depends on live network**: if GitHub is unreachable the page is empty except an error, and the content is invisible to crawlers because it loads client-side. A build-time snapshot fallback would be more resilient and better for SEO.
- **`index.html` nav GitHub aria-label**: reads `aria-label="GitHub on GitHub"`, likely a find/replace artefact from "Tempis on GitHub". Fix for polish.
- **Example coverage**: `examples/` contains ~40 files but the site lists ~18. The unlisted ones (`basic`, `static`, `keypress`, `single-item`, `stress-test`, `stack-mode`, `vertical-fill`, `min_max`, `ltr`, `set-items`, etc.) look like dev/scratch pages. Confirm none are meant to be public, and consider surfacing `stress-test` (performance) as a public card, since it supports the "large datasets" claim.
- **Pending version bumps**: a recent pass added three new type exports (`TempisTimelineFont`, `TempisTimelineLineStyle`, `TempisTimelineRangeUnitOptions`) to all three packages and rebuilt core. Before publishing, bump `@tempis/timeline` `1.3.0 -> 1.4.0` (additive exports), `@tempis/react` `1.0.3 -> 1.1.0`, `@tempis/vue` `1.0.0 -> 1.1.0`, and tighten the wrappers' `@tempis/timeline` peer range to `^1.4.0` so the new types are guaranteed present.

---

## 5. Documentation polish

- **`api/core/date-adapters.html` vs `constructor.html`/`llms.txt`**: the adapter registration API is shown two ways (`AdapterRegistry.register(adapter)` vs `TempisTimeline.registerDateAdapter(adapter)`). Both work (one delegates to the other). Pick `TempisTimeline.registerDateAdapter` as canonical (matches `llms.txt`), note `AdapterRegistry` as the lower-level equivalent, and cross-link the two pages.
- **`api/core/range.html`**: does not mention the zoom hard limits documented in `llms.txt` (floor 1000 ms, ceiling ~10,000 years). Add them so out-of-bounds values do not surprise.
- **`api/core/color-palette.html`**: add a reciprocal cross-link to `categories.html` (categories links to it, not vice versa).
- **`api/vue/ref.html`**: add the "escape hatches" note explaining when to use `getInstance()` / `getCanvas()` (React's ref page has it; Vue's does not).
- **`TempisTimelineBandStyle` undocumented**: it is exported and referenced via `TempisTimelineBand.style`, but has no dedicated anchored section like the other style sub-types (`TempisTimelineItemStyle`, `TempisTimelineDependencyStyle` already have one).
- **Cross-reference footers**: deep core pages (`bands`, `dependencies`, `scrollbar`, `minimap`, `rtl`) have no "see also". The sequential prev/next nav covers some of this, so low priority.
- **`llms.txt` gaps**: it omits `TempisTimeline.getDateAdapter()` and the three newly exported types (`TempisTimelineFont`, `TempisTimelineLineStyle`, `TempisTimelineRangeUnitOptions`). Add them so the single-file API surface stays complete.

---

## 6. Content and tone

The prose is largely concrete and example-driven. A couple of homepage lines lean soft:

- `index.html` responsive row: "it just works" and "redraws seamlessly". Replace "seamlessly" with something concrete ("redraws as its container resizes, tracked with a ResizeObserver").
- Keep "no flicker, no jank" and "Quite a lot, and it's all built in"; those read well.

Low priority; a light pass to swap two or three soft adjectives for concrete mechanics.

---

## 7. Things worth adding

- **Comparison page or section**: "Tempis vs vis-timeline / vs building your own / vs commercial Gantt libraries". High commercial-intent SEO and directly supports the licence decision.
- **A real-world case study or technical blog post**: e.g. "how we render 50k events at 60fps". Pulls in the target audience and feeds SEO.
- **Framework coverage signal**: there are Angular and Svelte SVGs in `images/`. If wrappers are planned, a "works with any framework" section with those logos (greyed "coming soon") signals breadth. If not planned, remove the unused SVGs.
- **Quantified performance on the homepage**: the "built for large datasets" row shows 5000 items; quantify it ("5,000+ items, 60fps pan/zoom") to make the claim concrete.
- **Playground discoverability**: the playground is strong but buried. A link from the hero or the large-datasets row would raise engagement.

---

## 8. Prioritised next steps

**P1 (high leverage)**
1. 1200x630 OG image + `summary_large_image` sitewide (1.1).
2. Strengthen the pricing page: value-led commercial card, unlimited-devs differentiator, cancel-anytime reassurance at the button (2.2).
3. Add social proof to the homepage (2.1).
4. Cache the GitHub star count and changelog (4).
5. Version bumps before the next publish (4).

**P2 (polish and depth)**
6. Structured data: `FAQPage`, `SoftwareApplication`/`offers`, `BreadcrumbList`; audit per-page meta/canonical (1.2, 1.3).
7. `lastmod` in sitemap; `aria-hidden`/labels on demo canvases; contrast check on grey tokens (1.5, 3).
8. Docs polish batch: date-adapter naming, range zoom limits, reciprocal palette link, Vue ref escape-hatches note, document `TempisTimelineBandStyle`, update `llms.txt` (5).
9. Homepage tone pass (6).
10. Comparison section/page and quantified performance numbers (7).
11. Fix `index.html` nav `aria-label="GitHub on GitHub"`; decide on unused Angular/Svelte SVGs and the stress-test example (4).

---

*This review is a static read of the HTML/CSS/JS and content. It does not replace live cross-browser testing, Lighthouse/analytics data, or manual accessibility testing with assistive technology, all of which are recommended before a launch push.*
