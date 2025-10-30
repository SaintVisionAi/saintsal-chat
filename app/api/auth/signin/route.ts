/**
 * app/api/auth/signin/route.ts
 * User login endpoint
 */
import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const users = db.collection("users");

    // Find user
    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session
    const response = NextResponse.json({
      success: true,
      userId: user._id,
      email: user.email,
      name: user.name,
      plan: user.plan || "free",
    });

    // Set auth cookies (matching /api/auth/login)
    response.cookies.set("saintsal_auth", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    response.cookies.set("saintsal_user_email", user.email.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err: any) {
    console.error("Signin error:", err);
    return NextResponse.json(
      { error: "Server error: " + (err?.message ?? String(err)) },
      { status: 500 }
    );
  }
}
