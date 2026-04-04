import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Update this array with your actual company names and their CEO/Escalation emails
const companyUpdates = [
  { name: "Sky", email: "corporate.complaints@sky.uk" },
  { name: "Barclays", email: "ceo.office@barclays.com" },
  { name: "Ryanair", email: "ceo.office@ryanair.com" },
  { name: "British Airways", email: "ceo@ba.com" },
  { name: "Vodafone", email: "ceo.office@vodafone.com" },
  { name: "BT", email: "ceo.office@bt.com" },
  // Add the rest of your Top 50 here...
];

async function main() {
  console.log("🚀 Starting migration of company escalation emails...");

  let updatedCount = 0;
  let missingCount = 0;

  for (const entry of companyUpdates) {
    try {
      // Check if the company exists in the database
      const company = await prisma.company.findUnique({
        where: { name: entry.name }
      });

      if (company) {
        await prisma.company.update({
          where: { id: company.id },
          data: { escalationEmail: entry.email }
        });
        console.log(`✅ Updated: ${entry.name} -> ${entry.email}`);
        updatedCount++;
      } else {
        console.warn(`⚠️  Skipped: "${entry.name}" not found in database.`);
        missingCount++;
      }
    } catch (error) {
      console.error(`❌ Error updating ${entry.name}:`, error.message);
    }
  }

  console.log("\n------------------------------------");
  console.log(`Migration Summary: ${updatedCount} updated, ${missingCount} skipped.`);
  console.log("------------------------------------\n");
}

main()
  .catch((e) => {
    console.error("❌ Fatal error during migration:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });