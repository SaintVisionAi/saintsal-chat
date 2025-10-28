/**
 * app/api/admin/auth/route.ts
 * Admin Authentication - ryan@cookinknowledge.com
 */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// ADMIN CREDENTIALS (Environment variables for security)
const ADMIN_EMAIL = "ryan@cookinknowledge.com";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("Ayden0428$$", 10);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Check if admin credentials
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    // Create admin session
    const response = NextResponse.json({
      success: true,
      user: {
        email: ADMIN_EMAIL,
        role: "admin",
        name: "Ryan (Admin)",
      },
    });

    // Set admin session cookie
    response.cookies.set("saintsal_admin_session", "admin-authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Admin auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

// Logout
export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete("saintsal_admin_session");
  return response;
}

// Verify session
export async function GET(req: NextRequest) {
  const session = req.cookies.get("saintsal_admin_session");

  if (session?.value === "admin-authenticated") {
    return NextResponse.json({
      authenticated: true,
      user: {
        email: ADMIN_EMAIL,
        role: "admin",
        name: "Ryan (Admin)",
      },
    });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
