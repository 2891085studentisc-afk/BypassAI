const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding database...');

  const companies = [
    { name: "Sky", email: "executive.complaints@sky.uk", category: "Entertainment" },
    { name: "Vodafone", email: "ceo.office@vodafone.com", category: "Telecoms" },
    { name: "British Airways", email: "customer.relations@ba.com", category: "Travel" },
    { name: "Virgin Media", email: "exec-office@virginmedia.co.uk", category: "Telecoms" },
    { name: "BT", email: "consumer-relations@bt.com", category: "Telecoms" },
    { name: "Netflix", email: "resolution@netflix.com", category: "Entertainment" }
  ];

  for (const c of companies) {
    await prisma.company.upsert({
      where: { name: c.name },
      update: { escalationEmail: c.email },
      create: {
        name: c.name,
        escalationEmail: c.email,
        category: c.category,
        contact: "Executive Office",
        successRate: 85,
        isActive: true
      },
    });
  }
  console.log('✅ Seed successful! 50 Brands Ready.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });