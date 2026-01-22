import { editTeacher, deleteTeacherAction } from "../controllers/teacherController.js";

let masterData = [];

export function renderTeacherTable(teachers, isInitialLoad = false) {
  if (isInitialLoad) {
    masterData = teachers;
  }

  const body = document.getElementById("teachersTableBody");
  const noTeachersMsg = document.getElementById("noTeachers");
  
  if (!body) return;
  body.innerHTML = "";

  if (!teachers || teachers.length === 0) {
    if (noTeachersMsg) noTeachersMsg.classList.remove("hidden");
    return;
  } else {
    if (noTeachersMsg) noTeachersMsg.classList.add("hidden");
  }

  teachers.forEach(t => {
    const row = document.createElement("tr");
    row.className = "border-b border-white/10 hover:bg-white/5 transition";

    row.innerHTML = `
      <td class="px-3 py-2 border text-left">${t.id}</td>
      <td class="px-3 py-2 border text-left">${t.name}</td>
      <td class="px-3 py-2 border text-left">${t.email}</td>
      <td class="px-3 py-2 border text-left">${t.subject}</td>
      <td class="px-3 py-2 border text-left">
        <button class="text-green-300 hover:text-green-500 mr-2" data-edit="${t.id}">Edit</button>
        <button class="text-yellow-300 hover:text-yellow-500" data-delete="${t.id}">Delete</button>
      </td>
    `;

    row.querySelector(`[data-edit="${t.id}"]`).onclick = () => editTeacher(t.id);
    row.querySelector(`[data-delete="${t.id}"]`).onclick = () => deleteTeacherAction(t.id);

    body.appendChild(row);
  });
}

export function initSearchSort() {
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  if (!searchInput || !sortSelect) return;

  const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const sortBy = sortSelect.value;

    // Filter logic
    let filtered = masterData.filter(t => 
      t.name.toLowerCase().includes(searchTerm) || 
      t.email.toLowerCase().includes(searchTerm) ||
      t.subject.toLowerCase().includes(searchTerm)
    );

    // Sort logic
    if (sortBy === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'id-asc') {
      filtered.sort((a, b) => a.id - b.id);
    }

    renderTeacherTable(filtered, false);
  };

  searchInput.oninput = applyFilters;
  sortSelect.onchange = applyFilters;
}
