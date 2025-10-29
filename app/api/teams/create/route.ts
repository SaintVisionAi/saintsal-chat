/**
 * Team Creation API Endpoint
 * POST /api/teams/create
 * Creates a new team for Pro or Enterprise users
 */

import { NextRequest, NextResponse } from 'next/server';
import { createTeam } from '@/lib/mongodb-schema';

export async function POST(req: NextRequest) {
  console.log('👥 [TEAMS] Create team request started...');

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
    const { teamName, plan } = await req.json();

    console.log(`📝 [TEAMS] Team Name: ${teamName}, Plan: ${plan}`);

    // Validate inputs
    if (!teamName || !teamName.trim()) {
      console.log('❌ [TEAMS] Team name is required');
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      );
    }

    if (!plan || !['pro', 'enterprise'].includes(plan)) {
      console.log('❌ [TEAMS] Invalid plan - teams only available for Pro/Enterprise');
      return NextResponse.json(
        { error: 'Teams are only available for Pro and Enterprise plans' },
        { status: 400 }
      );
    }

    // Create the team
    try {
      const teamId = await createTeam(authCookie, teamName.trim(), plan);

      console.log(`✅ [TEAMS] Team created successfully: ${teamId}`);

      return NextResponse.json({
        success: true,
        teamId,
        message: 'Team created successfully',
      });
    } catch (error: any) {
      console.error('❌ [TEAMS] Team creation failed:', error.message);
      return NextResponse.json(
        { error: error.message || 'Failed to create team' },
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
