# Tempis Timeline Site Review

A thorough review of the marketing site, documentation, and examples under `site/`, with prioritised, actionable next steps. Covers content quality, AI-generated tone, SEO, conversion (licence sales), accessibility, and technical correctness.

Reviewed: `index.html`, `pricing.html`, `get-started.html`, `examples.html`, `changelog.html`, `api.html`, `llms.txt`, `sitemap.xml`, `robots.txt`, and the full `api/core`, `api/react`, `api/vue` doc set.

> **Status:** Last updated after a docs-correctness and consistency pass. Items resolved in that pass are marked **DONE** inline, with a full log in section 0. The API docs are now accurate and internally consistent; the remaining open work is mostly SEO, conversion, and accessibility.

---

## 0. Completed in this pass

API documentation correctness and consistency:

- **Vue API factual errors fixed** (section 2.1): `verticalFill` default corrected `"scroll"` to `"content"`, `stackMode` default corrected `"compact"` to `"stable"`, `vue/ref.html` `toImage` option corrected `format` to `type`, and the `accessibility` and `minimap` rows added to the Vue options table.
- **"collpsed" typo fixed** (section 2.3) in `core/callbacks.html`, plus an em dash in the same demo log swapped for plain text.
- **UK/US spelling normalised** (section 5.1): `color-palette.html` and `categories.html` now use "Colour"; `color` kept only in code identifiers.
- **Missing type exports added.** Three types the docs referenced but the packages did not export (`TempisTimelineFont`, `TempisTimelineLineStyle`, `TempisTimelineRangeUnitOptions`) are now exported from `@tempis/timeline` and re-exported from `@tempis/react` and `@tempis/vue`. Core rebuilt; all three packages type-check clean. (Needs version bumps before publish, see section 8.)
- **Type names now link to their definitions.** Every options/props table across core, React and Vue links each type name to an anchored section (49 links, all verified resolving). The hash router was extended to support in-page anchors via a `page$anchor` form, with a brief highlight on the landing section.
- **Doc structure normalised for consistency:** removed all standalone "Overview" headings in favour of a lead paragraph; unified the type-heading convention (object types named in the heading, enum types shown with a type tag beside a descriptive heading); promoted `grouping` Methods/Callback from h3 to h2; renamed the `rtl` h1 to "Right to left"; aligned the Vue options page with React (added an "Instance Recreate" section).
- **Constructor page completeness** (the page was flagged as lacking): added a Callbacks table (all 7 callbacks), a minimal runnable example, a lead paragraph on construction/lifecycle, a `destroy()` anchor, the `toImage` `Promise<Blob>` return type, and softened the brittle "ten listeners" wording.

Not yet started: all SEO items (section 3), all conversion items (section 4), accessibility items (section 7), and the GitHub-API/robustness items (section 8). The homepage tone pass (section 5) and the remaining docs polish (section 6) are partially addressed where they overlapped the consistency work.

---

## 1. Executive summary

The site is in good shape. The writing is mostly concrete and example-driven, the homepage demos are genuinely impressive, and the information architecture is clean. There is no pervasive "AI slop" to scrub.

The API-docs correctness problems that dragged the original grade down have now been fixed (see section 0). The highest-value **remaining** work is:

1. Strengthening the **conversion path to a commercial licence**, which is currently underdeveloped for a paid product.
2. Filling **SEO gaps** (no OG image strategy beyond the logo, thin structured data, no per-doc-page canonicals/descriptions confirmed).
3. A first **accessibility** pass (demo canvases, contrast, focus states).

Overall grade: **content B+, docs accuracy A- (was C+, corrected this pass), SEO B-, conversion C.**

---

## 2. Critical (fix first, these are wrong or cost sales)

### 2.1 Vue API docs contain factual errors (DONE)
From a full docs audit:

- **`site/api/vue/options.html`**: `verticalFill` was documented with default `"scroll"` (does not exist). Corrected to `"content"` with the full union `"content" | "fill-canvas" | "grow-canvas"`.
- **`site/api/vue/options.html`**: `stackMode` default was `"compact"`. Corrected to `"stable"`.
- **`site/api/vue/ref.html`**: `toImage` example used `{ format: 'png' }`. Corrected to `{ type: 'image/png' }`.
- **`site/api/vue/options.html`**: added the missing `accessibility` and `minimap` rows and switched internal type aliases to spelled-out unions, matching core and React.

