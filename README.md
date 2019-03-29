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

### Via NPM

```javascript
import Lyticus from "lyticus";
const lyticus = new Lyticus("your-tracking-id");
```

### Via CDN

```html
<script src="https://unpkg.com/lyticus"></script>
<script>
  var lyticus = new Lyticus("your-tracking-id");
  lyticus.trackPage();
</script>
```

## Constructor

### Development

When set to true events will not be sent to the service but logged to the browser console instead.

```javascript
const lyticus = new Lyticus("your-tracking-id", {
  development: process.env.NODE_ENV === "dev"
});
```

### getPath

Enables you to override the way the path should be fetched.

#### Default implementation

```javascript
const lyticus = new Lyticus("your-tracking-id", {
  getPath: () => {
    return window.location.pathname;
  }
});
```

#### Vue: using route name instead of path

```javascript
const lyticus = new Lyticus("your-tracking-id", {
  getPath: () => {
    const route = router.currentRoute;
    if (!route || !route.name) {
      return window.location.pathname;
    }
    return route.name;
  }
});
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

<!---
### addDocumentTracker

Parameter(s): _event type, selector strings_

Adds a listener to the document for a specified type of browser event.

Lyticus will create a track event every time such browser event targets an element matching one of the specified selector strings.

The created track event will have the following values:

- type: the type of the browser event
- value: the id of the element or the value of the "data-track-value" attribute

Events without a name will not be tracked.

The "data-track-ignore" attribute can be used to skip the creation of a track event.
-->

#### Example

```javascript
lyticus.addDocumentTracker("click", ["a", "button"]);
```

## Usage with Nuxt

Add the following lyticus.js file to your middleware directory:

```javascript
import Lyticus from "lyticus";

const lyticus = new Lyticus("your-tracking-id", {
  development: process.env.NODE_ENV === "development"
});

export default ({ route }) => {
  lyticus.trackPage(route.path);
};
```

Add the following to your nuxt.config.js file:

```javascript
  router: {
    middleware: ["lyticus"]
  },
```

## Powered by

- Babel 7
- Webpack 4

## License

[MIT](http://opensource.org/licenses/MIT)

## Twitter

[Follow me on Twitter](https://twitter.com/KrolsBjorn)
