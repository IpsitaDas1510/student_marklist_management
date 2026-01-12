import { editTeacher, deleteTeacherAction } from "../controllers/teacherController.js";

export function renderTeacherTable(teachers) {
  const body = document.getElementById("teachersTableBody");
  body.innerHTML = "";

  if (!teachers || teachers.length === 0) return;

  teachers.forEach(t => {
    const row = document.createElement("tr");
    row.className = "border-b";

    row.innerHTML = `
      <td class="px-3 py-2 border text-left">${t.id}</td>
      <td class="px-3 py-2 border text-left">${t.name}</td>
      <td class="px-3 py-2 border text-left">${t.email}</td>
      <td class="px-3 py-2 border text-left">${t.subject}</td>
      <td class="px-3 py-2 border text-left">
        <button class="text-blue-600" data-edit="${t.id}">Edit</button>
        <button class="text-red-600" data-delete="${t.id}">Delete</button>
      </td>
    `;

    row.querySelector("[data-edit]").onclick =
      () => editTeacher(t.id);

    row.querySelector("[data-delete]").onclick =
      () => deleteTeacherAction(t.id);

    body.appendChild(row);
  });
}
