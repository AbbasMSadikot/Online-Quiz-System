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

test("returns full, zero, and partial scores without exposing the answer key", async () => {
  const { quiz, token } = await createFixture();
  const answers = quiz.questions.map(question => ({ questionId: question.id, answer: question.position === 1 ? "A" : "D" }));
  const full = await request(app).post(`/api/quizzes/${quiz.id}/submit`).set("Authorization", `Bearer ${token}`).send({ answers });
  assert.deepEqual(full.body.data.result, { quizId: quiz.id, correct: 2, total: 2, percentage: 100 });
  const zero = await request(app).post(`/api/quizzes/${quiz.id}/submit`).set("Authorization", `Bearer ${token}`).send({ answers: answers.map(answer => ({ ...answer, answer: "wrong" })) });
  assert.deepEqual(zero.body.data.result, { quizId: quiz.id, correct: 0, total: 2, percentage: 0 });
  const partial = await request(app).post(`/api/quizzes/${quiz.id}/submit`).set("Authorization", `Bearer ${token}`).send({ answers: [{ ...answers[0], answer: "A" }, { ...answers[1], answer: "wrong" }] });
  assert.deepEqual(partial.body.data.result, { quizId: quiz.id, correct: 1, total: 2, percentage: 50 });
  assert.equal(JSON.stringify(full.body).includes("correctAnswer"), false);
});

test("rejects incomplete, duplicate, unknown, unauthenticated, and non-student submissions", async () => {
  const { quiz, token } = await createFixture();
  const [first, second] = quiz.questions;
  for (const answers of [[{ questionId: first.id, answer: "A" }], [{ questionId: first.id, answer: "A" }, { questionId: first.id, answer: "A" }], [{ questionId: 99999, answer: "A" }, { questionId: second.id, answer: "D" }]]) {
    const response = await request(app).post(`/api/quizzes/${quiz.id}/submit`).set("Authorization", `Bearer ${token}`).send({ answers });
    assert.equal(response.status, 400);
  }
  const unauthenticated = await request(app).post(`/api/quizzes/${quiz.id}/submit`).send({ answers: [] });
  assert.equal(unauthenticated.status, 401);
  const teacher = await request(app).post("/api/auth/login").send({ email: "teacher@example.com", password: "correct horse battery" });
  const forbidden = await request(app).post(`/api/quizzes/${quiz.id}/submit`).set("Authorization", `Bearer ${teacher.body.data.token}`).send({ answers: [] });
  assert.equal(forbidden.status, 403);
});
