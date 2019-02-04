# lyticus

> Analytics client

## About

Lyticus mainty targets JavaScript Single-Page Applications (SPAs).

## Installation

```bash
npm install --save lyticus
```

[npm package link](https://www.npmjs.com/package/lyticus)

## Setup

```javascript
import Lyticus from "lyticus";
const lyticus = new Lyticus("your-tracking-id");
```

## Methods

### trackNavigator

Tracks the navigator's details.

#### Example

```javascript
lyticus.trackNavigator();
```

### trackPage

Tracks a page view.

#### Example

```javascript
lyticus.trackPage();
```

### trackClick

Tracks a click.

#### Example

```javascript
lyticus.trackClick("green-button");
```

### trackOutboundClick

Tracks an outbound click.

#### Example

```javascript
lyticus.trackOutboundClick("red-button", "https://www.google.com");
```

### addDocumentTracker

Parameter(s): _event type, selector strings_

Adds a listener to the document for a specified type of browser event.

Lyticus will create a track event every time such browser event targets an element matching one of the specified selector strings.

The created track event will have the following values:

- type: the type of the browser event
- value: the id of the element or the value of the "data-track-value" attribute

Events without a name will not be tracked.

The "data-track-ignore" attribute can be used to skip the creation of a track event.

#### Example

```javascript
lyticus.addDocumentTracker("click", ["a", "button"]);
```

## Powered by

- Babel 7
- Webpack 4

## License

[MIT](http://opensource.org/licenses/MIT)

## Twitter

[Follow me on Twitter](https://twitter.com/KrolsBjorn)
