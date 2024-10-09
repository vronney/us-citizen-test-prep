import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwtToken } from '@lib/jwt';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List of paths that don't require authentication
  const publicPaths = ['/api/signin', '/api/register', '/', '/pages/signup'];

  // Check if the path is public
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value;

  // If there's no token, return unauthorized for API routes
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/pages/signup', request.url));
  }

  // Verify the token
  const payload = verifyJwtToken(token);

  // If the token is invalid, return unauthorized for API routes
  if (!payload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/pages/signup', request.url));
  }

  // If everything is fine, continue to the requested page
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match all other routes except public paths
    '/((?!api/signin|api/register|pages/signup|_next/static|_next/image|favicon.ico).*)',
  ],
};