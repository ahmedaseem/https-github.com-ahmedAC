// config.js
// Export a named CONFIG object used by app.js.
// You can override values at runtime by defining `window.ASEM_CONFIG`
// before this module is imported (for example, inline in index.html).

// Default values suitable for local development. Change them for production deployment.
const _DEFAULT = {
  // API configuration
  // - api.real: base URL for backend API. Set to an absolute origin (https://api.example.com)
  //   or leave empty ("") to build endpoints relative to the current page origin.
  // - api.location: optional override for the location (geolocation) endpoint. If null/undefined,
  //   app.js will use `${API_BASE}/location`.
  api: {
    real: "", // empty = use relative API paths (development / same-origin)
    // You can set explicit endpoints here, e.g.:
    // tourism: "https://api.example.com/tourism" (but app.js constructs endpoints from api.real)
    location: null,
  },

  // Request timeout (milliseconds) used by apiRequest() when contacting remote services.
  // Matches the default used in app.js if not overridden.
  timeout: 15000,

  // Mode flag used by the UI (e.g., shows demo badge when "demo").
  // Use "production" or "development" or "demo" as needed.
  mode: "demo",

  // Application metadata (optional helpers)
  appName: "ASEM Digital Solutions",
  version: "1.0.0",
  contactEmail: "",

  // Feature toggles (optional)
  features: {
    enableDemoBadge: true, // app.js also checks CONFIG.mode === "demo"
  },
};

// Merge runtime overrides if provided (window.ASEM_CONFIG — set this before module import)
function deepMerge(target, source) {
  if (typeof source !== "object" || source === null) return target;
  const out = Array.isArray(target) ? target.slice() : { ...target };
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = out[key];
    if (Array.isArray(srcVal)) {
      out[key] = srcVal.slice();
    } else if (typeof srcVal === "object" && srcVal !== null) {
      out[key] = deepMerge(tgtVal && typeof tgtVal === "object" ? tgtVal : {}, srcVal);
    } else {
      out[key] = srcVal;
    }
  }
  return out;
}

const runtimeOverride = typeof window !== "undefined" && window.ASEM_CONFIG ? window.ASEM_CONFIG : null;
export const CONFIG = runtimeOverride ? deepMerge(_DEFAULT, runtimeOverride) : _DEFAULT;

// Helpful note:
// - If CONFIG.api.real is empty, app.js will use endpoints like `${API_BASE}/tourism`
//   where API_BASE === CONFIG.api.real || "" so the resulting endpoints are "/tourism" (same-origin).
// - To use a remote API host, set window.ASEM_CONFIG = { api: { real: "https://api.example.com" } }
//   before importing app.js (for example add a small inline script in index.html).
//
// Example override (index.html, put BEFORE the <script type="module" src="app.js">):
// <script>
//   window.ASEM_CONFIG = {
//     api: { real: "https://api.example.com", location: "https://api.example.com/location" },
//     timeout: 20000,
//     mode: "production"
//   };
// </script>
