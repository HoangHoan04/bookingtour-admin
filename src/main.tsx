/* eslint-disable  */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

if (typeof window !== "undefined") {
  (window as any).global = window;
}

import App from "./App.tsx";

import { Buffer } from "buffer";
// @ts-expect-error
import process from "process";

(window as any).Buffer = Buffer;
(window as any).process = process;
(window as any).global = window;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
