<h1 align="center">@tempis/timeline</h1>

<p align="center">
  Core canvas-rendered timeline library.<br>
  Zero dependencies. Smooth at 5,000+ items. Under 15 KB minified.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/dependencies-0-brightgreen" alt="zero dependencies">
  <img src="https://img.shields.io/badge/language-TypeScript-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/license-dual-orange" alt="dual license">
</p>

---

## Install

```bash
npm install tempis-timeline
```

Or via CDN:

```html
<script src="https://unpkg.com/tempis-timeline/dist/tempis_timeline.min.js"></script>
```

## Quick Start

```typescript
import { TempisTimeline } from 'tempis-timeline';

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

Script tag usage:

```html
<script>
  new tempis_timeline.TempisTimeline('#canvas', { /* ... */ });
</script>
```

## Features

- Canvas rendering — no DOM nodes per item
- Range and point-in-time items with automatic stacking
- Categories with interactive legend (filter on click, highlight on hover)
- Item groupings with custom sort
- Timeline bands (range markers, point markers, lines)
- Item dependencies with automatic connector routing and RTL support
- Per-item style overrides (colors, borders, dash patterns, radius, padding)
- Tooltips with custom templates, delay, and overflow handling
- Selection modes: none, single, multi
- Animated focus with configurable easing
- Zoom, pan, touch pinch, keyboard navigation
- Vertical fill modes: content, fill-canvas, grow-canvas
- Stack modes: compact, stable
- RTL layout
- Responsive resize
- Image export (PNG, JPEG, WebP) with DPR and background color
- Pluggable date adapters (native, Luxon, Day.js, etc.)
- Global color palette API
- Configurable scrollbar styling
- 100% TypeScript with full declarations

## API

### Constructor

```typescript
new TempisTimeline(context: string | HTMLCanvasElement, options: TempisTimelineOptions)
```

### Methods

| Method | Description |
|--------|-------------|
| `setItems(items)` | Replace all items and redraw |
| `getItems()` | Get current item definitions |
| `setCategories(categories)` | Replace all categories and redraw |
| `getCategories()` | Get current category definitions |
| `setBands(bands)` | Replace all bands and redraw |
| `focus(options?)` | Navigate to an item, date, or range with animation |
| `getRange()` | Current visible range as `{ start, end }` |
| `setSelection(ids)` | Programmatically select items by ID |
| `getSelection()` | Array of selected item IDs |
| `clearSelection()` | Deselect all items |
| `toImage(options?)` | Export as image Blob |
| `redraw()` | Force a redraw |
| `destroy()` | Clean up all listeners and resources |

### Callbacks

| Callback | Signature |
|----------|-----------|
| `onItemClick` | `(id: string \| number) => void` |
| `onItemDoubleClick` | `(id: string \| number) => void` |
| `onItemContextClick` | `(id: string \| number, position: { x: number; y: number }) => void` |
| `onItemHover` | `(id: string \| number \| null) => void` |
| `onSelectionChange` | `(changes: SelectionChangeEvent[]) => void` |
| `onRangeChange` | `(start: Date, end: Date) => void` |

### Image Export

```typescript
const blob = await timeline.toImage({
  type: 'image/png',       // 'image/jpeg', 'image/webp'
  quality: 0.9,            // lossy formats
  dpr: 2,                  // resolution multiplier
  backgroundColor: '#fff'  // transparent by default
});
```

### Date Adapters

```typescript
import { AdapterRegistry } from 'tempis-timeline';

AdapterRegistry.register(myLuxonAdapter);
```

## Browser Support

Chrome, Edge, Firefox, Safari, Opera (latest versions).

## License

Free for non-commercial use. Commercial use requires a paid license. See [LICENSE](LICENSE) for details.

Part of the [Tempis](../../README.md) monorepo.