### 2.2 Date-adapter API presented two different ways (OPEN)
- `api/core/date-adapters.html` tells users to call `AdapterRegistry.register(adapter)`.
- `api/core/constructor.html` and `llms.txt` document `TempisTimeline.registerDateAdapter(adapter)`.

Both work (one delegates to the other), but a reader sees two "official" APIs with no note they are equivalent.

**Action:** Pick `TempisTimeline.registerDateAdapter` as canonical (matches `llms.txt`), mention `AdapterRegistry` as the lower-level equivalent, and cross-link the two pages.

### 2.3 Visible typo in a live demo (DONE)
`api/core/callbacks.html` logged `"collpsed"` in the event-log demo panel. Fixed to `"collapsed"` (and an em dash in the same log line replaced with plain text).

---

## 3. SEO opportunities

### 3.1 Social share image
Every page uses `images/logo.png` as the OG image. A bare logo produces a poor social card. The product is visual, which is wasted here.

**Action:** Create a dedicated 1200x630 `og-image.png` showing a real timeline screenshot with the wordmark. Reference it from `og:image` and `twitter:image` on every page. Switch `twitter:card` from `summary` to `summary_large_image`.

### 3.2 Structured data is thin and home-only
Only `index.html` has JSON-LD (`SoftwareSourceCode`). 

**Action:**
- Add `SoftwareApplication` schema with `offers` (the £30/mo commercial licence and the £0 community tier) so pricing can surface as a rich result.
- Add `BreadcrumbList` JSON-LD to API doc pages.
- Consider `FAQPage` schema on `pricing.html` (it already has a well-structured FAQ, which is ideal for FAQ rich snippets).

### 3.3 Per-page meta on API docs not confirmed
The core/react/vue doc pages were reviewed for prose, but confirm each has a unique `<title>`, `<meta name="description">`, and `<link rel="canonical">`. Duplicate or missing descriptions across 30+ doc pages waste crawl budget and dilute ranking.

**Action:** Audit all `api/**` pages for unique title + description + canonical. Add where missing.

### 3.4 Keyword targeting
The homepage title "Canvas-powered timeline for the web" is brand-led. High-intent searches are things like "javascript gantt chart library", "react timeline component", "vue timeline component", "canvas timeline library".

**Action:** Work "Gantt", "scheduling", "React timeline component" and "Vue timeline component" naturally into H2s and meta descriptions. The hero typewriter already cycles relevant words, which is good; mirror those terms in crawlable text (they are in the `sr-only` span, which helps).

### 3.5 Sitemap hygiene
`sitemap.xml` has no `lastmod` dates. Search engines use these for recrawl prioritisation.

**Action:** Add `<lastmod>` to each URL; automate it in the build/deploy if possible.

---

## 4. Conversion and licence sales

This is the weakest area relative to the product's quality. It is a paid, source-available library, but the site mostly reads like a free OSS project.

### 4.1 No social proof
There is a live GitHub star count in the nav, but no testimonials, no "used by" logos, no download/usage numbers, no case studies.

**Action:** Add a social-proof strip to the homepage (even "X projects building with Tempis" or npm download count). Once there are real users, add 2-3 short testimonials near the pricing CTA.

### 4.2 Pricing page under-sells
The FAQ is solid, but the page leads with constraints ("Not for use in anything that generates revenue"). The commercial card lists only four features, none of which quantify value.

**Action:**
- Lead the commercial card with outcome value ("Ship Tempis in production, one flat price for the whole org, no seat counting").
- Add a short comparison framing against build-it-yourself cost and against other commercial timeline/Gantt libraries (many charge per-developer; "unlimited developers" is a genuine differentiator, make it loud).
- Add a money-back / cancel-anytime reassurance badge near the buy button (the FAQ says cancel anytime; surface it at the point of decision).

### 4.3 Weak calls to action for buyers
The homepage CTA is "Give it a try / Get started / API reference". There is no path on the homepage that points a commercial evaluator toward pricing.

**Action:** Add a secondary "Using it at work? See licensing" link in the closing CTA band, and consider a subtle pricing mention in the nav area or hero for commercial intent.

### 4.4 Annual billing gap
The FAQ says annual billing is "coming soon". Annual plans materially improve LTV and cash flow for a solo/small product.

**Action:** Prioritise adding an annual option (often with ~2 months free) in Lemon Squeezy; it is a common purchase preference for businesses doing procurement.

---

## 5. Content and tone

Good news from the docs audit: no meaningful AI-slop phrasing ("powerful", "seamlessly", "robust", "with ease", empty restated intros) was found in the API docs. The prose is concrete. A few homepage lines lean slightly generic and could be tightened:

