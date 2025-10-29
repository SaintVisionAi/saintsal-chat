/**
 * Email Service for SaintSal™
 * Handles all email sending (invitations, notifications, etc.)
 * Using Resend for email delivery
 */

export interface TeamInvitationEmail {
  to: string;
  teamName: string;
  inviterName: string;
  role: 'admin' | 'member';
  inviteUrl: string;
}

/**
 * Send a team invitation email
 */
export async function sendTeamInvitationEmail({
  to,
  teamName,
  inviterName,
  role,
  inviteUrl,
}: TeamInvitationEmail): Promise<boolean> {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    // If no API key, log the invitation (for development)
    if (!RESEND_API_KEY) {
      console.log('📧 [EMAIL] No RESEND_API_KEY - Invitation link:', inviteUrl);
      console.log(`📧 [EMAIL] Would send to: ${to}`);
      console.log(`📧 [EMAIL] Team: ${teamName}, Inviter: ${inviterName}, Role: ${role}`);
      return true; // Return true so the invitation still works
    }

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'SaintSal <noreply@saintsal.ai>',
        to: [to],
        subject: `You've been invited to join ${teamName} on SaintSal™`,
        html: getTeamInvitationEmailHTML({
          teamName,
          inviterName,
          role,
          inviteUrl,
        }),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ [EMAIL] Failed to send email:', error);
      return false;
    }

    const data = await response.json();
    console.log(`✅ [EMAIL] Invitation sent to ${to} (ID: ${data.id})`);
    return true;
  } catch (error) {
    console.error('❌ [EMAIL] Error sending invitation:', error);
    return false;
  }
}

/**
 * Get beautiful HTML email template for team invitation
 */
function getTeamInvitationEmailHTML({
  teamName,
  inviterName,
  role,
  inviteUrl,
}: Omit<TeamInvitationEmail, 'to'>): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Team Invitation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); border-radius: 50px; margin-bottom: 20px;">
        <span style="font-size: 24px; font-weight: bold; color: #000000; letter-spacing: 1px;">SAINTSAL™</span>
      </div>
    </div>

    <!-- Main Card -->
    <div style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%); border: 2px solid rgba(255, 215, 0, 0.3); border-radius: 16px; padding: 40px 32px; margin-bottom: 32px;">
      <!-- Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 80px; height: 80px; background: rgba(255, 215, 0, 0.2); border: 2px solid rgba(255, 215, 0, 0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 40px;">👥</span>
        </div>
      </div>

      <!-- Title -->
      <h1 style="color: #FFFFFF; font-size: 32px; font-weight: bold; text-align: center; margin: 0 0 16px 0;">
        You're Invited!
      </h1>

      <!-- Message -->
      <p style="color: #D1D5DB; font-size: 18px; text-align: center; line-height: 1.6; margin: 0 0 32px 0;">
        <strong style="color: #FFD700;">${inviterName}</strong> has invited you to join
        <strong style="color: #FFD700;">${teamName}</strong> on SaintSal™
      </p>

      <!-- Role Badge -->
      <div style="text-align: center; margin-bottom: 32px;">
        <span style="display: inline-block; padding: 8px 20px; background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 50px; color: #60A5FA; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">
          ROLE: ${role.toUpperCase()}
        </span>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${inviteUrl}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000000; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 12px; box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);">
          Accept Invitation
        </a>
      </div>

      <!-- Secondary Text -->
      <p style="color: #9CA3AF; font-size: 14px; text-align: center; margin: 0;">
        By accepting, you'll join the team and get access to shared resources and features.
      </p>
    </div>

    <!-- Info Box -->
    <div style="background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(55, 65, 81, 1); border-radius: 12px; padding: 24px; margin-bottom: 32px;">
      <h3 style="color: #FFD700; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">
        What you'll get:
      </h3>
      <ul style="color: #D1D5DB; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
        <li>Collaborate with team members</li>
        <li>Share team resources and limits</li>
        <li>Access to team-wide features</li>
        <li>${role === 'admin' ? 'Admin privileges to manage the team' : 'Full member access'}</li>
      </ul>
    </div>

    <!-- Footer -->
    <div style="text-align: center;">
      <p style="color: #6B7280; font-size: 12px; margin: 0 0 8px 0;">
        This invitation will expire in 7 days
      </p>
      <p style="color: #4B5563; font-size: 11px; margin: 0;">
        © 2024 SaintSal™. Advanced AI Platform.
      </p>
    </div>

    <!-- Divider -->
    <div style="margin: 32px 0; height: 1px; background: rgba(75, 85, 99, 0.5);"></div>

    <!-- Alternative Link -->
    <div style="text-align: center;">
      <p style="color: #6B7280; font-size: 12px; margin: 0 0 8px 0;">
        Button not working? Copy and paste this link:
      </p>
      <p style="color: #9CA3AF; font-size: 11px; word-break: break-all; margin: 0;">
        ${inviteUrl}
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Send email verification to new users
 */
