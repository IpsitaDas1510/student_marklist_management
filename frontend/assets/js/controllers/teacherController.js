import {
  getAllTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher
} from "../services/teacherService.js";

import { renderTeacherTable } from "../components/TeacherTable.js";
import { setState, getState } from "../state/store.js";

// initialize teacher page
export function initTeacherController() {
  loadTeachers();

  const teacherForm = document.getElementById("teacherForm");
  const cancelBtn = document.getElementById("cancelBtn");

  teacherForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      subject: document.getElementById("subject").value.trim()
    };

    const { editingId } = getState();

    if (editingId) {
      await updateTeacher(editingId, data);
    } else {
      await createTeacher(data);
    }

    setState({ editingId: null });
    teacherForm.reset();
    cancelBtn.classList.add("hidden");
    loadTeachers();
  });

  cancelBtn.addEventListener("click", () => {
    setState({ editingId: null });
    teacherForm.reset();
    cancelBtn.classList.add("hidden");
  });
}

// load all teachers
async function loadTeachers() {
  const teachers = await getAllTeachers();
  setState({ teachers });
  renderTeacherTable(teachers);
}

// edit teacher
export async function editTeacher(id) {
  const teacher = await getTeacher(id);
  setState({ editingId: id });

  document.getElementById("name").value = teacher.name;
  document.getElementById("email").value = teacher.email;
  document.getElementById("subject").value = teacher.subject;

  document.getElementById("cancelBtn").classList.remove("hidden");
}

// delete teacher
export async function deleteTeacherAction(id) {
  if (!confirm("Delete teacher?")) return;

  await deleteTeacher(id);
  loadTeachers();
}
