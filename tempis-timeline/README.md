# Tempis Timeline

A powerful, flexible, and highly customizable timeline visualization library for JavaScript and TypeScript. Built with performance in mind, Tempis Timeline renders beautiful interactive timelines on HTML5 Canvas.

![Tempis Timeline Banner](./docs/images/banner.png)

## Features

- **Canvas-Based Rendering** - High-performance rendering using HTML5 Canvas for smooth interactions even with thousands of items
- **Flexible Item Types** - Support for both point-in-time events and range-based items
- **Interactive Selection** - Single or multi-select modes with customizable callbacks
- **Rich Categorization** - Organize items with categories and visual groupings
- **Customizable Styling** - Full control over colors, fonts, borders, and spacing
- **Responsive Design** - Automatically adapts to container size changes
- **RTL Support** - Built-in right-to-left language support
- **Smart Tooltips** - Configurable tooltips with overflow handling and custom templates
- **Legend System** - Interactive legend with filtering and highlighting
- **Zoom & Pan** - Smooth zooming and panning with configurable constraints
- **Date Adapter System** - Pluggable date adapters (native Date, Luxon, etc.)
- **TypeScript First** - Written in TypeScript with full type definitions

## Screenshots

### Basic Timeline
![Basic Timeline](./docs/images/basic-timeline.png)

### Multi-Band Timeline
![Multi-Band Timeline](./docs/images/bands-timeline.png)

### Categorized Items with Legend
![Categorized Timeline](./docs/images/categories-timeline.png)

## Installation

```bash
npm install tempis-timeline
```

```bash
yarn add tempis-timeline
```

```bash
pnpm add tempis-timeline
```

## Quick Start

```typescript
import { TempisTimeline } from 'tempis-timeline';

// Create a canvas element
const canvas = document.getElementById('timeline-canvas') as HTMLCanvasElement;

// Initialize the timeline
const timeline = new TempisTimeline(canvas, {
  responsive: true,
  items: [
    {
      id: 1,
      label: 'Project Kickoff',
      start: '2024-01-15',
      category: 'milestone'
    },
    {
      id: 2,
      label: 'Development Phase',
      start: '2024-01-20',
      end: '2024-03-15',
      category: 'phase'
    },
    {
      id: 3,
      label: 'Launch',
      start: '2024-03-20',
      category: 'milestone'
    }
  ],
  categories: [
    {
      name: 'milestone',
      label: 'Milestones',
      style: {
        backgroundColor: '#4CAF50',
        fontColor: '#ffffff'
      }
    },
    {
      name: 'phase',
      label: 'Phases',
      style: {
        backgroundColor: '#2196F3',
        fontColor: '#ffffff'
      }
    }
  ],
  range: {
    start: '2024-01-01',
    end: '2024-12-31'
  }
});
```

## Use Cases

### Project Management
Track project milestones, phases, and deliverables with visual timelines that help teams stay aligned.

### Historical Timelines
Create engaging historical visualizations for educational content, museum exhibits, or documentation.

### Resource Planning
Visualize resource allocation, availability, and scheduling conflicts across teams and projects.

### Event Scheduling
Display event schedules, conference agendas, or production timelines with clear visual hierarchy.

### System Monitoring
Show system uptime, downtime periods, and maintenance windows for infrastructure monitoring.

### Data Analysis
Visualize time-series data, trends, and patterns with interactive exploration capabilities.

## Basic Usage

### Creating a Timeline

```typescript
const timeline = new TempisTimeline(canvas, options);
```

### Adding Items Dynamically

```typescript
timeline.setItems([
  {
    id: 'task-1',
    label: 'Design Phase',
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31'),
    category: 'design'
  },
  // ... more items
]);
```

### Handling Selection

```typescript
const timeline = new TempisTimeline(canvas, {
  selection: 'multi',
  onSelectionChange: (changes) => {
    console.log('Selection changed:', changes);
  },
  onItemClick: (id) => {
    console.log('Item clicked:', id);
  }
});
```

### Getting Selected Items

```typescript
const selectedIds = timeline.getSelection();
console.log('Currently selected:', selectedIds);
```

### Focusing on Items

```typescript
// Focus on all items
timeline.focus();

// Focus on specific date range
timeline.focus({
  start: '2024-01-01',
  end: '2024-06-30'
});

// Focus on specific item
timeline.focus({ itemId: 'task-1' });
```

## Configuration

### Responsive Timeline

```typescript
const timeline = new TempisTimeline(canvas, {
  responsive: true,
  verticalFill: 'fill-canvas'
});
```

### Custom Styling

