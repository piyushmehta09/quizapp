# Quizly

Full-stack quiz platform built with the MERN stack.

| Layer    | Tools                                             |
| -------- | ------------------------------------------------- |
| Frontend | Next.js 14, Tailwind CSS, React Icons, Toastify   |
| Admin    | React (Vite), Tailwind CSS, React Icons, Toastify |
| Backend  | Node.js, Express.js (MVC pattern)                 |
| Database | MongoDB with Mongoose                             |
| Auth     | JSON Web Tokens, role-based authorisation         |

## Features

- Learner app: category and difficulty filters, search, pagination, randomised questions, timed MCQ attempts, instant scoring, result review (correct, incorrect, skipped, percentage), leaderboard, personal progress.
- Admin panel: secure login, analytics dashboard, quiz CRUD, question CRUD, category management, user management with roles, attempt reports filtered by quiz.
- API: REST endpoints, JWT middleware, role guard, input sanitising, indexes, lean queries, response compression, rate limiting, helmet.

## Backend structure

```
backend/src
  config/        database connection
  models/        Mongoose schemas
  controllers/   request handling and business logic
  routes/        REST route definitions
  middlewares/   auth, role guard, error handling
  utils/         helpers
```

## Setup

```
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev

cd admin
cp .env.example .env
npm install
npm run dev

cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Ports: API 5000, learner app 3000, admin panel 5173.
Seeded admin login: `admin@quizly.com` / `Admin@123` (change after first login).

## Production

Set a strong `JWT_SECRET`, a hosted `MONGO_URI` and your real domains in `CORS_ORIGINS`.
Use `npm start` for the API, `npm run build && npm start` for the learner app and `npm run build` for the admin panel (serve `dist`).
Set `NEXT_PUBLIC_API_URL` and `VITE_API_URL` to the deployed API URL.
Portfolio link in the footer: `frontend/lib/config.js`.
