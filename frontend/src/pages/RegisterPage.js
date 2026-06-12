import { el } from '../components/ui.js';
import { register } from '../services/auth.js';
import { navigate } from '../router/router.js';

export function RegisterPage(container) {
  const errorBox = el('div', { class: 'alert alert-danger', style: 'display:none' }, '');

  const form = el(
    'form',
    {
      onSubmit: async (e) => {
        e.preventDefault();
        errorBox.style.display = 'none';

        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const password = form.querySelector('#password').value;

        try {
          await register(name, email, password);
          navigate('/login');
        } catch (err) {
          errorBox.textContent = err.message;
          errorBox.style.display = 'block';
        }
      },
    },
    [
      el('div', { class: 'mb-3' }, [
        el('label', { for: 'name', class: 'form-label' }, 'Nombre'),
        el('input', { type: 'text', id: 'name', class: 'form-control', required: true, placeholder: 'Tu nombre' }),
      ]),
      el('div', { class: 'mb-3' }, [
        el('label', { for: 'email', class: 'form-label' }, 'Correo electrónico'),
        el('input', { type: 'email', id: 'email', class: 'form-control', required: true, placeholder: 'tucorreo@ejemplo.com' }),
      ]),
      el('div', { class: 'mb-3' }, [
        el('label', { for: 'password', class: 'form-label' }, 'Contraseña'),
        el('input', { type: 'password', id: 'password', class: 'form-control', required: true, minlength: '6', placeholder: '••••••••' }),
      ]),
      errorBox,
      el('button', { type: 'submit', class: 'btn btn-primary w-100' }, 'Crear cuenta'),
    ]
  );

  container.appendChild(
    el('div', { class: 'auth-page card p-4 shadow-sm' }, [
      el('div', { class: 'card-body' }, [
        el('h1', { class: 'h3 mb-1' }, 'Crear cuenta'),
        el('p', { class: 'text-muted mb-4' }, 'Regístrate en AI Support Desk'),
        form,
        el('p', { class: 'text-muted mt-3 mb-0' }, [
          '¿Ya tienes cuenta? ',
          el('a', { href: '#/login' }, 'Inicia sesión'),
        ]),
      ]),
    ])
  );
}
