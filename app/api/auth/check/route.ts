/**
 * app/api/auth/check/route.ts
 * Check if user is authenticated using secure sessions
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../../lib/session';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;

export async function GET(req: NextRequest) {
  console.log('🔐 [AUTH-CHECK] Starting authentication check...');

  try {
    // Create a response first to get session
    const res = NextResponse.json({ authenticated: false });
    const session = await getSession(req, res);

    // Check if session has user data
    if (!session.userId || !session.email) {
      console.log('❌ [AUTH-CHECK] No session data found');
      console.log('🔍 [AUTH-CHECK] Session keys:', Object.keys(session));
      return res; // Return the response with session cookie
    }

    // For admin users, skip MongoDB lookup
    if (session.isAdmin) {
      console.log(`✅ [AUTH-CHECK] Admin authenticated: ${session.email}`);
      const adminResponse = NextResponse.json({
        authenticated: true,
        user: {
          name: session.name,
          email: session.email,
          plan: session.plan,
          isAdmin: true,
        },
      });
      // Ensure session cookie is included
      const adminSession = await getSession(req, adminResponse);
      return adminResponse;
    }

    // For regular users, verify they still exist in database
    console.log('📊 [AUTH-CHECK] Verifying user in MongoDB...');
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB || 'saintsal_db');
    const users = db.collection('users');

    console.log(`🔍 [AUTH-CHECK] Looking up user: ${session.userId}`);
    const user = await users.findOne({ _id: new ObjectId(session.userId) });
    await client.close();

    if (!user) {
      console.log('❌ [AUTH-CHECK] User not found in database');
      return NextResponse.json({
        authenticated: false,
      });
    }

    // Verify email matches (in case user was deleted/recreated)
    if (user.email.toLowerCase() !== session.email.toLowerCase()) {
      console.log('❌ [AUTH-CHECK] Email mismatch - session invalidated');
      return NextResponse.json({
        authenticated: false,
      });
    }

    console.log(`✅ [AUTH-CHECK] User authenticated: ${user.name} (${user.email})`);
    console.log(`📦 [AUTH-CHECK] Plan: ${user.plan.toUpperCase()} | Usage: ${user.usage?.messagesThisMonth || 0}/${user.limits?.messagesPerMonth || 0} messages`);

    const userResponse = NextResponse.json({
      authenticated: true,
      user: {
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
    });
    // Ensure session cookie is included
    const userSession = await getSession(req, userResponse);
    return userResponse;
  } catch (error) {
    console.error('❌ [AUTH-CHECK] Error:', error);
    const errorResponse = NextResponse.json({
      authenticated: false,
    });
    return errorResponse;
  }
}
