# Changelog

All notable changes to this project will be documented in this file.

## [1.0.20] - 2019-05-20

### Changed

- property to website

### Removed

- development flag from decorated events

## [1.0.18] - 2019-05-13

### Added

- `window.__LYTICUS__` exposing a safe copy of the instance's configuration

### Changed

- Renamed lyticus:ready to lyticus:configuration
- Use JSON.parse(JSON.stringify(this)) to build the payload for lyticus:configuration


## [1.0.17] - 2019-05-12

### Added

- CustomEvent polyfill

## [1.0.16] - 2019-05-12

### Other

- Corrected version number

## [1.0.15] - 2019-05-12

### Changed

- The time property is set to the number of milliseconds since the Unix Epoch

## [1.0.14] - 2019-05-12

### Added

- getVersion()

### Changed

- The detail implementation of lyticus:ready (explicit property serialization)

## [1.0.13] - 2019-05-12

### Added

- Time property to event
- Development property to event
- New custom event: lyticus:ready

### Other

- Upgraded babel-loader

## [1.0.12] - 2019-05-11

### Removed

- lyticus:events

## [1.0.11] - 2019-05-11

### Added

- New custom event: lyticus:events

### Removed

- window.\_lyticus

## [1.0.10] - 2019-05-11

### Added

- window.\_lyticus

## [1.0.9] - 2019-05-11

### Added

- getEvents returning an array of the events tracked during this session.

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
