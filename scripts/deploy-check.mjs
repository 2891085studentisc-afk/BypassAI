import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

const REQUIRED_VARS = ['DATABASE_URL', 'RESEND_API_KEY', 'JWT_SECRET', 'ADMIN_PASSWORD'];

console.log("🚀 Starting Bypass.ai Production Pre-flight Check...");

const missing = REQUIRED_VARS.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error("❌ ERROR: Missing required environment variables in .env:");
  missing.forEach(m => console.error(`   - ${m}`));
  process.exit(1);
}

try {
  console.log("📡 Validating Database Connection...");
  execSync('npx prisma validate', { stdio: 'inherit' });
  
  console.log("🛠️ Generating Prisma Client...");
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log("✅ SUCCESS: Your project is ready for deployment.");
  console.log("🔗 Next Step: git push origin main");
} catch (error) {
  console.error("❌ ERROR: Validation failed. Check your database URL or schema.");
  process.exit(1);
}