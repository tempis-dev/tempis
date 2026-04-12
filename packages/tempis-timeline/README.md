# Tempis Timeline

A lightweight, canvas-rendered timeline library with smooth interactions, touch support, and minimal dependencies.

## Install

```bash
npm install tempis-timeline
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
    { id: 5, label: 'Testing', start: '2026-01-20', end: '2026-01-29', grouping: 'Backend' }
  ],
  range: {
    start: '2026-01-01',
    end: '2026-02-01',
    position: 'bottom'
  }
});
```

Or via script tag:

```html
<script src="tempis_timeline.js"></script>
<script>
  new tempis_timeline.TempisTimeline('#canvas', { ... });
</script>
```

## Features

- Canvas rendering — handles thousands of items smoothly with no DOM overhead
- Range and point-in-time items with automatic stacking
- Categories with interactive legend (filter on click, highlight on hover)
- Item groupings with custom sort
- Timeline bands (range and point-in-time markers)
- Per-item style overrides (colors, borders, border styles, radius, padding)
- Border styles: solid, dashed, dotted, dash-dot, long-dash
- Tooltips with custom templates, delay, and overflow handling
- Selection modes: none, single, multi
- Animated focus with configurable easing
- Zoom and pan with mouse wheel, touch pinch, and keyboard
- Three vertical fill modes: content, fill-canvas, grow-canvas
- Two stack modes: compact and stable
- RTL layout support
- Responsive resize
- Image export (PNG, JPEG, WebP) with DPR and background color options
- Pluggable date adapter system (built-in native adapter, or bring Luxon, Day.js, etc.)
- Global color palette API
- Full TypeScript support with declarations

## API Overview

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
| `focus(options?)` | Navigate to an item, date, or range with optional animation |
| `getRange()` | Get the current visible range as `{ start, end }` |
| `setSelection(ids)` | Programmatically select items by ID |
| `getSelection()` | Get array of selected item IDs |
| `clearSelection()` | Deselect all items |
| `toImage(options?)` | Export as image Blob (PNG, JPEG, WebP) |
| `redraw()` | Force a redraw |
| `destroy()` | Clean up all listeners and resources |

### Callbacks

| Callback | Signature |
|----------|-----------|
| `onItemClick` | `(id: string \| number) => void` |
| `onItemDoubleClick` | `(id: string \| number) => void` |
| `onItemHover` | `(id: string \| number \| null) => void` |
| `onSelectionChange` | `(changes: SelectionChangeEvent[]) => void` |
| `onRangeChange` | `(start: Date, end: Date) => void` |

### Image Export

```typescript
const blob = await timeline.toImage({
  type: 'image/png',       // or 'image/jpeg', 'image/webp'
  quality: 0.9,            // for lossy formats
  dpr: 2,                  // resolution multiplier
  backgroundColor: '#fff'  // optional, transparent by default
});
```

### Date Adapters

```typescript
import { AdapterRegistry } from 'tempis-timeline';

AdapterRegistry.register(myLuxonAdapter);
```

See the [API Reference](site/api.html) for full documentation.

## Examples

The `test/` directory contains interactive demos:

- [Playground](test/playground.html) — all options with live controls
- [Crypto Stream](test/streaming-data.html) — real-time WebSocket data
- [Production Downtime](test/production-downtime.html) — selection-driven detail panels
- [Lazy Loading](test/lazy-loading.html) — on-demand data fetching
- [Custom Tooltips](test/custom-tooltips.html) — rich tooltip templates
- [Timezone Explorer](test/timezones.html) — Luxon date adapter
- [Server Monitoring](test/band-demo.html) — timeline bands
- [RTL Schedule](test/rtl-demo.html) — right-to-left layout
- [Color Palettes](test/color-palettes.html) — global palette API
- [External Selection](test/selection-grid.html) — programmatic selection from a table
- [Export to Image](test/to-image.html) — toImage() with format/quality/DPR
- [Per-Item Styles](test/item-styles.html) — border styles, radius, and thickness overrides

## Browser Support

Chrome, Edge, Firefox, Safari, and Opera (latest versions).

## License

Free for non-commercial use. Commercial use requires a paid license. See [LICENSE](LICENSE) for details.
