# # =========================
# # MARKS QUERIES (YEAR WISE)
# # =========================

# from datetime import datetime
# from database.connection import get_connection


# def db_create_mark(data):
#     conn = get_connection()
#     now = datetime.now().isoformat()

#     cur = conn.execute("""
#         INSERT INTO marks (student_id, year,subject, marks, created_at)
#         VALUES (?, ?, ?, ?, ?)
#     """, (
#         data["student_id"],
#         data["year"],# "1st year", "2nd year", "3rd year"
#         data["subject"],
#         data["marks"],
#         now
#     ))

#     conn.commit()
#     new_id = cur.lastrowid
#     conn.close()
#     return db_get_mark(new_id)


# def db_get_mark(mark_id):
#     conn = get_connection()
#     row = conn.execute(
#         "SELECT * FROM marks WHERE id = ?",
#         (mark_id,)
#     ).fetchone()
#     conn.close()
#     return dict(row) if row else None


# def db_get_marks_by_student(student_id):
#     conn = get_connection()
#     rows = conn.execute("""
#         SELECT * FROM marks
#         WHERE student_id = ?
#         ORDER BY id DESC
#     """, (student_id,)).fetchall()
#     conn.close()
#     return [dict(r) for r in rows]


# def db_update_mark(mark_id, data):
#     conn = get_connection()
#     now = datetime.now().isoformat()

#     conn.execute("""
#         UPDATE marks
#         SET year = ?, marks = ?, updated_at = ?
#         WHERE id = ?
#     """, (
#         data["year"],
#         data["marks"],
#         now,
#         mark_id
#     ))

#     conn.commit()
#     conn.close()
#     return db_get_mark(mark_id)


# def db_delete_mark(mark_id):
#     mark = db_get_mark(mark_id)
#     if not mark:
#         return None

#     conn = get_connection()
#     conn.execute("DELETE FROM marks WHERE id = ?", (mark_id,))
#     conn.commit()
#     conn.close()
#     return mark

# def db_get_all_marks():
#     conn = get_connection()
#     rows = conn.execute("""
#         SELECT * FROM marks ORDER BY student_id, year
#     """).fetchall()
#     conn.close()
#     return [dict(r) for r in rows]







# =========================
# MARKS QUERIES (CORE1/CORE2/CORE3)
# =========================

from datetime import datetime
from database.connection import get_connection

# -----------------------
# CREATE MARK
# -----------------------
def db_create_mark(data):
    conn = get_connection()
    now = datetime.now().isoformat()

    total = data["core1"] + data["core2"] + data["core3"]
    percentage = round(total / 3, 2)

    cur = conn.execute("""
        INSERT INTO marks (student_id, year, core1, core2, core3, total, percentage, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["student_id"],
        data["year"],
        data["core1"],
        data["core2"],
        data["core3"],
        total,
        percentage,
        now
    ))

    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return db_get_mark(new_id)


# -----------------------
# GET SINGLE MARK
# -----------------------
def db_get_mark(mark_id):
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM marks WHERE id = ?",
        (mark_id,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


# -----------------------
# GET MARKS BY STUDENT
# -----------------------
def db_get_marks_by_student(student_id):
    conn = get_connection()
    rows = conn.execute("""
        SELECT * FROM marks
        WHERE student_id = ?
        ORDER BY id DESC
    """, (student_id,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


# -----------------------
# UPDATE MARK
# -----------------------
def db_update_mark(mark_id, data):
    conn = get_connection()
    now = datetime.now().isoformat()

    total = data["core1"] + data["core2"] + data["core3"]
    percentage = round(total / 3, 2)

    conn.execute("""
        UPDATE marks
        SET year = ?, core1 = ?, core2 = ?, core3 = ?, total = ?, percentage = ?, updated_at = ?
        WHERE id = ?
    """, (
        data["year"],
        data["core1"],
        data["core2"],
        data["core3"],
        total,
        percentage,
        now,
        mark_id
    ))

    conn.commit()
    conn.close()
    return db_get_mark(mark_id)


# -----------------------
# DELETE MARK
# -----------------------
def db_delete_mark(mark_id):
    mark = db_get_mark(mark_id)
    if not mark:
        return None

    conn = get_connection()
    conn.execute("DELETE FROM marks WHERE id = ?", (mark_id,))
    conn.commit()
    conn.close()
    return mark


# -----------------------
# GET ALL MARKS
# -----------------------
def db_get_all_marks():
    conn = get_connection()
    rows = conn.execute("""
        SELECT * FROM marks
        ORDER BY student_id, year
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]


# # -----------------------
# # GET ALL MARKS JOINED WITH STUDENT INFO
# # -----------------------
# def db_get_all_marks_with_students():
#     conn = get_connection()
#     rows = conn.execute("""
#         SELECT m.*, s.name as student_name, s.email as student_email, s.course as student_course, m.year as mark_year,
#                t1.name as core1_teacher, t2.name as core2_teacher, t3.name as core3_teacher
#         FROM marks m
#         JOIN students s ON m.student_id = s.id
#         LEFT JOIN teachers t1 ON t1.subject = 'Core 1'
#         LEFT JOIN teachers t2 ON t2.subject = 'Core 2'
#         LEFT JOIN teachers t3 ON t3.subject = 'Core 3'
#         ORDER BY m.student_id, m.year
#     """).fetchall()
#     conn.close()
#     return [dict(r) for r in rows]


# # -----------------------
# # GET MARKS FOR A STUDENT WITH STUDENT INFO
# # -----------------------
# def db_get_marks_by_student_with_student(student_id):
#     conn = get_connection()
#     rows = conn.execute("""
#         SELECT m.*, s.name as student_name, s.email as student_email, s.course as student_course, m.year as exam_year,
#                t1.name as core1_teacher, t2.name as core2_teacher, t3.name as core3_teacher
#         FROM marks m
#         JOIN students s ON m.student_id = s.id
#         LEFT JOIN teachers t1 ON t1.subject = 'Core 1'
#         LEFT JOIN teachers t2 ON t2.subject = 'Core 2'
#         LEFT JOIN teachers t3 ON t3.subject = 'Core 3'
#         WHERE m.student_id = ?
#         ORDER BY m.id DESC
#     """, (student_id,)).fetchall()
#     conn.close()
#     return [dict(r) for r in rows]



# -----------------------
# GET ALL MARKS JOINED WITH STUDENT INFO
# -----------------------
def db_get_all_marks_with_students():
    conn = get_connection()
    rows = conn.execute("""
        SELECT
            m.id,
            m.student_id,
            m.year,
            m.core1,
            m.core2,
            m.core3,
            m.total,

            s.name   AS student_name,
            s.email  AS student_email,
            s.course AS student_course

        
        FROM marks m
        JOIN students s ON m.student_id = s.id
        ORDER BY m.student_id, m.year
    """).fetchall()

    conn.close()
    return [dict(r) for r in rows]



# -----------------------
# GET MARKS FOR A STUDENT WITH STUDENT INFO
# -----------------------
def db_get_marks_by_student_with_student(student_id):
    conn = get_connection()
    rows = conn.execute("""
        SELECT
            m.id,
            m.student_id,
            m.year,
            m.core1,
            m.core2,
            m.core3,
            m.total,

            s.name   AS student_name,
            s.email  AS student_email,
            s.course AS student_course


        FROM marks m
        JOIN students s ON m.student_id = s.id
        WHERE m.student_id = ?
        ORDER BY m.year
    """, (student_id,)).fetchall()

    conn.close()
    return [dict(r) for r in rows]
