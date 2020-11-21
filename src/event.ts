import "custom-event-polyfill";

import { CustomEventType } from "./types";

export function dispatch(type: CustomEventType, detail: unknown) {
  document.dispatchEvent(
    new CustomEvent(type, {
      detail,
    })
  );
}

export function withEventDispatcher(fn: Function) {
  return function (type: string) {
    return function () {
      // @ts-ignore
      const returnValue = fn.apply(this, arguments);
      const event = new CustomEvent(type);
      // @ts-ignore
      event.arguments = arguments;
      window.dispatchEvent(event);
      return returnValue;
    };
  };
}
