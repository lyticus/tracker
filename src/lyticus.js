import "custom-event-polyfill";
import "url-search-params-polyfill";

import { version } from "../package.json";
import { isObject } from "lodash";

import Cookies from "js-cookie";

const DEFAULT_OPTIONS = {
  cookies: true,
  development: false,
  getPath: () => window.location.pathname
};

const blankLifetime = () => {
  return {
    tracked: false
  };
};

const blankSession = () => {
  return {
    id:
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15),
    events: []
  };
};

export default class Lyticus {
  constructor(websiteId, options = {}) {
    if (!websiteId) {
      throw new Error("websiteId must be defined");
    }
    if (!isObject(options)) {
      throw new Error("options must be an object");
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
    this.previousPath = null;
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
    // Decorate the event with cookie information
    if (this.options.cookies) {
      // Lifetime
      let lifetimeData = Cookies.get("_lyticus_lifetime");
      if (!lifetimeData) {
        lifetimeData = blankLifetime();
      }
      try {
        lifetimeData = JSON.parse(lifetimeData);
      } catch (error) {
        lifetimeData = blankLifetime();
      }
      if (!lifetimeData.tracked) {
        decoratedEvent.newVisitor = true;
        lifetimeData.tracked = true;
        const in2Years = 365 * 2;
        Cookies.set("_lyticus_lifetime", JSON.stringify(lifetimeData), {
          expires: in2Years
        });
      }
      // Session
      let sessionData = Cookies.get("_lyticus_session");
      if (!sessionData) {
        sessionData = blankSession();
      }
      try {
        sessionData = JSON.parse(sessionData);
      } catch (error) {
        sessionData = blankSession();
      }
      decoratedEvent.sessionId = sessionData.id;
      if (
        event.type === "page" &&
        !sessionData.events.find(
          e => e.type === "page" && e.path == decoratedEvent.path
        )
      ) {
        decoratedEvent.unique = true;
        sessionData.events.push({
          type: decoratedEvent.type,
          path: decoratedEvent.path
        });
      }
      const in30Minutes = 1 / 48;
      Cookies.set("_lyticus_session", JSON.stringify(sessionData), {
        expires: in30Minutes
      });
    }
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
      const isLocalhostReferrer = document.referrer.match(
        /(^\w+:|^)\/\/localhost:/
      );
      const isExternalReferrer =
        document.referrer.indexOf(
          window.location.protocol + "//" + window.location.hostname
        ) < 0;
      if (!isLocalhostReferrer && isExternalReferrer) {
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
    if (event.path !== this.previousPath) {
      this.previousPath = event.path;
      this.track(event);
    }
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
