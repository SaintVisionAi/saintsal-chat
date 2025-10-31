/**
 * app/api/auth/signup/route.ts
 * User registration endpoint
 */
import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "../../../../lib/email";

export async function POST(req: Request) {
  console.log('🔐 [SIGNUP] Starting signup request...');

  try {
    const { name, email, password, companyName, role } = await req.json();
    console.log(`📧 [SIGNUP] Email: ${email}, Name: ${name || 'Not provided'}`);

    // Validation
    if (!email || !password) {
      console.log('❌ [SIGNUP] Missing email or password');
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      console.log('❌ [SIGNUP] Password too short');
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    console.log('📊 [SIGNUP] Connecting to MongoDB...');
    const db = await getDb();
    const users = db.collection("users");
    console.log('✅ [SIGNUP] MongoDB connected');

    // Check if user already exists
    console.log(`🔍 [SIGNUP] Checking if user exists: ${email.toLowerCase()}`);
    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ [SIGNUP] User already exists');
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }
    console.log('✅ [SIGNUP] Email available');

    // Hash password
    console.log('🔒 [SIGNUP] Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ [SIGNUP] Password hashed');

    // Generate email verification token
    console.log('🔑 [SIGNUP] Generating email verification token...');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    console.log('✅ [SIGNUP] Verification token generated');

    // Create user with limits and usage tracking
    console.log('👤 [SIGNUP] Creating user with Free plan limits...');
    const result = await users.insertOne({
      name: name || email.split("@")[0],
      email: email.toLowerCase(),
      password: hashedPassword,
      companyName: companyName || "",
      role: role || "",
      plan: "free", // Default to free plan
      emailVerified: false, // Email not verified yet
      verificationToken: verificationToken,
      verificationTokenExpiry: verificationTokenExpiry,
      limits: {
        messagesPerMonth: 50,
        voiceMinutesPerMonth: 10,
        ragQueriesPerMonth: 20,
        maxFileSize: 5,
      },
      usage: {
        messagesThisMonth: 0,
        voiceMinutesThisMonth: 0,
        ragQueriesThisMonth: 0,
        lastReset: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`✅ [SIGNUP] User created successfully! ID: ${result.insertedId}`);
    console.log(`📦 [SIGNUP] Plan: FREE | Messages: 50/month | Voice: 10min/month | RAG: 20/month`);

    // Send verification email
    console.log('📧 [SIGNUP] Sending verification email...');
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://saintsal.ai'}/auth/verify?token=${verificationToken}`;
    const emailSent = await sendVerificationEmail(
      email.toLowerCase(),
      name || email.split("@")[0],
      verificationUrl
    );

    if (emailSent) {
      console.log('✅ [SIGNUP] Verification email sent successfully');
    } else {
      console.log('⚠️ [SIGNUP] Failed to send verification email, but signup continues');
    }

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
    console.log('🍪 [SIGNUP] Setting authentication cookies...');
    response.cookies.set("saintsal_auth", result.insertedId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    console.log(`✅ [SIGNUP] Auth cookie set: ${result.insertedId.toString()}`);

    response.cookies.set("saintsal_user_email", email.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    console.log(`✅ [SIGNUP] Email cookie set: ${email.toLowerCase()}`);

    response.cookies.set("saintsal_first_time", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5, // 5 minutes - just for onboarding flow
    });
    console.log('✅ [SIGNUP] First-time cookie set (5min TTL)');

    console.log('🎉 [SIGNUP] SIGNUP COMPLETE! User can now log in.');
    return response;
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Server error: " + (err?.message ?? String(err)) },
      { status: 500 }
    );
  }
}
