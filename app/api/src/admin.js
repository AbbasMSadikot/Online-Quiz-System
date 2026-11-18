import { Router } from "express";
import { createRequireAuth } from "./auth.js";

function requireAdmin(req, res, next) {
  if (req.auth.role === "admin") return next();
  return res.status(403).json({
    success: false,
    error: { code: 403, message: "Administrator privileges are required." }
  });
}

export function createAdminRouter({ prisma, jwtSecret }) {
  const router = Router();
  router.use(createRequireAuth(jwtSecret, prisma), requireAdmin);

  router.get("/users", async (req, res, next) => {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, email: true, role: true, createdAt: true }
      });
      return res.json({ success: true, data: { users } });
    } catch (error) {
      return next(error);
    }
  });

  router.patch("/users/:userId/role", async (req, res, next) => {
    const userId = Number(req.params.userId);
    const role = req.body?.role;
    if (!Number.isInteger(userId) || userId < 1 || !["student", "teacher"].includes(role)) {
      return res.status(400).json({
        success: false,
        error: { code: 400, message: "Provide a valid user ID and a student or teacher role." }
      });
    }
    if (userId === req.auth.id) {
      return res.status(409).json({
        success: false,
        error: { code: 409, message: "Administrators cannot change their own role." }
      });
    }

    try {
      const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });
      if (!target || target.role === "admin") {
        return res.status(404).json({ success: false, error: { code: 404, message: "User not found." } });
      }
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: { id: true, email: true, role: true }
      });
      return res.json({ success: true, data: { user: updated } });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
