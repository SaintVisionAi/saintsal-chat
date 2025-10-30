/**
 * app/api/auth/verify/route.ts
 * Email verification endpoint
 */
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  console.log('✉️ [VERIFY] Starting email verification...');

  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      console.log('❌ [VERIFY] No token provided');
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 [VERIFY] Looking up token: ${token.substring(0, 10)}...`);

    // Connect to MongoDB
    const db = await getDb();
    const users = db.collection('users');

    // Find user with this verification token
    const user = await users.findOne({
      verificationToken: token,
    });

    if (!user) {
      console.log('❌ [VERIFY] Invalid token - user not found');
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (user.verificationTokenExpiry && new Date() > new Date(user.verificationTokenExpiry)) {
      console.log('❌ [VERIFY] Token expired');
      return NextResponse.json(
        { error: 'Verification token has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      console.log('✅ [VERIFY] Email already verified');
      return NextResponse.json({
        success: true,
        message: 'Email already verified',
        alreadyVerified: true,
      });
    }

    // Update user - mark as verified and clear token
    console.log(`✅ [VERIFY] Verifying user: ${user.email}`);
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          emailVerified: true,
          updatedAt: new Date(),
        },
        $unset: {
          verificationToken: '',
          verificationTokenExpiry: '',
        },
      }
    );

    console.log('🎉 [VERIFY] Email verification successful!');
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now access all features.',
      email: user.email,
    });

  } catch (error: any) {
    console.error('❌ [VERIFY] Error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
