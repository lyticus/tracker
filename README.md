# lyticus

> Generic wrapper for analytics clients.

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
