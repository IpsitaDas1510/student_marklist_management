import { $ } from "../utils/dom.js";

// Reset form to default (Add mode)
export function resetForm() {
  $("markForm").reset();

  // Change submit button text
  $("submitBtn").textContent = "Add Mark";

  // Hide cancel button
  $("cancelBtn").style.display = "none";
}

// Fill form for edit mode
export function fillForm(mark) {
  $("student_id").value = mark.student_id;
  $("subject").value = mark.subject;
  $("year").value = mark.year;
  $("marks").value = mark.marks;

  // Change submit button text
  $("submitBtn").textContent = "Update Mark";

  // Show cancel button
  $("cancelBtn").style.display = "inline-block";
}
