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
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
