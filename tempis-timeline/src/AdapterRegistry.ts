import { TempisTimelineDateAdapter } from "./TempisTimelineDateAdapter";
import { NativeDateAdapter } from "./NativeDateAdapter";

/**
 * Simple registration mechanism for date adapters.
 * 
 * This static class manages the global date adapter instance used by the timeline.
 * If no custom adapter is registered, a NativeDateAdapter is lazily created on first use.
 */
export class AdapterRegistry {
  /** The currently registered date adapter. */
  private static adapter: TempisTimelineDateAdapter | null = null;

  /**
   * Register a custom date adapter.
   * @param adapter - The adapter implementation to register
   * @throws Error if the adapter is invalid or missing required methods
   */
  static register(adapter: TempisTimelineDateAdapter): void {
    // Basic validation - TypeScript handles compile-time type safety
    if (!adapter || 
        typeof adapter.parse !== 'function' || 
        typeof adapter.startOf !== 'function' || 
        typeof adapter.add !== 'function' || 
        typeof adapter.format !== 'function') {
      throw new Error(
        'Invalid adapter: must implement parse, startOf, add, and format methods. ' +
        'See TimelineDateAdapter interface documentation.'
      );
    }
    
    AdapterRegistry.adapter = adapter;
  }

  /**
   * Get the currently registered adapter, or create a default NativeDateAdapter if none is registered.
   * @returns The active date adapter instance
   */
  static get(): TempisTimelineDateAdapter {
    if (!AdapterRegistry.adapter) {
      AdapterRegistry.adapter = new NativeDateAdapter();
    }
    return AdapterRegistry.adapter;
  }

  /**
   * Reset the adapter registry to its initial state (no adapter registered).
   * This is primarily useful for test isolation.
   */
  static reset(): void {
    AdapterRegistry.adapter = null;
  }
}
