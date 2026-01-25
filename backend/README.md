# Stack Overflow Clone - Backend

This is the backend for the Stack Overflow Clone project, built with Node.js, Express, and Supabase. It provides a robust RESTful API for user authentication, questions, answers, voting, notifications, AI-powered moderation, and a reputation system.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Services](#services)
- [License](#license)

---

## Features

- User authentication (Supabase)
- Ask, view, and answer questions
- Voting system for questions and answers
- Notifications for user activities
- AI moderation for content (Google Gemini)
- Reputation system (with upvotes, downvotes, accepted answers)

---

## Architecture

- **Express.js** for HTTP server and routing
- **Supabase** for authentication, database, and storage
- **Google Gemini** for AI moderation of questions
- **Modular structure**: controllers, routes, services, and middleware

---

## Project Structure

```
backend/
├── .env
├── package.json
├── README.md
└── src/
   ├── app.js                # Express app setup and route mounting
   ├── server.js             # Server entry point
   ├── config/
   │   └── supabase.js       # Supabase client configuration
   ├── controllers/          # Route handlers for business logic
   │   ├── account.controller.js
   │   ├── answers.controller.js
   │   ├── notifications.controller.js
   │   ├── questions.controller.js
   │   └── votes.controller.js
   ├── middlewares/
   │   └── auth.middleware.js # JWT authentication middleware
   ├── routes/               # API route definitions
   │   ├── account.route.js
   │   ├── answer.route.js
   │   ├── notifications.route.js
   │   ├── questions.route.js
   │   └── votes.routes.js
   └── services/             # Business logic and integrations
      ├── aiModeration.service.js
      └── reputation.service.js
```

---

## Setup & Installation

### Prerequisites

- Node.js (v16+)
- npm
- Supabase project (for authentication and database)
- Google Gemini API key (for AI moderation)

### Installation

1. Clone the repository and navigate to the backend folder:
   ```sh
   git clone <repo-url>
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the backend directory and add your Supabase and Gemini credentials (see [Environment Variables](#environment-variables)).

### Running the Server

Start the development server:

```sh
npm run dev
```

Or start the production server:

```sh
npm start
```

The server will run on the port specified in your `.env` file (default: 5000).

---

## Environment Variables

Add these to your `.env` file:

```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## API Endpoints

### Account

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | /api/account/signup  | Register a new user      |
| POST   | /api/account/login   | User login               |
| GET    | /api/account/profile | Get current user profile |
| PUT    | /api/account/profile | Update user profile      |

### Questions

| Method | Endpoint           | Description                                           |
| ------ | ------------------ | ----------------------------------------------------- |
| GET    | /api/questions     | Get all questions (with filters, pagination, sorting) |
| POST   | /api/questions     | Ask a new question (AI-moderated)                     |
| GET    | /api/questions/:id | Get details of a specific question                    |
| PUT    | /api/questions/:id | Update a question (owner only)                        |
| DELETE | /api/questions/:id | Delete a question (owner only)                        |

### Answers

| Method | Endpoint                      | Description                            |
| ------ | ----------------------------- | -------------------------------------- |
| GET    | /api/answers/:questionId      | Get all answers for a question         |
| POST   | /api/answers/:questionId      | Post an answer to a question           |
| PUT    | /api/answers/:answerId        | Update an answer (owner only)          |
| DELETE | /api/answers/:answerId        | Delete an answer (owner only)          |
| POST   | /api/answers/accept/:answerId | Accept an answer (question owner only) |

### Votes

| Method | Endpoint                        | Description                |
| ------ | ------------------------------- | -------------------------- |
| POST   | /api/votes/question/:questionId | Upvote/downvote a question |
| POST   | /api/votes/answer/:answerId     | Upvote/downvote an answer  |

### Notifications

| Method | Endpoint               | Description                            |
| ------ | ---------------------- | -------------------------------------- |
| GET    | /api/notifications     | Get all notifications for current user |
| PUT    | /api/notifications/:id | Mark a notification as read            |

### AI Moderation (Internal)

| Method | Endpoint        | Description                          |
| ------ | --------------- | ------------------------------------ |
| POST   | /api/moderation | Moderate content using AI (internal) |

> **Note:** Most endpoints (except signup/login) require authentication via Bearer token.

---

## Middleware

- **auth.middleware.js**: Protects routes and verifies user authentication using Supabase JWT tokens. Attaches the user object to the request if valid.

---

## Services

- **aiModeration.service.js**: Integrates with Google Gemini to moderate questions before posting. Blocks spam, off-topic, or low-effort content.
- **reputation.service.js**: Handles user reputation logic (upvotes, downvotes, accepted answers) using Supabase RPCs.

---

## Error Handling

- All endpoints return appropriate HTTP status codes and error messages.
- Common errors: authentication failure, invalid input, forbidden actions, not found.

---

## License

This project is licensed under the MIT License.
