import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create an admin user
  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@visa.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@visa.com",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log(admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
