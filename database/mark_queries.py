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