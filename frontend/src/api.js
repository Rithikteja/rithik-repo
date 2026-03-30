const defaultBase =
  window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://rithik-repo.onrender.com";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || defaultBase;

function normalizeError(error, fallbackMessage) {
  if (!error) return new Error(fallbackMessage);
  if (error instanceof Error) return error;
  if (typeof error === "string") return new Error(error);
  if (typeof error === "object" && error.message) return new Error(error.message);
  try {
    return new Error(`${fallbackMessage}: ${JSON.stringify(error)}`);
  } catch (e) {
    return new Error(fallbackMessage);
  }
}

export async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });
  } catch (error) {
    throw normalizeError(error, "Network request failed");
  }

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
