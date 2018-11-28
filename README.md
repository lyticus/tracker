# lyticus

> Analytics client facade

## About

_Lutikos (Greek) - Able to loosen_

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
import Lyticus from "lyticus";
const lyticus = new Lyticus("segment", () => window.analytics);
```

## Methods

### identify

Associates a users and their actions to a recognizable userId and traits.

#### Example

```javascript
lyticus.identify({ userId: "abcde", traits: { subscribed: true } });
```

### track

Parameter(s): _type, name, properties_

Tracks an event.

#### Example

```javascript
lyticus.track("click", "green-button", { text: "Hello, World!" });
```

### page

Parameter(s): _name_

Tracks a page view.

#### Example

```javascript
lyticus.page("About");
```

### addDocumentTracker

Parameter(s): _event type, selector strings_

Adds a listener to the document for a specified type of browser event.

Lyticus will create a track event every time such browser event targets an element matching one of the specified selector strings.

The created track event will have the following values:

- type: the type of the browser event
- name: the id of the element or the value of the "data-track-name" attribute
- properties: the value of the "data-track-properties" attribute or null

Events without a name will not be tracked.

The "data-track-ignore" attribute can be used to skip the creation of a track event.

#### Example

```javascript
lyticus.addDocumentTracker("click", ["a", "button"]);
```

```html
<!--
  Clicking this will create a track event with the following values:
      - type: "click"
      - name: "the-button"
      - properties: null
-->
<button id="the-button">Click me</button>

<!--
  Clicking this will create a track event with the following values:
      - type: "click"
      - name: "another-button"
      - properties: "{ color: 'blue' }"
-->
<button
  id="the-button"
  data-track-name="another-button"
  data-track-properties="{ color: 'blue' }"
>
  Click me
</button>

<!--
  Clicking this will create a track event with the following values:
      - type: "click"
      - name: "the-link"
      - properties: null
-->
<a href="https://www.google.com" id="the-link"> Click me </a>

<!-- Clicking this will not create a track event. -->
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
