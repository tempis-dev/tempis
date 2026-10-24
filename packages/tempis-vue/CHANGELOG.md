# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

This is the Vue 3 wrapper for `@tempis/timeline`. Rendering and interaction changes live in the core package changelog; entries here cover wrapper behaviour and the tracked core version.

## [1.1.0] - 2026-10-24

### Changed

- Tracks `@tempis/timeline` 1.4.0 and re-exports its newly exported `TempisTimelineFont`, `TempisTimelineLineStyle` and `TempisTimelineRangeUnitOptions` types. The peer dependency now requires `@tempis/timeline` `^1.4.0`.

## [1.0.0] - 2026-06-29

Initial release. Vue 3 wrapper with reactive props, v-model selection, and a template ref API. The wrapper element defaults to `width: 100%; height: 100%`. Tracks `@tempis/timeline` 1.3.0.
