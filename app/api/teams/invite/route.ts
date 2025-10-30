/**
 * Team Invitation API Endpoint
 * POST /api/teams/invite
 * Invite a new member to join the team
 */

import { NextRequest, NextResponse } from 'next/server';
import { inviteTeamMember } from '@/lib/mongodb-schema';
import { sendTeamInvitationEmail } from '@/lib/email';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || 'saintsal_db';

export async function POST(req: NextRequest) {
  console.log('📧 [TEAMS] Invite member request started...');

  try {
    // Check authentication
    const authCookie = req.cookies.get('saintsal_auth')?.value;
    if (!authCookie) {
      console.log('❌ [TEAMS] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get request body
    const { email, role = 'member' } = await req.json();

    console.log(`📝 [TEAMS] Inviting: ${email}, Role: ${role}`);

    // Validate inputs
    if (!email || !email.trim()) {
      console.log('❌ [TEAMS] Email is required');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ [TEAMS] Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!['admin', 'member'].includes(role)) {
      console.log('❌ [TEAMS] Invalid role');
      return NextResponse.json(
        { error: 'Role must be either "admin" or "member"' },
        { status: 400 }
      );
    }

    // Get user's team
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);
    const users = db.collection('users');
    const teams = db.collection('teams');

    try {
      const { ObjectId } = require('mongodb');
      const user = await users.findOne({ _id: new ObjectId(authCookie) }) as any;

      if (!user) {
        console.log('❌ [TEAMS] User not found');
        await client.close();
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      if (!user.teamId) {
        console.log('❌ [TEAMS] User is not part of a team');
        await client.close();
        return NextResponse.json(
          { error: 'You are not part of a team. Create a team first.' },
          { status: 400 }
        );
      }

      // Check if user has permission to invite (owner or admin)
      const team = await teams.findOne({ _id: new ObjectId(user.teamId) }) as any;
      const userMember = team.members.find((m: any) => m.userId === authCookie);

      if (!userMember || (userMember.role !== 'owner' && userMember.role !== 'admin')) {
        console.log('❌ [TEAMS] Insufficient permissions');
        await client.close();
        return NextResponse.json(
          { error: 'Only team owners and admins can invite members' },
          { status: 403 }
        );
      }

      await client.close();

      // Invite the member
      const token = await inviteTeamMember(user.teamId, authCookie, email.toLowerCase(), role);

      console.log(`✅ [TEAMS] Invitation created for ${email}`);

      // Send invitation email
      const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/teams/accept?token=${token}`;

      const emailSent = await sendTeamInvitationEmail({
        to: email.toLowerCase(),
        teamName: team.name,
        inviterName: user.name,
        role,
        inviteUrl,
      });

      if (emailSent) {
        console.log(`✅ [TEAMS] Invitation email sent to ${email}`);
      } else {
        console.log(`⚠️ [TEAMS] Invitation created but email failed to send to ${email}`);
      }

      return NextResponse.json({
        success: true,
        token,
        inviteUrl,
        message: 'Invitation sent successfully',
        emailSent,
      });
    } catch (error: any) {
      await client.close();
      console.error('❌ [TEAMS] Invitation failed:', error.message);
      return NextResponse.json(
        { error: error.message || 'Failed to send invitation' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('❌ [TEAMS] Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
