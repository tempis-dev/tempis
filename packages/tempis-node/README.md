<h1 align="center">@tempis/node</h1>

<p align="center">
  Server-side rendering for Tempis Timeline.<br>
  Generate timeline images in Node.js without a browser.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Node.js-green" alt="Node.js">
  <img src="https://img.shields.io/badge/language-TypeScript-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/license-source--available-orange" alt="source-available licence">
</p>

---

## Install

```bash
npm install @tempis/node @tempis/timeline
```

`@tempis/timeline` is a peer dependency.

## Quick Start

```typescript
import { renderTimeline } from '@tempis/node';
import { writeFileSync } from 'fs';

const { buffer } = await renderTimeline({
  width: 1200,
  items: [
    { id: 1, label: 'Design', start: '2026-01-05', end: '2026-01-15', grouping: 'Frontend' },
    { id: 2, label: 'Build', start: '2026-01-12', end: '2026-01-28', grouping: 'Frontend' },
    { id: 3, label: 'Launch', start: '2026-01-30', grouping: 'Frontend' },
    { id: 4, label: 'API', start: '2026-01-08', end: '2026-01-25', grouping: 'Backend' },
  ],
  range: { start: '2026-01-01', end: '2026-02-01', position: 'bottom' },
});

writeFileSync('timeline.png', buffer);
```

## Options

`renderTimeline` accepts all standard `TempisTimelineOptions` (items, categories, bands, range, style, etc.) plus:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | `number` | required | Output width in CSS pixels |
| `height` | `number` | — | Output height in CSS pixels. If omitted, height is derived from content. |
| `dpr` | `number` | `1` | Device pixel ratio. Use `2` for retina-quality output. |
| `format` | `"png" \| "jpeg" \| "webp"` | `"png"` | Output image format |
| `quality` | `number` | `0.9` | Quality for lossy formats (0–1) |
| `backgroundColor` | `string` | — | Background colour (transparent by default for PNG) |

## Custom Fonts

Register custom fonts before rendering:

```typescript
import { registerFont, renderTimeline } from '@tempis/node';

registerFont('./fonts/Inter-Bold.ttf', 'Inter');

const { buffer } = await renderTimeline({
  width: 1200,
  style: { font: { family: 'Inter', size: 14 } },
  items: [...]
});
```

A bundled Inter font is registered automatically as the default. Override it by registering your own font with the same family name.

## Date Adapters

Register a date adapter before rendering, same as in the browser:

```typescript
import { AdapterRegistry } from '@tempis/timeline';
import { renderTimeline } from '@tempis/node';

AdapterRegistry.register(myLuxonAdapter);

const { buffer } = await renderTimeline({ ... });
```

## Use Cases

- PDF reports with embedded timeline images
- Email digests with inline timeline graphics
- Slack/Discord bot integrations
- CI/CD pipeline visualisations
- Thumbnail generation for timeline previews
- Automated dashboard screenshots

## Licence

Free for personal projects, education, and evaluation. A paid licence is required for commercial use where revenue is generated. See [LICENSE](LICENSE) for full terms.

Part of the [Tempis](../../README.md) monorepo.
