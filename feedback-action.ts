"use server";

import { prisma } from "@/lib/prisma";
import { sanitizeInput } from "@/lib/security";
import { revalidatePath } from "next/cache";

export type FeedbackState = {
  success: boolean;
  error: string | null;
  id: string | null;
};

export async function submitFeedback(prevState: FeedbackState, formData: FormData): Promise<FeedbackState> {
  const name = sanitizeInput((formData.get("name") as string) || "");
  const email = (formData.get("email") as string) || "";
  const rating = parseInt((formData.get("rating") as string) || "0") || 0;
  const message = sanitizeInput((formData.get("message") as string) || "");

  try {
    const feedback = await prisma.feedback.create({
      data: { name, email, rating, message },
    });
    return { success: true, error: null, id: feedback.id };
  } catch (err) {
    return { 
      success: false, 
      error: "Failed to save feedback. Please try again.",
      id: null
    };
  }
}

export async function markFeedbackAsRead(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return { success: false };

  try {
    await prisma.feedback.update({
      where: { id },
      data: { isRead: true },
    });
    revalidatePath("/admin-dashboard");
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}