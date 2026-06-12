// Helpers para crear componentes reutilizables en JS vanilla + Bootstrap

// Crea un elemento con atributos y contenido
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);

  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'class') {
      node.className = value;
    } else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value === false || value === undefined || value === null) {
      // skip
    } else {
      node.setAttribute(key, value === true ? '' : value);
    }
  });

  (Array.isArray(children) ? children : [children]).forEach((child) => {
    if (typeof child === 'string') {
      node.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      node.appendChild(child);
    }
  });

  return node;
}

// Componente: barra de navegación (Bootstrap navbar)
export function Navbar({ active = '' } = {}) {
  const links = [
    { href: '#/tickets', label: 'Tickets', key: 'tickets' },
    { href: '#/dashboard', label: 'Dashboard', key: 'dashboard' },
  ];

  return el('nav', { class: 'navbar navbar-expand-lg border-bottom' }, [
    el('div', { class: 'container-fluid' }, [
      el('a', { class: 'navbar-brand', href: '#/tickets' }, 'AI Support Desk'),
      el('button', {
        class: 'navbar-toggler',
        type: 'button',
        'data-bs-toggle': 'collapse',
        'data-bs-target': '#navbarNav',
      }, el('span', { class: 'navbar-toggler-icon' })),
      el('div', { class: 'collapse navbar-collapse', id: 'navbarNav' }, [
        el(
          'ul',
          { class: 'navbar-nav me-auto' },
          links.map((link) =>
            el('li', { class: 'nav-item' }, [
              el(
                'a',
                {
                  class: `nav-link${active === link.key ? ' active' : ''}`,
                  href: link.href,
                },
                link.label
              ),
            ])
          )
        ),
        el('button', { class: 'btn btn-outline-secondary', id: 'logout-btn' }, 'Salir'),
      ]),
    ]),
  ]);
}

// Componente: badge de estado o prioridad
export function Badge(text, variant = 'default') {
  return el('span', { class: `badge rounded-pill badge-${variant}` }, text);
}

// Componente: tarjeta de ticket (resumen)
export function TicketCard(ticket, { onClick } = {}) {
  const statusVariant = {
    abierto: 'open',
    en_proceso: 'progress',
    cerrado: 'closed',
  }[ticket.status] || 'default';

  const priorityVariant = {
    alta: 'high',
    media: 'medium',
    baja: 'low',
  }[ticket.priority] || 'default';

  return el(
    'div',
    {
      class: 'card ticket-card mb-3',
      onClick: () => onClick && onClick(ticket),
    },
    [
      el('div', { class: 'card-body' }, [
        el('div', { class: 'd-flex justify-content-between align-items-start gap-2' }, [
          el('h5', { class: 'card-title mb-1' }, ticket.title),
          Badge(ticket.priority, priorityVariant),
        ]),
        el('p', { class: 'card-text text-muted ticket-card-desc' }, ticket.description),
        el('div', { class: 'd-flex justify-content-between align-items-center' }, [
          Badge(ticket.status?.replace('_', ' '), statusVariant),
          el('small', { class: 'text-muted' }, new Date(ticket.createdAt).toLocaleDateString()),
        ]),
      ]),
    ]
  );
}
