import "url-search-params-polyfill";

export function getUrlReferrer(window) {
  const candidates = ["referrer", "ref", "source", "utm_source"];
  const queryParameters = new URLSearchParams(window.location.search);
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    const value = queryParameters.get(candidate);
    if (value) {
      return value;
    }
  }
  return null;
}

export function isBodyLoaded(window) {
  return !!window.document.body;
}

export function isDoNotTrack(window) {
  return "doNotTrack" in window.navigator && window.navigator.doNotTrack == "1";
}

export function isExternalReferrer(window) {
  const referrer = window.document.referrer;
  const origin = `${window.location.protocol}//${window.location.hostname}`;
  return !referrer.includes(origin);
}

export function isLocalhostReferrer(window) {
  return /(^\w+:|^)\/\/localhost:/.test(window.document.referrer);
}

export function isVisibilityPrerendered(window) {
  return (
    "visibilityState" in window.document &&
    window.document.visibilityState == "prerender"
  );
}
