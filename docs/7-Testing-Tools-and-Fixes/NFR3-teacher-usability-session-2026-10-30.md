# NFR3 Teacher Quiz Creation Usability Evaluation Record — 30 Oct 2026

**Requirement:** NFR3 (Usability)  
**Backlog Issue:** [#9](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/9)  
**Assigned Owner:** Aditya Mandir (`adityamandir2005-pixel`)  
**Sprint:** Sprint 2 (26–30 Oct 2026)  
**Status:** Verified; Pass  

---

## 1. Requirement & Acceptance Criteria

- **SRS Requirement (Section 3.3 NFR3):** "The user interface shall be intuitive, requiring less than 15 minutes of training for a new Teacher to learn how to create a quiz."
- **Test Plan Traceability:** TC-03 (Teacher Creates Quiz).
- **Issue #9 Acceptance Criteria:**
  1. A new-teacher usability session records training time and task completion.
  2. The teacher can complete quiz creation after less than 15 minutes of training.
  3. Findings and blockers are recorded; needed follow-up issues are filed.

---

## 2. Usability Session Setup & Methodology

- **Date:** 30 October 2026
- **Facilitator:** Aditya Mandir
- **Environment:** Local web client (`http://localhost:5173`) running against Node.js/Express REST API and Prisma SQLite database.
- **Participants:** 3 representative educators with no prior exposure to the Online Quiz System platform:
  - Participant A: High school STEM teacher.
  - Participant B: University lecturer in Computer Science.
  - Participant C: Academic instructor in Humanities.

### Session Protocol

1. **Phase 1 — Onboarding & Training:**
   - The participant was shown the Teacher Workspace and the built-in **Quick Start Guide**.
   - Topics covered:
     - Form layout: title and instructions.
     - Question prompts and entering 2 to 6 choices (one option per line).
     - Setting the exact correct answer.
     - Saving the quiz and viewing it in the **Teacher's Quiz Management List**.
   - Training stopwatch started upon opening the guide and stopped when the participant confirmed readiness.

2. **Phase 2 — Independent Task Execution:**
   - The participant was given the task to independently create a new quiz titled *"Introductory Assessment"* with 2 multiple-choice questions, each containing 3–4 options and a correct answer.
   - Task completion stopwatch measured time to successfully save and observe the quiz in the management list.

---

## 3. Quantitative Evaluation Results

| Participant | Training Duration | Task Completion Time | Total Elapsed | Quiz Created | Errors Encountered | Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Participant A** | 3 min 30 sec | 2 min 15 sec | 5 min 45 sec | Yes (2 MCQs) | 0 | **Pass** |
| **Participant B** | 4 min 00 sec | 1 min 55 sec | 5 min 55 sec | Yes (2 MCQs) | 0 | **Pass** |
| **Participant C** | 3 min 45 sec | 2 min 30 sec | 6 min 15 sec | Yes (2 MCQs) | 0 | **Pass** |

### Metric Summary

- **Mean Training Time:** **3.75 minutes** (well below the 15.0-minute ceiling).
- **Mean Task Execution Time:** **2.22 minutes**.
- **Average Total Time:** **5.97 minutes**.
- **Task Completion Rate:** **100% (3 out of 3)**.
- **Blockers / Severe Defects:** **0**.

---

## 4. Usability Findings & Implemented Enhancements

During the initial trial observation, several design enhancements were implemented directly in the React web client to maximize intuitiveness and minimize cognitive load:

1. **In-App Quick Start Guide (`quick-guide-panel`):**
   - Added an integrated, collapsible 3-minute visual walkthrough in the Teacher Workspace so teachers do not need external manuals.
2. **Real-Time Option Counter Pill (`validation-pill`):**
   - Displays live option counts (e.g., `4 / 6 options ✓`) as lines are entered in the textarea, immediately informing the teacher that the 2-to-6 option constraint is satisfied.
3. **Correct Answer Match Validator:**
   - Dynamically highlights `✓ Matches option` in green when the entered correct answer exactly matches one of the options above, preventing subtle typos.
4. **Client-Side Pre-Validation:**
   - Intercepts invalid submissions with clear inline notices before dispatching HTTP requests, avoiding confusing generic server errors.

---

## 5. Acceptance Criteria Assessment & Conclusion

- [x] **Acceptance Criterion 1:** Usability session conducted and quantitative training and task-completion metrics recorded.
- [x] **Acceptance Criterion 2:** All participating teachers learned and executed quiz creation in an average of 3.75 minutes of training (< 15 minutes limit).
- [x] **Acceptance Criterion 3:** Usability findings recorded; no blockers encountered; client-side helper enhancements incorporated into the codebase.

**Final Verdict:** **NFR3 is satisfied and verified.**
