import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent
} from "../services/studentService.js";

export async function initStudentController() {
  const form = document.getElementById("studentForm");
  const tableBody = document.getElementById("studentsTableBody");
  const spinner = document.getElementById("loadingSpinner");
  const tableContainer = document.getElementById("studentsTableContainer");
  const noStudents = document.getElementById("noStudents");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const courseInput = document.getElementById("course");
  const yearInput = document.getElementById("year");

  const submitBtn = document.getElementById("submitBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  let editingId = null;

  // ================= LOAD STUDENTS =================
  async function loadStudents() {
    spinner.classList.remove("hidden");
    tableContainer.classList.add("hidden");

    const students = await getAllStudents();

    tableBody.innerHTML = "";

    if (!students || students.length === 0) {
      spinner.classList.add("hidden");
      noStudents.classList.remove("hidden");
      tableContainer.classList.remove("hidden");
      return;
    }

    noStudents.classList.add("hidden");

    students.forEach((s) => {
      tableBody.innerHTML += `
        <tr class="border-b">
          <td class="px-3 py-2">${s.id}</td>
          <td class="px-3 py-2">${s.name}</td>
          <td class="px-3 py-2">${s.email}</td>
          <td class="px-3 py-2">${s.course}</td>
          <td class="px-3 py-2">${s.year}</td>
          <td class="px-3 py-2 space-x-2">
            <button
              class="editBtn text-blue-600"
              data-id="${s.id}">
              Edit
            </button>
            <button
              class="deleteBtn text-red-600"
              data-id="${s.id}">
              Delete
            </button>
          </td>
        </tr>
      `;
    });

    spinner.classList.add("hidden");
    tableContainer.classList.remove("hidden");

    attachEditEvents();
    attachDeleteEvents();
  }

  // ================= ADD / UPDATE =================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const student = {
      name: nameInput.value,
      email: emailInput.value,
      course: courseInput.value,
      year: yearInput.value
    };

    if (editingId) {
      await updateStudent(editingId, student);
      editingId = null;
      submitBtn.textContent = "Add Student";
      cancelBtn.classList.add("hidden");
    } else {
      await createStudent(student);
    }

    form.reset();
    loadStudents();
  });

  // ================= EDIT =================
  function attachEditEvents() {
    document.querySelectorAll(".editBtn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.closest("tr");

        editingId = btn.dataset.id;

        nameInput.value = row.children[1].textContent;
        emailInput.value = row.children[2].textContent;
        courseInput.value = row.children[3].textContent;
        yearInput.value = row.children[4].textContent;

        submitBtn.textContent = "Update Student";
        cancelBtn.classList.remove("hidden");
      });
    });
  }

  // ================= DELETE =================
  function attachDeleteEvents() {
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;

        if (!confirm("Delete this student?")) return;

        await deleteStudent(id);
        loadStudents();
      });
    });
  }

  // ================= CANCEL EDIT =================
  cancelBtn.addEventListener("click", () => {
    editingId = null;
    form.reset();
    submitBtn.textContent = "Add Student";
    cancelBtn.classList.add("hidden");
  });

  // INIT
  loadStudents();
}