- `index.html` responsive row: "it just works" and "redraws seamlessly" are the two softest phrases on the page. Consider replacing "seamlessly" with something concrete ("redraws as its container resizes, tracked with a ResizeObserver").
- `index.html` live-data row: "no flicker, no jank" is fine and punchy; keep.
- The "What else is in the box" intro ("Quite a lot, and it's all built in") is good, on-brand voice.

**Action:** Light pass on the homepage feature rows to swap two or three soft adjectives for concrete mechanics. Low priority; the copy is largely strong.

### 5.1 Spelling consistency, US vs UK (DONE)
The docs mixed "Color Palette" (H1) with "colour" in body prose. Normalised to UK spelling across prose and visible labels (`color-palette.html` h1 and the `categories.html` link now read "Colour"), keeping `color` only in code identifiers (`backgroundColor`, `fontColor`, `gridColor`). The remaining homepage-tone action in this section is still open.

---

## 6. Documentation gaps and polish

Already addressed in the consistency pass (section 0):
- **Constructor page** was thin: now has a callbacks table, a minimal example, a lifecycle lead paragraph, and a `toImage` return type. **DONE**
- **Type names** across all options/props tables now link to anchored definitions. **DONE**
- **Vue options** aligned with React (Instance Recreate section). **DONE**
- **"Overview" headings** removed site-wide; type-heading convention unified. **DONE**

Still open:
- **`api/core/range.html`**: does not mention the zoom hard limits documented in `llms.txt` (floor 1000 ms, ceiling ~10,000 years). Add them so out-of-bounds values do not surprise. (The `TempisTimelineRangeUnitOptions` section was added this pass, but the zoom limits note is still missing.)
- **`api/core/color-palette.html`**: add a reciprocal cross-link to `categories.html` (categories links to it, not vice versa).
- **`api/vue/ref.html`**: add the "escape hatches" note explaining when to use `getInstance()` / `getCanvas()` (React's ref page has it; Vue's does not).
- **`TempisTimelineBandStyle` undocumented**: it is exported and referenced via `TempisTimelineBand.style`, but has no dedicated anchored section like the other style sub-types (`TempisTimelineItemStyle`, `TempisTimelineDependencyStyle` now have one).
- **Cross-reference footers**: deep core pages (`bands`, `dependencies`, `scrollbar`, `minimap`, `rtl`) have no "see also". The sequential prev/next nav covers some of this, so low priority.
- **`llms.txt` gaps**: `TempisTimeline.getDateAdapter()` is documented in `constructor.html` but absent from `llms.txt`; also add the three newly exported types (`TempisTimelineFont`, `TempisTimelineLineStyle`, `TempisTimelineRangeUnitOptions`) so the single-file API surface stays complete.

**Action:** Batch the remaining items into one short docs-polish pass.

---

## 7. Accessibility

Strengths: the hero typewriter has a proper `sr-only` full phrase and respects `prefers-reduced-motion`; nav has ARIA labels; the library itself ships keyboard/ARIA support.

Gaps to check:
- **Canvas demos**: the homepage has many `<canvas>` elements with no text alternative. A screen-reader user gets nothing from them. Each decorative demo canvas should have `aria-hidden="true"` (if purely illustrative) or an `aria-label` summarising what it shows.
- **Colour contrast**: verify the muted text tokens (`--text-3`, `--ink-3`) meet WCAG AA (4.5:1) against their backgrounds, especially the pale grey hints and tile badges.
- **Focus states**: confirm visible keyboard focus rings on nav links, buttons, and the pricing CTAs.

**Action:** Add `aria-hidden="true"` to decorative demo canvases, run a contrast check on the grey text tokens, and verify focus-visible styling. Note that full WCAG conformance needs manual testing with assistive tech and expert review; this is a first pass only.

---

## 8. Technical correctness and robustness

