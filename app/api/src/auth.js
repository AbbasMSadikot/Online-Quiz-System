import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const HASH_ROUNDS = 12;
const TOKEN_LIFETIME = "15m";

function publicUser(user) {
  return { id: user.id, email: user.email, role: user.role };
}

function issueToken(user, secret) {
  return jwt.sign(
    { email: user.email, role: user.role },
    secret,
    { subject: String(user.id), expiresIn: TOKEN_LIFETIME }
  );
}

export function createAuthRouter({ prisma, jwtSecret }) {
  const router = Router();

  router.post("/register", async (req, res, next) => {
    try {
      const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
      const password = typeof req.body?.password === "string" ? req.body.password : "";
      if (!EMAIL_PATTERN.test(email) || password.length < PASSWORD_MIN_LENGTH) {
        return res.status(400).json({
          success: false,
          error: { code: 400, message: "Enter a valid email and a password with at least 8 characters." }
        });
      }

      const passwordHash = await bcrypt.hash(password, HASH_ROUNDS);
      const user = await prisma.user.create({
        data: { email, passwordHash, role: "student" }
      });
      return res.status(201).json({
        success: true,
        data: { user: publicUser(user), token: issueToken(user, jwtSecret) }
      });
    } catch (error) {
      if (error?.code === "P2002") {
        return res.status(409).json({
          success: false,
          error: { code: 409, message: "An account with this email already exists." }
        });
      }
      return next(error);
    }
  });

  router.post("/login", async (req, res, next) => {
    try {
      const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
      const password = typeof req.body?.password === "string" ? req.body.password : "";
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: { code: 400, message: "Email and password are required." }
        });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      const matches = user ? await bcrypt.compare(password, user.passwordHash) : false;
      if (!matches) {
        return res.status(401).json({
          success: false,
          error: { code: 401, message: "Email or password is incorrect." }
        });
      }
      return res.json({
        success: true,
        data: { user: publicUser(user), token: issueToken(user, jwtSecret) }
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

export function createRequireAuth(jwtSecret) {
  return (req, res, next) => {
    const header = req.get("authorization") ?? "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        error: { code: 401, message: "A valid bearer token is required." }
      });
    }

    try {
      const claims = jwt.verify(token, jwtSecret);
      req.auth = { id: Number(claims.sub), email: claims.email, role: claims.role };
      return next();
    } catch {
      return res.status(401).json({
        success: false,
        error: { code: 401, message: "The token is invalid or expired." }
      });
    }
  };
}
