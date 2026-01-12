# # Handlers for Marklist (marks)

# import json
# from core.responses import send_json, send_404
# from core.request import parse_json_body
# from services.mark_service import (
#     service_add_mark,
#     service_get_marks_by_student,
#     service_update_mark,
#     service_delete_mark,
#    service_get_marks_by_student_with_student,
#    service_update_mark,
#    service_delete_mark,
#    service_get_all_marks,
#    service_get_all_marks_with_students,
)
	# service_get_marks_by_student_with_student,
	# service_update_mark,
	# service_delete_mark,
	# service_get_all_marks,
	# service_get_all_marks_with_students,

# def get_marks_by_student(handler, student_id):
#     marks = service_get_marks_by_student(student_id)
#     return send_json(handler, 200, marks) if marks else send_404(handler)

# def update_mark(handler, mark_id):
#     data = parse_json_body(handler)
#     updated = service_update_mark(mark_id, data)
#     return send_json(handler, 200, updated) if updated else send_404(handler)
# def delete_mark(handler, mark_id):

#     deleted = service_delete_mark(mark_id)

#     return send_json(handler, 200, {"deleted": True}) if deleted else send_404(handler)





# def get_all_marks(handler):

#     return send_json(handler, 200, service_get_all_marks())









