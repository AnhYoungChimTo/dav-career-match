# DAV Career Match

A full-stack web application to help DAV students find suitable career paths based on their personality, knowledge domain, and interests.

## Tech Stack
- **Frontend**: Next.js 14, TailwindCSS, React Hook Form, TanStack Query
- **Backend**: NestJS, Prisma, Postgres
- **Infrastructure**: Docker, Docker Compose

## Getting Started

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose

### Option 1: Run with Docker (Recommended)
1.  Build and start the containers:
    ```bash
    docker-compose up --build
    ```
2.  Access the application:
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend: [http://localhost:4000](http://localhost:4000)

### Option 2: Run Locally (Manual)

#### 1. Database Setup
Ensure you have a Postgres database running. Update the `DATABASE_URL` in `backend/.env` (you may need to create this file based on the docker-compose config).

#### 2. Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push  # Create database tables
npm run start:dev
```
The backend will run on port 4000.

#### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on port 3000.

## Features (MVP)
- **Authentication**: Register and Login.
- **Onboarding**: Multi-step form to capture Faculty, MBTI, DISC, and Interests.
- **Matching Engine**: Rule-based algorithm to suggest top 5 jobs.
- **Dashboard**: View profile summary and matched jobs.
- **Roadmap**: View detailed skill gaps and learning path for each job.
