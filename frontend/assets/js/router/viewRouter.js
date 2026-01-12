// import { initStudentController } from "../controllers/studentController.js";
// import { initTeacherController } from "../controllers/teacherController.js";
// import { initMarkController } from "../controllers/markController.js";


// async function loadView(path) {
//   const res = await fetch(path);
//   const html = await res.text();
//   document.getElementById("app").innerHTML = html;
// }

// export async function router() {
//   const path = window.location.pathname;
//   console.log("PATH:", path); // debug

//   // HOME
//   if (
//     path === "/" ||
//     path === "/home" ||
//     path.endsWith("index.html")
//   ) {
//     await loadView("/frontend/pages/home.html");
//   }

//   // STUDENTS
//   else if (path === "/students") {
//     await loadView("/frontend/pages/students.html");
//     initStudentController();
//   }
//   //TEACHERS
//   else if (path === "/teachers") {
//     await loadView("/frontend/pages/teachers.html");
//     initTeacherController();
//   }
//   //MARKS
//   else if (path === "/marks") {
//     await loadView("/frontend/pages/marks.html");
//     initMarkController();
//   }

//   // FALLBACK
//   else {
//     await loadView("/frontend/pages/404.html");
//   }
// }

// export function initRouterEvents() {
//   document.addEventListener("click", (e) => {
//     const link = e.target.closest("[data-link]");
//     if (!link) return;

//     e.preventDefault();
//     history.pushState(null, "", link.getAttribute("href"));
//     router();
//   });

//   window.addEventListener("popstate", router);
// }



import { initStudentController } from "../controllers/studentController.js";
import { initTeacherController } from "../controllers/teacherController.js";
import { initMarkController } from "../controllers/markController.js";

async function loadView(htmlPath) {
  const res = await fetch(htmlPath);
  if (!res.ok) {
    console.error("Failed to load view:", htmlPath);
    return;
  }
  const html = await res.text();
  document.getElementById("app").innerHTML = html;
}

export async function router() {
  const path = window.location.pathname;
  console.log("PATH:", path);

  // HOME
  if (path === "/" || path === "/home" || path.endsWith("index.html")) {
    await loadView("/frontend/pages/home.html");
    return;
  }

  // STUDENTS
  if (path === "/students") {
    await loadView("/frontend/pages/students.html");
    initStudentController();
    return;
  }

  // TEACHERS
  if (path === "/teachers") {
    await loadView("/frontend/pages/teachers.html");
    initTeacherController();
    return;
  }

  // MARKS
  if (path === "/marks") {
    await loadView("/frontend/pages/marks.html");
    initMarkController();
    return;
  }

  // STUDENT-MARKS-JOIN (report card)
  if (path === "/student-marks-join") {
    await loadView("/frontend/pages/student-marks-join.html");
    // dynamically import controller so it runs after HTML is injected
    try {
      await import("../controllers/studentMarksJoinController.js");
    } catch (err) {
      console.error("Failed to load studentMarksJoinController:", err);
    }
    return;
  }

  // FALLBACK
  await loadView("/frontend/pages/404.html");
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
