const API_URL = window.API_BASE_URL + "/students";

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// GET all students
export async function getAllStudents() {
  const res = await fetch(API_URL);
  return res.ok ? safeJson(res) : [];
}

// GET one student
export async function getStudent(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.ok ? safeJson(res) : null;
}

// CREATE student
export function createStudent(data) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

// UPDATE student
export function updateStudent(id, data) {
  return fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

// DELETE student
export function deleteStudent(id) {
  return fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
}
