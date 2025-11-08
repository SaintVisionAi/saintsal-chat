/**
 * lib/session.ts
 * Secure session management using iron-session
 */
import { getIronSession } from 'iron-session';
import { NextRequest, NextResponse } from 'next/server';

// Session configuration - MUST use environment variable in production!
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-to-a-random-secret-min-32-chars-long-for-production';

if (process.env.NODE_ENV === 'production' && SESSION_SECRET === 'change-this-to-a-random-secret-min-32-chars-long-for-production') {
  console.warn('⚠️ WARNING: Using default SESSION_SECRET in production! Set SESSION_SECRET environment variable.');
}

export const sessionOptions = {
  password: SESSION_SECRET,
  cookieName: 'saintsal_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/', // Ensure cookie is available on all paths
  },
};

// Session data structure
export interface SessionData {
  userId?: string;
  email?: string;
  name?: string;
  plan?: string;
  emailVerified?: boolean;
  isAdmin?: boolean;
}

/**
 * Get session from request (for API routes)
 * Usage: const session = await getSession(req, res);
 */
export async function getSession(
  req: NextRequest | Request,
  res: NextResponse | Response
): Promise<SessionData> {
  const session = await getIronSession<SessionData>(req as any, res as any, sessionOptions);
  return session;
}

/**
 * Helper to create a response with session data
 */
export async function createSessionResponse(
  req: NextRequest,
  data: SessionData,
  responseBody?: any
): Promise<NextResponse> {
  const res = NextResponse.json(responseBody || { success: true });
  const session = await getSession(req, res) as any;
  
  // Copy data to session
  Object.assign(session, data);
  await session.save();
  
  return res;
}

