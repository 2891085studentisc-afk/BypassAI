import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a production app, verify the webhook signature with PayPal here.
    // For now, we'll look for the order status and custom ID.
    
    const { resource } = body;
    const status = resource.status;
    const orderId = resource.id;
    const escalationId = resource.custom_id || (resource.purchase_units?.[0]?.custom_id);

    if (status === "COMPLETED" && escalationId) {
      // 1. Create or Update Payment
      const payment = await prisma.payment.upsert({
        where: { paypalOrderId: orderId },
        update: { status: "COMPLETED" },
        create: {
          paypalOrderId: orderId,
          amount: 8.00,
          currency: "GBP",
          status: "COMPLETED",
        }
      });

      // 2. Link to Escalation and set isPremium
      await prisma.escalation.update({
        where: { id: escalationId },
        data: {
          isPremium: true,
          paymentId: payment.id
        }
      });

      console.log(`[PAYPAL] Premium upgrade successful for Case: ${escalationId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
