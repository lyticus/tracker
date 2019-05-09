import axios from "axios";

export default class Lyticus {
  constructor(propertyId, options = {}) {
    if (!options.getPath) {
      options.getPath = () => window.location.pathname;
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
      const isExternalReferrer =
        document.referrer.indexOf(
          window.location.protocol + "//" + window.location.hostname
        ) < 0;
      if (isExternalReferrer) {
        referrer = document.referrer;
        this.referrerTracked = true;
      }
    }
    this.track({
      type: "page",
      path: path || this.options.getPath(),
      referrer
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
