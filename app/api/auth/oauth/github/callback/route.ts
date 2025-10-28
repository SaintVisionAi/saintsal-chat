/**
 * app/api/auth/oauth/github/callback/route.ts
 * GitHub OAuth - Handle callback and exchange code for token
 */
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI!;

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Check for OAuth errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/?error=github_oauth_${error}`, req.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/?error=no_code", req.url)
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.NEXT_PUBLIC_APP_URL
          ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/github/callback`
          : "http://localhost:3000/api/auth/oauth/github/callback",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.redirect(
        new URL(`/?error=github_token_${tokenData.error}`, req.url)
      );
    }

    const accessToken = tokenData.access_token;

    // Get GitHub user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
      },
    });

    const githubUser = await userResponse.json();

    // Store token in MongoDB
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB || "saintsal_db");
    const users = db.collection("users");

    // Get current user from session cookie (you'll need to implement this based on your auth)
    // For now, we'll use GitHub email as identifier
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
      },
    });

    const emails = await emailResponse.json();
    const primaryEmail = emails.find((e: any) => e.primary)?.email || emails[0]?.email;

    if (!primaryEmail) {
      await client.close();
      return NextResponse.redirect(
        new URL("/?error=no_email", req.url)
      );
    }

    // Update or create user with GitHub connection
    await users.updateOne(
      { email: primaryEmail.toLowerCase() },
      {
        $set: {
          githubConnected: true,
          githubAccessToken: accessToken,
          githubUsername: githubUser.login,
          githubUserId: githubUser.id,
          githubProfileUrl: githubUser.html_url,
          githubConnectedAt: new Date(),
        },
        $setOnInsert: {
          email: primaryEmail.toLowerCase(),
          name: githubUser.name || githubUser.login,
          createdAt: new Date(),
          plan: "free",
        },
      },
      { upsert: true }
    );

    await client.close();

    // Redirect back to app with success
    const response = NextResponse.redirect(
      new URL("/?github_connected=true", req.url)
    );

    // Set session cookie with user email (you might want to encrypt this)
    response.cookies.set("saintsal_user_email", primaryEmail.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error("GitHub OAuth callback error:", error);
    return NextResponse.redirect(
      new URL(`/?error=oauth_failed&message=${encodeURIComponent(error.message)}`, req.url)
    );
  }
}