- **GitHub API rate limits**: both the nav star count (`index.html`) and the entire `changelog.html` fetch from the unauthenticated GitHub API (60 requests/hour/IP). On a popular launch day this will rate-limit and the changelog will show the error state. Consider caching release data at build time, or a tiny serverless proxy with a token.
- **Changelog depends on live network**: if GitHub is unreachable the page is empty except an error. A build-time snapshot as fallback would be more resilient and better for SEO (currently the changelog content is invisible to crawlers because it loads client-side from the API).
- **`index.html` nav GitHub aria-label**: reads `aria-label="GitHub on GitHub"` (the home page's nav), likely a find/replace artefact from "Tempis on GitHub". Minor, fix for polish.
- **Example coverage**: `examples/` contains ~40 files but the site lists ~18. The unlisted ones (`basic`, `static`, `keypress`, `single-item`, `stress-test`, `stack-mode`, `vertical-fill`, `min_max`, `ltr`, `set-items`, etc.) appear to be dev/scratch pages. Confirm none are meant to be public, and consider whether `stress-test` (performance) deserves a public card, it is a strong sales argument for the "large datasets" claim.
- **Pending version bumps (from this pass).** The consistency pass added three new type exports to all three packages and rebuilt core. Before publishing: bump `@tempis/timeline` (minor, additive exports), bump `@tempis/react` and `@tempis/vue` (minor, new re-exports), and tighten the wrappers' `@tempis/timeline` peer range to require the core version that actually has the new types. Suggested: core `1.3.0 -> 1.4.0`, react `1.0.3 -> 1.1.0`, vue `1.0.0 -> 1.1.0`, peer range `^1.4.0`.

**Action:** Add GitHub API caching/fallback for the star count and changelog; fix the duplicated aria-label; decide whether to surface the stress-test example publicly; apply the version bumps above before the next publish.

---

## 9. Things worth adding

- **OG image** (covered in SEO): single highest-leverage visual/SEO addition.
- **A "comparison" page or section**: "Tempis vs vis-timeline / vs building your own / vs commercial Gantt libraries". High commercial-intent SEO and directly supports the licence decision.
- **A real-world case study or blog**: even one "how we render 50k events at 60fps" technical post would pull in the target audience (developers searching for performant timeline solutions) and feed SEO.
- **Framework coverage**: there are Angular and Svelte SVGs in `images/`. If wrappers are planned, a "works with any framework" section with those logos (greyed "coming soon") signals breadth. If not planned, remove the unused SVGs.
- **Stress-test / benchmark numbers on the homepage**: the "built for large datasets" row shows 5000 items; quantify it ("5,000+ items, 60fps pan/zoom") to make the performance claim concrete and credible.
- **Playground discoverability**: the playground is strong but buried. A link from the hero or the large-datasets row would raise engagement.

---

## 10. Prioritised action list

**P0 (correctness), DONE this pass**
1. ~~Fix `vue/options.html` `verticalFill` default.~~ DONE
2. ~~Fix `vue/options.html` `stackMode` default.~~ DONE
3. ~~Fix `vue/ref.html` `toImage` option.~~ DONE
4. ~~Fix "collpsed" typo in `core/callbacks.html`.~~ DONE
5. ~~Export the three types the docs referenced but packages did not.~~ DONE (bumps pending, see P2.16)

**P1 (high leverage), OPEN**
6. Add a proper 1200x630 OG image and switch to `summary_large_image` sitewide.
7. Strengthen the pricing page (value-led commercial card, unlimited-devs differentiator, cancel-anytime reassurance at the button).
8. Add social proof to the homepage (npm downloads / star count / first testimonials).
9. Cache the GitHub star count and changelog (rate-limit resilience + crawlable changelog).

**P2 (polish and depth), OPEN**
10. Reconcile the date-adapter API naming and cross-link (section 2.2).
11. Add `FAQPage` + `SoftwareApplication`/`offers` structured data; audit per-page meta/canonical on all docs.
12. Add `lastmod` to sitemap; add `aria-hidden`/labels to demo canvases; contrast check on grey tokens.
13. Homepage tone pass (swap "seamlessly" / "it just works" for concrete mechanics); remaining docs polish (range zoom limits, reciprocal palette link, Vue ref escape-hatches note, document `TempisTimelineBandStyle`, update `llms.txt`).
14. Add a comparison section/page and quantified performance numbers.
15. Fix `index.html` nav `aria-label="GitHub on GitHub"`; decide on unused Angular/Svelte SVGs and the stress-test example.
16. Version bumps before next publish: core `1.4.0`, react `1.1.0`, vue `1.1.0`, wrapper peer range `^1.4.0` (section 8).

**Done since the original review**
- All P0 correctness items; UK/US spelling pass; Vue options aligned with React; type-name linking across all tables; doc structure normalisation; constructor page completeness.

---

*This review is a static read of the HTML/CSS/JS and content. It does not replace live cross-browser testing, Lighthouse/analytics data, or manual accessibility testing with assistive technology, all of which are recommended before a launch push.*
