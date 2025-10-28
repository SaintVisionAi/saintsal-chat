/**
 * app/api/auth/signout/route.ts
 * User logout endpoint
 */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true });

  // Clear session cookie
  response.cookies.set("saintsal_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });

  return response;
}
