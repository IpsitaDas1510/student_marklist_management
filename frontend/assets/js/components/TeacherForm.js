import { $ } from "../utils/dom.js";

// Resets the input form to its default state for creating a new teacher
export function resetForm() {
  // Reset the HTML form
  $("teacherForm").reset();

  // Change submit button text back to "Add Teacher"
  $("submitBtn").textContent = "Add Teacher";

  // Hide cancel button (not editing)
  $("cancelBtn").style.display = "none";
}

// Populates the form fields with selected teacher data (edit mode)
export function fillForm(teacher) {
  $("name").value = teacher.name;
  $("email").value = teacher.email;
  $("subject").value = teacher.subject;

  // Change submit button text to "Update Teacher"
  $("submitBtn").textContent = "Update Teacher";

  // Show cancel button
  $("cancelBtn").style.display = "inline-block";
}