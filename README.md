# School Management System

A full-stack School Management System built with Spring Boot and React.js.

## Features
- JWT Authentication with role-based access (Admin, Teacher, Parent)
- Admission management with workflow (New → Confirmed → Student creation)
- Student management with auto-generated IDs (STU-2026-0001)
- Academic structure (Years, Classes, Sections, Subjects, Teachers)
- Attendance tracking with duplicate prevention and percentage calculation
- Examination and result management with auto grade calculation
- Fee management with payment tracking and status calculation
- Parent portal with access restricted to own child only
- Admin dashboard with statistics and low attendance alerts
- Global exception handling with consistent JSON errors

## Tech Stack
**Backend**: Java 17, Spring Boot 4.1, Spring Security, Spring Data JPA, Hibernate, MySQL, JWT, Flyway, Lombok, Maven
**Frontend**: React 19, Vite 8, React Router 7, Axios, CSS
**Database**: MySQL 8.x

## Architecture
The application uses a layered architecture:
- **Controllers**: Handle HTTP requests and responses, map JSON to DTOs.
- **Services**: Contain business logic and transaction management.
- **Repositories**: Interface with the database using Spring Data JPA.
- **Entities**: Map to database tables using Hibernate ORM.
- **Frontend**: React components interact with backend via Axios REST calls.

## Project Structure
```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/schoolmanagement/
│   │   │   ├── config/       (Security, Swagger configs)
│   │   │   ├── controller/   (REST API endpoints)
│   │   │   ├── dto/          (Data Transfer Objects)
│   │   │   ├── entity/       (JPA Entities)
│   │   │   ├── exception/    (Global Exception Handler)
│   │   │   ├── mapper/       (DTO <-> Entity mappers)
│   │   │   ├── repository/   (Spring Data JPA repos)
│   │   │   └── service/      (Business logic)
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/ (Flyway SQL scripts)
│   └── test/                 (JUnit/Mockito tests)
```

## Database Design
1. **users**: System login credentials and roles.
2. **academic_years**: Configuration for active/inactive school years.
3. **school_classes**: Available classes (e.g., Class 1, Class 10).
4. **sections**: Sections linked to a class and academic year.
5. **subjects**: Subject master list (Math, Science).
6. **teachers**: Staff information.
7. **teacher_subject_class**: Mapping of who teaches what to whom.
8. **parents**: Parent profiles linked to user accounts.
9. **admissions**: Admission applications.
10. **students**: Active student profiles.
11. **attendance**: Daily attendance records.
12. **examinations**: Exam schedule setup.
13. **results**: Student marks per exam and subject.
14. **fees**: Overall fee obligations per year.
15. **payments**: Individual transaction records for fees.
16. **student_academic_history**: Yearly progression track.

## API Endpoints
| Method | URL | Description | Access |
|--------|-----|-------------|--------|
| POST   | /api/auth/login | Authenticate user | Public |
| GET    | /api/students | List all students | Admin, Teacher |
| POST   | /api/admissions | Create new admission | Admin |
| PUT    | /api/admissions/{id}/status | Update admission status | Admin |
| POST   | /api/attendance | Mark student attendance | Teacher |
| GET    | /api/results/student/{id} | Get student results | Admin, Teacher, Parent(Own) |
| POST   | /api/payments | Record a fee payment | Admin |

## Authentication Flow
1. User submits credentials to `/api/auth/login`.
2. Backend verifies via BCrypt against `users` table.
3. If valid, backend generates and returns a JWT.
4. Frontend stores JWT in local storage/cookies.
5. Subsequent requests include `Authorization: Bearer <token>`.
6. Spring Security filters intercept and validate the token for protected endpoints.

## Key Business Flows
### Admission Workflow
- Status starts as `NEW`.
- Admin reviews and updates to `CONFIRMED`.
- System automatically generates a student record and unique ID (STU-YYYY-NNNN).

### Payment Processing
- Total fee is defined per student per year.
- Payment reduces `outstanding_amount` and increases `amount_paid`.
- Status updates automatically (`PENDING` -> `PARTIAL` -> `PAID`).

### Parent Authorization
- Parents can only access records where `student.parent_id` matches their own linked `parent_id`.

### Attendance Tracking
- Prevents duplicate entries for the same student and date via DB unique constraints.
- Calculates percentages dynamically.

## How to Run

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.x
- Maven

### Backend Setup
```bash
# Create MySQL database
mysql -u root -p -e "CREATE DATABASE school_management;"

# Navigate to backend
cd backend

# Run (Flyway will create tables automatically)
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| DB_USERNAME | root | MySQL username |
| DB_PASSWORD | nilesh321 | MySQL password |
| JWT_SECRET | (embedded) | JWT signing key |

## Sample Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | password123 |
| Teacher | john.teacher@school.com | password123 |
| Teacher | jane.teacher@school.com | password123 |
| Parent | parent1@email.com | password123 |
| Parent | parent2@email.com | password123 |

## Running Tests
```bash
cd backend
./mvnw test
```

## Future Improvements
- Email notifications for admission updates
- Report card PDF generation
- Timetable management
- SMS notifications for attendance
- Student photo upload
- Bulk attendance import from CSV
- Export reports to Excel
