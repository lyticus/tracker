import Cookies from "js-cookie";
import { LifetimeCookieData, SessionCookieData } from "./types";

/* HELPERS */

function getCookieOrDefault(
  cookieName: string,
  defaultValue: Record<string, unknown>
) {
  let value;
  const cookieValue = Cookies.get(cookieName);
  if (!cookieValue) {
    value = defaultValue;
  } else {
    try {
      value = JSON.parse(cookieValue);
    } catch (error) {
      value = defaultValue;
    }
  }
  return value;
}

/* LIFETIME */

const LIFETIME_COOKIE_NAME = "_lyticus_lifetime";

export function getLifetimeData(): LifetimeCookieData {
  return getCookieOrDefault(LIFETIME_COOKIE_NAME, {
    tracked: false,
  });
}

export function saveLifetimeData(data: LifetimeCookieData) {
  const in2Years = 365 * 2;
  Cookies.set(LIFETIME_COOKIE_NAME, JSON.stringify(data), {
    expires: in2Years,
  });
}

/* SESSION */

const SESSION_COOKIE_NAME = "_lyticus_session";

function getRandomSessionId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function getSessionData(): SessionCookieData {
  return getCookieOrDefault(SESSION_COOKIE_NAME, {
    id: getRandomSessionId(),
    events: [],
  });
}

export function saveSessionData(data: SessionCookieData) {
  const in30Minutes = 1 / 48;
  Cookies.set(SESSION_COOKIE_NAME, JSON.stringify(data), {
    expires: in30Minutes,
  });
}
