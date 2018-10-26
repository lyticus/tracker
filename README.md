# lyticus

> Analytics client facade.

## About

Lyticus' mission is to prevent analytics client vendor lock-in.

It does so by providing an open-source uniform abstraction layer which serves as a facade for a supported analytics client.

Lyticus maintly targets JavaScript Single-Page Applications (SPAs).

## Supported clients

- Segment (analytics.js)

## Installation

```bash
npm install --save lyticus
```

[npm package link](https://www.npmjs.com/package/lyticus)

## Setup

### Segment

1. Install the [Segment snippet](https://segment.com/docs/sources/website/analytics.js/quickstart/#step-1-copy-the-snippet)
2. Import Lyticus

```javascript
import Lyticus from 'lyticus';
const lyticus = new Lyticus('segment', () => window.analytics);
```

## Methods

### Track

Tracks an event.

Parameter(s): type, name, properties

```javascript
lyticus.track('click', 'green-button', { text: 'Hello, World!' });
```

### Page

Tracks a page view.

Parameter(s): name

```javascript
lyticus.page('About');
```

## Powered by

- Babel 7
- Webpack 4

## License

[MIT](http://opensource.org/licenses/MIT)

## Twitter

[Follow me on Twitter](https://twitter.com/KrolsBjorn)
