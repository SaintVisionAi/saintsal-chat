/**
 * app/api/auth/signup/route.ts
 * User registration endpoint
 */
import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, companyName, role } = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const users = db.collection("users");

    // Check if user already exists
    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await users.insertOne({
      name: name || email.split("@")[0],
      email: email.toLowerCase(),
      password: hashedPassword,
      companyName: companyName || "",
      role: role || "",
      plan: "free", // Default to free plan
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create session (simple cookie-based)
    const response = NextResponse.json(
      {
        success: true,
        userId: result.insertedId,
        email: email.toLowerCase(),
      },
      { status: 201 }
    );

    // Set auth cookies
    response.cookies.set("saintsal_auth", result.insertedId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    response.cookies.set("saintsal_user_email", email.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    response.cookies.set("saintsal_first_time", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5, // 5 minutes - just for onboarding flow
    });

    return response;
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Server error: " + (err?.message ?? String(err)) },
      { status: 500 }
    );
  }
}
