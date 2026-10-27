const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function apiRequest(path, options = {}, authenticated = false) {
  const token = authenticated ? localStorage.getItem('eventspark-token') : null;
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.error || `Request failed (${response.status}).`);
  }
  return payload;
}

export const getEvents = (authenticated = false) => apiRequest('/events', {}, authenticated);
export const getSchedule = () => apiRequest('/schedule');
export const getSpeakers = () => apiRequest('/speakers');
export const getFestivalInfo = () => apiRequest('/festival-info');
export const getSponsors = () => apiRequest('/sponsors');
