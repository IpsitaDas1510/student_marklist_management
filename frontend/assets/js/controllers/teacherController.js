import {
  getAllTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher
} from "../services/teacherService.js";

import { renderTeacherTable } from "../components/TeacherTable.js";
import { setState, getState } from "../state/store.js";
import { $ } from "../utils/dom.js";

export function initTeacherController() {
  loadTeachers();

  $("teacherForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: $("name").value.trim(),
      email: $("email").value.trim(),
      subject: $("subject").value.trim()
    };

    const { editingId } = getState();

    if (editingId) {
      await updateTeacher(editingId, data);
      setState({ editingId: null });
    } else {
      await createTeacher(data);
    }

    $("teacherForm").reset();
    $("cancelBtn").classList.add("hidden");
    loadTeachers();
  });

  $("cancelBtn").onclick = () => {
    setState({ editingId: null });
    $("teacherForm").reset();
    $("cancelBtn").classList.add("hidden");
  };
}

async function loadTeachers() {
  const teachers = await getAllTeachers();
  setState({ teachers });
  renderTeacherTable(teachers);
}

export async function editTeacher(id) {
  const teacher = await getTeacher(id);
  setState({ editingId: id });

  $("name").value = teacher.name;
  $("email").value = teacher.email;
  $("subject").value = teacher.subject;

  $("cancelBtn").classList.remove("hidden");
}

export async function deleteTeacherAction(id) {
  if (!confirm("Delete teacher?")) return;
  await deleteTeacher(id);
  loadTeachers();
}
