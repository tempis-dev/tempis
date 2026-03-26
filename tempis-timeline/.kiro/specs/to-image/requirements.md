# Requirements Document

## Introduction

This feature adds a `toImage()` method to the `TempisTimeline` class that exports the current visual state of the canvas timeline as an image. The method leverages the underlying HTML5 Canvas `toBlob()` API to produce a `Blob` asynchronously. Because the library uses DPR (device pixel ratio) scaling for crisp rendering on high-DPI displays, the export must account for this to produce a correctly sized image. The async approach avoids blocking the main thread, which is important for large canvases (e.g., `grow-canvas` vertical fill mode).

## Glossary

- **Timeline**: An instance of the `TempisTimeline` class that renders items on an HTML5 Canvas element.
- **Image_Exporter**: The `toImage()` public method on the `TempisTimeline` class responsible for producing an image from the canvas.
- **Blob**: A binary large object representing the image data, produced by the HTML5 Canvas `toBlob()` API.
- **DPR**: Device Pixel Ratio — the ratio between physical pixels and CSS pixels on the display device. The canvas internal buffer is scaled by DPR for crisp rendering.
- **Image_Format**: The MIME type string specifying the output image encoding (e.g., `image/png`, `image/jpeg`, `image/webp`).
- **Quality**: A number between 0 and 1 that controls the encoding quality for lossy image formats such as `image/jpeg` and `image/webp`.

## Requirements

### Requirement 1: Export Canvas as Image Blob

**User Story:** As a developer using Tempis Timeline, I want to export the current timeline view as an image Blob, so that I can save, download, or transmit the timeline as an image.

#### Acceptance Criteria

1. WHEN `toImage()` is called with no arguments, THE Image_Exporter SHALL resolve with a Blob encoded as `image/png`.
2. WHEN `toImage()` is called with a `type` option set to a valid Image_Format, THE Image_Exporter SHALL resolve with a Blob encoded in the specified Image_Format.
3. WHEN `toImage()` is called with a `type` of `image/jpeg` or `image/webp` and a `quality` option, THE Image_Exporter SHALL pass the quality value to the underlying canvas `toBlob()` call.
4. THE Image_Exporter SHALL resolve with a Blob that represents the full visible canvas content at the time of the call, including all rendered items, bands, range views, legend, and tooltip overlays.

### Requirement 2: DPR-Aware Image Output

**User Story:** As a developer, I want the exported image dimensions to match the CSS pixel dimensions of the canvas, so that the image looks the same as what is displayed on screen without unexpected scaling.

#### Acceptance Criteria

1. WHEN the canvas is rendered on a device with a DPR greater than 1 and no `dpr` option is provided, THE Image_Exporter SHALL resolve with a Blob whose decoded image dimensions match the canvas CSS pixel dimensions (i.e., `offsetWidth` × `offsetHeight`), not the internal DPR-scaled buffer dimensions.
2. WHEN the canvas is rendered on a device with a DPR of 1 and no `dpr` option is provided, THE Image_Exporter SHALL resolve with a Blob whose decoded image dimensions match the canvas element dimensions.
3. WHEN `toImage()` is called with a `dpr` option, THE Image_Exporter SHALL resolve with a Blob whose decoded image dimensions are `offsetWidth × dpr` by `offsetHeight × dpr`.

### Requirement 3: Fresh Render Before Export

**User Story:** As a developer, I want the exported image to always reflect the latest timeline state, so that I do not capture a stale or partially rendered frame.

#### Acceptance Criteria

1. WHEN `toImage()` is called, THE Image_Exporter SHALL ensure the canvas contains a current and complete render of the timeline before capturing the image.

### Requirement 4: Destroyed Timeline Guard

**User Story:** As a developer, I want a clear error when attempting to export an image from a destroyed timeline, so that I can identify misuse in my code.

#### Acceptance Criteria

1. IF `toImage()` is called after `destroy()` has been called on the Timeline, THEN THE Image_Exporter SHALL throw an Error with a descriptive message indicating that the timeline has been destroyed.

### Requirement 5: Consistent API Surface

**User Story:** As a developer, I want `toImage()` to follow the same patterns as other public methods on the Timeline class, so that the API remains predictable and easy to use.

#### Acceptance Criteria

1. THE Image_Exporter SHALL be a public asynchronous method on the `TempisTimeline` class that returns a `Promise<Blob>`.
2. THE Image_Exporter SHALL accept an optional options object with the following properties: `type` (string, defaults to `"image/png"`), `quality` (number, 0–1, for lossy formats), and `dpr` (number, defaults to `1`).
3. THE Image_Exporter SHALL reject the promise if the timeline has been destroyed.
