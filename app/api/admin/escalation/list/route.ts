import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const escalations = await prisma.escalation.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(escalations);
  } catch (error) {
    console.error("List error:", error);
    return NextResponse.json(
      { error: "Failed to fetch escalations." },
      { status: 500 }
    );
  }
}
