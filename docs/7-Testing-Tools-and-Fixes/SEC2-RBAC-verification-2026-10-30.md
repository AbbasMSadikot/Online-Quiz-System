# SEC2 Role-Based Access Control Verification — 30 Oct 2026

The API protects quiz-management operations with JWT authentication and checks for the `teacher` or `admin` role.

| Actor | Operation | Expected | Test evidence |
| --- | --- | --- | --- |
| Anonymous | Create quiz | HTTP 401 | `auth.test.js` |
| Student | Create quiz | HTTP 403 | `auth.test.js` |
| Student | List teacher quiz management | HTTP 403 | `auth.test.js` |
| Teacher | Create and list quiz | HTTP 201 / 200 | `auth.test.js` |
| Administrator | Create and list quiz | HTTP 201 / 200 | Admin coverage added 30 Oct 2026 |

The existing collaborator change in [PR #20](https://github.com/AbbasMSadikot/Online-Quiz-System/pull/20) added the quiz-management role checks and student-denial tests. The administrator allow-case is covered by the additional test added for issue #6.

The test suite runs in the **Application checks** GitHub Actions workflow on pushes to main. Record the successful run after it completes before treating this report as verified.