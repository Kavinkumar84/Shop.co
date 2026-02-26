import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// ✅ Bootstrap CSS removed — not used in codebase (saves ~190KB CSS)
// Bootstrap Icons still imported in Header.jsx where bi-* classes are used

import { HelmetProvider } from "react-helmet-async";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
