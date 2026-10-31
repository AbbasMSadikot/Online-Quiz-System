import { performance } from "node:perf_hooks";
import jwt from "jsonwebtoken";
import request from "supertest";
import { createApp } from "../src/app.js";
import { prisma } from "../src/db.js";

const iterations = Number(process.env.NFR1_ITERATIONS ?? 100);
const warmupCount = 5;
const secret = process.env.AUTH_JWT_SECRET;

if (!Number.isInteger(iterations) || iterations < 30) {
  throw new Error("NFR1_ITERATIONS must be an integer of at least 30.");
}
if (!secret || secret.length < 32) {
  throw new Error("AUTH_JWT_SECRET must contain at least 32 characters.");
}

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
let quizId;
const createdUserIds = [];

function percentile(sortedValues, fraction) {
  return sortedValues[Math.ceil(sortedValues.length * fraction) - 1];
}

try {
  const owner = await prisma.user.create({
    data: { email: `nfr1-owner-${runId}@example.test`, passwordHash: "benchmark-only", role: "teacher" }
  });
  createdUserIds.push(owner.id);
  const student = await prisma.user.create({
    data: { email: `nfr1-student-${runId}@example.test`, passwordHash: "benchmark-only", role: "student" }
  });
  createdUserIds.push(student.id);

  const quiz = await prisma.quiz.create({
    data: {
      title: `NFR1 grading benchmark ${runId}`,
      instructions: "Synthetic local performance fixture.",
      ownerId: owner.id,
      questions: {
        create: Array.from({ length: 10 }, (_, index) => ({
          position: index + 1,
          prompt: `Benchmark question ${index + 1}?`,
          optionsJson: JSON.stringify(["A", "B", "C", "D"]),
          correctAnswer: "A"
        }))
      }
    },
    include: { questions: { orderBy: { position: "asc" }, select: { id: true } } }
  });
  quizId = quiz.id;

  const token = jwt.sign(
    { email: student.email, role: student.role },
    secret,
    { subject: String(student.id), expiresIn: "15m" }
  );
  const app = createApp({ prismaClient: prisma, jwtSecret: secret });
  const answers = quiz.questions.map(question => ({ questionId: question.id, answer: "A" }));
  const submit = () => request(app)
    .post(`/api/quizzes/${quiz.id}/submit`)
    .set("Authorization", `Bearer ${token}`)
    .send({ answers });

  for (let index = 0; index < warmupCount; index += 1) {
    const response = await submit();
    if (response.status !== 200 || response.body?.data?.result?.correct !== 10) {
      throw new Error(`Warm-up grading request failed with HTTP ${response.status}.`);
    }
  }

  const timings = [];
  for (let index = 0; index < iterations; index += 1) {
    const started = performance.now();
    const response = await submit();
    const elapsedMs = performance.now() - started;
    if (response.status !== 200 || response.body?.data?.result?.correct !== 10) {
      throw new Error(`Measured grading request ${index + 1} failed with HTTP ${response.status}.`);
    }
    timings.push(elapsedMs);
  }

  timings.sort((left, right) => left - right);
  const result = {
    iterations,
    warmupRequests: warmupCount,
    quizQuestions: quiz.questions.length,
    load: "one local client; sequential requests; no competing workload",
    p50Ms: Number(percentile(timings, 0.50).toFixed(2)),
    p95Ms: Number(percentile(timings, 0.95).toFixed(2)),
    maxMs: Number(timings.at(-1).toFixed(2)),
    thresholdMs: 2000,
    passed: timings.at(-1) < 2000
  };
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
} finally {
  if (quizId) await prisma.quiz.deleteMany({ where: { id: quizId } });
  if (createdUserIds.length) await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
  await prisma.$disconnect();
}
