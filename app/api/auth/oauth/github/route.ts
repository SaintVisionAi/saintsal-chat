/**
 * app/api/auth/oauth/github/route.ts
 * GitHub App OAuth - Initiate authentication
 * Using SaintSal-Agent-Cookin-Chat GitHub App
 */
import { NextRequest, NextResponse } from "next/server";

// Your GitHub App Client ID
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "Iv23limGcQY8OVviNoBV";
const REDIRECT_URI = process.env.GITHUB_CALLBACK_URL || "https://saintsal.ai/api/github/callback";

export async function GET(req: NextRequest) {
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
