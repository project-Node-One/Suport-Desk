import { el } from '../components/ui.js';

export function NotFoundPage(container) {
  container.appendChild(
    el('div', { class: 'auth-page card p-4 text-center shadow-sm' }, [
      el('div', { class: 'card-body' }, [
        el('h1', { class: 'display-4 mb-2' }, '404'),
        el('p', { class: 'text-muted mb-3' }, 'Página no encontrada'),
        el('a', { href: '#/login', class: 'btn btn-primary' }, 'Volver al inicio'),
      ]),
    ])
  );
}
