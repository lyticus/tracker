import "custom-event-polyfill";

export const CONFIGURATION_EVENT = "lyticus:configuration";
export const TRACK_EVENT = "lyticus:track";

export function dispatch(type, detail) {
  document.dispatchEvent(
    new CustomEvent(type, {
      detail
    })
  );
}
