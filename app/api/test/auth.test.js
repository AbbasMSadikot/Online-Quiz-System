import test, { before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import bcrypt from "bcryptjs";
import { prisma } from "../src/db.js";
import { createApp } from "../src/app.js";

const app = createApp({ prismaClient: prisma, jwtSecret: process.env.AUTH_JWT_SECRET });

before(async () => {
  await prisma.$connect();
  await prisma.user.deleteMany();
});

beforeEach(async () => {
  await prisma.user.deleteMany();
});

after(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
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
