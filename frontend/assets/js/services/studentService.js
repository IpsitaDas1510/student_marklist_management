const API_BASE = window.API_BASE_URL; // from env.js

export async function getAllStudents() {
  const res = await fetch(`${API_BASE}/students`);
  return res.json();
}

export async function createStudent(student) {
  const res = await fetch(`${API_BASE}/students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(student)
  });

  return res.json();
}

export async function updateStudent(id, student) {
  const res = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });
  return res.json();
}

export async function deleteStudent(id) {
  await fetch(`${API_BASE_URL}/students/${id}`, {
    method: "DELETE"
  });
}
