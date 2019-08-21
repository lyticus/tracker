import Cookies from "js-cookie";

/* HELPERS */

function getCookieOrDefault(cookieName, defaultValue) {
  let data = Cookies.get(cookieName);
  if (!data) {
    data = defaultValue;
  }
  try {
    data = JSON.parse(data);
  } catch (error) {
    data = defaultValue;
  }
  return data;
}

/* LIFETIME */

const LIFETIME_NAME = "_lyticus_lifetime";

export function getLifetimeData() {
  return getCookieOrDefault(LIFETIME_NAME, {
    tracked: false
  });
}

export function saveLifetimeData(data) {
  const in2Years = 365 * 2;
  Cookies.set(LIFETIME_NAME, JSON.stringify(data), {
    expires: in2Years
  });
}

/* SESSION */

const SESSION_NAME = "_lyticus_session";

export function getSessionData() {
  return getCookieOrDefault(SESSION_NAME, {
    id:
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15),
    events: []
  });
}

export function saveSessionData(data) {
  const in30Minutes = 1 / 48;
  Cookies.set(SESSION_NAME, JSON.stringify(data), {
    expires: in30Minutes
  });
}
