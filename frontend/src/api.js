const defaultBase =
  window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://rithik-repo.onrender.com";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || defaultBase;

export async function api(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("Server returned non-JSON response");
    }
  }

  if (!response.ok) {
    const message = data?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export function getSessionUser() {
  const userId = sessionStorage.getItem("userId");
  const username = sessionStorage.getItem("username");
  return userId ? { userId: Number(userId), username } : null;
}

export function setSessionUser(user) {
  sessionStorage.setItem("userId", user.id);
  sessionStorage.setItem("username", user.username || "User");
}

export function clearSessionUser() {
  sessionStorage.clear();
}
