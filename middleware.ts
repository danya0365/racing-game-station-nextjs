/**
 * Next.js Middleware
 * Handles authentication state refresh and route protection
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Branch route prefixes — customer-facing URLs carry the branch as a
// real segment (/pattani/...), NOT a route group, so the branch survives
// the URL. Strip the prefix before the auth checks below.
//
// Read from the config rather than repeated here: a slug typo in two places
// silently breaks the branch. Edge middleware can import from src/config.
import { BRANCH_SLUGS } from '@/src/config/branch.config';

const BRANCH_PREFIXES = BRANCH_SLUGS.map((slug) => `/${slug}`);

// Routes that require authentication
const protectedRoutes = [
  '/backend',
  '/profile',
];

// Routes that should redirect to customer if already authenticated
const authRoutes = [
  '/auth/login',
  '/auth/register',
];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Strip the branch prefix so /pattani/customer/booking-status is checked
  // against /customer/booking-status — branch pages reuse the existing
  // auth rules instead of duplicating them per branch.
  const branchPrefix = BRANCH_PREFIXES.find((p) => pathname === p || pathname.startsWith(`${p}/`));
  const routePath = branchPrefix ? pathname.slice(branchPrefix.length) || '/' : pathname;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    routePath.startsWith(route)
  );

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some((route) =>
    routePath.startsWith(route)
  );

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    // Keep the branch prefix so login returns the customer to the same branch
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to customer page if accessing auth routes while authenticated
  if (isAuthRoute && user) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo');
    const url = request.nextUrl.clone();
    url.pathname = redirectTo || '/customer';
    url.searchParams.delete('redirectTo');
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
