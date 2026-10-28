import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { prisma } from "./db.js";
import { createAuthRouter, createRequireAuth } from "./auth.js";
import { createQuizRouter } from "./quizzes.js";

export function createApp({
  prismaClient = prisma,
  jwtSecret = process.env.AUTH_JWT_SECRET
} = {}) {
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error("AUTH_JWT_SECRET must contain at least 32 characters.");
  }

  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(express.json({ limit: "10kb" }));
  app.use("/api/auth", rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false
  }));
  app.use("/api/auth", createAuthRouter({ prisma: prismaClient, jwtSecret }));
  app.use("/api/quizzes", createQuizRouter({ prisma: prismaClient, jwtSecret }));

  app.get("/api/auth/me", createRequireAuth(jwtSecret), async (req, res, next) => {
    try {
      const user = await prismaClient.user.findUnique({
        where: { id: req.auth.id },
        select: { id: true, email: true, role: true }
      });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: { code: 401, message: "The account for this token no longer exists." }
        });
      }
      return res.json({ success: true, data: { user } });
    } catch (error) {
      return next(error);
    }
  });

  app.use((error, req, res, next) => {
    console.error(error);
    if (res.headersSent) return next(error);
    return res.status(500).json({
      success: false,
      error: { code: 500, message: "An unexpected server error occurred." }
    });
  });

  return app;
}
