import { initStudentController } from "../controllers/studentController.js";
import { initTeacherController } from "../controllers/teacherController.js";

async function loadView(path) {
  const res = await fetch(path);
  const html = await res.text();
  document.getElementById("app").innerHTML = html;
}

export async function router() {
  const path = window.location.pathname;
  console.log("PATH:", path); // debug

  // HOME
  if (
    path === "/" ||
    path === "/home" ||
    path.endsWith("index.html")
  ) {
    await loadView("/frontend/pages/home.html");
  }

  // STUDENTS
  else if (path === "/students") {
    await loadView("/frontend/pages/students.html");
    initStudentController();
  }
  //TEACHERS
  else if (path === "/teachers") {
    await loadView("/frontend/pages/teachers.html");
    initTeacherController();
  }

  // FALLBACK
  else {
    await loadView("/frontend/pages/404.html");
  }
}

export function initRouterEvents() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-link]");
    if (!link) return;

    e.preventDefault();
    history.pushState(null, "", link.getAttribute("href"));
    router();
  });

  window.addEventListener("popstate", router);
}
