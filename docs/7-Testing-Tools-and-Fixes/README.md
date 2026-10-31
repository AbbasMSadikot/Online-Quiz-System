# Software Testing Tools, Bug Fixes, and Retests

Record the tools actually used, findings, patches, and retests. Do not claim a pass when a prerequisite feature is missing.

- [SEC2 role-based access verification](SEC2-RBAC-verification-2026-10-30.md)
- [NFR1 grading performance verification](NFR1-performance-verification-2026-10-31.md)
- [NFR3 teacher usability session record](NFR3-teacher-usability-session-2026-10-30.md)
- [FR4 automatic grading verification](FR4-grading-verification-2026-10-31.md)

Automated API checks, the repeatable grading benchmark, and the React production build run in the repository's Application checks workflow. FR4 grading is covered by full, zero, partial, invalid, and authorization tests. NFR1 passed a 100-request single-client local measurement; see the verification record for method and limits. NFR3 teacher usability is verified through timed usability trials (3.75 min mean training time).
