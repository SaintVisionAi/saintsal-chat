/**
 * app/api/admin/auth/route.ts
 * Secure Admin Authentication using environment variables and sessions
 */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession, createSessionResponse, SessionData } from "../../../../lib/session";

// Admin credentials from environment variables (REQUIRED in production)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ryan@cookinknowledge.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

if (process.env.NODE_ENV === 'production' && !process.env.ADMIN_PASSWORD) {
  console.error('❌ CRITICAL: ADMIN_PASSWORD environment variable not set in production!');
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Check if admin credentials match
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    // In production, require ADMIN_PASSWORD env var
    if (process.env.NODE_ENV === 'production' && !ADMIN_PASSWORD) {
      console.error('❌ [ADMIN] ADMIN_PASSWORD not configured');
      return NextResponse.json({ error: "Admin authentication not configured" }, { status: 500 });
    }

    // Compare password (use bcrypt if stored hash, or direct compare if env var)
    let isValid = false;
    if (ADMIN_PASSWORD.startsWith('$2')) {
      // Password is bcrypt hashed
      isValid = await bcrypt.compare(password, ADMIN_PASSWORD);
    } else {
      // Password is plain text (for development only)
      if (process.env.NODE_ENV === 'production') {
        console.error('❌ [ADMIN] Plain text password in production! Use bcrypt hash.');
        return NextResponse.json({ error: "Invalid configuration" }, { status: 500 });
      }
      isValid = password === ADMIN_PASSWORD;
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    // Create secure admin session
    const sessionData: SessionData = {
      userId: 'admin', // Special admin user ID
      email: ADMIN_EMAIL.toLowerCase(),
      name: "Ryan (Admin)",
      plan: 'enterprise',
      emailVerified: true,
      isAdmin: true, // Mark as admin
    };

    const response = await createSessionResponse(req, sessionData, {
      success: true,
      user: {
        email: ADMIN_EMAIL,
        role: "admin",
        name: "Ryan (Admin)",
      },
    });

    return response;
  } catch (error: any) {
    console.error("Admin auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

// Logout
export async function DELETE(req: NextRequest) {
  try {
    const res = NextResponse.json({ success: true, message: "Logged out" });
    const session = await getSession(req, res);
    // Clear session by removing all properties
    Object.keys(session).forEach(key => {
      delete (session as any)[key];
    });
    await (session as any).save();
    return res;
  } catch (error: any) {
    console.error("Admin logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}

// Verify session
export async function GET(req: NextRequest) {
  try {
    const res = NextResponse.json({ authenticated: false });
    const session = await getSession(req, res);

    if (session.isAdmin && session.email === ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({
        authenticated: true,
        user: {
          email: ADMIN_EMAIL,
          role: "admin",
          name: session.name || "Ryan (Admin)",
        },
      });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error: any) {
    console.error("Admin session check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
