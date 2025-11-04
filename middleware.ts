// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, authCookieName } from './lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static files, Next internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets')
  ) {
    return NextResponse.next();
  }

  const isLoginRoute = pathname === '/login' || pathname === '/api/login';
  const isPublicRoot = pathname === '/';

  const token = req.cookies.get(authCookieName)?.value ?? null;
  const session = token ? await verifySessionToken(token) : null;
  const isAuthenticated = !!session;

  // If user hits /login but is already authenticated -> send to dashboard
  if (pathname === '/login' && isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Root: decide where to send them based on auth
  if (isPublicRoot) {
    const url = req.nextUrl.clone();
    url.pathname = isAuthenticated ? '/dashboard' : '/login';
    return NextResponse.redirect(url);
  }

  // Protect /dashboard and /calls
  const isProtectedRoute =
    pathname.startsWith('/dashboard') || pathname.startsWith('/calls');

  if (isProtectedRoute && !isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Routes that go through this middleware
export const config = {
  matcher: ['/dashboard/:path*', '/calls/:path*', '/login', '/'],
};
