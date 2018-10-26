# lyticus

> Analytics client facade.

## About

Lyticus' mission is to prevent analytics client vendor lock-in.

It does so by providing a uniform abstraction layer which serves as a facade for a supported analytics client.

## Supported clients

- Segment

## Installation

```bash
npm install --save lyticus
```

[npm package link](https://www.npmjs.com/package/lyticus)

## Setup & example

```javascript
import Lyticus from 'lyticus';
const lyticus = new Lyticus('segment', () => window.analytics);

lyticus.track('click', 'green-button', { text: 'Hello, World!' });

lyticus.page('About');
```

## Powered by

- Babel
- Webpack 4

## License

[MIT](http://opensource.org/licenses/MIT)

## Twitter

[Follow me on Twitter](https://twitter.com/KrolsBjorn)
