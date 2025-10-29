/**
 * Team Member Remove API Endpoint
 * DELETE /api/teams/remove
 * Remove a member from the team
 */

import { NextRequest, NextResponse } from 'next/server';
import { removeTeamMember } from '@/lib/mongodb-schema';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || 'saintsal_db';

export async function DELETE(req: NextRequest) {
  console.log('🚫 [TEAMS] Remove member request started...');

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
    const { memberId } = await req.json();

    console.log(`📝 [TEAMS] Removing member: ${memberId}`);

    // Validate inputs
    if (!memberId || !memberId.trim()) {
      console.log('❌ [TEAMS] Member ID is required');
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    // Get user's team
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);
    const users = db.collection('users');

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
          { error: 'You are not part of a team' },
          { status: 400 }
        );
      }

      await client.close();

      // Remove the member
      const success = await removeTeamMember(user.teamId, memberId, authCookie);

      if (success) {
        console.log(`✅ [TEAMS] Member removed successfully`);

        return NextResponse.json({
          success: true,
          message: 'Member removed successfully',
        });
      } else {
        console.log('❌ [TEAMS] Failed to remove member');
        return NextResponse.json(
          { error: 'Failed to remove member' },
          { status: 400 }
        );
      }
    } catch (error: any) {
      await client.close();
      console.error('❌ [TEAMS] Remove member failed:', error.message);
      return NextResponse.json(
        { error: error.message || 'Failed to remove member' },
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
