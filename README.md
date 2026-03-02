Mini Job Processing Task API

Backend service built with NestJS, TypeORM, and PostgreSQL for managing users and background task processing.

🚀 Tech Stack

NestJS 11

TypeORM 0.3+

PostgreSQL

Swagger (OpenAPI)

BullMQ (Queue processing)

JWT Authentication

📦 Installation
git clone https://github.com/Davlatbek-boop/mini-job-processing-task.git
cd mini-job-processing-task
npm install
⚙️ Environment Variables

Create .env file in project root:

PG_HOST=localhost
PG_PORT=5432
PG_USERNAME=postgres
PG_PASSWORD=postgres
PG_DB=mini_job_db
ACCESS_TOKEN_KEY=yourkey
REFRESH_TOKEN_KEY=yourkey
ACCESS_TOKEN_TIME=3600
REFRESH_TOKEN_TIME=54000
REFRESH_COOKIE_TIME=604800000
🗄 Database Setup

Make sure PostgreSQL is running.

Create database:

CREATE DATABASE mini_job_db;
🏗 Migration System (IMPORTANT)

This project uses TypeORM migrations.

synchronize is disabled (production-ready).

🔹 Generate Migration

If you changed or added entities:

npm run migration:generate -- ./src/migration/MigrationName

Example:

npm run migration:generate -- ./src/migration/CreateUserAndTaskTables
🔹 Run Migration
npm run migration:run
🔹 Revert Last Migration
npm run migration:revert
🔹 Create Empty Migration (manual)
npm run typeorm -- migration:create ./src/migration/ManualMigration
▶️ Run Application
Development mode
npm run start:dev
Production build
npm run build
npm run start:prod
📘 Swagger Documentation

Swagger is enabled in the project.

After running the app:

http://localhost:3000/api/docs

If you changed port, use your custom port.

🔐 Authentication

JWT-based authentication

Login endpoint returns access token

Use token in Swagger:

Click Authorize → Paste:

Bearer your_token_here