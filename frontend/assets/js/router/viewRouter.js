let isRouting = false;

async function loadView(htmlPath) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const res = await fetch(htmlPath);
  if (!res.ok) {
    console.error("Failed to load view:", htmlPath);
    return;
  }

  const html = await res.text();
  app.innerHTML = html;
}

export async function router() {
  if (isRouting) return; // 🔥 PREVENT DOUBLE EXECUTION
  isRouting = true;

  const path = window.location.pathname;
  console.log("Navigating to:", path);

  try {
    // HOME
    if (path === "/" || path === "/home" || path.endsWith("index.html")) {
      await loadView("/frontend/pages/home.html");
      return;
    }

    // STUDENTS
    if (path === "/students") {
      await loadView("/frontend/pages/students.html");
      const { initStudentController } = await import(
        "../controllers/studentController.js"
      );
      initStudentController();
      return;
    }

    // TEACHERS
    if (path === "/teachers") {
      await loadView("/frontend/pages/teachers.html");
      const { initTeacherController } = await import(
        "../controllers/teacherController.js"
      );
      initTeacherController();
      return;
    }

    // MARKS
    if (path === "/marks") {
      await loadView("/frontend/pages/marks.html");
      const { initMarkController } = await import(
        "../controllers/markController.js"
      );
      initMarkController();
      return;
    }

    // REPORT CARD (JOIN)
    if (path === "/student-marks-join") {
      await loadView("/frontend/pages/student-marks-join.html");
      const { initStudentMarksJoin } = await import(
        "../controllers/studentMarksJoinController.js"
      );
      await initStudentMarksJoin();
      return;
    }

    // STUDENT PROFILE
    if (path === "/student-profile") {
      await loadView("/frontend/pages/student-profile.html");
      const { initStudentProfile } = await import(
        "../controllers/studentProfileController.js"
      );
      await initStudentProfile();
      return;
    }


    // FALLBACK
    await loadView("/frontend/pages/404.html");
  } finally {
    // 🔓 unlock after route completes
    setTimeout(() => {
      isRouting = false;
    }, 0);
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
