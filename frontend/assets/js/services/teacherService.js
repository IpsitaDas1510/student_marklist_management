const API_URL = window.API_BASE_URL + "/teachers";

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// GET all teachers
export async function getAllTeachers() {
  const res = await fetch(API_URL);
  return res.ok ? safeJson(res) : [];
}

// GET single teacher
export async function getTeacher(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.ok ? safeJson(res) : null;
}

// CREATE teacher
export function createTeacher(data) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

// UPDATE teacher
export function updateTeacher(id, data) {
  return fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

// DELETE teacher
export function deleteTeacher(id) {
  return fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
}
