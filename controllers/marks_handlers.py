from core.responses import send_json, send_404
from core.request import parse_json_body
from services.mark_service import (
    service_add_mark,
    service_get_marks_by_student,
    service_get_marks_by_student_with_student,
    service_update_mark,
    service_delete_mark,
    service_get_all_marks,
    service_get_all_marks_with_students,
)


def add_mark(handler):
    data = parse_json_body(handler)

    # ---- validation (controller-level, light) ----
    required_fields = ["student_id", "core1", "core2", "core3"]
    for field in required_fields:
        if field not in data:
            return send_json(handler, 400, {"error": f"Missing field: {field}"})

    try:
        data["core1"] = int(data["core1"])
        data["core2"] = int(data["core2"])
        data["core3"] = int(data["core3"])
    except ValueError:
        return send_json(handler, 400, {"error": "Marks must be integers"})

    for m in [data["core1"], data["core2"], data["core3"]]:
        if m < 0 or m > 100:
            return send_json(handler, 400, {"error": "Marks must be between 0 and 100"})

    mark = service_add_mark(data)
    return send_json(handler, 201, mark)


def get_marks_by_student(handler, student_id):
    marks = service_get_marks_by_student(student_id)
    return send_json(handler, 200, marks) if marks else send_404(handler)


def get_marks_by_student_with_student(handler, student_id):
    marks = service_get_marks_by_student_with_student(student_id)
    return send_json(handler, 200, marks) if marks else send_404(handler)


def update_mark(handler, mark_id):
    data = parse_json_body(handler)
    for field in ["core1", "core2", "core3"]:
        if field in data:
            try:
                value = int(data[field])
                if value < 0 or value > 100:
                    return send_json(handler, 400, {"error": "Marks must be between 0 and 100"})
                data[field] = value
            except ValueError:
                return send_json(handler, 400, {"error": "Marks must be integers"})

    updated = service_update_mark(mark_id, data)
    return send_json(handler, 200, updated) if updated else send_404(handler)


def delete_mark(handler, mark_id):
    deleted = service_delete_mark(mark_id)
    return send_json(handler, 200, {"deleted": True}) if deleted else send_404(handler)


def get_all_marks(handler):
    return send_json(handler, 200, service_get_all_marks())


def get_all_marks_with_students(handler):
    return send_json(handler, 200, service_get_all_marks_with_students())
