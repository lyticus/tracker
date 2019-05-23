import "custom-event-polyfill";
import "url-search-params-polyfill";

import { version } from "../package.json";

import Cookies from "js-cookie";

const DEFAULT_OPTIONS = {
  cookies: true,
  development: false,
  getPath: () => window.location.pathname
};

const FRESH_COOKIE = {
  newVisitor: true,
  newSession: true,
  lastEvent: new Date()
};

export default class Lyticus {
  constructor(websiteId, options = {}) {
    if (!websiteId) {
      console.error("Must provide a id");
    }
    this.version = version;
    this.websiteId = websiteId;
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    };
    this.referrerTracked = false;
    this.urlReferrerTracked = false;
    this.events = [];
    const safeConfig = JSON.parse(
      JSON.stringify({
        ...this,
        events: undefined,
        referrerTracked: undefined,
        urlReferrerTracked: undefined
      })
    );
    window.__LYTICUS__ = safeConfig;
    document.dispatchEvent(
      new CustomEvent("lyticus:configuration", {
        detail: safeConfig
      })
    );
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
    // Decorate the event with the website id and time
    let decoratedEvent = {
      ...event,
      websiteId: this.websiteId,
      time: new Date().getTime()
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
    document.dispatchEvent(
      new CustomEvent("lyticus:track", { detail: decoratedEvent })
    );
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
    const event = {
      type: "page",
      path: path || this.options.getPath()
    };
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
    if (referrer && referrer.length) {
      event.referrer = referrer;
    }
    if (urlReferrer && urlReferrer.length) {
      event.urlReferrer = urlReferrer;
    }
    // Decorate the event with cookie information
    if (this.options.cookies) {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        24,
        0,
        0
      );
      const thirtyMinsAgo = new Date();
      thirtyMinsAgo.setMinutes(thirtyMinsAgo.getMinutes() - 30);
      let cookieData = Cookies.get("_lyticus");
      if (!cookieData) {
        cookieData = FRESH_COOKIE;
      }
      try {
        cookieData = JSON.parse(cookieData);
      } catch (error) {
        cookieData = FRESH_COOKIE;
      }
      if (cookieData.lastEvent < thirtyMinsAgo) {
        cookieData.newSession = true;
      }
      if (cookieData.newVisitor) {
        event.newVisitor = true;
      }
      if (cookieData.newSession) {
        event.newSession = true;
      }
      cookieData.newVisitor = false;
      cookieData.newSession = false;
      Cookies.set("_lyticus", JSON.stringify(cookieData), {
        expires: midnight
      });
    }
    this.track(event);
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
