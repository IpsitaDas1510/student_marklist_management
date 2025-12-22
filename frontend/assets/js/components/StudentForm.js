import { $ } from "../utils/dom.js";

// Resets the input form to its default state for creating a new student
export function resetForm() {
  // Reset the HTML form
  $("studentForm").reset();

  // Change submit button text back to "Add Student"
  $("submitBtn").textContent = "Add Student";

  // Hide cancel button (not editing)
  $("cancelBtn").style.display = "none";
}

// Populates the form fields with selected student data (edit mode)
export function fillForm(student) {
  $("name").value = student.name;
  $("email").value = student.email;
  $("course").value = student.course;
  $("year").value = student.year;

  // Change submit button text to "Update Student"
  $("submitBtn").textContent = "Update Student";

  // Show cancel button
  $("cancelBtn").style.display = "inline-block";
}
