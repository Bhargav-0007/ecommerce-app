const BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export function apiUrl(path: string): string {
  return `${BASE}${path}`;
}

export function authHeaders(token: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}
