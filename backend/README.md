# CREV AI Code Review Backend

This is the Spring Boot backend server for the AI Code Review Dashboard. It receives code snippets, coordinates with the Claude AI API for analysis, and returns structured review feedback.

## Setup Instructions

1. **Create MySQL database**:
   ```sql
   CREATE DATABASE crev_db CHARACTER SET utf8mb4;
   ```

2. **Configure Application Properties**:
   Update `src/main/resources/application.properties` with your credentials:
   - MySQL password
   - JWT secret (min 32 chars, random string)
   - Claude API key (from console.anthropic.com)

3. **Build & Run**:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **Test the API**:
   
   **Register**:
   ```bash
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"sagnik","email":"s@test.com","password":"test123"}'
   ```
   
   **Login** (Copy the returned token):
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"sagnik","password":"test123"}'
   ```
   
   **Run Review**:
   ```bash
   curl -X POST http://localhost:8080/api/review \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"code":"SELECT * FROM users WHERE id = "+userId","language":"sql"}'
   ```
