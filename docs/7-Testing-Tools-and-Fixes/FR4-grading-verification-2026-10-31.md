# FR4 automatic grading verification

Date: 31 October 2026

The API now exposes `POST /api/quizzes/{quizId}/submit` for authenticated student accounts. A submission must contain exactly one answer for every question, and the response returns only `correct`, `total`, and `percentage`; stored answer keys are never returned.

Automated coverage in `app/api/test/grading.test.js` verifies full, zero, partial, invalid, unauthenticated, and non-student submissions.

Run the check from the repository root with:

```sh
npm install
npm run db:generate --workspace @online-quiz/api
npm run db:push --workspace @online-quiz/api
npm test --workspace @online-quiz/api
```

The endpoint does not yet provide the student quiz-selection/timer UI tracked separately by FR3 (#4); it grades a valid quiz submission once a client has collected the answers.
