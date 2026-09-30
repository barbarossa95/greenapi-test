/** Базовый URL API: в dev — origin SPA (Vite proxy /api), в prod — `VITE_API_URL`. */
export function resolveApiBaseUrl(): string {
  if (import.meta.env.DEV) {
    return typeof window !== 'undefined'
      ? window.location.origin
      : (import.meta.env.VITE_API_URL ?? '');
  }

  return import.meta.env.VITE_API_URL ?? '';
}

const isAPIPath = (pathname: string) =>
  pathname.startsWith('/api/') || pathname === '/healthz';

/** Из абсолютного URL API оставляет только path — чтобы в dev идти через origin SPA. */
const toAPIPath = (url: string): string | undefined => {
  try {
    const {pathname, search, hash} = new URL(url);
    if (!isAPIPath(pathname)) return undefined;
    return `${pathname}${search}${hash}`;
  } catch {
    return undefined;
  }
};

/** Склеивает путь (относительный или абсолютный) с `resolveApiBaseUrl()`. */
export function resolveApiAssetUrl(
  url: string | undefined | null
): string | undefined {
  if (!url) return undefined;

  const path = /^https?:\/\//i.test(url) ? (toAPIPath(url) ?? url) : url;
  if (/^https?:\/\//i.test(path)) return path;

  const base = resolveApiBaseUrl();
  if (!base) return path;
  return new URL(path, base.endsWith('/') ? base : `${base}/`).href;
}
