/**
 * app/api/auth/login/route.ts
 * User login endpoint
 */
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI!;

export async function POST(req: NextRequest) {
  console.log('🔑 [LOGIN] Starting login request...');

  try {
    const { email, password } = await req.json();
    console.log(`📧 [LOGIN] Email: ${email}`);

    if (!email || !password) {
      console.log('❌ [LOGIN] Missing email or password');
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    console.log('📊 [LOGIN] Connecting to MongoDB...');
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB || 'saintsal_db');
    const users = db.collection('users');
    console.log('✅ [LOGIN] MongoDB connected');

    // Find user by email
    console.log(`🔍 [LOGIN] Looking up user: ${email.toLowerCase()}`);
    const user = await users.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log('❌ [LOGIN] User not found');
      await client.close();
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    console.log(`✅ [LOGIN] User found: ${user.name} (${user.email})`);

    // Verify password
    console.log('🔒 [LOGIN] Verifying password...');
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      console.log('❌ [LOGIN] Invalid password');
      await client.close();
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    console.log('✅ [LOGIN] Password verified');

    // Update last login
    console.log('📅 [LOGIN] Updating last login timestamp...');
    await users.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );
    console.log('✅ [LOGIN] Last login updated');

    await client.close();

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
    });

    // Set auth cookie
    console.log('🍪 [LOGIN] Setting authentication cookies...');
    response.cookies.set('saintsal_auth', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    console.log(`✅ [LOGIN] Auth cookie set: ${user._id.toString()}`);

    // Also set user email cookie for integrations
    response.cookies.set('saintsal_user_email', user.email.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    console.log(`✅ [LOGIN] Email cookie set: ${user.email.toLowerCase()}`);

    console.log(`🎉 [LOGIN] LOGIN SUCCESSFUL! Welcome back, ${user.name}! Plan: ${user.plan.toUpperCase()}`);
    return response;
  } catch (error: any) {
    console.error('❌ [LOGIN] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
