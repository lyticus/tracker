# Changelog

All notable changes to this project will be documented in this file.

## [1.0.8] - 2019-05-10

### Added

- Polyfill for URLSearchParams (increasing bundle size from 5 KB to 8 KB)

## [1.0.7] - 2019-05-10

### Changed

- HTTP POST implementation from Axios to JavaScript XHR

### Added

- Support for URL referrers ("referrer", "ref", "source", "utm_source")
- startHistoryMode method
- Dispatching of custom lyticus:track event

### Removed

- Axios dependency (reducing bundle size from 18 KB to 5 KB)
- historyMode configuration option
- Console logging in development mode
