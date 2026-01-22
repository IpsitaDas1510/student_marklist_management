import { editStudent, deleteStudentAction } from "../controllers/studentController.js";

// Master copy of data for local filtering without re-fetching from API
let masterData = [];

/**
 * Renders the student table rows.
 * @param {Array} students - The array of student objects to display.
 * @param {Boolean} isInitialLoad - If true, updates the masterData reference.
 */
export function renderStudentTable(students, isInitialLoad = false) {
  if (isInitialLoad) {
    masterData = students;
  }

  const body = document.getElementById("studentsTableBody");
  if (!body) return;

  body.innerHTML = "";

  // Handle Empty State
  if (!students || students.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-10 text-gray-400 italic border border-white/10">
          No students found matching your criteria.
        </td>
      </tr>`;
    return;
  }

  // Render Rows
  students.forEach(s => {
    const row = document.createElement("tr");
    row.className = "border-b border-white/10 hover:bg-white/5 transition-colors";
    
    row.innerHTML = `
      <td class="px-3 py-2 border border-white/10 text-left">${s.id}</td>
      <td class="px-3 py-2 border border-white/10 text-left font-medium">${s.name}</td>
      <td class="px-3 py-2 border border-white/10 text-left text-gray-300">${s.email}</td>
      <td class="px-3 py-2 border border-white/10 text-left">${s.course}</td>
      <td class="px-3 py-2 border border-white/10 text-left">${s.year}</td>
      <td class="px-3 py-2 border border-white/10 text-left">
        <div class="flex gap-3">
          <button class="text-green-300 hover:text-green-500 transition-colors" data-edit="${s.id}">
            Edit
          </button>
          <button class="text-yellow-300 hover:text-yellow-500 transition-colors" data-delete="${s.id}">
            Delete
          </button>
        </div>
      </td>
    `;

    // Attach Event Listeners
    row.querySelector(`[data-edit="${s.id}"]`).onclick = () => editStudent(s.id);
    row.querySelector(`[data-delete="${s.id}"]`).onclick = () => deleteStudentAction(s.id);
    
    body.appendChild(row);
  });
}

/**
 * Initializes listeners for search input and sort dropdown.
 */
export function initSearchSort() {
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  if (!searchInput || !sortSelect) {
    console.warn("Search or Sort elements not found in DOM.");
    return;
  }

  const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const sortBy = sortSelect.value;

    // 1. Filter Logic
    let filtered = masterData.filter(s =>
      s.name.toLowerCase().includes(searchTerm) ||
      s.email.toLowerCase().includes(searchTerm) ||
      s.course.toLowerCase().includes(searchTerm) ||
      String(s.id).includes(searchTerm)
    );

    // 2. Sort Logic
    if (sortBy === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'id-asc') {
      filtered.sort((a, b) => a.id - b.id);
    }

    // 3. Re-render (passing false to preserve masterData)
    renderStudentTable(filtered, false);
  };

  // Attach Listeners
  searchInput.oninput = applyFilters;
  sortSelect.onchange = applyFilters;
}
