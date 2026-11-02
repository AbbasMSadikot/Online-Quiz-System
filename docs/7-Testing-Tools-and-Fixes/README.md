# Software Testing Tools, Bug Fixes, and Retests

Record the tools actually used, findings, patches, and retests. Do not claim a pass when a prerequisite feature is missing.

- [SEC2 role-based access verification](SEC2-RBAC-verification-2026-10-30.md)
- [NFR1 grading performance verification](NFR1-performance-verification-2026-10-31.md)
- [NFR3 teacher usability session record](NFR3-teacher-usability-session-2026-10-30.md)
- [FR4 automatic grading verification](FR4-grading-verification-2026-10-31.md)
- [FR3 timed student flow and NFR2 local 500-client load verification](FR3-and-NFR2-verification-2026-11-02.md)

Automated API checks, the repeatable grading benchmark, and the React production build run in the repository's Application checks workflow. FR3 covers student quiz selection, server-side timing, publishing state, answer-key privacy, and attempt submission; FR4 covers full, zero, partial, malformed, and authorization cases. A local 500-client test passed with zero errors; the evidence record states deployment limits. NFR3 teacher usability is verified through timed usability trials (3.75 min mean training time).
