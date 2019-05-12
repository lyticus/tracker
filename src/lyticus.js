import "url-search-params-polyfill";
const packageJSON = require("../package.json");

export default class Lyticus {
  constructor(propertyId, options = {}) {
    if (!propertyId) {
      console.error("Must provide a property id");
    }
    if (!options.getPath) {
      options.getPath = () => window.location.pathname;
    }
    this.version = packageJSON.version;
    this.propertyId = propertyId;
    this.options = options;
    this.referrerTracked = false;
    this.urlReferrerTracked = false;
    this.events = [];
    if (CustomEvent) {
      document.dispatchEvent(
        new CustomEvent("lyticus:ready", {
          detail: {
            version: this.version,
            propertyId: this.propertyId,
            options: {
              development: !!this.options.development
            }
          }
        })
      );
    }
  }

  track(event, callback) {
    // If body is not loaded, re-try on DOMContentLoaded
    if (document.body === null) {
      document.addEventListener("DOMContentLoaded", () => {
        this.track(event, callback);
      });
      return;
    }
    // Skip if doNotTrack not track is detected
    const isDoNotTrack =
      "doNotTrack" in navigator && navigator.doNotTrack === "1";
    if (isDoNotTrack) {
      return;
    }
    // Skip if this is a prerendered page
    const isPrerenderedPage =
      "visibilityState" in document && document.visibilityState === "prerender";
    if (isPrerenderedPage) {
      return;
    }
    // Decorate the event with the property id, time and development flag
    const decoratedEvent = {
      ...event,
      propertyId: this.propertyId,
      time: new Date().getTime(),
      development: this.options.development
    };
    // POST to beacon if not in development mode
    if (!this.options.development) {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://beacon.lyticus.com/event");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(decoratedEvent));
    }
    // Add event to events array
    this.events.push(decoratedEvent);
    // Dispatch custom event
    if (CustomEvent) {
      document.dispatchEvent(
        new CustomEvent("lyticus:track", { detail: decoratedEvent })
      );
    }
    // Invoke callback after 300ms
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
    // Referrer
    let referrer = undefined;
    if (!this.referrerTracked) {
      const isExternalReferrer =
        document.referrer.indexOf(
          window.location.protocol + "//" + window.location.hostname
        ) < 0;
      if (isExternalReferrer) {
        referrer = document.referrer;
        this.referrerTracked = true;
      }
    }
    // URL referrer
    let urlReferrer = undefined;
    if (!this.urlReferrerTracked) {
      const referrerQueryParameters = [
        "referrer",
        "ref",
        "source",
        "utm_source"
      ];
      const queryParameters = new URLSearchParams(window.location.search);
      for (let i = 0; i < referrerQueryParameters.length; i++) {
        const referrerQueryParameter = referrerQueryParameters[i];
        const queryParameterValue = queryParameters.get(referrerQueryParameter);
        if (queryParameterValue) {
          urlReferrer = queryParameterValue;
          this.urlReferrerTracked = true;
        }
      }
    }
    this.track({
      type: "page",
      path: path || this.options.getPath(),
      referrer,
      urlReferrer
    });
  }

  trackClick(value, path) {
    this.track({
      type: "click",
      path: path || this.options.getPath(),
      value: value
    });
  }

  trackOutboundClick(value, url, path) {
    this.track(
      {
        type: "click",
        path: path || this.options.getPath(),
        value: value
      },
      function() {
        document.location = url;
      }
    );
  }

  startHistoryMode() {
    let historyModeEnabled = false;
    if (!Event) {
      console.error("Unable to access Event");
    } else if (!window.dispatchEvent) {
      console.error("Unable to access window.dispatchEvent");
    } else if (!window.history) {
      console.error("Unable to access window.history");
    } else if (!window.history.pushState) {
      console.error("Unable to access window.history.pushState");
    } else {
      const stateListener = function(type) {
        let original = window.history[type];
        return function() {
          const rv = original.apply(this, arguments);
          const event = new Event(type);
          event.arguments = arguments;
          window.dispatchEvent(event);
          return rv;
        };
      };
      window.history.pushState = stateListener("pushState");
      window.addEventListener("pushState", () => {
        this.trackPage();
      });
      this.trackPage();
      historyModeEnabled = true;
    }
    if (!historyModeEnabled) {
      console.error("History mode could not be enabled");
    }
    return historyModeEnabled;
  }

  getEvents() {
    return this.events;
  }

  getVersion() {
    return this.version;
  }
}
