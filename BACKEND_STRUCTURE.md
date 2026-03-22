# CREV AI — Backend Structure

> **Framework:** Spring Boot 3.2.4 · **Java 17** · **Build:** Maven  
> **Database:** MySQL 8 · **Migrations:** Flyway  
> **Auth:** JWT (jjwt 0.11.5) · **AI:** Claude API via OkHttp  
> **Server Port:** 8080

---

## Directory Tree

```
backend/
├── pom.xml                                      # Maven build config & dependencies
├── README.md
└── src/main/
    ├── java/com/crev/
    │   ├── CrevApplication.java                 # Spring Boot entry point
    │   │
    │   ├── config/
    │   │   ├── CorsConfig.java                  # CORS policy (allowed origins)
    │   │   └── SecurityConfig.java              # Spring Security filter chain & JWT config
    │   │
    │   ├── controller/
    │   │   ├── AuthController.java              # POST /api/auth/register, /api/auth/login
    │   │   └── ReviewController.java            # POST /api/reviews — submit code for AI review
    │   │
    │   ├── dto/
    │   │   ├── request/
    │   │   │   ├── LoginRequest.java            # { email, password }
    │   │   │   ├── RegisterRequest.java         # { username, email, password }
    │   │   │   └── ReviewRequest.java           # { code, language }
    │   │   └── response/
    │   │       ├── AuthResponse.java            # { token, username }
    │   │       ├── IssueDto.java                # { type, severity, line, message, suggestion }
    │   │       └── ReviewResponse.java          # { score, summary, issues[] }
    │   │
    │   ├── exception/
    │   │   ├── ClaudeApiException.java          # Wraps Claude API errors
    │   │   ├── GlobalExceptionHandler.java      # @ControllerAdvice — unified error responses
    │   │   └── RateLimitException.java          # Thrown when user exceeds rate limit
    │   │
    │   ├── model/
    │   │   ├── User.java                        # JPA entity — users table
    │   │   ├── Review.java                      # JPA entity — reviews table
    │   │   ├── ReviewIssue.java                 # JPA entity — review_issues table
    │   │   └── RateLimitLog.java                # JPA entity — rate_limit_logs table
    │   │
    │   ├── repository/
    │   │   ├── UserRepository.java              # JPA repo — find by email/username
    │   │   ├── ReviewRepository.java            # JPA repo — find reviews by user
    │   │   ├── ReviewIssueRepository.java       # JPA repo — issues linked to a review
    │   │   └── RateLimitLogRepository.java      # JPA repo — rate limit tracking
    │   │
    │   ├── security/
    │   │   ├── JwtUtil.java                     # JWT generation & validation helper
    │   │   ├── JwtAuthFilter.java               # OncePerRequestFilter — extracts JWT from headers
    │   │   └── UserDetailsServiceImpl.java      # Loads user from DB for Spring Security
    │   │
    │   └── service/
    │       ├── AuthService.java                 # Register & login logic, password hashing
    │       ├── ReviewService.java               # Orchestrates: build prompt → call Claude → parse → save
    │       ├── ClaudeApiService.java            # OkHttp call to Claude Messages API
    │       ├── PromptBuilderService.java        # Constructs the system & user prompt for Claude
    │       └── ResponseParserService.java       # Parses Claude JSON response into ReviewResponse
    │
    └── resources/
        ├── application.properties               # DB, JWT, Claude API, CORS, rate-limit config
        └── db/migration/
            └── V1__init.sql                     # Flyway migration — creates all tables
```

---

## Architecture Flow

```
Client Request
     │
     ▼
┌─────────────────────┐
│   AuthController    │──▶ AuthService ──▶ UserRepository ──▶ MySQL
│   ReviewController  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   ReviewService     │
│   (orchestrator)    │
└────────┬────────────┘
         │
    ┌────┴─────────────┬──────────────────────┐
    ▼                  ▼                      ▼
PromptBuilder    ClaudeApiService      ResponseParser
Service          (OkHttp → Claude)     Service
                                             │
                                             ▼
                                    ReviewRepository
                                    (save to MySQL)
```

---

## Key Endpoints

| Method | Endpoint              | Auth     | Description                    |
|--------|-----------------------|----------|--------------------------------|
| POST   | `/api/auth/register`  | Public   | Create new user account        |
| POST   | `/api/auth/login`     | Public   | Login, returns JWT token       |
| POST   | `/api/reviews`        | JWT      | Submit code for AI review      |

---

## Configuration (application.properties)

| Property                   | Description                          |
|----------------------------|--------------------------------------|
| `server.port`              | Backend runs on port `8080`          |
| `spring.datasource.*`     | MySQL connection (localhost:3306)     |
| `jwt.secret`               | Secret key for signing JWT tokens    |
| `jwt.expiration.ms`        | Token expiry (24 hours default)      |
| `claude.api.key`           | Anthropic Claude API key             |
| `claude.api.model`         | Model used (claude-sonnet-4-6)    |
| `rate.limit.requests`      | Max 20 requests per user per hour    |
| `cors.allowed.origins`     | Frontend URLs allowed to call API    |

---

## Dependencies (pom.xml)

- **spring-boot-starter-web** — REST API
- **spring-boot-starter-security** — Authentication & authorization
- **spring-boot-starter-data-jpa** — ORM / Hibernate
- **spring-boot-starter-validation** — Input validation
- **mysql-connector-j** — MySQL JDBC driver
- **jjwt (api/impl/jackson)** — JWT token handling
- **okhttp** — HTTP client for Claude API calls
- **lombok** — Boilerplate reduction (@Data, @Builder, etc.)
- **flyway-mysql** — Database schema migrations
