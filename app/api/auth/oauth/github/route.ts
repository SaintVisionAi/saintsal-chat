/**
 * app/api/auth/oauth/github/route.ts
 * GitHub OAuth - Initiate authentication
 */
import { NextRequest, NextResponse } from "next/server";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/github/callback`
  : "http://localhost:3000/api/auth/oauth/github/callback";

export async function GET(req: NextRequest) {
  if (!GITHUB_CLIENT_ID) {
    return NextResponse.json({
      error: "GitHub OAuth not configured",
      instructions: [
        "1. Go to https://github.com/settings/developers",
        "2. Create a new OAuth App",
        "3. Set callback URL to: " + REDIRECT_URI,
        "4. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to .env.local",
      ],
    }, { status: 503 });
  }

  // GitHub OAuth scopes for repo access
  const scopes = [
    "repo",           // Full control of private repositories
    "read:user",      // Read user profile data
    "user:email",     // Access user email addresses
  ].join(" ");

  // Generate state for CSRF protection
  const state = Math.random().toString(36).substring(7);

  // Build GitHub OAuth URL
  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
  githubAuthUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  githubAuthUrl.searchParams.set("scope", scopes);
  githubAuthUrl.searchParams.set("state", state);
  githubAuthUrl.searchParams.set("allow_signup", "true");

  // Redirect user to GitHub OAuth
  return NextResponse.redirect(githubAuthUrl.toString());
}
