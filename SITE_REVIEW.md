# Tempis Timeline Site Review

Outstanding work only. Items already actioned have been removed. Covers SEO, conversion (licence sales), technical robustness, and things worth adding.

Scope of the review: `index.html`, `pricing.html`, `get-started.html`, `examples.html`, `changelog.html`, `api.html`, `llms.txt`, `sitemap.xml`, `robots.txt`, and the full `api/core`, `api/react`, `api/vue` doc set.

---

## 1. SEO

### 1.1 Per-page meta on the main pages
The API doc files are fragments served through the `api.html` shell, so they correctly have no per-page meta and are no longer in the sitemap. Confirm the eight real standalone pages (`index`, `get-started`, `api`, `examples`, `pricing`, `changelog`, `privacy`, `terms`) each have a unique `<title>`, `<meta name="description">`, and `<link rel="canonical">`. Add where missing.

### 1.2 Keyword targeting
The homepage title "Canvas-powered timeline for the web" is brand-led. High-intent searches are "javascript gantt chart library", "react timeline component", "vue timeline component", "canvas timeline library". Work "Gantt", "scheduling", "React timeline component" and "Vue timeline component" naturally into H2s and meta descriptions.

---

## 2. Conversion and licence sales

This is the weakest area relative to the product's quality. It is a paid, source-available library, but the site mostly reads like a free OSS project.

### 2.1 No social proof
There is a live GitHub star count in the nav, but no testimonials, no "used by" logos, no download/usage numbers, no case studies. Add a social-proof strip to the homepage (even npm download count). Once there are real users, add 2-3 short testimonials near the pricing CTA. Needs real numbers or quotes from you.

### 2.2 Pricing page under-sells
The FAQ is solid, but the page leads with constraints ("Not for use in anything that generates revenue"), and the commercial card lists only four features, none quantifying value.

- Lead the commercial card with outcome value ("Ship Tempis in production, one flat price for the whole org, no seat counting").
- Add comparison framing against build-it-yourself cost and against other commercial timeline/Gantt libraries (many charge per developer; "unlimited developers" is a genuine differentiator, make it loud).
- Surface the cancel-anytime reassurance near the buy button (currently only in the FAQ).

Needs your positioning decisions; the copy can then be drafted.

### 2.3 Weak calls to action for buyers
The homepage CTA is "Give it a try / Get started / API reference", with no path pointing a commercial evaluator toward pricing. Add a secondary "Using it at work? See licensing" link in the closing CTA band.

### 2.4 Annual billing gap
The FAQ says annual billing is "coming soon". Annual plans improve LTV and cash flow and suit business procurement. Prioritise adding an annual option (often with ~2 months free) in Lemon Squeezy. Needs the Lemon Squeezy change first, then a copy/FAQ update.

---

## 3. Technical robustness

- **GitHub API dependency (decision recorded, not actioned)**: the nav star count and the `changelog.html` release list both fetch the unauthenticated GitHub API (60 requests/hour/IP), so on a busy day the changelog can show its error state and the content is not in the static markup for crawlers. A build-time snapshot was built and then intentionally reverted to keep the setup simple; the site uses live client-side fetches that fail silently. Revisit only if rate limiting or changelog SEO becomes a real problem.
- **Example coverage**: `examples/` contains ~40 files but the site lists ~18. The unlisted ones (`basic`, `static`, `keypress`, `single-item`, `stress-test`, `stack-mode`, `vertical-fill`, `min_max`, `ltr`, `set-items`, etc.) look like dev/scratch pages. Confirm none are meant to be public, and consider surfacing `stress-test` (performance) as a public card, since it supports the "large datasets" claim. Needs your call on which to publish.
- **Pending version bumps (release gate)**: a recent pass added three new type exports (`TempisTimelineFont`, `TempisTimelineLineStyle`, `TempisTimelineRangeUnitOptions`) to all three packages and rebuilt core. Before publishing, bump `@tempis/timeline` `1.3.0 -> 1.4.0` (additive exports), `@tempis/react` `1.0.3 -> 1.1.0`, `@tempis/vue` `1.0.0 -> 1.1.0`, and tighten the wrappers' `@tempis/timeline` peer range to `^1.4.0` so the new types are guaranteed present.

---

## 4. Things worth adding

- **Comparison page or section**: "Tempis vs vis-timeline / vs building your own / vs commercial Gantt libraries". High commercial-intent SEO and directly supports the licence decision.
- **A real-world case study or technical blog post**: e.g. "how we render 50k events at 60fps". Pulls in the target audience and feeds SEO.
- **Framework coverage signal**: there are Angular and Svelte SVGs in `images/`. If wrappers are planned, a "works with any framework" section with those logos (greyed "coming soon") signals breadth. If not planned, remove the unused SVGs.
- **Quantified performance on the homepage**: the "built for large datasets" row shows 5000 items; quantify it ("5,000+ items, 60fps pan/zoom") to make the claim concrete.
- **Playground discoverability**: the playground is strong but buried. A link from the hero or the large-datasets row would raise engagement.

---

## 5. Prioritised next steps

**P1 (high leverage, needs your input or assets)**
1. Strengthen the pricing page: value-led commercial card, unlimited-devs differentiator, cancel-anytime reassurance at the button (2.2).
2. Add social proof to the homepage (2.1).

**P2 (self-contained, can be done without new input)**
3. Confirm/add unique title, description and canonical on the eight standalone pages (1.1).
4. Keyword targeting pass on H2s and meta descriptions (1.2).
5. Add the "Using it at work? See licensing" CTA to the homepage closing band (2.3).
6. Quantify the homepage "large datasets" performance claim (4).
7. Improve playground discoverability (4).

**P3 (needs a decision or external change)**
9. Annual billing in Lemon Squeezy, then copy/FAQ update (2.4).
10. Decide which unlisted examples go public; remove or use the Angular/Svelte SVGs (3, 4).
11. Comparison section/page and a case study or technical post (4).

**Release gate**
12. Version bumps before the next publish (3).

---

*This review is a static read of the HTML/CSS/JS and content. It does not replace live cross-browser testing, Lighthouse/analytics data, or manual accessibility testing with assistive technology, all of which are recommended before a launch push.*
