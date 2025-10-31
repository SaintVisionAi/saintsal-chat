/**
 * Team Info API Endpoint
 * GET /api/teams/info
 * Get current user's team information including members
 */

import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || 'saintsal_db';

export async function GET(req: NextRequest) {
  console.log('📊 [TEAMS] Get team info request started...');

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

    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);
    const users = db.collection('users');
    const teams = db.collection('teams');
    const invitations = db.collection('team_invitations');

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

      // Check if user is part of a team
      if (!user.teamId) {
        console.log('ℹ️ [TEAMS] User is not part of a team');
        await client.close();
        return NextResponse.json({
          hasTeam: false,
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            plan: user.plan,
          },
        });
      }

      // Get team information
      const team = await teams.findOne({ _id: new ObjectId(user.teamId) }) as any;

      if (!team) {
        console.log('❌ [TEAMS] Team not found');
        await client.close();
        return NextResponse.json(
          { error: 'Team not found' },
          { status: 404 }
        );
      }

      // Get pending invitations (if user is owner or admin)
      let pendingInvitations: any[] = [];
      const userMember = team.members.find((m: any) => m.userId === authCookie);

      if (userMember && (userMember.role === 'owner' || userMember.role === 'admin')) {
        pendingInvitations = await invitations
          .find({
            teamId: user.teamId,
            status: 'pending',
          })
          .toArray();
      }

      await client.close();

      console.log(`✅ [TEAMS] Team info retrieved: ${team.name}`);

      return NextResponse.json({
        hasTeam: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          plan: user.plan,
          teamRole: user.teamRole,
        },
        team: {
          id: team._id.toString(),
          name: team.name,
          plan: team.plan,
          ownerId: team.ownerId,
          members: team.members.map((m: any) => ({
            userId: m.userId,
            email: m.email,
            name: m.name,
            role: m.role,
            joinedAt: m.joinedAt,
            verified: m.verified,
          })),
          limits: team.limits,
          usage: team.usage,
          createdAt: team.createdAt,
        },
        pendingInvitations: pendingInvitations.map((inv: any) => ({
          id: inv._id.toString(),
          email: inv.email,
          role: inv.role,
          invitedBy: inv.invitedByName,
          createdAt: inv.createdAt,
          expiresAt: inv.expiresAt,
        })),
      });
    } catch (error: any) {
      await client.close();
      console.error('❌ [TEAMS] Get team info failed:', error.message);
      return NextResponse.json(
        { error: error.message || 'Failed to get team info' },
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
