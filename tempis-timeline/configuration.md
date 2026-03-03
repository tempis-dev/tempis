# Tempis Timeline

## Configuration

## TempisTimelineOptions
The options object passed when creating an instance of TempisTimeline.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `responsive` | `boolean` | `false` | Whether the canvas should resize to match the dimensions of its parent container. |
| `verticalFill` | `TempisTimelineVerticalFillMode` | `"content"` | Defines how the timeline should fill the vertical space. |
| `rtl` | `boolean` | `false` | Whether the timeline and any default tooltips should be rendered right-to-left. |
| `range` | `TempisTimelineRangeOptions` | — | Timeline range configuration including start, end, min/max, zoom, units, and position. |
| `legend` | `TempisTimelineLegendOptions` | — | Configuration for the timeline legend including position, alignment, marker style, gap, and interaction behavior. |
| `tooltip` | `TempisTimelineTooltipOptions` | — | Configuration for item tooltips including delay, overflow behavior, and content templates. |
| `style` | `TempisTimelineStyleOptions` | — | Default style settings for timeline text and items. |
| `categories` | `TempisTimelineCategory[]` | — | List of item categories, including labels and default styles. |
| `items` | `TempisTimelineItem[]` | — | Timeline items to display, including labels, dates, styles, and selection state. |
| `selection` | `TempisTimelineItemSelectionMode` | `"none"` | Defines how timeline items can be selected. |
| `onItemClick` | `(id: string \| number) => void` | — | Callback function triggered when an item is clicked. |
| `onItemDoubleClick` | `(id: string \| number) => void` | — | Callback function triggered when an item is double-clicked. |
| `onSelectionChange` | `(changes: SelectionChangeEvent[]) => void` | — | Callback function triggered when item selection changes. |

## TempisTimelineVerticalFillMode
Defines how the timeline should fill the vertical space.

| Value | Description |
|------|-------------|
| `content` | The timeline height is determined purely by its content and will only take up as much vertical space as required to render all visible. |
| `fill-canvas` | The timeline expands to fill the available vertical space of the canvas. |
| `grow-canvas` | The timeline grows the canvas element itself to match the required content height. |

## TempisTimelineItemSelectionMode
Defines how items in a timeline can be selected.

| Value | Description |
|------|-------------|
| `none` | No items can be selected (view-only mode). |
| `single` | Only one item can be selected at a time. Selecting a new item clears the previous selection. |
| `multi` | Multiple items can be selected simultaneously. Each item can be toggled independently. |

## TempisTimelineTooltipOptions
The timeline tooltip options.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Whether tooltips are enabled. |
| `delay` | `number` | `0` | Tooltip delay in milliseconds. |
| `overflowBehavior` | `"none" \| "canvas" \| "viewport"` | `none` | How tooltips behave near edges: `none` = may overflow, `canvas` = constrained to canvas, `viewport` = constrained to viewport. |
| `template` | `(id: string \| number) => HTMLElement \| string \| null` | — | Optional function for custom tooltip content. Returns HTMLElement, string, or null. |
| `shouldShow` | `(id: string \| number) => boolean` | — | Optional predicate to determine whether to show a tooltip for a specific item. |

## TempisTimelineTooltipOverflowBehavior
Controls how tooltip positioning behaves when near edges.

| Value | Description |
|-------|-------------|
| `none` | Positioned near the cursor; may overflow viewport or canvas. |
| `canvas` | Stays within canvas bounds by flipping horizontally/vertically. |
| `viewport` | Stays within browser viewport by flipping horizontally/vertically. |

## TempisTimelineStyleOptions
The timeline style options.

| Option | Type | Description |
|--------|------|-------------|
| `font` | `TempisTimelineFont` | Default font for timeline text. |
| `item` | `TempisTimelineItemStyle` | Default style applied to all timeline items unless overridden by item or category styles. |

## TempisTimelineFont
The timeline font options.

| Option | Type | Description |
|--------|------|-------------|
| `size` | `number` | Font size in pixels. |
| `family` | `string` | Font family. |
| `style` | `string` | Font style (e.g., italic). |
| `weight` | `string \| number` | Font weight (normal, bold, lighter, bolder, or numeric). |
| `lineHeight` | `number \| string` | Line height. |

