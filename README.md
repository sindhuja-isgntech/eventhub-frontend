# EventHub

EventHub is a full-stack event discovery, ticket booking, and administration application. The frontend is a React single-page app, and the backend is a Spring Boot REST API backed by PostgreSQL.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| Backend | Java 21, Spring Boot 4, Spring MVC, Spring Data JPA, Bean Validation |
| Database | PostgreSQL |
| Authentication | JWT bearer tokens and BCrypt password hashing |

## Prerequisites

- Node.js compatible with Vite 8 and npm
- Java 21
- PostgreSQL
- Git

## Database setup

Create a PostgreSQL database before starting the backend. For a local PostgreSQL installation, connect as a database administrator and run:

```sql
CREATE DATABASE eventhub;
```

By default, the backend connects to `jdbc:postgresql://localhost:5432/eventhub` with username `postgres`. Set `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` in the backend process environment to use a different local database or account.

Hibernate is configured with `ddl-auto=update` and creates or updates the application tables when the backend starts. The backend also initializes sample event data. Back up persistent data before changing database configuration or schema behavior.

## Environment variables

### Frontend

The optional frontend environment file sets the API origin:

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | Backend API base URL |

From this directory, create a local `.env` from the example:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Change the value in `.env` only if the backend is hosted at a different origin. Local `.env` files are ignored by Git; do not commit secrets.

### Backend

The backend loads an optional `.env` from its working directory. Copy `eventhub-backend/.env.example` to `.env` there, then replace the placeholder with a random JWT signing secret of at least 32 bytes. Keep this secret private.

| Variable | Default | Description |
| --- | --- | --- |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/eventhub` | PostgreSQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | Database user |
| `SPRING_DATASOURCE_PASSWORD` | None | Set to the password for your PostgreSQL user through the process environment or local configuration |
| `JWT_SECRET` | Required | Random JWT signing secret, at least 32 bytes |
| `JWT_EXPIRATION_SECONDS` | `3600` | JWT lifetime in seconds |
| `FRONTEND_URL` | `http://localhost:5173` | Frontend origin used in password reset links |
| `MAIL_HOST` | `localhost` | SMTP host for password reset |
| `MAIL_PORT` | `1025` | SMTP port |
| `MAIL_USERNAME` | Empty | SMTP username, when required |
| `MAIL_PASSWORD` | Empty | SMTP password, when required |
| `MAIL_SMTP_AUTH` | `false` | Enable SMTP authentication |
| `MAIL_SMTP_STARTTLS` | `false` | Enable SMTP STARTTLS |

Environment variables take precedence over `.env`. Do not commit credentials, JWT secrets, or SMTP passwords.

Generate a local JWT secret in PowerShell:

```powershell
$bytes = [byte[]]::new(32)
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$rng.Dispose()
$secret = [Convert]::ToBase64String($bytes)
(Get-Content .env) -replace '^JWT_SECRET=.*$', "JWT_SECRET=$secret" | Set-Content .env
```

Run this command from the backend directory after creating `.env` from `.env.example`. It replaces only the placeholder `JWT_SECRET` line and preserves other settings.

## API overview

The backend API base path is `/api`. Admin list routes use zero-based `page` indexes and return Spring page objects with `content`, `number`, `size`, `totalElements`, and `totalPages`. The default page size is 5, with a maximum of 100.

| Area | Routes | Access |
| --- | --- | --- |
| Authentication | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/forgot-password`, `POST /auth/reset-password` | Registration/login and password reset are public; current-user lookup requires sign-in |
| Events | `GET /events`, `GET /events/{id}` | Public |
| Categories and venues | `GET /categories`, `GET /venues` | Public |
| Customer bookings | `POST /bookings`, `GET /bookings/mine`, `GET /bookings/{id}`, `PATCH /bookings/{id}/cancel` | Sign-in required; customers can access their own bookings |
| Admin event, category, venue lists | `GET /admin/events?page=0&size=5`, `GET /admin/categories?page=0&size=5`, `GET /admin/venues?page=0&size=5` | Admin only |
| Admin booking management | `GET /admin/bookings?page=0&size=5`, `GET /admin/bookings/summary`, `PATCH /admin/bookings/{id}/status`, `DELETE /admin/bookings/{id}` | Admin only |
| Admin resource management | `POST`, `PUT`, and `DELETE` under `/admin/events`, `/admin/categories`, and `/admin/venues` | Admin only |

Send the JWT from login or registration on protected requests as `Authorization: Bearer <JWT>`. Public registration does not create administrators; provision admin accounts through a trusted, protected process. For the full backend configuration, see [the backend README](../../eventhub-backend/README.md).

## Run locally

Start PostgreSQL and create the `eventhub` database first. Use two terminals.

### 1. Start the backend

```powershell
Set-Location ..\..\eventhub-backend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Edit `.env` and set `JWT_SECRET` (and database or SMTP settings if needed), then run:

```powershell
.\mvnw.cmd spring-boot:run
```

The API will be available at `http://localhost:8080/api`.

### 2. Start the frontend

From the frontend directory:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm ci
npm run dev
```

Open the Vite URL shown in the terminal (by default, `http://localhost:5173`).

## Useful frontend commands

```powershell
npm run dev       # Start the development server
npm run build     # Type-check and create a production build in dist/
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

Run backend tests from `eventhub-backend`:

```powershell
.\mvnw.cmd test
```
