/**
 * Team Invitation Accept API Endpoint
 * POST /api/teams/accept
 * Accept a team invitation
 */

import { NextRequest, NextResponse } from 'next/server';
import { acceptTeamInvitation } from '@/lib/mongodb-schema';

export async function POST(req: NextRequest) {
  console.log('✅ [TEAMS] Accept invitation request started...');

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
    const { token } = await req.json();

    console.log(`📝 [TEAMS] Accepting invitation with token: ${token?.substring(0, 8)}...`);

    // Validate inputs
    if (!token || !token.trim()) {
      console.log('❌ [TEAMS] Invitation token is required');
      return NextResponse.json(
        { error: 'Invitation token is required' },
        { status: 400 }
      );
    }

    // Accept the invitation
    try {
      const success = await acceptTeamInvitation(authCookie, token);

      if (success) {
        console.log(`✅ [TEAMS] Invitation accepted successfully`);

        return NextResponse.json({
          success: true,
          message: 'You have successfully joined the team!',
        });
      } else {
        console.log('❌ [TEAMS] Failed to accept invitation');
        return NextResponse.json(
          { error: 'Failed to accept invitation' },
          { status: 400 }
        );
      }
    } catch (error: any) {
      console.error('❌ [TEAMS] Accept invitation failed:', error.message);
      return NextResponse.json(
        { error: error.message || 'Failed to accept invitation' },
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
