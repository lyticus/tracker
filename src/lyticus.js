import axios from "axios";
import nanoid from "nanoid";

export default class Lyticus {
  constructor(trackingId, options = {}) {
    this.sessionId = nanoid();
    this.trackingId = trackingId;
    this.options = options;
    this.referrerTracked = false;
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
      const doNotTrack =
        "doNotTrack" in navigator && navigator.doNotTrack === "1";
      if (!doNotTrack) {
        axios.post("https://beacon.lyticus.com/event", decoratedEvent);
      }
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
    let referrer = undefined;
    if (!this.referrerTracked) {
      referrer = document.referrer;
      /*
      if (!referrer) {
        const urlSearchParams = new URLSearchParams(window.location.search);
        referrer = urlSearchParams.get("ref");
      }
      */
      this.referrerTracked = true;
    }
    this.track({
      type: "page",
      path:
        path || this.options.getPath
          ? this.options.getPath()
          : window.location.pathname,
      referrer
    });
  }
  trackClick(value, path) {
    this.track({
      type: "click",
      path:
        path || this.options.getPath
          ? this.options.getPath()
          : window.location.pathname,
      value: value
    });
  }
  trackOutboundClick(value, url, path) {
    this.track(
      {
        type: "click",
        path:
          path || this.options.getPath
            ? this.options.getPath()
            : window.location.pathname,
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
