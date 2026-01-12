# # Contains business logic for marks (year-wise)
# # No HTTP logic here

# from database.mark_queries import (
#     db_create_mark,
#     db_get_marks_by_student,
#     db_update_mark,
#     db_delete_mark,
#     db_get_all_marks,
# )

# from database.queries import db_get_one

# VALID_YEARS = {1, 2, 3,}

# def service_add_mark(data):
#     # validation: student must exist
#     student = db_get_one(data["student_id"])
#     if not student:
#         raise ValueError("Student not found")

#     # validation: valid academic year
#     try:
#         year = int(data["year"])
#     except (ValueError, TypeError):
#         raise ValueError("Year must be a number")

#     if year not in VALID_YEARS:
#         raise ValueError("Invalid year")

#     data["year"] = year
#     return db_create_mark(data)


# def service_get_marks_by_student(student_id):
#     return db_get_marks_by_student(student_id)


# def service_update_mark(mark_id, data):
#     try:
#         year = int(data["year"])
#     except (ValueError, TypeError):
#         raise ValueError("Year must be a number")

#     if year not in VALID_YEARS:
#         raise ValueError("Invalid year")

#     data["year"] = year
#     return db_update_mark(mark_id, data)


# def service_delete_mark(mark_id):
#     return db_delete_mark(mark_id)


# def service_get_all_marks():
#     return db_get_all_marks()








# Contains business logic for marks (year-wise)
# No HTTP logic here

# services/mark_service.py
from database.mark_queries import (
    db_create_mark,
    db_get_marks_by_student,
    db_get_marks_by_student_with_student,
    db_update_mark,
    db_delete_mark,
    db_get_all_marks,
    db_get_all_marks_with_students,
)
from database.queries import db_get_one

VALID_YEARS = {1, 2, 3}

def service_add_mark(data):
    student = db_get_one(data["student_id"])
    if not student:
        raise ValueError("Student not found")

    try:
        year = int(data["year"])
    except (ValueError, TypeError):
        raise ValueError("Year must be a number")

    if year not in VALID_YEARS:
        raise ValueError("Invalid year")

    data["year"] = year

    # Validate core marks
    for core in ["core1", "core2", "core3"]:
        if core not in data:
            raise ValueError(f"{core} is required")

    return db_create_mark(data)


def service_get_marks_by_student(student_id):
    return db_get_marks_by_student(student_id)


def service_get_marks_by_student_with_student(student_id):
    return db_get_marks_by_student_with_student(student_id)


def service_update_mark(mark_id, data):
    try:
        year = int(data["year"])
    except (ValueError, TypeError):
        raise ValueError("Year must be a number")

    if year not in VALID_YEARS:
        raise ValueError("Invalid year")

    data["year"] = year

    for core in ["core1", "core2", "core3"]:
        if core not in data:
            raise ValueError(f"{core} is required")

    return db_update_mark(mark_id, data)


def service_delete_mark(mark_id):
    return db_delete_mark(mark_id)


def service_get_all_marks():
    return db_get_all_marks()


def service_get_all_marks_with_students():
    return db_get_all_marks_with_students()







