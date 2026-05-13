// Centralized session helpers for the frontend.
// We keep auth in localStorage to match the existing login flow.

const KEY = "nx_auth";

export function readAuth() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export function writeAuth(auth) {
  localStorage.setItem(KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}
