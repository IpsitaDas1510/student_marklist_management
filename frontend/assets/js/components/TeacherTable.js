import { deleteTeacherAction, editTeacher } from "../controllers/teacherController.js";

export function renderTeacherTable(teachers) {
  const body = document.getElementById("teachersTableBody");
  body.innerHTML = "";

  teachers.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="border px-3 py-2">${t.id}</td>
      <td class="border px-3 py-2">${t.name}</td>
      <td class="border px-3 py-2">${t.email}</td>
      <td class="border px-3 py-2">${t.subject}</td>
      <td class="border px-3 py-2 space-x-2">
        <button class="text-blue-600" data-edit="${t.id}">Edit</button>
        <button class="text-red-600" data-delete="${t.id}">Delete</button>
      </td>
    `;
    body.appendChild(tr);
  });

  body.querySelectorAll("[data-edit]").forEach(b =>
    b.onclick = () => editTeacher(b.dataset.edit)
  );

  body.querySelectorAll("[data-delete]").forEach(b =>
    b.onclick = () => deleteTeacherAction(b.dataset.delete)
  );
}
