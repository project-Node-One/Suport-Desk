import { isAuthenticated, logout } from '../services/auth.js';

const routes = [];
const PUBLIC_ROUTES = ['/login', '/register'];

// path puede contener parámetros, ej: '/tickets/:id'
export function addRoute(path, renderFn) {
  const paramNames = [];
  const regexPath = path
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':')) {
        paramNames.push(segment.slice(1));
        return '([^/]+)';
      }
      return segment;
    })
    .join('/');

  routes.push({
    path,
    regex: new RegExp(`^${regexPath}$`),
    paramNames,
    renderFn,
  });
}

export function navigate(path) {
  window.location.hash = path;
}

function matchRoute(currentPath) {
  for (const route of routes) {
    const match = currentPath.match(route.regex);
    if (match) {
      const params = {};
      route.paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { route, params };
    }
  }
  return null;
}

function resolveRoute() {
  let path = window.location.hash.slice(1) || '/login';

  const isPublic = PUBLIC_ROUTES.includes(path);

  if (!isPublic && !isAuthenticated()) {
    window.location.hash = '/login';
    return;
  }

  if (isPublic && isAuthenticated()) {
    window.location.hash = '/tickets';
    return;
  }

  const app = document.querySelector('#app');
  const matched = matchRoute(path);

  app.innerHTML = '';

  if (!matched) {
    const notFound = matchRoute('/not-found');
    notFound.route.renderFn(app, {});
  } else {
    matched.route.renderFn(app, matched.params);
  }

  const logoutBtn = document.querySelector('#logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      navigate('/login');
    });
  }
}

export function startRouter() {
  window.addEventListener('hashchange', resolveRoute);
  window.addEventListener('DOMContentLoaded', resolveRoute);
  resolveRoute();
}
