# API behavior in current source — 19 November 2026

Base path: `/api`. Successful responses use `{ success, data }`; errors use `{ success: false, error: { code, message } }`. Protected routes require `Authorization: Bearer <JWT>` and enforce roles server-side.

| Method and path | Role | Purpose |
| --- | --- | --- |
| `POST /auth/register` | Public; creates student | Register email/password |
| `POST /auth/login` | Public | Authenticate and receive token |
| `GET /auth/me` | Authenticated | Return current principal |
| `GET /admin/users` | Admin | List user ID/email/role/creation date; excludes password hashes |
| `PATCH /admin/users/{userId}/role` | Admin | Change a student/teacher role; cannot assign admin or change own role |
| `GET /quizzes` | Student / teacher / admin | Student: active summaries; teacher: owned quizzes; admin: all quizzes |
| `GET /quizzes/results` | Student | List that student's submitted scores, newest first; no answer keys |
| `POST /quizzes` | Teacher / admin | Create quiz and questions; `201` |
| `PATCH /quizzes/{quizId}/active` | Owner teacher / admin | Activate/deactivate quiz |
| `POST /quizzes/{quizId}/start` | Student | Create timed attempt and return options without answer key; `409` after a submitted attempt |
| `POST /quizzes/{quizId}/submit` | Student | Submit one answer per question; enforce ownership, expiry, once-only submission; return score only |

The SAD baseline lists `GET /quizzes/{id}`. That route is absent: starting an attempt returns questions and deadline. See DEV-03 in the deviation log. Executable behavior and validation live in `app/api/src/auth.js`, `app/api/src/quizzes.js`, and `app/api/src/app.js`.
