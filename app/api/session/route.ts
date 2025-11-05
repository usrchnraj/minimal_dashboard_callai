// app/api/session/route.ts
import { NextResponse } from 'next/server';
import { verifySessionToken, authCookieName } from '@/lib/auth';

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const token = cookie
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(`${authCookieName}=`))
    ?.split('=')[1];

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  try {
    const decoded = await verifySessionToken(token);
    if (decoded) {
      return NextResponse.json({ valid: true, user: decoded });
    }
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  return NextResponse.json({ valid: false }, { status: 401 });
}
