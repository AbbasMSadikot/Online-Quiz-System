import test, { before, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import bcrypt from "bcryptjs";
import { createApp } from "../src/app.js";
import { prisma } from "../src/db.js";

const app = createApp({ prismaClient: prisma, jwtSecret: process.env.AUTH_JWT_SECRET });

before(async () => {
  await prisma.$connect();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.user.deleteMany();
});

beforeEach(async () => {
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.user.deleteMany();
});

after(async () => {
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

test("creates a quiz with its multiple-choice questions for an authorized teacher", async () => {
  const passwordHash = await bcrypt.hash("correct horse battery", 12);
  const teacher = await prisma.user.create({
    data: { email: "teacher@example.com", passwordHash, role: "teacher" }
  });
  const login = await request(app).post("/api/auth/login")
    .send({ email: teacher.email, password: "correct horse battery" });
  assert.equal(login.status, 200);

  const response = await request(app)
    .post("/api/quizzes")
    .set("Authorization", `Bearer ${login.body.data.token}`)
    .send({
      title: "Science basics",
      instructions: "Choose one answer for each question.",
      questions: [{
        prompt: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
        correctAnswer: "Mars"
      }]
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.quiz.title, "Science basics");
  assert.equal(response.body.data.quiz.questions.length, 1);
  assert.deepEqual(response.body.data.quiz.questions[0].options, ["Earth", "Mars", "Venus", "Jupiter"]);
  assert.equal("correctAnswer" in response.body.data.quiz.questions[0], false);

  const saved = await prisma.quiz.findUnique({
    where: { id: response.body.data.quiz.id },
    include: { questions: true }
  });
  assert.equal(saved.ownerId, teacher.id);
  assert.equal(saved.questions[0].correctAnswer, "Mars");
});

test("lists quizzes created by the authorized teacher in the quiz management list", async () => {
  const passwordHash = await bcrypt.hash("correct horse battery", 12);
  const teacher = await prisma.user.create({
    data: { email: "teacher@example.com", passwordHash, role: "teacher" }
  });
  const login = await request(app).post("/api/auth/login")
    .send({ email: teacher.email, password: "correct horse battery" });
  const token = login.body.data.token;

  await request(app)
    .post("/api/quizzes")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Science basics",
      instructions: "Answer all questions.",
      questions: [{ prompt: "Planet?", options: ["Mars", "Venus"], correctAnswer: "Mars" }]
    });

  const response = await request(app)
    .get("/api/quizzes")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.quizzes.length, 1);
  assert.equal(response.body.data.quizzes[0].title, "Science basics");
  assert.equal(response.body.data.quizzes[0].questions.length, 1);
});

test("rejects student access to teacher quiz management list", async () => {
  const registration = await request(app).post("/api/auth/register")
    .send({ email: "student@example.com", password: "correct horse battery" });

  const denied = await request(app)
    .get("/api/quizzes")
    .set("Authorization", `Bearer ${registration.body.data.token}`);

  assert.equal(denied.status, 403);
});

test("rejects quiz creation without authentication and for a student", async () => {
  const missingToken = await request(app).post("/api/quizzes").send({});
  assert.equal(missingToken.status, 401);

  const registration = await request(app).post("/api/auth/register")
    .send({ email: "student@example.com", password: "correct horse battery" });
  const denied = await request(app).post("/api/quizzes")
    .set("Authorization", `Bearer ${registration.body.data.token}`)
    .send({
      title: "Not allowed",
      instructions: "Student role",
      questions: [{ prompt: "Question?", options: ["A", "B"], correctAnswer: "A" }]
    });
  assert.equal(denied.status, 403);
});

test("rejects missing quiz fields and malformed multiple-choice questions", async () => {
  const passwordHash = await bcrypt.hash("correct horse battery", 12);
  const teacher = await prisma.user.create({
    data: { email: "teacher@example.com", passwordHash, role: "teacher" }
  });
  const login = await request(app).post("/api/auth/login")
    .send({ email: teacher.email, password: "correct horse battery" });
  const token = login.body.data.token;

  const invalidRequests = [
    { instructions: "No title", questions: [{ prompt: "Q?", options: ["A", "B"], correctAnswer: "A" }] },
    { title: "No questions", instructions: "Instructions", questions: [] },
    { title: "Bad answer", instructions: "Instructions", questions: [{ prompt: "Q?", options: ["A", "B"], correctAnswer: "C" }] },
    { title: "Bad options", instructions: "Instructions", questions: [{ prompt: "Q?", options: ["A", "A"], correctAnswer: "A" }] }
  ];
  for (const body of invalidRequests) {
    const response = await request(app).post("/api/quizzes")
      .set("Authorization", `Bearer ${token}`)
      .send(body);
    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
    assert.ok(response.body.error.message);
  }
});

test("registers an account, normalizes email, and stores a salted bcrypt hash", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({ email: "  Student@Example.com ", password: "correct horse battery" });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.user.email, "student@example.com");
  assert.equal(response.body.data.user.role, "student");
  assert.ok(response.body.data.token);
  assert.equal("passwordHash" in response.body.data.user, false);

  const stored = await prisma.user.findUnique({ where: { email: "student@example.com" } });
  assert.notEqual(stored.passwordHash, "correct horse battery");
  assert.equal(await bcrypt.compare("correct horse battery", stored.passwordHash), true);
});

test("rejects invalid registration fields and duplicate email", async () => {
  const invalid = await request(app).post("/api/auth/register")
    .send({ email: "not-an-email", password: "short" });
  assert.equal(invalid.status, 400);

  await request(app).post("/api/auth/register")
    .send({ email: "student@example.com", password: "correct horse battery" });
  const duplicate = await request(app).post("/api/auth/register")
    .send({ email: "STUDENT@example.com", password: "correct horse battery" });
  assert.equal(duplicate.status, 409);
});

test("logs in with valid credentials and rejects invalid credentials", async () => {
  await request(app).post("/api/auth/register")
    .send({ email: "student@example.com", password: "correct horse battery" });

  const valid = await request(app).post("/api/auth/login")
    .send({ email: "STUDENT@example.com", password: "correct horse battery" });
  assert.equal(valid.status, 200);
  assert.ok(valid.body.data.token);

  const invalid = await request(app).post("/api/auth/login")
    .send({ email: "student@example.com", password: "wrong password" });
  assert.equal(invalid.status, 401);
});

test("requires a valid token for the authenticated account endpoint", async () => {
  const missing = await request(app).get("/api/auth/me");
  assert.equal(missing.status, 401);

  const registered = await request(app).post("/api/auth/register")
    .send({ email: "student@example.com", password: "correct horse battery" });
  const accepted = await request(app).get("/api/auth/me")
    .set("Authorization", `Bearer ${registered.body.data.token}`);
  assert.equal(accepted.status, 200);
  assert.equal(accepted.body.data.user.email, "student@example.com");
});
