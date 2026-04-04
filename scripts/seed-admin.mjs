import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    console.log("🌱 Seeding admin user...");

    const hashedPassword = await hashPassword("admin123");

    const admin = await prisma.user.upsert({
      where: { email: "admin@bypass.ai" },
      update: {},
      create: {
        email: "admin@bypass.ai",
        password: hashedPassword,
        name: "Bypass.ai Admin",
        role: "superadmin"
      }
    });

    console.log("✅ Admin user created/updated:");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: admin123 (change this immediately!)`);
    console.log(`   Role: ${admin.role}`);

  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();