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

### track

Tracks an event.

Parameter(s): type, name, properties

#### Example

```javascript
lyticus.track('click', 'green-button', { text: 'Hello, World!' });
```

### page

Tracks a page view.

Parameter(s): name

#### Example

```javascript
lyticus.page('About');
```

### addDocumentTracker

Adds a listener to the document for a specified browser event type targeting a specified set of tag names.

Lyticus will create a corresponding analytics event with a type matching the browser event. The event will be named after the id of the targeted element. "data-track-name" and "data-track-properties" can be used to change the analytics event values. "data-track-ignore" can be used to ingore the skip the creation of the analytics event.

Parameter(s): event type, tag names

#### Example

```javascript
lyticus.addDocumentTracker('click', ['A', 'BUTTON']);
```

```html
<!--
Clicking this will create a track event with the following values:
    - type: "click"
    - name: "the-button"
    - properties: null
-->
<button id="the-button">
    Click me
</button>

<!--
Clicking this will create a track event with the following values:
    - type: "click"
    - name: "another-button"
    - properties: "{ color: 'blue' }"
-->
<button id="the-button" data-track-name="another-button" data-track-properties="{ color: 'blue' }">
    Click me
</button>

<!--
Clicking this will create a track event with the following values:
    - type: "click"
    - name: "the-link"
    - properties: null
-->
<a href="https://www.google.com" id="the-link">
    Click me
</a>

<!--
Clicking this will not create a track event.
-->
<a href="https://www.google.com" id="the-link" data-track-ignore="true">
    Click me
</a>
```

## Powered by

- Babel 7
- Webpack 4

## License

[MIT](http://opensource.org/licenses/MIT)

## Twitter

[Follow me on Twitter](https://twitter.com/KrolsBjorn)
