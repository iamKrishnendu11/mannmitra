const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function parse(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

// get by user_email or current user (no auth required for ?user_email)
export async function getProgress({ user_email, accessToken } = {}) {
  const url = user_email ? `${API_BASE}/api/progress?user_email=${encodeURIComponent(user_email)}` : `${API_BASE}/api/progress`;
  const headers = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const res = await fetch(url, { method: 'GET', headers, credentials: 'include' });
  return parse(res);
}

// create progress (protected)
export async function createProgress(data, accessToken) {
  const res = await fetch(`${API_BASE}/api/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  return parse(res);
}

// update progress by id (protected)
export async function updateProgressById(id, updateData, accessToken) {
  const res = await fetch(`${API_BASE}/api/progress/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    credentials: 'include',
    body: JSON.stringify(updateData)
  });
  return parse(res);
}

// convenience: update by email
export async function updateProgressByEmail(user_email, updateData, accessToken) {
  const res = await fetch(`${API_BASE}/api/progress/email/${encodeURIComponent(user_email)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    credentials: 'include',
    body: JSON.stringify(updateData)
  });
  return parse(res);
}
