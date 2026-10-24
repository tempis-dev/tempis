# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

This is the React wrapper for `@tempis/timeline`. Rendering and interaction changes live in the core package changelog; entries here cover wrapper behaviour and the tracked core version.

## [1.1.0] - 2026-10-24

### Changed

- Tracks `@tempis/timeline` 1.4.0 and re-exports its newly exported `TempisTimelineFont`, `TempisTimelineLineStyle` and `TempisTimelineRangeUnitOptions` types. The peer dependency now requires `@tempis/timeline` `^1.4.0`.

## [1.0.3] - 2026-06-29

### Fixed

- The wrapper element now defaults to `width: 100%; height: 100%`, so the canvas no longer collapses when the parent has no explicit size.

### Changed

- Tracks `@tempis/timeline` 1.3.0.

## [1.0.2] - 2026-05-27

### Changed

- Tracks `@tempis/timeline` 1.2.0.

## [1.0.1] - 2026-05-21

### Changed

- Tracks `@tempis/timeline` 1.1.0.

## [1.0.0] - 2026-05-20

Initial release.
