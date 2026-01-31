from datetime import datetime
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse
import os

from controllers.students import (
    get_all_students,
    get_student,
    create_student,
    update_student,
    delete_student,
)

from controllers.teachers import (
    get_all_teachers,
    get_teacher,
    create_teacher,
    update_teacher,
    delete_teacher,
)

from controllers.marks_handlers import (
    add_mark,
    get_marks_by_student,
    get_marks_by_student_with_student,
    get_all_marks,
    get_all_marks_with_students,
    update_mark,
    delete_mark,
)

from core.static import serve_static
from core.responses import send_404
from core.middleware import add_cors_headers


def handle_ui_routes(handler, path):
    """
    SPA + Static file handler
    """

    # -------- STATIC FILES --------
    if path.startswith("/frontend/"):
        serve_static(handler, path.lstrip("/"))
        return True

    if path == "/openapi.yaml":
        serve_static(handler, "openapi.yaml")
        return True

    # -------- SPA FALLBACK --------
    # Any non-API route should return index.html
    if not path.startswith("/api/"):
        serve_static(handler, "frontend/pages/index.html")
        return True

    return False


class StudentRouter(BaseHTTPRequestHandler):

    # -------- CORS --------
    def do_OPTIONS(self):
        self.send_response(200)
        add_cors_headers(self)
        self.end_headers()

    # -------- GET --------
    def do_GET(self):
        path = urlparse(self.path).path

        # Handle frontend routes FIRST
        if handle_ui_routes(self, path):
            return

        # --------------------
        # STUDENTS
        # --------------------
        if path == "/api/students":
            return get_all_students(self)

        if path.startswith("/api/students/"):
            try:
                return get_student(self, int(path.split("/")[-1]))
            except ValueError:
                return send_404(self)

        # --------------------
        # TEACHERS
        # --------------------
        if path == "/api/teachers":
            return get_all_teachers(self)

        if path.startswith("/api/teachers/"):
            try:
                return get_teacher(self, int(path.split("/")[-1]))
            except ValueError:
                return send_404(self)

        # --------------------
        # MARKS
        # --------------------
        if path == "/api/marks":
            return get_all_marks(self)

        if path == "/api/marks_with_students":
            return get_all_marks_with_students(self)

        if path.startswith("/api/marks/student/"):
            try:
                student_id = int(path.split("/")[-1])
                return get_marks_by_student(self, student_id)
            except ValueError:
                return send_404(self)

        if path.startswith("/api/marks/student_with/"):
            try:
                student_id = int(path.split("/")[-1])
                return get_marks_by_student_with_student(self, student_id)
            except ValueError:
                return send_404(self)

        return send_404(self)

    # -------- POST --------
    def do_POST(self):
        if self.path == "/api/students":
            return create_student(self)

        if self.path == "/api/teachers":
            return create_teacher(self)

        if self.path == "/api/marks":
            return add_mark(self)

        return send_404(self)

    # -------- PUT --------
    def do_PUT(self):
        if self.path.startswith("/api/students/"):
            return update_student(self, int(self.path.split("/")[-1]))

        if self.path.startswith("/api/teachers/"):
            return update_teacher(self, int(self.path.split("/")[-1]))

        if self.path.startswith("/api/marks/"):
            return update_mark(self, int(self.path.split("/")[-1]))

        return send_404(self)

    # -------- DELETE --------
    def do_DELETE(self):
        if self.path.startswith("/api/students/"):
            return delete_student(self, int(self.path.split("/")[-1]))

        if self.path.startswith("/api/teachers/"):
            return delete_teacher(self, int(self.path.split("/")[-1]))

        if self.path.startswith("/api/marks/"):
            return delete_mark(self, int(self.path.split("/")[-1]))

        return send_404(self)

    # -------- LOGGING --------
    def log_message(self, format, *args):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [Server] {format % args}")