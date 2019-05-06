# lyticus

## About

This is the tracker library for [Lyticus](https://www.lyticus.com).

## Installation

### NPM

```bash
npm install --save lyticus
```

[npm package link](https://www.npmjs.com/package/lyticus)

### CDN

```html
<script src="https://unpkg.com/lyticus"></script>
```

## Setup

### NPM

```javascript
import Lyticus from "lyticus";
const lyticus = new Lyticus("your-tracking-id");
```

### CDN

```html
<script src="https://unpkg.com/lyticus"></script>
<script>
  var lyticus = new Lyticus("your-tracking-id");
</script>
```

## Constructor

```javascript
const lyticus = new Lyticus(trackingId, configuration);
```

- trackingId: string
- configuration: object

### configuration properties

#### development (boolean)

When set to true events will not be sent to the service but logged to the browser console instead.

```javascript
const lyticus = new Lyticus("your-tracking-id", {
  development: process.env.NODE_ENV === "dev"
});
```

#### getPath (function)

Enables you to override the way the path should be fetched.

##### Default implementation

```javascript
const lyticus = new Lyticus("your-tracking-id", {
  getPath: () => {
    return window.location.pathname;
  }
});
```

##### Vue: computing route name from router

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

## Framework examples

### Vue

Add the following to your main.js file:

```javascript
import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";

import Lyticus from "lyticus";

// Create Lyticus instance
const lyticus = new Lyticus("your-tracking-id", {
  development: process.env.NODE_ENV === "development",
  getPath: () => {
    const route = router.currentRoute;
    if (!route || !route.name) {
      return window.location.pathname;
    }
    return route.name;
  }
});

// Automatically track route changes
router.afterEach(() => {
  lyticus.trackPage();
});

/*
(OPTIONAL)
Adding $lyticus to the Vue prototype enables you to call Lyticus methods from within your components
*/
Vue.prototype.$lyticus = lyticus;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
```

### Nuxt

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

### VuePress

Add the following to your .vuepress/enhanceApp.js file:

```javascript
import Lyticus from "lyticus";

const lyticus = new Lyticus("your-tracking-id", {
  development: process.env.NODE_ENV === "development"
});

export default ({ router }) => {
  router.afterEach(function(to) {
    lyticus.trackPage(to.fullPath);
  });
};
```

## Powered by

- Babel 7
- Webpack 4

## License

[MIT](http://opensource.org/licenses/MIT)

## Twitter

[Follow me on Twitter](https://twitter.com/KrolsBjorn)
