import { editStudent, deleteStudentAction } from "../controllers/studentController.js";

export function renderStudentTable(students) {
  const body = document.getElementById("studentsTableBody");
  body.innerHTML = "";

  if (!students || students.length === 0) return;

  students.forEach(s => {
    const row = document.createElement("tr");
    row.className = "border-b";

    row.innerHTML = `
      <td class="px-3 py-2 border text-left">${s.id}</td>
      <td class="px-3 py-2 border text-left">${s.name}</td>
      <td class="px-3 py-2 border text-left">${s.email}</td>
      <td class="px-3 py-2 border text-left">${s.course}</td>
      <td class="px-3 py-2 border text-left">${s.year}</td>
      <td class="px-3 py-2 border text-left">
        <button class="text-green-300" data-edit="${s.id}">Edit</button>
        <button class="text-yellow-300" data-delete="${s.id}">Delete</button>
      </td>
    `;

    row.querySelector("[data-edit]").onclick =
      () => editStudent(s.id);

    row.querySelector("[data-delete]").onclick =
      () => deleteStudentAction(s.id);

    body.appendChild(row);
  });
}
