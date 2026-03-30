import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";

function normalizeReason(reason) {
  if (!reason) return "Unknown error";
  if (typeof reason === "string") return reason;
  if (reason.message) return reason.message;
  try {
    return JSON.stringify(reason);
  } catch (e) {
    return "Non-serializable error";
  }
}

window.addEventListener("unhandledrejection", (event) => {
  const message = normalizeReason(event.reason);
  console.error("Unhandled promise rejection:", message, event.reason);
  event.preventDefault();
});

window.addEventListener("error", (event) => {
  const message = normalizeReason(event.error || event.message);
  console.error("Global runtime error:", message, event.error || event.message);
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
