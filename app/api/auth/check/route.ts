/**
 * app/api/auth/check/route.ts
 * Check if user is authenticated
 */
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;

export async function GET(req: NextRequest) {
  try {
    const authCookie = req.cookies.get('saintsal_auth')?.value;

    if (!authCookie) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    // Verify auth cookie with MongoDB
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB || 'saintsal_db');
    const users = db.collection('users');

    const user = await users.findOne({ _id: new ObjectId(authCookie) });
    await client.close();

    if (!user) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      authenticated: false,
    });
  }
}
