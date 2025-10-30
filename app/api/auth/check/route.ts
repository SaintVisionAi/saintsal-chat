/**
 * app/api/auth/check/route.ts
 * Check if user is authenticated
 */
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;

export async function GET(req: NextRequest) {
  console.log('🔐 [AUTH-CHECK] Starting authentication check...');

  try {
    // Check for both cookie names for backwards compatibility
    const authCookie = req.cookies.get('saintsal_auth')?.value || req.cookies.get('saintsal_session')?.value;

    if (!authCookie) {
      console.log('❌ [AUTH-CHECK] No auth cookie found');
      return NextResponse.json({
        authenticated: false,
      });
    }
    console.log(`🍪 [AUTH-CHECK] Auth cookie found: ${authCookie}`);

    // Verify auth cookie with MongoDB
    console.log('📊 [AUTH-CHECK] Connecting to MongoDB...');
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB || 'saintsal_db');
    const users = db.collection('users');
    console.log('✅ [AUTH-CHECK] MongoDB connected');

    console.log('🔍 [AUTH-CHECK] Looking up user by ID...');
    const user = await users.findOne({ _id: new ObjectId(authCookie) });
    await client.close();

    if (!user) {
      console.log('❌ [AUTH-CHECK] User not found in database');
      return NextResponse.json({
        authenticated: false,
      });
    }

    console.log(`✅ [AUTH-CHECK] User authenticated: ${user.name} (${user.email})`);
    console.log(`📦 [AUTH-CHECK] Plan: ${user.plan.toUpperCase()} | Usage: ${user.usage?.messagesThisMonth || 0}/${user.limits?.messagesPerMonth || 0} messages`);

    return NextResponse.json({
      authenticated: true,
      user: {
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error('❌ [AUTH-CHECK] Error:', error);
    return NextResponse.json({
      authenticated: false,
    });
  }
}
