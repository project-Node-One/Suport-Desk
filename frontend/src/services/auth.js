import { apiRequest } from './api.js';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export async function register(name, email, password) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: { name, email, password },
    auth: false,
  });
}

export async function login(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });

  if (data.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user || {}));
  }

  return data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getCurrentUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY);
}
