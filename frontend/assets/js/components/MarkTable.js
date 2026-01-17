// import { editMark, deleteMarkAction } from "../controllers/markController.js";

// export function renderMarkTable(marks) {
//   const body = document.getElementById("marksTableBody");
//   body.innerHTML = "";

//   if (!marks.length) return;

//   marks.forEach(mark => {
//     const tr = document.createElement("tr");
//     tr.innerHTML = `
//       <td class="border px-3 py-2">${mark.id}</td>
//       <td class="border px-3 py-2">${mark.student_id}</td>
//       <td class="border px-3 py-2">${mark.year}</td>
//       <td class="border px-3 py-2">${mark.subject}</td>
//       <td class="border px-3 py-2">${mark.marks}</td>
//       <td class="border px-3 py-2 space-x-2">
//         <button class="text-blue-600 edit-btn">Edit</button>
//         <button class="text-red-600 delete-btn">Delete</button>
//       </td>
//     `;

//     tr.querySelector(".edit-btn").onclick = () => editMark(mark);
//     tr.querySelector(".delete-btn").onclick = () => deleteMarkAction(mark.id);

//     body.appendChild(tr);
//   });
// }









import { editMark, deleteMarkAction } from "../controllers/markController.js";

export function renderMarkTable(marks) {
  const body = document.getElementById("marksTableBody");
  body.innerHTML = "";

  if (!marks.length) return;

  marks.forEach(mark => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="border px-3 py-2">${mark.id}</td>
      <td class="border px-3 py-2">${mark.student_id}</td>
      <td class="border px-3 py-2">${mark.year}</td>
      <td class="border px-3 py-2">${mark.core1}</td>
      <td class="border px-3 py-2">${mark.core2}</td>
      <td class="border px-3 py-2">${mark.core3}</td>
      <td class="border px-3 py-2">${mark.total}</td>
      <td class="border px-3 py-2">${mark.percentage}%</td>
      <td class="border px-3 py-2 space-x-2">
        <button class="text-green-300 edit-btn">Edit</button>
        <button class="text-yellow-300 delete-btn">Delete</button>
      </td>
    `;

    // Attach button actions
    tr.querySelector(".edit-btn").onclick = () => editMark(mark);
    tr.querySelector(".delete-btn").onclick = () => deleteMarkAction(mark.id);

    body.appendChild(tr);
  });
}