```typescript
const timeline = new TempisTimeline(canvas, {
  style: {
    font: {
      family: 'Inter, sans-serif',
      size: 14,
      weight: 500
    },
    item: {
      backgroundColor: '#e0e0e0',
      fontColor: '#333333',
      borderRadius: 4,
      padding: 8,
      borderColor: '#999999',
      borderThickness: 1
    }
  }
});
```

### Stack Mode

Control how items are vertically arranged when they overlap:

```typescript
const timeline = new TempisTimeline(canvas, {
  stackMode: 'stable' // or 'compact' (default)
});
```

- `'compact'` (default) - Items are dynamically stacked based on visible items only. Point-in-time labels are adjusted to fit within canvas bounds. Layout updates when panning. More space-efficient but items may shift vertically.
- `'stable'` - All items in the dataset are included in the layout. Point-in-time labels are always centered on their timestamp. Layout only recalculates on zoom or data changes. Items maintain stable vertical positions when panning.

### Custom Tooltips

```typescript
const timeline = new TempisTimeline(canvas, {
  tooltip: {
    enabled: true,
    delay: 300,
    overflowBehavior: 'viewport',
    template: (id) => {
      const item = items.find(i => i.id === id);
      return `
        <div class="custom-tooltip">
          <h3>${item.label}</h3>
          <p>Start: ${item.start}</p>
          ${item.end ? `<p>End: ${item.end}</p>` : ''}
        </div>
      `;
    }
  }
});
```

### Zoom Configuration

```typescript
const timeline = new TempisTimeline(canvas, {
  range: {
    zoom: {
      enabled: true,
      min: 24 * 60 * 60 * 1000, // 1 day
      max: 365 * 24 * 60 * 60 * 1000 // 1 year
    }
  }
});
```

### Legend Configuration

```typescript
const timeline = new TempisTimeline(canvas, {
  legend: {
    position: 'top',
    alignment: 'center',
    item: {
      markerStyle: 'circle',
      isHighlightOnHover: true,
      isFilterOnClick: true
    }
  }
});
```

## API Reference

### Constructor

```typescript
new TempisTimeline(canvas: HTMLCanvasElement, options: TempisTimelineOptions)
```

### Methods

#### `setItems(items: TempisTimelineItem[])`
Updates the timeline items without changing the visible range.

#### `getSelection(): (string | number)[]`
Returns an array of currently selected item IDs.

#### `focus(options?: FocusOptions)`
Focuses the timeline on specific items, dates, or the full range.

#### `redraw()`
Manually triggers a redraw of the timeline (useful for non-responsive timelines).

#### `destroy()`
Destroys the timeline and cleans up all resources. Removes all event listeners and observers to prevent memory leaks. Call this before removing the timeline from the DOM or when creating a new timeline instance.

```typescript
// Clean up before removing
timeline.destroy();
```

### Events

- `onItemClick` - Fired when an item is clicked
- `onItemDoubleClick` - Fired when an item is double-clicked
- `onSelectionChange` - Fired when selection state changes

## Advanced Features

### Date Adapters

Tempis Timeline supports pluggable date adapters for different date libraries:

```typescript
import { LuxonAdapter } from 'tempis-timeline/adapters/luxon';

const timeline = new TempisTimeline(canvas, {
  dateAdapter: new LuxonAdapter(),
  // ... other options
});
```

### Item Grouping

```typescript
const timeline = new TempisTimeline(canvas, {
  items: [
    {
      id: 1,
      label: 'Task A',
      start: '2024-01-01',
      grouping: 'team-1'
    },
    {
      id: 2,
      label: 'Task B',
      start: '2024-01-05',
      grouping: 'team-1'
    }
  ]
});
```

### RTL Support

```typescript
const timeline = new TempisTimeline(canvas, {
  rtl: true
});
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Performance Tips

- Use `responsive: false` for static timelines to avoid unnecessary redraws
- Use `stackMode: 'stable'` for better UX when users need to track items across panning operations
- Use `stackMode: 'compact'` for more space-efficient layouts when vertical space is limited
- Limit the number of visible items when dealing with large datasets
- Use `verticalFill: 'content'` for better performance with many items
- Call `destroy()` when removing timelines to prevent memory leaks
- Implement virtual scrolling for extremely large datasets

## Examples

Check out the `/test` directory for complete working examples:

- `basic.html` - Simple timeline setup
- `categories.html` - Using categories and legend
- `bands.html` - Multi-band timeline
- `selection.html` - Selection handling
- `tooltips.html` - Custom tooltips
- `styling.html` - Custom styling examples
- `stack-mode.html` - Stack mode comparison
- `stress-test.html` - Performance testing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

Made with ❤️ by the Tempis Timeline team
