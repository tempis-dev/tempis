# Implementation Plan: toImage

## Overview

Implement the `toImage()` method on `TempisTimeline` that exports the current canvas state as an image `Blob`. The implementation adds a destroyed-timeline guard, extends `_draw()` and `TimelineDataView.draw()` to support scrollbar suppression, creates an offscreen canvas for DPR-controlled rendering, and wraps `toBlob()` in a Promise. A new `TempisTimelineImageOptions` interface is added and exported.

## Tasks

- [x] 1. Add `_isDestroyed` flag and guard in `destroy()`
  - Add `private _isDestroyed: boolean = false;` field to `TempisTimeline`
  - Set `this._isDestroyed = true;` as the first line in the `destroy()` method body
  - _Requirements: 4.1, 5.3_

- [x] 2. Add `TempisTimelineImageOptions` interface and export it
  - [x] 2.1 Define `TempisTimelineImageOptions` interface in `src/TempisTimelineOptions.ts`
    - Properties: `type?: string`, `quality?: number`, `dpr?: number`
    - Add JSDoc comments matching the design document
    - _Requirements: 5.2_
  - [x] 2.2 Export `TempisTimelineImageOptions` from `src/index.ts`
    - Add to the import and `export type` blocks
    - _Requirements: 5.1, 5.2_

- [x] 3. Extend `_draw()` and `TimelineDataView.draw()` to support scrollbar hiding
  - [x] 3.1 Extend `TimelineDataView.draw()` to accept optional `hideScrollbar` parameter
    - Add `hideScrollbar?: boolean` as the last parameter (default `false`)
    - Skip the `_drawScrollbar()` call when `hideScrollbar` is `true`
    - _Requirements: 1.4_
  - [x] 3.2 Extend `TempisTimeline._draw()` to accept optional options object
    - Change signature to `_draw(options?: { hideScrollbar?: boolean }): void`
    - Pass `options?.hideScrollbar` through to `this._dataView.draw()`
    - _Requirements: 1.4_

- [ ] 4. Checkpoint - Verify scrollbar hiding works
  - Ensure all existing functionality still works after the `_draw()` and `draw()` signature changes. No callers should break since the new parameters are optional. Ask the user if questions arise.

- [ ] 5. Implement `toImage()` method on `TempisTimeline`
  - [ ] 5.1 Add the `async toImage(options?: TempisTimelineImageOptions): Promise<Blob>` public method
    - Import `TempisTimelineImageOptions` in `TempisTimeline.ts`
    - Throw synchronously if `_isDestroyed` is `true` with message `"Cannot export image: timeline has been destroyed."`
    - Call `this._draw({ hideScrollbar: true })` to render a clean frame without scrollbar
    - Create an offscreen canvas at `offsetWidth × dpr` by `offsetHeight × dpr` (dpr defaults to 1)
    - Draw the source canvas buffer scaled onto the offscreen canvas using `drawImage()`
    - Wrap `offscreenCanvas.toBlob(callback, type, quality)` in a `Promise<Blob>`
    - Reject the promise if `toBlob()` callback receives `null`
    - Call `this._draw()` to restore the normal render (with scrollbar)
    - Resolve with the `Blob`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 3.1, 4.1, 5.1, 5.2, 5.3_

- [ ] 6. Update API documentation
  - Add `toImage()` method documentation to `site/api.html`
  - Document the `TempisTimelineImageOptions` interface (type, quality, dpr)
  - Include usage examples for PNG export, JPEG with quality, and high-DPR export
  - _Requirements: 5.1, 5.2_

- [ ] 7. Final checkpoint - Ensure everything compiles and works
  - Ensure the project compiles without errors. Ask the user if questions arise.

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- The implementation language is TypeScript, matching the existing codebase
