import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/lib/jwt-edge";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  console.log('Middleware - Path:', pathname);
  console.log('Middleware - Token exists:', !!token);

  // Protected routes (require authentication)
  if (pathname.startsWith("/back")) {
    if (!token) {
      console.log('Middleware - No token, redirecting to login');
      const url = req.nextUrl.clone();
      url.pathname = "/auth/sign-in";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Verify token
    try {
      const decoded = await verifyTokenEdge(token);
      
      if (!decoded) {
        throw new Error('Token verification returned null');
      }
      
      console.log('Middleware - Token valid for user:', decoded.email);
      
      // Add user info to headers (optional, untuk diakses di page)
      const response = NextResponse.next();
      response.headers.set('x-user-id', decoded.userId.toString());
      response.headers.set('x-user-email', decoded.email);
      
      return response;
    } catch (error) {
      console.log('Middleware - Invalid token, redirecting to login');
      // Token invalid atau expired
      const url = req.nextUrl.clone();
      url.pathname = "/auth/sign-in";
      url.searchParams.set("next", pathname);
      
      // Clear invalid token
      const response = NextResponse.redirect(url);
      response.cookies.delete("token");
      
      return response;
    }
  }

  // Auth routes (redirect if already logged in)
  if (pathname.startsWith("/auth/sign-in") || pathname.startsWith("/auth/sign-up")) {
    if (token) {
      try {
        // Verify token is valid
        await verifyTokenEdge(token);
        console.log('Middleware - Already logged in, redirecting to dashboard');
        
        const url = req.nextUrl.clone();
        url.pathname = "/back/dashboard";
        return NextResponse.redirect(url);
      } catch (error) {
        // Token invalid, clear it and allow access to auth pages
        console.log('Middleware - Invalid token on auth page, clearing cookie');
        const response = NextResponse.next();
        response.cookies.delete("token");
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/back/:path*",           // Protect all /back routes
    "/auth/sign-in",          // Check if already logged in
    "/auth/sign-up",          // Check if already logged in
  ],
};
