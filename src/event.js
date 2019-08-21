import "custom-event-polyfill";

export const CONFIGURATION_EVENT = "lyticus:configuration";
export const PUSH_STATE_EVENT = "lyticus:pushState";
export const TRACK_EVENT = "lyticus:track";

export function dispatch(type, detail) {
  document.dispatchEvent(
    new CustomEvent(type, {
      detail
    })
  );
}

export function withEventDispatcher(fn) {
  return function(type) {
    return function() {
      const rv = fn.apply(this, arguments);
      const event = new CustomEvent(type);
      event.arguments = arguments;
      window.dispatchEvent(event);
      return rv;
    };
  };
}
