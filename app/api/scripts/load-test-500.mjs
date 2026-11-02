import { performance } from "node:perf_hooks";
import jwt from "jsonwebtoken";
import request from "supertest";
import { createApp } from "../src/app.js";
import { prisma } from "../src/db.js";

const concurrency = Number(process.env.NFR2_CONCURRENCY ?? 500);
const secret = process.env.AUTH_JWT_SECRET;
if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 500) {
  throw new Error("NFR2_CONCURRENCY must be an integer from 1 to 500.");
}
if (!secret || secret.length < 32) throw new Error("AUTH_JWT_SECRET must contain at least 32 characters.");

function percentile(sorted, value) {
  return sorted[Math.max(0, Math.ceil(sorted.length * value) - 1)];
}

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
let quizId;
let studentIds = [];
try {
  const owner = await prisma.user.create({
    data: { email: `nfr2-owner-${runId}@example.test`, passwordHash: "synthetic-load-test", role: "teacher" }
  });
  const studentRows = Array.from({ length: concurrency }, (_, index) => ({
    email: `nfr2-student-${index}-${runId}@example.test`, passwordHash: "synthetic-load-test", role: "student"
  }));
  await prisma.user.createMany({ data: studentRows });
  const students = await prisma.user.findMany({ where: { email: { in: studentRows.map(student => student.email) } }, select: { id: true, email: true, role: true } });
  studentIds = students.map(student => student.id);
  const quiz = await prisma.quiz.create({
    data: {
      title: `NFR2 concurrent load fixture ${runId}`, instructions: "Synthetic local-only load test.",
      durationMinutes: 30, ownerId: owner.id,
      questions: { create: Array.from({ length: 10 }, (_, index) => ({
        position: index + 1, prompt: `Load question ${index + 1}?`, optionsJson: JSON.stringify(["A", "B", "C", "D"]), correctAnswer: "A"
      })) }
    }, include: { questions: { orderBy: { position: "asc" }, select: { id: true } } }
  });
  quizId = quiz.id;
  const app = createApp({ prismaClient: prisma, jwtSecret: secret });
  const clients = students.map(student => ({
    token: jwt.sign({ email: student.email, role: student.role }, secret, { subject: String(student.id), expiresIn: "15m" })
  }));
  const answerPayload = quiz.questions.map(question => ({ questionId: question.id, answer: "A" }));
  const failures = [];
  const startTimings = new Array(concurrency);
  const timings = new Array(concurrency);

  // Synchronize all clients at the start of each phase to approximate an opening and a submit spike.
  const startBegan = performance.now();
  const startResponses = await Promise.all(clients.map(async (client, index) => {
    const started = performance.now();
    const response = await request(app).post(`/api/quizzes/${quiz.id}/start`).set("Authorization", `Bearer ${client.token}`);
    startTimings[index] = performance.now() - started;
    if (response.status !== 201) failures.push({ phase: "start", index, status: response.status, error: response.body?.error?.message });
    return response;
  }));
  const startDurationMs = performance.now() - startBegan;
  const validStartTimings = startTimings.filter(Number.isFinite).sort((a, b) => a - b);
  const submitBegan = performance.now();
  await Promise.all(clients.map(async (client, index) => {
    const attemptId = startResponses[index].body?.data?.attempt?.id;
    if (!attemptId) return;
    const started = performance.now();
    const response = await request(app).post(`/api/quizzes/${quiz.id}/submit`)
      .set("Authorization", `Bearer ${client.token}`).send({ attemptId, answers: answerPayload });
    timings[index] = performance.now() - started;
    if (response.status !== 200 || response.body?.data?.result?.correct !== 10) {
      failures.push({ phase: "submit", index, status: response.status, error: response.body?.error?.message });
    }
  }));
  const submitDurationMs = performance.now() - submitBegan;
  const validTimings = timings.filter(Number.isFinite).sort((a, b) => a - b);
  const result = {
    concurrency,
    quizQuestions: quiz.questions.length,
    totalStudentWorkflows: concurrency,
    startPhaseDurationMs: Number(startDurationMs.toFixed(2)),
    submitPhaseDurationMs: Number(submitDurationMs.toFixed(2)),
    completedSubmissions: validTimings.length - failures.filter(failure => failure.phase === "submit").length,
    startThroughputPerSecond: Number((concurrency / (startDurationMs / 1000)).toFixed(2)),
    startLatencyP50Ms: Number(percentile(validStartTimings, 0.50).toFixed(2)),
    startLatencyP95Ms: Number(percentile(validStartTimings, 0.95).toFixed(2)),
    startLatencyMaxMs: Number(validStartTimings.at(-1).toFixed(2)),
    submitThroughputPerSecond: Number((validTimings.length / (submitDurationMs / 1000)).toFixed(2)),
    submitLatencyP50Ms: validTimings.length ? Number(percentile(validTimings, 0.50).toFixed(2)) : null,
    submitLatencyP95Ms: validTimings.length ? Number(percentile(validTimings, 0.95).toFixed(2)) : null,
    submitLatencyMaxMs: validTimings.length ? Number(validTimings.at(-1).toFixed(2)) : null,
    errorCount: failures.length,
    failures: failures.slice(0, 20),
    environment: "local Node process and SQLite test database; synthetic authenticated student tokens; one concurrent client per student",
    note: "This run measures one local instance and does not establish production, network, or multi-instance capacity."
  };
  console.log(JSON.stringify(result, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  if (quizId) await prisma.quiz.deleteMany({ where: { id: quizId } });
  if (studentIds.length) await prisma.user.deleteMany({ where: { id: { in: studentIds } } });
  await prisma.user.deleteMany({ where: { email: { startsWith: `nfr2-owner-${runId}@example.test` } } });
  await prisma.$disconnect();
}
