// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { createSessionToken, authCookieName } from '@/lib/auth';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const validUser = process.env.BASIC_AUTH_USER;
  const validPass = process.env.BASIC_AUTH_PASS;

  if (!validUser || !validPass) {
    return NextResponse.json(
      { success: false, error: 'Server auth not configured' },
      { status: 500 },
    );
  }

  if (username !== validUser || password !== validPass) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  // ✅ Create signed JWT
  const token = await createSessionToken(username);

  const res = NextResponse.json({ success: true });

  // 🔐 Set HttpOnly cookie
  res.cookies.set(authCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 2, // 2 hours
  });

  return res;
}
