<h1 align="center">@tempis/react</h1>

<p align="center">
  React wrapper for the Tempis Timeline canvas library.<br>
  Declarative props, reactive data, imperative ref for everything else.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react-%3E%3D18-blue" alt="React 18+">
  <img src="https://img.shields.io/badge/language-TypeScript-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/license-source--available-orange" alt="source-available licence">
</p>

---

## Install

```bash
npm install @tempis/react @tempis/timeline
```

`@tempis/timeline` and `react` / `react-dom` are peer dependencies.

## Quick Start

```tsx
import { TempisTimeline } from '@tempis/react';

function App() {
  return (
    <TempisTimeline
      items={[
        { id: 1, label: 'Design',  start: '2026-01-05', end: '2026-01-15', grouping: 'Frontend' },
        { id: 2, label: 'Build',   start: '2026-01-12', end: '2026-01-28', grouping: 'Frontend' },
        { id: 3, label: 'Launch',  start: '2026-01-30', grouping: 'Frontend' },
        { id: 4, label: 'API',     start: '2026-01-08', end: '2026-01-25', grouping: 'Backend' },
      ]}
      options={{
        responsive: true,
        range: { start: '2026-01-01', end: '2026-02-01', position: 'bottom' }
      }}
      onItemClick={(id) => console.log('clicked', id)}
      height={400}
    />
  );
}
```

## Props

The component accepts `items`, `categories`, `bands`, and `dependencies` as reactive props, plus an `options` object for configuration:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TempisTimelineItem[]` | required | Timeline items |
| `categories` | `TempisTimelineCategory[]` | — | Item categories |
| `bands` | `TempisTimelineBand[]` | — | Timeline bands |
| `dependencies` | `TempisTimelineDependency[]` | — | Item dependencies (source → target arrows) |
| `className` | `string` | — | CSS class for the wrapper div |
| `wrapperStyle` | `CSSProperties` | — | Inline styles for the wrapper div |
| `width` | `string \| number` | `"100%"` | Canvas width |
| `height` | `string \| number` | `300` | Canvas height |

Reactive props (`items`, `categories`, `bands`) sync automatically via `useEffect`. Structural props (`responsive`, `rtl`, `stackMode`, `selection`, `verticalFill`) trigger a full instance recreate when changed.

## Ref API

Access imperative methods via `useRef`:

```tsx
import { useRef } from 'react';
import { TempisTimeline, type TempisTimelineRef } from '@tempis/react';

function App() {
  const ref = useRef<TempisTimelineRef>(null);

  return (
    <>
      <button onClick={() => ref.current?.focus({ id: 1, animate: true })}>
        Focus Item 1
      </button>
      <TempisTimeline ref={ref} items={items} options={{ responsive: true }} />
    </>
  );
}
```

| Method | Description |
|--------|-------------|
| `focus(options?)` | Navigate to an item, date, or range |
| `getRange()` | Current visible range |
| `setItems(items)` | Replace all items |
| `getItems()` | Get current items |
| `setCategories(categories)` | Replace all categories |
| `getCategories()` | Get current categories |
| `setBands(bands)` | Replace all bands |
| `setDependencies(deps)` | Replace all dependencies |
| `setSelection(ids)` | Select items by ID |
| `getSelection()` | Get selected IDs |
| `clearSelection()` | Clear selection |
| `setGroupCollapsed(group, collapsed?)` | Set or toggle a group's collapsed state |
| `isGroupCollapsed(group)` | Check if a group is collapsed |
| `toImage(options?)` | Export as image blob |
| `redraw()` | Force a redraw |
| `getInstance()` | Access the underlying core instance |
| `getCanvas()` | Access the underlying canvas element |

## Re-exports

All core types are re-exported for convenience — no need to install `@tempis/timeline` separately for type imports:

```tsx
import type { TempisTimelineItem, FocusOptions } from '@tempis/react';
```

## Licence

Free for personal projects, education, and evaluation. A paid licence is required for commercial use where revenue is generated. See [LICENSE](LICENSE) for full terms.

Part of the [Tempis](../../README.md) monorepo.
