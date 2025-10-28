/**
 * app/api/auth/logout/route.ts
 * User logout endpoint
 */
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear all auth cookies
  response.cookies.delete('saintsal_auth');
  response.cookies.delete('saintsal_user_email');
  response.cookies.delete('saintsal_session');
  response.cookies.delete('saintsal_first_time');

  return response;
}
