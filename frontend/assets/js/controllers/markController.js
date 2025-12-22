import {
  getAllMarks,
  getMark,
  createMark,
  updateMark,
  deleteMark
} from "../services/markService.js";

import { renderMarkTable } from "../components/MarkTable.js";
import { resetForm, fillForm } from "../components/MarkForm.js";
import { setState, getState } from "../state/store.js";
import { $ } from "../utils/dom.js";

export function initMarkController() {
  loadMarks();

  $("markForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      student_id: $("student_id").value.trim(),
      subject: $("subject").value.trim(),
      year: $("year").value.trim(),
      marks: $("marks").value.trim()
    };

    const { editingId } = getState();

    editingId
      ? await updateMark(editingId, data)
      : await createMark(data);

    resetForm();
    setState({ editingId: null });
    loadMarks();
  });

  $("cancelBtn").onclick = () => {
    resetForm();
    setState({ editingId: null });
  };
}

async function loadMarks() {
  const marks = await getAllMarks();
  setState({ marks });
  renderMarkTable(marks);
}

export async function editMark(id) {
  const mark = await getMark(id);
  setState({ editingId: id });
  fillForm(mark);
}

export async function deleteMarkAction(id) {
  if (!confirm("Delete this mark?")) return;
  await deleteMark(id);
  loadMarks();
}
