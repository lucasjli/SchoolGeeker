// Prefix all /api requests with configured base URL in production builds
// Set VITE_API_BASE_URL in .env.production (e.g., http://YOUR_BACKEND_HOST:PORT)
const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? String(import.meta.env.VITE_API_BASE_URL).replace(/\/+$/, '')
  : '';

if (API_BASE) {
  const originalFetch = window.fetch.bind(window);
  window.fetch = function patchedFetch(input, init) {
    try {
      if (typeof input === 'string') {
        if (input.startsWith('/api')) {
          return originalFetch(API_BASE + input, init);
        }
        if (input.startsWith('api/')) {
          return originalFetch(`${API_BASE}/${input}`, init);
        }
      } else if (input instanceof Request) {
        const reqUrl = input.url || '';
        if (reqUrl.startsWith('/api')) {
          const newReq = new Request(API_BASE + reqUrl, input);
          return originalFetch(newReq, init);
        }
        if (reqUrl.startsWith('api/')) {
          const newReq = new Request(`${API_BASE}/${reqUrl}`, input);
          return originalFetch(newReq, init);
        }
      }
    } catch (_) {
      // fall through to original fetch if anything unexpected happens
    }
    return originalFetch(input, init);
  };

  // Optional: expose for debugging
  console.debug('[API] Base URL set to', API_BASE);
}

export { }; // make this a module
