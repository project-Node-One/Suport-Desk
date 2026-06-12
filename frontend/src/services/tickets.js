import { apiRequest } from './api.js';

export async function getTickets() {
  return apiRequest('/tickets');
}

export async function getTicket(id) {
  return apiRequest(`/tickets/${id}`);
}

export async function createTicket({ title, description, priority }) {
  return apiRequest('/tickets', {
    method: 'POST',
    body: { title, description, priority },
  });
}

export async function updateTicket(id, payload) {
  return apiRequest(`/tickets/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export async function deleteTicket(id) {
  return apiRequest(`/tickets/${id}`, { method: 'DELETE' });
}

export async function addComment(id, content) {
  return apiRequest(`/tickets/${id}/comments`, {
    method: 'POST',
    body: { content },
  });
}

export async function getMetrics() {
  return apiRequest('/tickets/metrics');
}
