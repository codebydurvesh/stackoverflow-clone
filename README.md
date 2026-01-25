# Stack Overflow Clone (MERN + Supabase + Gemini)

A full-stack Stack Overflow clone built with React (Vite), Node.js/Express, Supabase (Postgres + Auth), and Google Gemini for AI-powered moderation. This project demonstrates a modern, scalable Q&A platform with authentication, voting, notifications, and reputation features.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Screenshots](#screenshots)
- [License](#license)

---

## Features

- User authentication (Supabase)
- Ask, view, and answer questions
- Voting system for questions and answers
- Notifications for user activities
- AI moderation for content (Google Gemini)
- Reputation system
- Responsive, modern UI (React + TailwindCSS)

---

## Tech Stack

- **Frontend:** React (Vite), TailwindCSS, React Router
- **Backend:** Node.js, Express
- **Database & Auth:** Supabase (Postgres)
- **AI Moderation:** Google Gemini API

---

## Project Structure

```
Stack Overflow Clone/
├── backend/        # Express API server
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       └── services/
├── frontend/       # React client app
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── components/
│       ├── config/
│       └── pages/
└── README.md       # (This file)
```

---

## Setup & Installation

### Prerequisites

- Node.js (v16+)
- npm
- Supabase project (for authentication and database)
- Google Gemini API key (for AI moderation)

### 1. Clone the repository

```sh
git clone <repo-url>
cd Stack Overflow Clone
```

### 2. Backend Setup

```sh
cd backend
cp .env.example .env # Fill in your Supabase and Gemini keys
npm install
npm run dev
```

### 3. Frontend Setup

```sh
cd ../frontend
cp .env.example .env # Fill in your Supabase keys
npm install
npm run dev
```

- The backend runs on `http://localhost:5000` (default)
- The frontend runs on `http://localhost:5173` (default)

---

## Environment Variables

See `.env.example` in both `backend/` and `frontend/` for required variables.

**Backend:**

- `PORT` - API server port
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `GEMINI_API_KEY` - Google Gemini API key

**Frontend:**

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon/public key

---

## API Overview

See `backend/README.md` for full API documentation. Key endpoints include:

- `/api/account` - User registration, login, profile
- `/api/questions` - CRUD for questions
- `/api/answers` - CRUD for answers
- `/api/votes` - Voting on questions/answers
- `/api/notifications` - User notifications

Most endpoints require authentication (Bearer token).

---

## Screenshots

> Add screenshots/gifs of the UI here for better presentation!

---

## License

This project is licensed under the MIT License.
