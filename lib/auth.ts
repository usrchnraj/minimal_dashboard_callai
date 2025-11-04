// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';

const AUTH_COOKIE = 'doctor_session';

const secretKey = process.env.AUTH_SECRET;
if (!secretKey) {
  throw new Error('AUTH_SECRET is not set');
}
const secret = new TextEncoder().encode(secretKey);

export const authCookieName = AUTH_COOKIE;

export async function createSessionToken(username: string) {
  return new SignJWT({ sub: username, role: 'doctor' })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('2h') // session valid for 2 hours
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { sub: string; role?: string; iat: number; exp: number };
  } catch {
    return null;
  }
}
