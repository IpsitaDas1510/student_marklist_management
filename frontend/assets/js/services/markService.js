const API_URL = window.API_BASE_URL + "/marks";

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// GET all marks
export async function getAllMarks() {
  const res = await fetch(API_URL);
  return res.ok ? safeJson(res) : [];
}

// GET one mark
export async function getMark(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.ok ? safeJson(res) : null;
}

// CREATE mark
export function createMark(data) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

// UPDATE mark
export function updateMark(id, data) {
  return fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

// DELETE mark
export function deleteMark(id) {
  return fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
}
