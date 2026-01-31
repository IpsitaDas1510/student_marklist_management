import sqlite3
import os

DB_FILE = "master.db"

# ------------------------------
# Get DB Connection
# ------------------------------
def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

# ------------------------------
# Initialize / Reset Database
# ------------------------------
def init_database():
    conn = get_connection()

    # ------------------------------
    # Students Table
    # ------------------------------
    conn.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        course TEXT,
        year TEXT,
        created_at TEXT,
        updated_at TEXT
    )
    """)

    # ------------------------------
    # Teachers Table
    # ------------------------------
    conn.execute("""
    CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        subject TEXT NOT NULL,
        created_at TEXT,
        updated_at TEXT
    )
    """)

    # ------------------------------
    # Marks Table (3 cores)
    # ------------------------------
    conn.execute("""
    CREATE TABLE IF NOT EXISTS marks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        year TEXT NOT NULL,
        core1 INTEGER NOT NULL DEFAULT 0,
        core2 INTEGER NOT NULL DEFAULT 0,
        core3 INTEGER NOT NULL DEFAULT 0,
        total INTEGER NOT NULL DEFAULT 0,
        percentage REAL NOT NULL DEFAULT 0,
        created_at TEXT,
        updated_at TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id)
    )
    """)

    conn.commit()
    conn.close()

    print("✓ Database initialized with students, teachers & marks tables")

# ------------------------------
# Optional: Run directly to init DB
# ------------------------------
if __name__ == "__main__":
    init_database()
