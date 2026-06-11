// Cliente API centralizado (Integrante 3 — HU-3.3).
// Todas las peticiones al backend pasan por aquí.

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token");
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Error ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}
