<h1 align="center">@tempis/vue</h1>

<p align="center">
  Vue 3 wrapper for the Tempis Timeline canvas library.<br>
  Declarative props, reactive data, v-model selection, template ref for everything else.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/vue-%3E%3D3.3-brightgreen" alt="Vue 3.3+">
  <img src="https://img.shields.io/badge/language-TypeScript-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/license-source--available-orange" alt="source-available licence">
</p>

---

## Install

```bash
npm install @tempis/vue @tempis/timeline
```

`@tempis/timeline` and `vue` are peer dependencies.

## Quick Start

```vue
<script setup lang="ts">
import { TempisTimeline } from '@tempis/vue'

const items = [
  { id: 1, label: 'Design',  start: '2026-01-05', end: '2026-01-15', grouping: 'Frontend' },
  { id: 2, label: 'Build',   start: '2026-01-12', end: '2026-01-28', grouping: 'Frontend' },
  { id: 3, label: 'Launch',  start: '2026-01-30', grouping: 'Frontend' },
  { id: 4, label: 'API',     start: '2026-01-08', end: '2026-01-25', grouping: 'Backend' },
]
</script>

<template>
  <TempisTimeline
    :items="items"
    :options="{
      responsive: true,
      range: { start: '2026-01-01', end: '2026-02-01', position: 'bottom' }
    }"
    :height="400"
    @item-click="(id) => console.log('clicked', id)"
  />
</template>
```

## Props

The component accepts `items`, `categories`, `bands`, `dependencies`, and `selection` as reactive props, plus an `options` object for configuration:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TempisTimelineItem[]` | required | Timeline items |
| `categories` | `TempisTimelineCategory[]` | — | Item categories |
| `bands` | `TempisTimelineBand[]` | — | Timeline bands |
| `dependencies` | `TempisTimelineDependency[]` | — | Item dependencies (source → target arrows) |
| `selection` | `(string \| number)[]` | — | Selected IDs (`v-model:selection`). Enables controlled selection. |
| `options` | `TempisTimelineConfig` | `{}` | Structural options (recreates instance on change) |
| `wrapperClass` | `string` | — | CSS class for the wrapper div |
| `wrapperStyle` | `CSSProperties` | — | Inline styles for the wrapper div |
| `width` | `string \| number` | `"100%"` | Canvas width |
| `height` | `string \| number` | `300` | Canvas height |

Reactive props (`items`, `categories`, `bands`, `dependencies`, `selection`) sync automatically via `watch`. Structural props (`responsive`, `rtl`, `stackMode`, `selection` mode, `verticalFill`) live inside `options` and trigger a full instance recreate when changed.

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `item-click` | `id: string \| number` | Item clicked |
| `item-double-click` | `id: string \| number` | Item double-clicked |
| `item-context-click` | `id: string \| number, position: { x, y }` | Item right-clicked |
| `item-hover` | `id: string \| number \| null` | Pointer enters/leaves item |
| `update:selection` | `(string \| number)[]` | Selection changed (controlled mode). Use with `v-model:selection`. |
| `range-change` | `start: Date, end: Date` | Visible range changed |
| `group-toggle` | `group: string, collapsed: boolean` | Group collapsed/expanded |

## Selection

**Uncontrolled** — the timeline manages state internally:
```vue
<TempisTimeline :items="items" :options="{ selection: 'multi' }" />
```

**Controlled** — you own the state via `v-model:selection`:
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TempisTimeline } from '@tempis/vue'

const selectedIds = ref<(string | number)[]>([])
</script>

<template>
  <TempisTimeline
    v-model:selection="selectedIds"
    :items="items"
    :options="{ selection: 'multi' }"
  />
  <button @click="selectedIds = []">Clear</button>
</template>
```

## Template Ref API

Access imperative methods via a template ref:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TempisTimeline, type TempisTimelineExposed } from '@tempis/vue'

const timelineRef = ref<TempisTimelineExposed | null>(null)
</script>

<template>
  <button @click="timelineRef?.focus({ id: 1, animate: true })">Focus Item 1</button>
  <TempisTimeline ref="timelineRef" :items="items" :options="{ responsive: true }" />
</template>
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

All core types are re-exported for convenience — no need to import from `@tempis/timeline` directly:

```ts
import type { TempisTimelineItem, FocusOptions } from '@tempis/vue';
```

## Documentation

Full API documentation and guides are available at [tempis.dev/api/vue/getting-started](https://tempis.dev/api/vue/getting-started.html).

## Licence

Free for personal projects, education, and evaluation. A paid licence is required for commercial use where revenue is generated. See [LICENSE](LICENSE) for full terms.

Part of the [Tempis](../../README.md) monorepo.
