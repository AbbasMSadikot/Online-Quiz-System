import test, { before, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import bcrypt from "bcryptjs";
import { createApp } from "../src/app.js";
import { prisma } from "../src/db.js";

const app = createApp({ prismaClient: prisma, jwtSecret: process.env.AUTH_JWT_SECRET });
before(async () => { await prisma.$connect(); });
beforeEach(async () => {
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.user.deleteMany();
});
after(async () => { await prisma.$disconnect(); });

async function createFixture() {
  const passwordHash = await bcrypt.hash("correct horse battery", 4);
  const teacher = await prisma.user.create({ data: { email: "teacher@example.com", passwordHash, role: "teacher" } });
  const student = await prisma.user.create({ data: { email: "student@example.com", passwordHash, role: "student" } });
  const quiz = await prisma.quiz.create({
    data: {
      title: "Grading boundary cases", instructions: "Answer all questions.", ownerId: teacher.id,
      questions: { create: [
        { position: 1, prompt: "One?", optionsJson: JSON.stringify(["A", "B"]), correctAnswer: "A" },
        { position: 2, prompt: "Two?", optionsJson: JSON.stringify(["C", "D"]), correctAnswer: "D" }
      ] }
    }, include: { questions: true }
  });
  const login = await request(app).post("/api/auth/login").send({ email: student.email, password: "correct horse battery" });
  return { quiz, token: login.body.data.token };
}

async function startAttempt(quizId, token) {
  const response = await request(app).post(`/api/quizzes/${quizId}/start`).set("Authorization", `Bearer ${token}`);
  assert.equal(response.status, 201);
  return response.body.data.attempt;
}

test("returns full, zero, and partial scores without exposing the answer key", async () => {
  const { quiz, token } = await createFixture();
  const answers = quiz.questions.map(question => ({ questionId: question.id, answer: question.position === 1 ? "A" : "D" }));
  const fullAttempt = await startAttempt(quiz.id, token);
  const full = await request(app).post(`/api/quizzes/${quiz.id}/submit`).set("Authorization", `Bearer ${token}`).send({ attemptId: fullAttempt.id, answers });
  assert.deepEqual(full.body.data.result, { quizId: quiz.id, attemptId: fullAttempt.id, correct: 2, total: 2, percentage: 100, submittedAt: full.body.data.result.submittedAt });
  const zeroAttempt = await startAttempt(quiz.id, token);
  const zero = await request(app).post(`/api/quizzes/${quiz.id}/submit`).set("Authorization", `Bearer ${token}`).send({ attemptId: zeroAttempt.id, answers: answers.map(answer => ({ ...answer, answer: "wrong" })) });
  assert.equal(zero.body.data.result.correct, 0);
  assert.equal(zero.body.data.result.percentage, 0);
  const partialAttempt = await startAttempt(quiz.id, token);
  const partial = await request(app).post(`/api/quizzes/${quiz.id}/submit`).set("Authorization", `Bearer ${token}`).send({ attemptId: partialAttempt.id, answers: [{ ...answers[0], answer: "A" }, { ...answers[1], answer: "wrong" }] });
  assert.equal(partial.body.data.result.correct, 1);
  assert.equal(partial.body.data.result.total, 2);
  assert.equal(partial.body.data.result.percentage, 50);
  assert.equal(JSON.stringify(full.body).includes("correctAnswer"), false);
});

test("rejects incomplete, duplicate, unknown, unauthenticated, and non-student submissions", async () => {
  const { quiz, token } = await createFixture();
  const [first, second] = quiz.questions;
  for (const answers of [[{ questionId: first.id, answer: "A" }], [{ questionId: first.id, answer: "A" }, { questionId: first.id, answer: "A" }], [{ questionId: 99999, answer: "A" }, { questionId: second.id, answer: "D" }]]) {
    const attempt = await startAttempt(quiz.id, token);
    const response = await request(app).post(`/api/quizzes/${quiz.id}/submit`).set("Authorization", `Bearer ${token}`).send({ attemptId: attempt.id, answers });
    assert.equal(response.status, 400);
  }
  const unauthenticated = await request(app).post(`/api/quizzes/${quiz.id}/submit`).send({ attemptId: 1, answers: [] });
  assert.equal(unauthenticated.status, 401);
  const teacher = await request(app).post("/api/auth/login").send({ email: "teacher@example.com", password: "correct horse battery" });
  const forbidden = await request(app).post(`/api/quizzes/${quiz.id}/submit`).set("Authorization", `Bearer ${teacher.body.data.token}`).send({ attemptId: 1, answers: [] });
  assert.equal(forbidden.status, 403);
});

test("enforces the server-side deadline and permits a submission only once", async () => {
  const { quiz, token } = await createFixture();
  const attempt = await startAttempt(quiz.id, token);
  const answers = quiz.questions.map(question => ({ questionId: question.id, answer: "A" }));
  await prisma.quizAttempt.update({ where: { id: attempt.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
  const late = await request(app).post(`/api/quizzes/${quiz.id}/submit`).set("Authorization", `Bearer ${token}`).send({ attemptId: attempt.id, answers });
  assert.equal(late.status, 410);

  const validAttempt = await startAttempt(quiz.id, token);
  const accepted = await request(app).post(`/api/quizzes/${quiz.id}/submit`).set("Authorization", `Bearer ${token}`).send({ attemptId: validAttempt.id, answers });
  assert.equal(accepted.status, 200);
  assert.ok(accepted.body.data.result.submittedAt);
  const savedAttempt = await prisma.quizAttempt.findUnique({ where: { id: validAttempt.id } });
  assert.equal(savedAttempt.quizId, quiz.id);
  assert.equal(savedAttempt.correct, accepted.body.data.result.correct);
  assert.deepEqual(JSON.parse(savedAttempt.answersJson), answers);
  const duplicate = await request(app).post(`/api/quizzes/${quiz.id}/submit`).set("Authorization", `Bearer ${token}`).send({ attemptId: validAttempt.id, answers });
  assert.equal(duplicate.status, 409);
});
