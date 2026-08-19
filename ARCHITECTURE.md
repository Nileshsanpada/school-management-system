# System Architecture

## 1. System Architecture Overview

```text
+----------------+       HTTP/REST        +-------------------+       TCP/IP        +-----------------+
|                |       JSON / JWT       |                   |                     |                 |
|  React (Vite)  | <--------------------> | Spring Boot 4.1   | <-----------------> |   MySQL 8.x     |
|  Frontend UI   |                        | Backend API       |                     |   Database      |
|                |                        |                   |                     |                 |
+----------------+                        +-------------------+                     +-----------------+
```

## 2. Backend Architecture - Layered Pattern

The backend follows a standard multi-tier architecture to enforce separation of concerns:

- **Controller Layer**: Handles HTTP incoming requests, validates input DTOs, calls the appropriate Service, and maps the Service result back to response DTOs.
- **Service Layer**: Houses the core business logic. It handles transactions (`@Transactional`), enforces business rules (like checking duplicate payments), and coordinates between multiple repositories.
- **Repository Layer**: Extends Spring Data JPA interfaces. It abstracts database queries into simple method names (e.g., `findByStudentIdAndAttendanceDate`).
- **Entity Layer**: Java classes annotated with JPA annotations (`@Entity`, `@Table`) that map directly to database tables.

## 3. Why this Architecture?

- **Separation of Concerns**: Changes in the database don't immediately break the UI.
- **Testability**: Services can be easily tested using Mockito by mocking the Repository layer without needing a real database.
- **Maintainability**: Clear boundaries make it easier for teams to collaborate and find code.
- **Security**: The Controller translates internal Entities to DTOs, ensuring sensitive information (like passwords) doesn't leak to the client.

## 4. Request Flow (Example: Create Student)

1. Client POSTs JSON to `/api/students`.
2. `StudentController` receives the request and binds it to a `StudentDto`.
3. Controller passes the DTO to `StudentService.createStudent(dto)`.
4. `StudentService` validates data, generates a unique ID, creates a `Student` entity.
5. Service calls `StudentRepository.save(student)`.
6. Hibernate translates the object to a SQL `INSERT` statement.

## 5. Response Flow (Example)

1. Database returns the inserted row.
2. `StudentRepository` returns the persisted `Student` entity to the Service.
3. `StudentService` returns the entity to the Controller.
4. `StudentController` maps the Entity back to a `StudentDto`.
5. Controller returns HTTP 201 Created with the DTO serialized to JSON.

## 6. Authentication Flow (JWT)

1. User POSTs `/api/auth/login` with email and password.
2. `AuthService` loads the User details and checks BCrypt password hash.
3. If successful, creates a JWT containing the user ID and role.
4. Token is sent back in the response payload.
5. Frontend includes `Authorization: Bearer <token>` in subsequent requests.
6. Spring Security `JwtAuthenticationFilter` validates the token on each request before reaching the Controller.

## 7. Admission Workflow

State transition: `NEW` → `CONFIRMED` or `REJECTED`.

- When status is updated to `CONFIRMED`, an event or synchronous service call triggers `StudentService.createStudentFromAdmission()`.
- A new parent account might be created if one doesn't exist.
- A unique Student ID is generated.

## 8. Payment Processing Flow

- `PaymentService` is called with the amount.
- It fetches the `Fee` record.
- Calculates `new_outstanding = old_outstanding - amount`.
- If `new_outstanding < 0`, an exception is thrown.
- Updates the Fee's status (`PAID` if outstanding is 0, else `PARTIAL`).
- Saves the `Payment` record and updates the `Fee` record in one `@Transactional` block.

## 9. Parent Authorization Flow

- Using Spring Security `@PreAuthorize` or manual service checks.
- When `/api/students/{id}/results` is requested:
  - If role is ADMIN or TEACHER -> allowed.
  - If role is PARENT -> check if `student.parent_id == current_user.parent_id`. 
  - Throws `AccessDeniedException` if mismatched.

## 10. Database Design Decisions

- **Foreign Keys**: Enforce referential integrity (e.g., student must belong to a valid class).
- **Unique Constraints**: Prevent duplicate records at the database level (e.g., one attendance record per student per day).
- **Normalization**: Separated `academic_years`, `classes`, and `sections` to allow easy transitions between years.

## 11. Exception Handling Strategy

- Global `@ControllerAdvice` intercepts all exceptions thrown by the application.
- Maps domain exceptions (e.g., `ResourceNotFoundException`, `IllegalArgumentException`) to appropriate HTTP status codes (404, 400).
- Returns a consistent JSON error structure: `{"timestamp": "...", "status": 400, "message": "...", "path": "..."}`.

## 12. Security Design

- **BCrypt**: Passwords are never stored in plain text.
- **JWT**: Stateless session management, preventing CSRF attacks.
- **DTOs**: Ensure entities with lazy loaded relationships or sensitive fields don't cause JSON serialization issues or data leaks.
