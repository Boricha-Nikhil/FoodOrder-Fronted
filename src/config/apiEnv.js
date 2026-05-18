/**
 * Shared API / Socket config from Vite env (no axios — safe for any module).
 */
export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL?.trim();
  if (!raw) return '/api';
  const withoutTrailingSlash = raw.replace(/\/+$/, '');
  return withoutTrailingSlash.endsWith('/api')
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;
}

/** Origin for Socket.io when API is on another host; null = same origin as the SPA */
export function getSocketOrigin() {
  const raw = import.meta.env.VITE_API_URL?.trim();
  if (!raw) return null;
  const withoutTrailingSlash = raw.replace(/\/+$/, '');
  try {
    return new URL(withoutTrailingSlash).origin;
  } catch {
    return null;
  }
}
