import { el, Navbar } from '../components/ui.js';
import { getMetrics } from '../services/tickets.js';

export async function DashboardPage(container) {
  const statsEl = el('div', { class: 'row g-3' }, [el('p', { class: 'text-muted' }, 'Cargando métricas...')]);

  container.appendChild(
    el('div', {}, [
      Navbar({ active: 'dashboard' }),
      el('main', { class: 'container py-4' }, [
        el('h1', { class: 'h3 mb-4' }, 'Dashboard'),
        statsEl,
      ]),
    ])
  );

  function StatCard(label, value, variant = 'default') {
    return el('div', { class: 'col-6 col-md-3' }, [
      el('div', { class: `card p-3 stat-${variant}` }, [
        el('span', { class: 'stat-value d-block' }, String(value)),
        el('span', { class: 'stat-label text-muted' }, label),
      ]),
    ]);
  }

  try {
    const metrics = await getMetrics();

    statsEl.innerHTML = '';
    statsEl.appendChild(StatCard('Total de tickets', metrics.total ?? 0));
    statsEl.appendChild(StatCard('Abiertos', metrics.abiertos ?? 0, 'open'));
    statsEl.appendChild(StatCard('En proceso', metrics.enProceso ?? 0, 'progress'));
    statsEl.appendChild(StatCard('Cerrados', metrics.cerrados ?? 0, 'closed'));
    statsEl.appendChild(StatCard('Prioridad alta', metrics.prioridadAlta ?? 0, 'high'));
  } catch (err) {
    statsEl.innerHTML = '';
    statsEl.appendChild(el('div', { class: 'alert alert-danger' }, err.message));
  }
}
