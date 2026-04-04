import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const escalation = await prisma.escalation.findUnique({
      where: { id },
    });

    if (!escalation) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json(escalation);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
