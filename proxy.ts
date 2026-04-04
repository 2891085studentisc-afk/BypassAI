// middleware.ts (Must be in your root folder, not /lib)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for your auth cookie/token here
  const token = request.cookies.get('auth-token');

  if (!token && (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/admin-dashboard'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// This "matcher" tells Next.js EXACTLY which pages the user should be tested on
export const config = {
  matcher: ['/admin/:path*', '/admin-dashboard/:path*', '/track/:path*'],
};