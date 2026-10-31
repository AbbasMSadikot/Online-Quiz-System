# Mini-Project Demos

Store the actual working-product recordings here, or link to files committed in this folder.

## Submission checklist

- [x] Sprint 1 scope demo: 59.99-second retrospective recording captured 31 October 2026 (Assigned to AbbasMSadikot, [Issue #12](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/12))
- [x] Sprint 2 demo: approximately two minutes, recorded for Sprint 2 (26–30 Oct 2026) (Assigned to Aditya Mandir, [Issue #13](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/13))
- [x] Show the implemented user flows and state any known gaps/deviations
- [x] Confirm each video plays and does not expose credentials or private test data

---

## Sprint 1 Scope Demonstration

- **File:** [sprint-1-product-demo.mov](sprint-1-product-demo.mov)
- **Duration:** 59.99 seconds
- **Format:** QuickTime MOV screen recording
- **Recorded Date:** 31 October 2026 (retrospective demonstration; not recorded during the Sprint 1 dates)
- **Demonstrated:** Student account registration, successful authenticated session, sign-out, and successful sign-in on the local application.
- **Test identity:** A synthetic `example.test` student account; no personal credentials are shown.

This recording demonstrates the Sprint 1 authentication scope. It is a retrospective recording and is not represented as footage captured during 19–23 October.

---

## Sprint 2 Working Product Demonstration

- **File:** [sprint-2-product-demo.mp4](sprint-2-product-demo.mp4)
- **Duration:** 2 minutes (120 seconds, 2880 frames at 24 fps)
- **Format:** H.264 MP4 (1280x720 progressive, yuv420p)
- **File Size:** ~1.58 MB
- **Demonstrator / Author:** Aditya Mandir (`adityamandir2005-pixel`)
- **Recorded Date:** 30 October 2026

### Demonstrated User Flows & Verifications

1. **System Overview & Architecture Alignment (0:00 – 0:18):**
   - Introduces the Online Quiz System, Sprint 2 objectives, and adherence to the submitted IEEE 3-Tier Architecture (React SPA + Express REST API + Prisma/SQLite relational database).
2. **User Authentication & RBAC (0:18 – 0:40):**
   - Demonstrates student and teacher authentication (FR1, SEC1) using bcrypt salted hashing and 15-minute JWT tokens.
   - Shows role-based access control (SEC2): students are denied access to quiz authoring (HTTP 403 Forbidden), while teachers and administrators receive full authoring access.
3. **Teacher Usability & Fast Onboarding (0:40 – 1:05):**
   - Shows the in-app Quick Start Guide and live visual validators that allow teachers to master quiz creation in an average of 3.75 minutes (< 15-minute NFR3 ceiling).
4. **Quiz Creation & Validation (1:05 – 1:30):**
   - Demonstrates composing a quiz with title, instructions, and multiple-choice questions (FR2). Shows real-time option counts (`4 / 6 options ✓`) and answer matching validation (`✓ Matches option`).
   - Verifies the `POST /api/quizzes` JSON payload and HTTP 201 Created response.
5. **Quiz Management List & Automated Test Suite (1:30 – 1:50):**
   - Verifies persistence in the relational database and immediate appearance in the **Teacher's Quiz Management List** (Test Case TC-03).
   - Reviews the automated test suite with 10 passing tests in `app/api/test/auth.test.js`.
6. **Sprint 2 Conclusion & Backlog Disposition (1:50 – 2:00):**
   - Summarizes verified deliverables (FR1, FR2, SEC1, SEC2, NFR3, Demo Video) and records that student quiz taking (FR3) and automated grading (FR4) remain carried forward in the project backlog.
