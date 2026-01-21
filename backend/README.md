# Stack Overflow Clone Backend

This backend powers a Stack Overflow-like Q&A platform. It is built with Node.js, Express, and Supabase for data storage and authentication.

## Features
- User authentication (via Supabase JWT)
- Ask questions with tags
- Answer questions
- Accept answers
- Vote on answers (upvote/downvote)
- Reputation system for users

## API Endpoints

### Questions

#### `GET /api/questions`
- **Description:** Get a paginated list of questions. Supports filtering by tags and sorting.
- **Query Params:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `sort` (string: `newest` | `oldest` | `votes`, default: `newest`)
  - `tags` (comma-separated string, optional)
- **Response:**
  ```json
  {
    "data": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "created_at": "ISODate",
        "score": 0,
        "user": { "id": "string", "username": "string", "avatar_url": "string" }
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
  }
  ```
- **Errors:** 500 (server error)

#### `POST /api/questions/create`
- **Description:** Create a new question. Requires authentication.
- **Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "tags": ["tag1", "tag2"]
  }
  ```
- **Response:**
  ```json
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "author_id": "string",
    ...
  }
  ```
- **Errors:**
  - 400: Missing fields
  - 401: Unauthorized (no/invalid token)
  - 500: Server error

#### `GET /api/questions/:id`
- **Description:** Get a question by ID, with paginated answers.
- **Query Params:**
  - `page` (number, default: 1)
  - `limit` (number, default: 5)
  - `sort` (string: `newest` | `oldest` | `votes`, default: `newest`)
- **Response:**
  ```json
  {
    "question": { ... },
    "answers": [ ... ],
    "pagination": { ... }
  }
  ```
- **Errors:**
  - 404: Not found
  - 500: Server error

### Answers

#### `POST /api/answers/create`
- **Description:** Post an answer to a question. Requires authentication.
- **Body:**
  ```json
  {
    "questionId": "string",
    "content": "string"
  }
  ```
- **Response:** Answer object
- **Errors:**
  - 400: Missing fields
  - 401: Unauthorized
  - 500: Server error

#### `PATCH /api/answers/:id/accept`
- **Description:** Accept an answer (question author only). Requires authentication.
- **Response:** `{ "message": "Answer accepted" }`
- **Errors:**
  - 403: Not allowed (not question author)
  - 401: Unauthorized
  - 500: Server error

### Votes

#### `POST /api/votes/vote`
- **Description:** Upvote or downvote an answer. Requires authentication.
- **Body:**
  ```json
  {
    "answerId": "string",
    "type": "up" | "down"
  }
  ```
- **Response:** `{ "message": "Vote applied" }` or `{ "message": "Vote removed" }`
- **Errors:**
  - 400: Invalid vote type
  - 403: Cannot vote on own answer
  - 401: Unauthorized
  - 500: Server error

## Authentication
- All endpoints requiring authentication expect a Bearer token in the `Authorization` header.
- Example: `Authorization: Bearer <token>`

## Error Format
All errors are returned as JSON:
```json
{ "message": "Error description" }
```

## Running the Server
1. Install dependencies: `npm install`
2. Set up a `.env` file with your Supabase credentials:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `PORT` (optional, default 5000)
3. Start the server: `npm run dev`

---

For more details, see the code in the `src/` directory.
