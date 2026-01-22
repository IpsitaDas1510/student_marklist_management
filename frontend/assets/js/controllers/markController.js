import { getAllMarks, createMark, updateMark, deleteMark } from "../services/markService.js";
import { renderMarkTable, initSearchSort } from "../components/MarkTable.js";
import { resetForm, fillForm } from "../components/MarkForm.js";
import { setState, getState } from "../state/store.js";
import { $ } from "../utils/dom.js";

export function initMarkController() {
  const params = new URLSearchParams(window.location.search);
  const yearParam = params.get("year");
  
  loadMarks(yearParam ? Number(yearParam) : null);
  
  // Initialize UI Listeners
  initSearchSort();

  $("markForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      student_id: Number($("student_id").value),
      year: Number($("year").value),
      core1: Number($("core1").value),
      core2: Number($("core2").value),
      core3: Number($("core3").value)
    };
    const { editingId } = getState();

    try {
      if (editingId) {
        await updateMark(editingId, data);
      } else {
        await createMark(data);
      }
      setState({ editingId: null });
      resetForm();
      loadMarks();
    } catch (error) {
      alert(error.message || "Error saving mark.");
    }
  });

  $("cancelBtn").onclick = () => {
    setState({ editingId: null });
    resetForm();
  };
}

async function loadMarks(filterYear = null) {
  const marks = await getAllMarks();
  const filtered = (filterYear === null)
    ? marks
    : marks.filter(m => String(m.year) === String(filterYear) || String(m.student_year) === String(filterYear));
  
  setState({ marks: filtered });
  // Pass true to mark this as the master dataset
  renderMarkTable(filtered, true);
}

export function editMark(mark) {
  setState({ editingId: mark.id });
  fillForm(mark);
}

export async function deleteMarkAction(id) {
  if (!confirm("Delete mark?")) return;
  await deleteMark(id);
  loadMarks();
}