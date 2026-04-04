import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(companies);
  } catch {
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, contact, successRate } = body;

    const company = await prisma.company.upsert({
      where: { name },
      update: { contact, successRate, isActive: true },
      create: { name, contact, successRate, isActive: true }
    });

    return NextResponse.json(company);
  } catch {
    return NextResponse.json({ error: "Failed to save company" }, { status: 500 });
  }
}
