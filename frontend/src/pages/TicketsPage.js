import { el, Navbar, TicketCard } from '../components/ui.js';
import { getTickets, createTicket } from '../services/tickets.js';
import { navigate } from '../router/router.js';

export async function TicketsPage(container) {
  const errorBox = el('div', { class: 'alert alert-danger', style: 'display:none' }, '');
  const listEl = el('div', {}, [el('p', { class: 'text-muted' }, 'Cargando tickets...')]);

  const form = el(
    'form',
    {
      onSubmit: async (e) => {
        e.preventDefault();
        errorBox.style.display = 'none';

        const title = form.querySelector('#title').value.trim();
        const description = form.querySelector('#description').value.trim();
        const priority = form.querySelector('#priority').value;

        try {
          await createTicket({ title, description, priority });
          form.reset();
          await loadTickets();
        } catch (err) {
          errorBox.textContent = err.message;
          errorBox.style.display = 'block';
        }
      },
    },
    [
      el('h2', { class: 'h5 mb-3' }, 'Nuevo ticket'),

      el('div', { class: 'mb-3' }, [
        el('label', { for: 'title', class: 'form-label' }, 'Título'),
        el('input', { type: 'text', id: 'title', class: 'form-control', required: true, placeholder: 'Resumen del problema' }),
      ]),

      el('div', { class: 'mb-3' }, [
        el('label', { for: 'description', class: 'form-label' }, 'Descripción'),
        el('textarea', { id: 'description', class: 'form-control', rows: '3', required: true, placeholder: 'Describe el problema con detalle' }),
      ]),

      el('div', { class: 'mb-3' }, [
        el('label', { for: 'priority', class: 'form-label' }, 'Prioridad'),
        el('select', { id: 'priority', class: 'form-select' }, [
          el('option', { value: 'baja' }, 'Baja'),
          el('option', { value: 'media', selected: true }, 'Media'),
          el('option', { value: 'alta' }, 'Alta'),
        ]),
      ]),

      errorBox,

      el('button', { type: 'submit', class: 'btn btn-primary w-100' }, 'Crear ticket'),
    ]
  );

  async function loadTickets() {
    try {
      const tickets = await getTickets();
      listEl.innerHTML = '';

      if (!tickets.length) {
        listEl.appendChild(el('p', { class: 'text-muted text-center py-4' }, 'No tienes tickets registrados todavía.'));
        return;
      }

      tickets.forEach((ticket) => {
        listEl.appendChild(
          TicketCard(ticket, {
            onClick: (t) => navigate(`/tickets/${t.id}`),
          })
        );
      });
    } catch (err) {
      listEl.innerHTML = '';
      listEl.appendChild(el('div', { class: 'alert alert-danger' }, err.message));
    }
  }

  container.appendChild(
    el('div', {}, [
      Navbar({ active: 'tickets' }),
      el('main', { class: 'container py-4' }, [
        el('h1', { class: 'h3 mb-4' }, 'Tickets'),
        el('div', { class: 'row g-4' }, [
          el('div', { class: 'col-12 col-lg-8' }, [listEl]),
          el('div', { class: 'col-12 col-lg-4' }, [
            el('div', { class: 'card p-3' }, [form]),
          ]),
        ]),
      ]),
    ])
  );

  loadTickets();
}
