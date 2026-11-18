import bcrypt from "bcryptjs";
import { prisma } from "./db.js";

async function main() {
  const passwordHash = await bcrypt.hash("Teacher123!", 12);
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@example.com" },
    update: { role: "teacher" },
    create: {
      email: "teacher@example.com",
      passwordHash,
      role: "teacher"
    }
  });
  console.log(`Provisioned teacher account: ${teacher.email} (role: ${teacher.role})`);

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail || adminPassword) {
    if (!adminEmail || !adminPassword || adminPassword.length < 8 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
      throw new Error("Set both ADMIN_EMAIL and an ADMIN_PASSWORD of at least 8 characters to provision an administrator.");
    }
    const adminPasswordHash = await bcrypt.hash(adminPassword, 12);
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: "admin" },
      create: { email: adminEmail, passwordHash: adminPasswordHash, role: "admin" }
    });
    console.log(`Provisioned administrator account: ${admin.email} (role: ${admin.role})`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
