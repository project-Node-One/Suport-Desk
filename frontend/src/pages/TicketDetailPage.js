import { el, Navbar, Badge } from '../components/ui.js';
import { getTicket, updateTicket, deleteTicket, addComment } from '../services/tickets.js';
import { navigate } from '../router/router.js';

export async function TicketDetailPage(container, params) {
  const { id } = params;

  const wrapper = el('div', {}, [el('p', { class: 'text-muted' }, 'Cargando ticket...')]);

  container.appendChild(
    el('div', {}, [
      Navbar({ active: 'tickets' }),
      el('main', { class: 'container py-4' }, [wrapper]),
    ])
  );

  async function load() {
    try {
      const ticket = await getTicket(id);
      render(ticket);
    } catch (err) {
      wrapper.innerHTML = '';
      wrapper.appendChild(el('div', { class: 'alert alert-danger' }, err.message));
    }
  }

  function render(ticket) {
    wrapper.innerHTML = '';

    const errorBox = el('div', { class: 'alert alert-danger', style: 'display:none' }, '');

    // Formulario de edición
    const editForm = el(
      'form',
      {
        onSubmit: async (e) => {
          e.preventDefault();
          errorBox.style.display = 'none';

          const title = editForm.querySelector('#edit-title').value.trim();
          const description = editForm.querySelector('#edit-description').value.trim();
          const status = editForm.querySelector('#edit-status').value;
          const priority = editForm.querySelector('#edit-priority').value;

          try {
            const updated = await updateTicket(id, { title, description, status, priority });
            render(updated);
          } catch (err) {
            errorBox.textContent = err.message;
            errorBox.style.display = 'block';
          }
        },
      },
      [
        el('h2', { class: 'h5 mb-3' }, 'Editar ticket'),

        el('div', { class: 'mb-3' }, [
          el('label', { for: 'edit-title', class: 'form-label' }, 'Título'),
          el('input', { type: 'text', id: 'edit-title', class: 'form-control', value: ticket.title, required: true }),
        ]),

        el('div', { class: 'mb-3' }, [
          el('label', { for: 'edit-description', class: 'form-label' }, 'Descripción'),
          el('textarea', { id: 'edit-description', class: 'form-control', rows: '3', required: true }, ticket.description),
        ]),

        el('div', { class: 'row' }, [
          el('div', { class: 'col-6 mb-3' }, [
            el('label', { for: 'edit-status', class: 'form-label' }, 'Estado'),
            el('select', { id: 'edit-status', class: 'form-select' }, [
              el('option', { value: 'abierto', selected: ticket.status === 'abierto' }, 'Abierto'),
              el('option', { value: 'en_proceso', selected: ticket.status === 'en_proceso' }, 'En proceso'),
              el('option', { value: 'cerrado', selected: ticket.status === 'cerrado' }, 'Cerrado'),
            ]),
          ]),
          el('div', { class: 'col-6 mb-3' }, [
            el('label', { for: 'edit-priority', class: 'form-label' }, 'Prioridad'),
            el('select', { id: 'edit-priority', class: 'form-select' }, [
              el('option', { value: 'baja', selected: ticket.priority === 'baja' }, 'Baja'),
              el('option', { value: 'media', selected: ticket.priority === 'media' }, 'Media'),
              el('option', { value: 'alta', selected: ticket.priority === 'alta' }, 'Alta'),
            ]),
          ]),
        ]),

        errorBox,

        el('div', { class: 'd-flex gap-2' }, [
          el('button', { type: 'submit', class: 'btn btn-primary' }, 'Guardar cambios'),
          el(
            'button',
            {
              type: 'button',
              class: 'btn btn-outline-danger',
              onClick: async () => {
                if (confirm('¿Eliminar este ticket?')) {
                  await deleteTicket(id);
                  navigate('/tickets');
                }
              },
            },
            'Eliminar ticket'
          ),
        ]),
      ]
    );

    // Sección de comentarios
    const commentsList = el(
      'ul',
      { class: 'list-group comments-list mb-3' },
      (ticket.comments || []).map((c) =>
        el('li', { class: 'list-group-item comment-item mb-2' }, [
          el('p', { class: 'mb-1' }, c.content),
          el('small', { class: 'text-muted' }, new Date(c.createdAt).toLocaleString()),
        ])
      )
    );

    if (!ticket.comments || ticket.comments.length === 0) {
      commentsList.appendChild(el('li', { class: 'list-group-item text-muted text-center' }, 'Sin comentarios todavía.'));
    }

    const commentForm = el(
      'form',
      {
        class: 'd-flex gap-2',
        onSubmit: async (e) => {
          e.preventDefault();
          const input = commentForm.querySelector('#comment-content');
          const content = input.value.trim();
          if (!content) return;

          try {
            const updated = await addComment(id, content);
            render(updated);
          } catch (err) {
            errorBox.textContent = err.message;
            errorBox.style.display = 'block';
          }
        },
      },
      [
        el('input', { type: 'text', id: 'comment-content', class: 'form-control', placeholder: 'Escribe una nota interna...' }),
        el('button', { type: 'submit', class: 'btn btn-primary' }, 'Comentar'),
      ]
    );

    wrapper.appendChild(
      el('div', { class: 'row g-4' }, [
        el('div', { class: 'col-12 col-lg-8' }, [
          el('a', { href: '#/tickets', class: 'd-inline-block mb-3' }, '← Volver a tickets'),
          el('div', { class: 'd-flex justify-content-between align-items-center mb-2' }, [
            el('h1', { class: 'h3 mb-0' }, ticket.title),
            Badge(ticket.status?.replace('_', ' '), 'default'),
          ]),
          el('p', { class: 'text-muted' }, ticket.description),
          el('div', { class: 'card p-3' }, [editForm]),
        ]),
        el('div', { class: 'col-12 col-lg-4' }, [
          el('div', { class: 'card p-3' }, [
            el('h2', { class: 'h5 mb-3' }, 'Comentarios internos'),
            commentsList,
            commentForm,
          ]),
        ]),
      ])
    );
  }

  load();
}
