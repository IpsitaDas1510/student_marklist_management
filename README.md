# Academic Management Portal

A full-stack **Academic Management System** designed to manage **Teachers, Students, and Marks** efficiently.  
The project demonstrates clean backend architecture, RESTful APIs, and a modular frontend structure.

---

## 🚀 Features

### 👩‍🏫 Teacher Management
- Add, view, update, and delete teachers
- Maintain teacher records in a centralized database

### 🎓 Student Management
- Create and manage student profiles
- Perform full CRUD operations on students

### 📝 Marks Management
- Assign marks to students
- View marks by student ID
- Update and delete marks records

---

## 🛠 Tech Stack

### Backend
- **Python**
- **HTTPServer**
- **REST API Architecture**
- **SQLite (master.db)**
- Modular structure:
  - Controllers
  - Services
  - Database Queries
  - Router & Middleware

### Frontend
- **HTML**
- **CSS (Tailwind)**
- **JavaScript**
- Single Page Application (SPA) approach

---

## 📂 Project Structure

│
├── controllers/
│ ├── students.py
│ ├── teachers.py
│ └── marks.py
│
├── services/
│ ├── student_service.py
│ ├── teacher_service.py
│ └── mark_service.py
│
├── database/
│ ├── connection.py
│ ├── queries.py
│ ├── teacher_queries.py
│ └── mark_queries.py
│
├── core/
│ ├── request.py
│ ├── responses.py
│ └── middleware.py
│
├── frontend/
│
├── app.py
├── router.py
├── master.db
└── README.md


---

## 🔗 API Endpoints

### Students
- `GET /api/students`
- `GET /api/students/{id}`
- `POST /api/students`
- `PUT /api/students/{id}`
- `DELETE /api/students/{id}`

### Teachers
- `GET /api/teachers`
- `POST /api/teachers`
- `PUT /api/teachers/{id}`
- `DELETE /api/teachers/{id}`

### Marks
- `GET /api/marks`
- `GET /api/marks/student/{id}`
- `POST /api/marks`
- `PUT /api/marks/{id}`
- `DELETE /api/marks/{id}`

---

## ⚙️ How to Run Locally


1. Clone the repository
```bash
git clone https://github.com/IpsitaDas1510/academic_management_portal.git

2. Navigate to the project folder

cd academic_management_portal

3. Run the backend server

python app.py

4. Open the frontend files in your browser


## 👩‍💻 Author
Ipsita Das
GitHub: IpsitaDas1510



