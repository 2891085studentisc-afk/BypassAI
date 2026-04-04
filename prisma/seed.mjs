import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = await new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100_000, 64, "sha512", (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });
  return `${salt}:${derived.toString("hex")}`;
}

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@bypass.ai";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const hashed = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: { password: hashed },
    create: { email, password: hashed, name: "Admin", role: "superadmin" },
  });

  console.log(`✅ Admin seeded: ${email}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
