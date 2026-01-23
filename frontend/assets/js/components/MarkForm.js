import { $ } from "../utils/dom.js";

export function resetForm() {
  $("markForm").reset();
  $("submitBtn").textContent = "Add Marks";
  $("cancelBtn").classList.add("hidden");
}

export function fillForm(mark) {
  $("student_id").value = mark.student_id;
  $("year").value = mark.year;
  $("core1").value = mark.core1;
  $("core2").value = mark.core2;
  $("core3").value = mark.core3;

  $("submitBtn").textContent = "Update Marks";
  $("cancelBtn").classList.remove("hidden");
}
