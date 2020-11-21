import isObject from "lodash.isobject";

import { dispatch, withEventDispatcher } from "./event";

import {
  getLifetimeData,
  getSessionData,
  saveLifetimeData,
  saveSessionData,
} from "./cookie";

import {
  getEventPath,
  getUrlReferrer,
  isBodyLoaded,
  isDoNotTrack,
  isExternalReferrer,
  isLocalhostReferrer,
  sendToBeacon,
} from "./utils";

import {
  DecoratedEvent,
  CustomEventType,
  Options,
  State,
  ClickEvent,
  NavigatorEvent,
  PageViewEvent,
} from "./types";

const DEFAULT_OPTIONS = {
  cookies: true,
  development: false,
  getPath: () => window.location.pathname,
};

export default class Lyticus {
  options: Options;
  state: State;

  constructor(websiteId: string, options: Partial<Options> = {}) {
    if (!websiteId) {
      throw new Error("websiteId must be defined");
    }
    if (!isObject(options)) {
      throw new Error("options must be an object");
    }
    this.state = {
      websiteId,
      referrerTracked: false,
      urlReferrerTracked: false,
      events: [],
      previousPath: null,
    };
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
    // @ts-ignore
    window.__LYTICUS__ = this.state;
    dispatch(CustomEventType.CONFIGURATION_EVENT, this.state);
  }

  track(
    event: ClickEvent | NavigatorEvent | PageViewEvent,
    callback?: { (): void; (...args: any[]): void }
  ) {
    if (!isBodyLoaded(window)) {
      document.addEventListener("DOMContentLoaded", () =>
        this.track(event, callback)
      );
      return;
    }
    if (isDoNotTrack(window)) {
      return;
    }
    const decoratedEvent: DecoratedEvent = {
      ...event,
      newVisitor: false,
      time: new Date().getTime(),
      unique: false,
      websiteId: this.state.websiteId,
    };
    if (this.options.cookies) {
      // Lifetime cookie
      const lifetime = getLifetimeData();
      if (!lifetime.tracked) {
        decoratedEvent.newVisitor = true;
        lifetime.tracked = true;
        saveLifetimeData(lifetime);
      }
      // Session cookie
      const session = getSessionData();
      decoratedEvent.sessionId = session.id;
      if (
        decoratedEvent.type === "page" &&
        !session.events.find(
          (e: { type: string; path: string }) =>
            e.type === "page" && e.path === decoratedEvent.path
        )
      ) {
        decoratedEvent.unique = true;
        session.events.push({
          type: decoratedEvent.type,
          path: decoratedEvent.path,
        });
      }
      saveSessionData(session); // Always save session data (bump expiry)
    }
    if (!this.options.development) {
      sendToBeacon(decoratedEvent);
    }
    this.state.events.push(decoratedEvent);
    dispatch(CustomEventType.TRACK_EVENT, decoratedEvent);
    if (callback) {
      setTimeout(callback, 300);
    }
  }

  trackNavigator() {
    this.track({
      type: "navigator",
      screenWidth: window.innerWidth,
      language: window.navigator.language,
      userAgent: window.navigator.userAgent,
    });
  }

  trackPage(path?: string) {
    const event: PageViewEvent = {
      type: "page",
      path: path || this.options.getPath(),
    };
    if (event.path === this.state.previousPath) {
      return;
    }
    this.state.previousPath = event.path;
    // Referrer
    if (
      !this.state.referrerTracked &&
      !isLocalhostReferrer(window) &&
      isExternalReferrer(window)
    ) {
      const referrer = document.referrer;
      if (referrer && referrer.length) {
        event.referrer = referrer;
        this.state.referrerTracked = true;
      }
    }
    // URL referrer
    if (!this.state.urlReferrerTracked) {
      const urlReferrer = getUrlReferrer(window);
      if (urlReferrer && urlReferrer.length) {
        event.urlReferrer = urlReferrer;
        this.state.urlReferrerTracked = true;
      }
    }
    this.track(event);
  }

  trackClick(value: string, path?: string) {
    this.track({
      type: "click",
      path: path || this.options.getPath(),
      value,
    });
  }

  trackOutboundClick(value: string, url: string, path: string) {
    this.track(
      {
        type: "click",
        path: path || this.options.getPath(),
        value,
      },
      function callback() {
        window.location.href = url;
      }
    );
  }

  startHistoryMode() {
    if (window.history && window.history.pushState) {
      window.history.pushState = withEventDispatcher(window.history.pushState)(
        CustomEventType.PUSH_STATE_EVENT
      );
      window.addEventListener(CustomEventType.PUSH_STATE_EVENT, () =>
        this.trackPage()
      );
      this.trackPage();
      return true;
    }
    return false;
  }

  stopHistoryMode() {
    console.warn("Stopping history mode is currently not supported"); // TODO
  }

  clickTracker() {
    return (event: any) => {
      const path = getEventPath(event) || [];
      for (let element of path) {
        const dataset = element.dataset;
        if (dataset && dataset.trackClick) {
          this.trackClick(dataset.trackClick);
          break;
        }
      }
    };
  }

  getEvents() {
    return this.state.events;
  }
}
