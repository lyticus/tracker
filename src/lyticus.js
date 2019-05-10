function post(url, body) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(body));
}

export default class Lyticus {
  constructor(propertyId, options = {}) {
    if (!options.getPath) {
      options.getPath = () => window.location.pathname;
    }
    if (options.historyMode) {
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
        historyModeEnabled = true;
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
      }
      if (!historyModeEnabled) {
        console.error("History mode could not be enabled");
      }
    }
    this.propertyId = propertyId;
    this.options = options;
    this.referrerTracked = false;
  }
  track(event, callback) {
    if (document.body === null) {
      document.addEventListener("DOMContentLoaded", () => {
        this.track(event, callback);
      });
      return;
    }
    const decoratedEvent = {
      ...event,
      propertyId: this.propertyId
    };
    if (this.options.development) {
      console.log(decoratedEvent);
    } else {
      const isDoNotTrack =
        "doNotTrack" in navigator && navigator.doNotTrack === "1";
      const isPrerenderedPage =
        "visibilityState" in document &&
        document.visibilityState === "prerender";
      if (!isDoNotTrack && !isPrerenderedPage) {
        post("https://beacon.lyticus.com/event", decoratedEvent);
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
    const queryParameters = new URLSearchParams(window.location.search);
    ["referrer", "ref", "source", "utm_source"].forEach(
      referrerQueryParameter => {
        const queryParameterValue = queryParameters.get(referrerQueryParameter);
        if (queryParameterValue) {
          urlReferrer = queryParameterValue;
        }
      }
    );
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
}
