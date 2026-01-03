import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  // Public routes - allow access
  if (request.nextUrl.pathname === "/" || request.nextUrl.pathname.startsWith("/auth/")) {
    return NextResponse.next()
  }

  // Protected routes - require token
  if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/user")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
}
