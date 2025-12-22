import { editMark, deleteMarkAction } from "../controllers/markController.js";

export function renderMarkTable(marks) {
  const body = document.getElementById("marksTableBody");
  const noMarks = document.getElementById("noMarks");

  body.innerHTML = "";

  if (!marks || marks.length === 0) {
    noMarks.classList.remove("hidden");
    return;
  }

  noMarks.classList.add("hidden");

  marks.forEach(m => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="border px-3 py-2">${m.id}</td>
      <td class="border px-3 py-2">${m.student_id}</td>
      <td class="border px-3 py-2">${m.subject}</td>
      <td class="border px-3 py-2">${m.year}</td>
      <td class="border px-3 py-2">${m.marks}</td>
      <td class="border px-3 py-2 space-x-2">
        <button class="text-blue-600" data-edit="${m.id}">Edit</button>
        <button class="text-red-600" data-delete="${m.id}">Delete</button>
      </td>
    `;
    body.appendChild(tr);
  });

  body.querySelectorAll("[data-edit]").forEach(btn =>
    btn.onclick = () => editMark(btn.dataset.edit)
  );

  body.querySelectorAll("[data-delete]").forEach(btn =>
    btn.onclick = () => deleteMarkAction(btn.dataset.delete)
  );
}
