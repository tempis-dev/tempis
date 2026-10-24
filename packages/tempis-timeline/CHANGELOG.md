# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.4.0] - 2026-10-24

### Added

- Exported the `TempisTimelineFont`, `TempisTimelineLineStyle` and `TempisTimelineRangeUnitOptions` types from the package entry point, so they can be imported directly rather than inferred.

## [1.3.0] - 2026-06-29

### Added

- `opacity` option on dependency connector styles.

### Fixed

- Floor canvas dimensions when rounding for device pixel ratio, preventing a resize feedback loop on high-DPI displays.
- Progress fill now renders correctly when a range item is partially off-screen.
- Item selection is preserved across `setItems` calls.
- Collapsed group state is preserved across `setItems` calls.
- `getRange()` and `toImage()` throw clear errors instead of null pointer crashes when the instance is unavailable.

## [1.2.0] - 2026-05-27

### Added

- `requireModifier` zoom option to toggle default scroll wheel behaviour between zoom and vertical scroll.
- Hard minimum (100ms) and hard maximum (10000 years) for range zoom, to prevent problems when zooming too far in or out.

### Fixed

- Resolved visual artefacts rendered for range items.
- Resolved panning problems when dealing with narrow ranges.

## [1.1.0] - 2026-05-21

### Changed

- Minor unit grid lines now render at 80% opacity for a subtler appearance.

### Fixed

- Tooltip width no longer shrinks when constrained to a viewport edge.

## [1.0.0] - 2026-05-20

Initial release.
