##################### API Observation Via Codespace URL
##################### API Observation Via Hopscotch
##################### API Observation Via CURL

# A. Get All Students
curl -X GET "https://supreme-capybara-97r696q5gppq27vq-8000.app.github.dev/api/students"

# A. Get All Teachers
curl -X GET "https://supreme-capybara-97r696q5gppq27vq-8000.app.github.dev/api/teachers"

# B. Get One Student
curl -X GET "http://localhost:8000/api/students/1"

# B. Get One Student Mark
curl -X GET "http://localhost:8000/api/marks/student/1"

# B. Get One Teacher
curl -X GET "http://localhost:8000/api/teachers/1"

# C. Create Student
curl -X POST "https://supreme-capybara-97r696q5gppq27vq-8000.app.github.dev/api/students" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "course": "Computer Science",
    "year": 2
  }'

# C. Create Teacher
 curl -X POST "https://supreme-capybara-97r696q5gppq27vq-8000.app.github.dev/api/teachers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Naruto Uzumaki",
    "email": "uzumaki@example.com",
    "subject": "Mathematics"
  }'


# # C. Create Marks

# 1st Year
curl -X POST http://localhost:8000/api/marks \
-H "Content-Type: application/json" \
-d '{"student_id":1,"year":1,"core1":90,"core2":80,"core3":70}'

# 2nd Year
curl -X POST http://localhost:8000/api/marks \
-H "Content-Type: application/json" \
-d '{"student_id":1,"year":2,"core1":85,"core2":75,"core3":65}'

# 3rd Year
curl -X POST http://localhost:8000/api/marks \
-H "Content-Type: application/json" \
-d '{"student_id":1,"year":3,"core1":80,"core2":70,"core3":60}'


# D. Update Student
curl -X PUT "https://supreme-capybara-97r696q5gppq27vq-8000.app.github.dev/api/students/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Updated",
    "email": "alice_new@example.com",
    "course": "Data Science",
    "year": 3
  }'

  # D. Update Teacher
curl -X PUT "https://supreme-capybara-97r696q5gppq27vq-8000.app.github.dev/api/teachers/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "email": "john_new@example.com",
    "subject": "Data Science"
  }'

 # D. Update Marks
  curl -X PUT "https://supreme-capybara-97r696q5gppq27vq-8000.app.github.dev/api/marks/1" \
  -H "Content-Type: application/json" \
  -d '{
    "year": "1st year",
    "subject": "Maths",
    "marks": 88
  }'


# E. Delete Student
curl -X DELETE "http://localhost:8000/api/students/1"


# E. Delete Teacher
curl -X DELETE "http://localhost:8000/api/teachers/1"


# E. Delete Marks
curl -X DELETE "http://localhost:8000/api/marks/1"



##################### DB Observation Via SQLite Web
- install https://github.com/coleifer/sqlite-web
- pip install sqlite-web
- sqlite_web master.db