import axios from "axios";
import nanoid from "nanoid";

export default class Lyticus {
  constructor(trackingId, options = {}) {
    this.sessionId = nanoid();
    this.trackingId = trackingId;
    this.options = options;
  }
  track(event, callback) {
    const decoratedEvent = {
      ...event,
      sessionId: this.sessionId,
      trackingId: this.trackingId
    };
    if (this.options.development) {
      console.log(decoratedEvent);
    } else {
      axios.post("https://beacon.lyticus.com/event", decoratedEvent);
    }
    if (callback) {
      setTimeout(callback, 300);
    }
  }
  trackNavigator() {
    this.track({
      type: "navigator",
      screenWidth: window.innerWidth,
      language: window.navigator.language,
      userAgent: window.navigator.userAgent
    });
  }
  trackPage(path) {
    this.track({
      type: "page",
      path: path || window.location.pathname,
      referer: document.referrer
    });
  }
  trackClick(value) {
    this.track({
      type: "click",
      path: window.location.pathname,
      value: value
    });
  }
  trackOutboundClick(value, url) {
    this.track(
      {
        type: "click",
        path: window.location.pathname,
        value: value
      },
      function() {
        document.location = url;
      }
    );
  }
  addDocumentTracker(eventType, selectorStrings) {
    document.addEventListener(eventType, event => {
      const { target } = event;
      for (let index = 0; index < selectorStrings.length; index++) {
        const selectorString = selectorStrings[index];
        if (target.matches(selectorString)) {
          let value = null;
          // Parse id
          if (target.id) {
            value = target.id;
          }
          // Parse attributes
          if (target.attributes) {
            // -- Ignore
            const ingoreAttribute = target.attributes.getNamedItem(
              "data-track-ignore"
            );
            if (ingoreAttribute) {
              return;
            }
            // -- Value
            const valueAttribute = target.attributes.getNamedItem(
              "data-track-value"
            );
            if (valueAttribute) {
              value = valueAttribute.value;
            }
          }
          if (value) {
            this.track(eventType, {
              value: value
            });
          }
          break;
        }
      }
    });
  }
}
