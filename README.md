# CareerOS

CareerOS is a placement and career tracking platform for college students.

## Stack

- Frontend: Next.js 15, TypeScript, Tailwind CSS
- Backend: Java Spring Boot 3
- Database: PostgreSQL
- Auth: JWT with role-based access control
- Charts: Recharts
- File storage: Local storage first, cloud-ready later

## Repo Layout

- `backend/` Spring Boot API
- `frontend/` Next.js application
- `docker-compose.yml` local PostgreSQL setup

## Local Setup

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Run the backend

Start the Spring Boot app. The default profile is `local`, so this works without PostgreSQL setup:

```bash
cd backend
mvn spring-boot:run
```

Backend defaults:
- API base: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Admin seed login: `admin@careeros.app` / `Admin@12345`

To run against PostgreSQL instead, use:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL=http://localhost:8080/api` in your environment before starting the frontend.

## Environment Variables

### Backend

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SPRING_PROFILES_ACTIVE`
- `JWT_SECRET`
- `JWT_EXPIRATION_MINUTES`
- `FRONTEND_URL`
- `UPLOAD_DIR`

### Frontend

- `NEXT_PUBLIC_API_URL`

## Main API Areas

- `/api/auth`
- `/api/applications`
- `/api/interviews`
- `/api/resumes`
- `/api/reminders`
- `/api/dashboard`
- `/api/analytics`
- `/api/admin`

## Deployment

- Frontend: Netlify
- Backend: Render
- Database: Render PostgreSQL or any managed PostgreSQL instance

## Notes

- The backend currently seeds a default admin user for first-run access.
- Resume storage is local now and isolated behind the `ResumeService`, so cloud storage can be added later without changing the API contract.
