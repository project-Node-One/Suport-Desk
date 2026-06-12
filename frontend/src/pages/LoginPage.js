import { el } from '../components/ui.js';
import { login } from '../services/auth.js';
import { navigate } from '../router/router.js';

export function LoginPage(container) {
  const errorBox = el('div', { class: 'alert alert-danger', style: 'display:none' }, '');

  const form = el(
    'form',
    {
      onSubmit: async (e) => {
        e.preventDefault();
        errorBox.style.display = 'none';

        const email = form.querySelector('#email').value.trim();
        const password = form.querySelector('#password').value;

        try {
          await login(email, password);
          navigate('/tickets');
        } catch (err) {
          errorBox.textContent = err.message;
          errorBox.style.display = 'block';
        }
      },
    },
    [
      el('div', { class: 'mb-3' }, [
        el('label', { for: 'email', class: 'form-label' }, 'Correo electrónico'),
        el('input', { type: 'email', id: 'email', class: 'form-control', required: true, placeholder: 'tucorreo@ejemplo.com' }),
      ]),
      el('div', { class: 'mb-3' }, [
        el('label', { for: 'password', class: 'form-label' }, 'Contraseña'),
        el('input', { type: 'password', id: 'password', class: 'form-control', required: true, placeholder: '••••••••' }),
      ]),
      errorBox,
      el('button', { type: 'submit', class: 'btn btn-primary w-100' }, 'Iniciar sesión'),
    ]
  );

  container.appendChild(
    el('div', { class: 'auth-page card p-4 shadow-sm' }, [
      el('div', { class: 'card-body' }, [
        el('h1', { class: 'h3 mb-1' }, 'Iniciar sesión'),
        el('p', { class: 'text-muted mb-4' }, 'Accede a AI Support Desk'),
        form,
        el('p', { class: 'text-muted mt-3 mb-0' }, [
          '¿No tienes cuenta? ',
          el('a', { href: '#/register' }, 'Crear una cuenta'),
        ]),
      ]),
    ])
  );
}
