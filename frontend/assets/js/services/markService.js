// services/markService.js

const API_URL = "/api/marks";

// Safely parse JSON
async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// Fetch all marks
export async function getAllMarks() {
  const res = await fetch(API_URL);
  return res.ok ? safeJson(res) : [];
}

// Create a new mark
export function createMark(data) {
  // data should include: student_id, year, core1, core2, core3
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// Update an existing mark
export function updateMark(id, data) {
  // data should include: student_id, year, core1, core2, core3
  return fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// Delete a mark
export function deleteMark(id) {
  return fetch(`${API_URL}/${id}`, { method: "DELETE" });
}