import {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
} from "../services/studentService.js";

import { renderStudentTable } from "../components/StudentTable.js";
import { setState, getState } from "../state/store.js";
import { $ } from "../utils/dom.js";

export function initStudentController() {
  loadStudents();

  $("studentForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: $("name").value.trim(),
      email: $("email").value.trim(),
      course: $("course").value.trim(),
      year: $("year").value.trim()
    };

    const { editingId } = getState();

    if (editingId) {
      await updateStudent(editingId, data);
      setState({ editingId: null });
    } else {
      await createStudent(data);
    }

    $("studentForm").reset();
    $("cancelBtn").classList.add("hidden");
    loadStudents();
  });

  $("cancelBtn").onclick = () => {
    setState({ editingId: null });
    $("studentForm").reset();
    $("cancelBtn").classList.add("hidden");
  };
}

async function loadStudents() {
  const students = await getAllStudents();
  setState({ students });
  renderStudentTable(students);
}

export async function editStudent(id) {
  const student = await getStudent(id);
  setState({ editingId: id });

  $("name").value = student.name;
  $("email").value = student.email;
  $("course").value = student.course;
  $("year").value = student.year;

  $("cancelBtn").classList.remove("hidden");
}

export async function deleteStudentAction(id) {
  if (!confirm("Delete student?")) return;
  await deleteStudent(id);
  loadStudents();
}
