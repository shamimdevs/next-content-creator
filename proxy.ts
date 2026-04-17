import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route protection via cookie presence check (Edge-compatible).
// Full session validation happens inside each Server Component / Route Handler
// via auth() from @/lib/auth, which runs in Node.js runtime.
const PUBLIC_PATHS = ["/", "/login"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public pages and auth API routes
  if (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // Check for an Auth.js v5 session cookie (v5 uses "authjs." prefix; v4 used "next-auth.")
  const sessionCookie =
    req.cookies.get("authjs.session-token") ??
    req.cookies.get("__Secure-authjs.session-token") ??
    req.cookies.get("next-auth.session-token") ??
    req.cookies.get("__Secure-next-auth.session-token");

  if (!sessionCookie) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
