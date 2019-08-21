import { isBodyLoaded } from "../src/utils";

test("isBodyLoaded returns true when the body is not null", () => {
  expect(
    isBodyLoaded({
      document: {
        body: "<body>Lorem</body>"
      }
    })
  ).toEqual(true);
});

test("isBodyLoaded returns false when the body is null", () => {
  expect(
    isBodyLoaded({
      document: {
        body: null
      }
    })
  ).toEqual(false);
});

import { isDoNotTrack } from "../src/utils";

test("isDoNotTrack returns true when the flag is set to 1", () => {
  expect(
    isDoNotTrack({
      navigator: {
        doNotTrack: 1
      }
    })
  ).toEqual(true);
});

test("isDoNotTrack returns false when the flag is not set to 1", () => {
  expect(
    isDoNotTrack({
      navigator: {
        doNotTrack: 0
      }
    })
  ).toEqual(false);
});

test("isDoNotTrack returns false when the flag is not set", () => {
  expect(
    isDoNotTrack({
      navigator: {}
    })
  ).toEqual(false);
});

import { isExternalReferrer } from "../src/utils";

test("isExternalReferrer returns true for external referrer", () => {
  expect(
    isExternalReferrer({
      location: {
        protocol: "https:",
        hostname: "lyticus"
      },
      document: {
        referrer: "https://google.com"
      }
    })
  ).toEqual(true);
});

test("isExternalReferrer returns false for internal referrer", () => {
  expect(
    isExternalReferrer({
      location: {
        protocol: "https:",
        hostname: "lyticus"
      },
      document: {
        referrer: "https://lyticus.com"
      }
    })
  ).toEqual(false);
});

import { isLocalhostReferrer } from "../src/utils";

test("isLocalhostReferrer returns true for localhost referrer", () => {
  expect(
    isLocalhostReferrer({
      document: {
        referrer: "http://localhost:3000"
      }
    })
  ).toEqual(true);
});

test("isLocalhostReferrer returns false for empty referrer", () => {
  expect(
    isLocalhostReferrer({
      document: {
        referrer: ""
      }
    })
  ).toEqual(false);
});

test("isLocalhostReferrer returns false for website referrer", () => {
  expect(
    isLocalhostReferrer({
      document: {
        referrer: "https://lyticus.com"
      }
    })
  ).toEqual(false);
});

import { isVisibilityPrerendered } from "../src/utils";

test("isVisibilityPrerendered returns true when the visibility state is 'prerender'", () => {
  expect(
    isVisibilityPrerendered({
      document: {
        visibilityState: "prerender"
      }
    })
  ).toEqual(true);
});

test("isVisibilityPrerendered returns false when the visibility state not 'prerender'", () => {
  expect(
    isVisibilityPrerendered({
      document: {
        visibilityState: "visible"
      }
    })
  ).toEqual(false);
});

test("isVisibilityPrerendered returns false when the visibility state not set", () => {
  expect(
    isVisibilityPrerendered({
      document: {}
    })
  ).toEqual(false);
});
