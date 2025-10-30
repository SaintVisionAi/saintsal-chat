/**
 * app/api/auth/resend-verification/route.ts
 * Resend verification email endpoint
 */
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../lib/mongodb';
import crypto from 'crypto';
import { sendVerificationEmail } from '../../../../lib/email';

export async function POST(req: NextRequest) {
  console.log('📧 [RESEND] Resending verification email...');

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 [RESEND] Looking up user: ${email}`);

    // Connect to MongoDB
    const db = await getDb();
    const users = db.collection('users');

    // Find user
    const user = await users.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not (security)
      console.log('⚠️ [RESEND] User not found (returning success anyway)');
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a verification link has been sent.',
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      console.log('✅ [RESEND] Email already verified');
      return NextResponse.json({
        success: true,
        message: 'This email is already verified!',
        alreadyVerified: true,
      });
    }

    // Generate new verification token
    console.log('🔑 [RESEND] Generating new verification token...');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          verificationToken: verificationToken,
          verificationTokenExpiry: verificationTokenExpiry,
          updatedAt: new Date(),
        },
      }
    );

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://saintsal.ai'}/auth/verify?token=${verificationToken}`;
    const emailSent = await sendVerificationEmail(
      email.toLowerCase(),
      user.name,
      verificationUrl
    );

    if (emailSent) {
      console.log('✅ [RESEND] Verification email sent successfully');
      return NextResponse.json({
        success: true,
        message: 'Verification email sent! Please check your inbox.',
      });
    } else {
      console.log('❌ [RESEND] Failed to send email');
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again later.' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('❌ [RESEND] Error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}
