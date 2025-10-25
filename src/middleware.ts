import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/back")) {
    const token = req.cookies.get("token")?.value;
    console.log("Middleware - Token:", token);
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/auth") ) {
    const token = req.cookies.get("token")?.value;
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = "/back";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/back/:path*"], // path yang ingin dilindungi
};
