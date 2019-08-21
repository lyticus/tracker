import "custom-event-polyfill";

import { version } from "../package.json";
import isObject from "lodash.isobject";

import {
  getLifetimeData,
  saveLifetimeData,
  getSessionData,
  saveSessionData
} from "./cookie";

import {
  getEventPath,
  getUrlReferrer,
  isBodyLoaded,
  isDoNotTrack,
  isExternalReferrer,
  isLocalhostReferrer,
  isVisibilityPrerendered,
  sendToBeacon
} from "./utils";

const DEFAULT_OPTIONS = {
  cookies: true,
  development: false,
  getPath: () => window.location.pathname
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
    if (!isBodyLoaded(window)) {
      document.addEventListener("DOMContentLoaded", () => {
        this.track(event, callback);
      });
      return;
    }
    // Skip if doNotTrack not track is detected
    if (isDoNotTrack(window)) {
      return;
    }
    // Skip if this is a prerendered page
    if (isVisibilityPrerendered(window)) {
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
      const lifetimeData = getLifetimeData();
      if (!lifetimeData.tracked) {
        decoratedEvent.newVisitor = true;
        lifetimeData.tracked = true;
        saveLifetimeData(lifetimeData);
      }
      // Session
      const sessionData = getSessionData();
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
      // We save the session data regardless of whether its content was updated, to keep track of activity and update its expiry accordingly
      saveSessionData(sessionData);
    }
    // Send event to beacon
    if (!this.options.development) {
      sendToBeacon(decoratedEvent);
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
    if (
      !this.referrerTracked &&
      !isLocalhostReferrer(window) &&
      isExternalReferrer(window)
    ) {
      const referrer = document.referrer;
      if (referrer && referrer.length) {
        event.referrer = referrer;
        this.referrerTracked = true;
      }
    }
    // URL referrer
    if (!this.urlReferrerTracked) {
      const urlReferrer = getUrlReferrer(window);
      if (urlReferrer && urlReferrer.length) {
        event.urlReferrer = urlReferrer;
        this.urlReferrerTracked = true;
      }
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

  clickTracker() {
    return event => {
      const path = getEventPath(event);
      if (path) {
        for (let i = 0; i < path.length; i++) {
          const element = path[i];
          const dataset = element.dataset;
          if (dataset && dataset.trackClick) {
            this.trackClick(dataset.trackClick);
            break;
          }
        }
      } else {
        // This browser doesn't supply path information
      }
    };
  }

  getEvents() {
    return this.events;
  }

  getVersion() {
    return this.version;
  }
}