## TempisTimelineItemStyle
The timeline item style options.

| Option | Type | Description |
|--------|------|-------------|
| `backgroundColor` | `string` | Background color of the item. Used for markers on point-in-time items if no border is defined. |
| `fontColor` | `string` | Text color for the item label. |
| `padding` | `number` | Padding inside the item box. |
| `borderColor` | `string` | Border color. Used for markers of point-in-time items. |
| `borderThickness` | `number` | Border thickness in pixels. |
| `borderRadius` | `number` | Border radius in pixels. |


## TempisTimelineRangeOptions
The timeline range options.

| Option | Type | Description |
|--------|------|-------------|
| `fixed` | `boolean` | Whether the timeline range is fixed and cannot be modified via user interaction. |
| `minorUnit` | `TempisTimelineRangeUnitOptions` | Configuration for minor range units. |
| `majorUnit` | `TempisTimelineRangeUnitOptions` | Configuration for major range units. |
| `position` | `"top" \| "bottom" \| "both" \| "none"` | Position of the range bar. |
| `min` | `string \| number \| Date` | Minimum displayable date. |
| `max` | `string \| number \| Date` | Maximum displayable date. |
| `start` | `string \| number \| Date` | Initial start date of the visible range. |
| `end` | `string \| number \| Date` | Initial end date of the visible range. |
| `zoom` | `TempisTimelineRangeZoomOptions` | Zoom configuration options. |

## TempisTimelineRangeZoomOptions
The timeline range zoom options.

| Option | Type | Description |
|--------|------|-------------|
| `enabled` | `boolean` | Whether zooming is enabled. |
| `min` | `number` | Minimum zoom range in milliseconds. |
| `max` | `number` | Maximum zoom range in milliseconds. |

## TempisTimelineRangeUnitOptions
The timeline range unit options.

| Option | Type | Description |
|--------|------|-------------|
| `font` | `TempisTimelineFont` | Font for range unit labels. |
| `formats` | `TempisTimelineRangeUnitLabelFormats` | Label formats for units (millisecond, second, minute, hour, day, month, year). |

---

## TempisTimelineLegendOptions
The timeline legend options.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `position` | `"top" \| "bottom" \| "none"` | `"bottom"` | Position of the legend relative to the timeline. |
| `alignment` | `"start" \| "center" \| "end"` | `"center"` | Horizontal alignment of the legend. |
| `markerStyle` | `"square" \| "square-rounded" \| "circle"` | `"square-rounded"` | Marker style for legend items. |
| `gap` | `number` | `6` | Gap between legend items. |
| `isHighlightOnHover` | `boolean` | `true` | Whether hovering a legend item highlights corresponding timeline items. |
| `isFilterOnClick` | `boolean` | `true` | Whether clicking a legend item toggles visibility of related timeline items. |

---

## TempisTimelineItem
A range or point-in-time timeline item.

| Option | Type | Description |
|--------|------|-------------|
| `id` | `string \| number` | Unique identifier for the item. |
| `start` | `string \| number \| Date` | Start date/time of the item. |
| `end` | `string \| number \| Date` | Optional end date/time for range items. |
| `label` | `string` | Label displayed for the item. |
| `grouping` | `string` | Optional grouping key for visual grouping. |
| `category` | `string` | Category name corresponding to `categories`. |
| `style` | `TempisTimelineItemStyle` | Custom style for the item. |
| `selected` | `boolean` | Whether the item is initially selected. |

---

## TempisTimelineCategory
A timeline category.

| Option | Type | Description |
|--------|------|-------------|
| `name` | `string` | Category identifier used by items. |
| `label` | `string` | Display label for the category in the legend. |
| `style` | `TempisTimelineItemStyle` | Default style applied to all items in this category. |


## TempisTimeline Methods

#### getSelection()
Returns an array of selected item identifiers.

#### setItems(items: TempisTimelineItem[])
Sets the timeline items and redraws the timeline without updating the range.

#### focus(options?: FocusOptions)
Focuses the timeline on a specific item, date, or range. If no options are defined the timeline will focus on the full range of items.

#### redraw()
Redraw the timeline. This is primarily used for non-responsive timelines.