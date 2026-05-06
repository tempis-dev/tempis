<p align="center">
  <img src="resources/tempis-logo.png" alt="Tempis" width="100">
</p>

<h1 align="center">Tempis</h1>

<p align="center">
  A fast, zero-dependency, canvas-rendered timeline library.<br>
  Handles thousands of items, touch &amp; keyboard input, RTL, image export, and more.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/dependencies-0-brightgreen" alt="zero dependencies">
  <img src="https://img.shields.io/badge/language-TypeScript-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/license-dual-orange" alt="dual license">
</p>

---

## Highlights

- Canvas rendering — no DOM nodes per item, virtualised rendering for consistent performance at any scale
- Range and point-in-time items with automatic stacking
- Progress indicator on range items
- Categories with interactive legend
- Collapsible groups with programmatic control
- Timeline bands (markers, regions, lines)
- Item dependencies with automatic connector routing
- Per-item style overrides (colors, borders, radius, dash patterns)
- Custom tooltip templates
- Selection modes: none, single, multi
- Animated focus with configurable easing
- Zoom, pan, touch pinch, keyboard navigation
- Three vertical fill modes, two stack modes
- RTL layout
- Image export (PNG, JPEG, WebP) with DPR control
- Pluggable date adapters (native, Luxon, Day.js, etc.)
- Global color palette API
- Accessibility: keyboard navigation, ARIA attributes, reduced motion
- 100% TypeScript with full declarations

## Packages

| Package | Description |
|---------|-------------|
| [`@tempis/timeline`](packages/tempis-timeline) | Core timeline library — canvas rendering, interactions, adapters |
| [`@tempis/react`](packages/tempis-react) | React wrapper with declarative props, reactive data, and imperative ref API |

## Quick Start

```bash
npm install @tempis/timeline
```

```typescript
import { TempisTimeline } from '@tempis/timeline';

const timeline = new TempisTimeline('#canvas', {
  responsive: true,
  items: [
    { id: 1, label: 'Design',  start: '2026-01-05', end: '2026-01-15', grouping: 'Frontend' },
    { id: 2, label: 'Build',   start: '2026-01-12', end: '2026-01-28', grouping: 'Frontend' },
    { id: 3, label: 'Launch',  start: '2026-01-30', grouping: 'Frontend' },
    { id: 4, label: 'API',     start: '2026-01-08', end: '2026-01-25', grouping: 'Backend' },
  ],
  range: { start: '2026-01-01', end: '2026-02-01', position: 'bottom' }
});
```

Or via CDN:

```html
<script src="https://unpkg.com/@tempis/timeline/dist/tempis_timeline.min.js"></script>
<script>
  new tempis_timeline.TempisTimeline('#canvas', { /* ... */ });
</script>
```

## Repo Structure

```
tempis/
├── packages/
│   ├── tempis-timeline/   Core library
│   └── tempis-react/      React wrapper
├── examples/              Interactive HTML demos
├── site/                  Documentation site
├── scripts/               Build tooling
├── lib/                   Dev build output (gitignored)
└── dist/                  Distribution output (gitignored)
```

## Development

```bash
npm install
npm run dev          # Watch + dev server on :8080
npm run build        # Build all packages
npm run build:site   # Build the documentation site
npm test             # Lint + unit tests
```

## Examples

The [`examples/`](examples/) directory has 35+ interactive demos covering basic usage, dashboards, dependencies, progress indicators, real-time streaming, custom tooltips, RTL, image export, and more. Run `npm run dev` and browse them at `http://localhost:8080/examples/`.

## License

Free for non-commercial use. Commercial use requires a paid license — see [LICENSE](packages/tempis-timeline/LICENSE) for details.
