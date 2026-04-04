import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: "Company name required" }, { status: 400 });

    const company = await prisma.company.upsert({
      where: { name },
      update: { 
        requestCount: { increment: 1 },
        isActive: false // Keep it off-list until an admin adds contact info
      },
      create: { 
        name, 
        contact: "Requested by user",
        isActive: false,
        requestCount: 1
      }
    });

    return NextResponse.json({ success: true, company });
  } catch {
    return NextResponse.json({ error: "Failed to log request" }, { status: 500 });
  }
}
