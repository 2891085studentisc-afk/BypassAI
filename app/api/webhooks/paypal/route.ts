import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resource } = body;
    const status = resource?.status;
    const escalationId = resource?.custom_id || resource?.purchase_units?.[0]?.custom_id;

    if (status === "COMPLETED" && escalationId) {
      await prisma.escalation.update({
        where: { id: escalationId },
        data: { isPremium: true },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
