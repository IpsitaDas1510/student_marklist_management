import { editMark, deleteMarkAction } from "../controllers/markController.js";

let masterData = [];

export function renderMarkTable(marks, isInitialLoad = false) {
  if (isInitialLoad) {
    masterData = marks;
  }

  const body = document.getElementById("marksTableBody");
  const noMarksMsg = document.getElementById("noMarks");
  
  if (!body) return;
  body.innerHTML = "";

  if (!marks || marks.length === 0) {
    if (noMarksMsg) noMarksMsg.classList.remove("hidden");
    return;
  } else {
    if (noMarksMsg) noMarksMsg.classList.add("hidden");
  }

  marks.forEach(mark => {
    const tr = document.createElement("tr");
    tr.className = "border-b border-white/10 hover:bg-white/5 transition";
    tr.innerHTML = `
      <td class="border border-white/10 px-3 py-2">${mark.id}</td>
      <td class="border border-white/10 px-3 py-2">${mark.student_id}</td>
      <td class="border border-white/10 px-3 py-2">${mark.year}</td>
      <td class="border border-white/10 px-3 py-2">${mark.core1}</td>
      <td class="border border-white/10 px-3 py-2">${mark.core2}</td>
      <td class="border border-white/10 px-3 py-2">${mark.core3}</td>
      <td class="border border-white/10 px-3 py-2 font-bold">${mark.total}</td>
      <td class="border border-white/10 px-3 py-2 text-indigo-300">${mark.percentage}%</td>
      <td class="border border-white/10 px-3 py-2 space-x-2">
        <button class="text-green-300 hover:text-green-500 edit-btn">Edit</button>
        <button class="text-yellow-300 hover:text-yellow-500 delete-btn">Delete</button>
      </td>
    `;

    tr.querySelector(".edit-btn").onclick = () => editMark(mark);
    tr.querySelector(".delete-btn").onclick = () => deleteMarkAction(mark.id);

    body.appendChild(tr);
  });
}

export function initSearchSort() {
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  if (!searchInput || !sortSelect) return;

  const applyFilters = () => {
    const searchTerm = searchInput.value.trim();
    const sortBy = sortSelect.value;

    // 1. Search Logic (Student ID)
    let filtered = masterData.filter(m => 
      String(m.student_id).includes(searchTerm)
    );

    // 2. Sort Logic
    if (sortBy === 'total-desc') {
      filtered.sort((a, b) => b.total - a.total);
    } else if (sortBy === 'perc-desc') {
      filtered.sort((a, b) => b.percentage - a.percentage);
    } else if (sortBy === 'id-asc') {
      filtered.sort((a, b) => a.id - b.id);
    }

    renderMarkTable(filtered, false);
  };

  searchInput.oninput = applyFilters;
  sortSelect.onchange = applyFilters;
}