export async function sendVerificationEmail(
  to: string,
  name: string,
  verificationUrl: string
): Promise<boolean> {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    // If no API key, log the verification link (for development)
    if (!RESEND_API_KEY) {
      console.log('📧 [EMAIL] No RESEND_API_KEY - Verification link:', verificationUrl);
      console.log(`📧 [EMAIL] Would send to: ${to}`);
      return true; // Return true so signup still works
    }

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'SaintSal <noreply@saintsal.ai>',
        to: [to],
        subject: 'Verify your email for SaintSal™',
        html: getVerificationEmailHTML({ name, verificationUrl }),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ [EMAIL] Failed to send verification email:', error);
      return false;
    }

    const data = await response.json();
    console.log(`✅ [EMAIL] Verification email sent to ${to} (ID: ${data.id})`);
    return true;
  } catch (error) {
    console.error('❌ [EMAIL] Error sending verification email:', error);
    return false;
  }
}

/**
 * Get beautiful HTML email template for email verification
 */
function getVerificationEmailHTML({
  name,
  verificationUrl,
}: {
  name: string;
  verificationUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); border-radius: 50px; margin-bottom: 20px;">
        <span style="font-size: 24px; font-weight: bold; color: #000000; letter-spacing: 1px;">SAINTSAL™</span>
      </div>
    </div>

    <!-- Main Card -->
    <div style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%); border: 2px solid rgba(255, 215, 0, 0.3); border-radius: 16px; padding: 40px 32px; margin-bottom: 32px;">
      <!-- Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 80px; height: 80px; background: rgba(255, 215, 0, 0.2); border: 2px solid rgba(255, 215, 0, 0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 40px;">✉️</span>
        </div>
      </div>

      <!-- Title -->
      <h1 style="color: #FFFFFF; font-size: 32px; font-weight: bold; text-align: center; margin: 0 0 16px 0;">
        Verify Your Email
      </h1>

      <!-- Message -->
      <p style="color: #D1D5DB; font-size: 18px; text-align: center; line-height: 1.6; margin: 0 0 32px 0;">
        Welcome to <strong style="color: #FFD700;">SaintSal™</strong>, ${name}!<br>
        Please verify your email address to activate your account and start using our AI platform.
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${verificationUrl}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000000; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 12px; box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);">
          Verify Email Address
        </a>
      </div>

      <!-- Secondary Text -->
      <p style="color: #9CA3AF; font-size: 14px; text-align: center; margin: 0;">
        This link will expire in 24 hours for security reasons.
      </p>
    </div>

    <!-- Info Box -->
    <div style="background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(55, 65, 81, 1); border-radius: 12px; padding: 24px; margin-bottom: 32px;">
      <h3 style="color: #FFD700; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">
        Why verify your email?
      </h3>
      <ul style="color: #D1D5DB; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
        <li>Secure your account and data</li>
        <li>Enable password recovery</li>
        <li>Receive important notifications</li>
        <li>Access all platform features</li>
      </ul>
    </div>

    <!-- Security Notice -->
    <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 32px;">
      <p style="color: #FCA5A5; font-size: 13px; margin: 0; line-height: 1.5;">
        <strong>🔒 Security Tip:</strong> If you didn't create an account on SaintSal™, please ignore this email or contact our support team.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center;">
      <p style="color: #6B7280; font-size: 12px; margin: 0 0 8px 0;">
        This verification link expires in 24 hours
      </p>
      <p style="color: #4B5563; font-size: 11px; margin: 0;">
        © 2024 SaintSal™. Advanced AI Platform.
      </p>
    </div>

    <!-- Divider -->
    <div style="margin: 32px 0; height: 1px; background: rgba(75, 85, 99, 0.5);"></div>

    <!-- Alternative Link -->
    <div style="text-align: center;">
      <p style="color: #6B7280; font-size: 12px; margin: 0 0 8px 0;">
        Button not working? Copy and paste this link:
      </p>
      <p style="color: #9CA3AF; font-size: 11px; word-break: break-all; margin: 0;">
        ${verificationUrl}
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Send a welcome email to new team members
 */
export async function sendWelcomeEmail(
  to: string,
  name: string,
  teamName: string
): Promise<boolean> {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.log('📧 [EMAIL] No RESEND_API_KEY - Would send welcome email to:', to);
      return true;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'SaintSal <noreply@saintsal.ai>',
        to: [to],
        subject: `Welcome to ${teamName}!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #FFD700;">Welcome to ${teamName}! 🎉</h1>
            <p>Hi ${name},</p>
            <p>You're now part of the team! Start collaborating with your teammates on SaintSal™.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://app.saintsal.ai'}" style="display: inline-block; padding: 12px 24px; background: #FFD700; color: #000; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      console.error('❌ [EMAIL] Failed to send welcome email');
      return false;
    }

    console.log(`✅ [EMAIL] Welcome email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ [EMAIL] Error sending welcome email:', error);
    return false;
  }
}
