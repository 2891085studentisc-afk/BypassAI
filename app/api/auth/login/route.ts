import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken } from "@/lib/auth";

// This dummy hash prevents timing attacks by ensuring verifyPassword 
// always runs even if the user isn't found.
const DUMMY_HASH = "$2b$10$vI8AWBWzeu9ia3kC8Y0.9eyZ.z4yTidTBy/Cq.jFpX1.t.5R4iX0C";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Ensure inputs are strings to prevent internal property errors
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitizedEmail = email.trim().toLowerCase();
    if (!sanitizedEmail || !password || !emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: "A valid email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    });

    // Verify password against user hash OR dummy hash to maintain consistent response time
    const isValidPassword = await verifyPassword(password, user?.password || DUMMY_HASH);

    if (!user || !isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}