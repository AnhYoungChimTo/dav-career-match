---
description: How to run the DAV Career Match application locally
---

# How to Run DAV Career Match

## Prerequisites
- Node.js installed
- Docker installed and running (for the database)

## 1. Start the Database
Ensure the PostgreSQL database is running via Docker.
```bash
docker-compose up -d postgres
```

## 2. Start the Backend
The backend runs on port 4000.
```bash
cd backend
npm install
# Run migrations if needed
# npx prisma migrate dev 
npm run start:dev
```

## 3. Start the Frontend
The frontend runs on port 3000.
```bash
cd frontend
npm install
npm run dev
```

## 4. Access the Application
Open your browser and navigate to:
[http://localhost:3000](http://localhost:3000)

## Troubleshooting
- **Backend fails to start**: Check if port 4000 is in use or if the database is running.
- **Database connection error**: Ensure `.env` in `backend/` has the correct `DATABASE_URL`.
