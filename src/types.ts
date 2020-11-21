export type Options = {
  cookies: boolean;
  development: boolean;
  getPath: () => string;
};

export type State = {
  websiteId: string;
  referrerTracked: boolean;
  urlReferrerTracked: boolean;
  events: DecoratedEvent[];
  previousPath: string | null;
};

export type SessionCookieData = {
  id: string;
  events: { type: string; path: string }[];
};

export type LifetimeCookieData = {
  tracked: boolean;
};

export enum CustomEventType {
  CONFIGURATION_EVENT = "lyticus:configuration",
  PUSH_STATE_EVENT = "lyticus:pushState",
  TRACK_EVENT = "lyticus:track",
}

export type ClickEvent = {
  type: "click";
  path: string;
  value: string;
};

export type NavigatorEvent = {
  type: "navigator";
  screenWidth: number;
  language: string;
  userAgent: string;
};

export type PageViewEvent = {
  type: "page";
  path: string;
  referrer?: string;
  urlReferrer?: string;
};

export type DecoratedEvent = (ClickEvent | NavigatorEvent | PageViewEvent) & {
  newVisitor: boolean;
  sessionId?: string;
  time: number;
  unique: boolean;
  websiteId: string;
};
