# Requirements Traceability Matrix (Draft)

Requirement summaries below are paraphrased from the existing GitHub issue titles/descriptions. Check exact text, numbering, and completeness against SRS.pdf before submission. “Pending” means no implementation/test evidence was present in the repository at the audit.

| ID | Requirement summary | Backlog issue | Planned verification evidence | Status |
| --- | --- | --- | --- | --- |
| FR1 | User registration/login | #2 | Authentication tests; reviewed PR; test report | Pending |
| SEC1 | Password hashing | #2 | Stored-hash inspection and authentication/security tests | Pending |
| FR2 | Teacher creates quizzes with title, instructions, and MCQs | #3 | Teacher workflow tests; reviewed PR | Pending |
| FR3 | Student selects active quiz, answers, and submits within time limit | #4 | Timed quiz tests and boundary cases | Pending |
| FR4 | Automatic grading returns score after submission | #5 | Answer-key and score calculation tests | Pending |
| SEC2 | Role-based access control for student/teacher/admin operations | #6 | Authorization tests for permitted/denied roles | Pending |
| SEC3 | HTTPS with TLS 1.2 or higher | #7 | Deployment configuration and TLS verification output | Pending |
| NFR1 | Grading/result response under 2 seconds | #8 | Repeatable timed measurement under documented normal load | Pending |
| NFR3 | New teacher learns quiz creation in less than 15 minutes of training | #9 | Usability session notes and task-completion record | Pending |
| NFR2 | Support verification for 500 concurrent students | #11 | Repeatable load-test plan/results and environment details | Pending |

## Traceability completion checklist

- [ ] Compare every row and ID against the submitted SRS and add any omitted requirements.
- [ ] Link each requirement to its test case(s), code/PR, and result artifact.
- [ ] Record approved requirement changes and deviations in the deviation log.
