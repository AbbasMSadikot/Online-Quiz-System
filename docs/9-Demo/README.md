# Mini-Project Demos

The two recordings below are historical sprint artifacts. Preserve them as recorded and describe their visible contents accurately. Neither is a current end-to-end demonstration of the completed product.

## Historical recordings

### Sprint 1 recording

- **File:** [sprint-1-product-demo.mov](sprint-1-product-demo.mov)
- **Duration/date:** 59.99 seconds; recorded 31 October 2026, retrospectively (not during Sprint 1)
- **Visible scope:** registration succeeds; the success screen occupies much of the recording; it ends on a prefilled sign-in form without showing a completed login.
- **Recording issue:** a persistent browser debugging banner is visible and distracts from the product.
- **Privacy:** the visible registration uses a synthetic `example.test` identity.

The video proves registration only. Do not state it shows successful login/logout.

### Sprint 2 recording

- **File:** [sprint-2-product-demo.mp4](sprint-2-product-demo.mp4)
- **Duration/date:** 2 minutes; recorded 30 October 2026
- **Visible scope:** narrated/static slides describing architecture, authentication/roles, teacher quiz creation concepts, and the then-current test count.
- **Limitations:** it does not show a live teacher-to-student quiz workflow; its “10/10 tests” and “FR3/FR4 carried forward” statements are historical and stale against current code. Some checklist glyphs render as empty squares.

This is a historical Sprint 2 presentation, not proof of current working product flows. Do not edit the source recording to hide its date/scope; record a new final demo.

## Current final demo still required

- [ ] Record a clean end-to-end video on the current build; remove browser/debug overlays and use synthetic accounts/data.
- [ ] Show a teacher signing in, creating a quiz, and publishing it.
- [ ] Show a separate student signing in, selecting that teacher's quiz, answering, submitting, and receiving a score.
- [ ] Show the server-enforced timer/no-answer-key behavior or explain it from the API/tests.
- [ ] State known limitations: local SQLite vs PostgreSQL baseline; no hosted HTTPS proof; historical GitHub PRs lack recorded reviewer submissions.
- [ ] Upload the real capture here, document capture date/participants, and make sure no credentials/private information appear.

## Suggested narration

1. “This is the Online Quiz System. Students can register; teacher accounts are provisioned separately. Public registration creates student accounts only.”
2. “Teachers create and publish multiple-choice quizzes with instructions and a duration.”
3. “Students see active quizzes, start a timed attempt, and submit answers. The server owns the deadline and grading; the browser timer is only a display.”
4. “The API returns the score without exposing correct answers. A submitted quiz cannot be retaken; an unfinished attempt can be resumed until expiry.”
5. “Automated API tests and CI cover core routes. Local performance/load evidence has limits. Deployment HTTPS and full SRS grade-history/admin-user features remain gaps.”

The current checkout does not contain a fresh capture, so this folder intentionally does not claim the final demo requirement is complete.
