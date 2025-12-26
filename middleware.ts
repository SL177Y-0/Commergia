import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const PROTECTED_ACCOUNT_PREFIX = "/account";
const PROTECTED_API_PREFIXES = ["/api/account", "/api/customer", "/api/orders", "/api/wishlist"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith(PROTECTED_ACCOUNT_PREFIX)) {
    const customerAccessToken = request.cookies.get("customerAccessToken")?.value;
    if (!customerAccessToken) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/auth";
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    const customerAccessToken = request.cookies.get("customerAccessToken")?.value;
    if (!customerAccessToken) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        },
        { status: 401 }
      );
    }
  }

  const response = NextResponse.next();

  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    "US";

  if (!request.cookies.get("preferredCurrency")) {
    response.cookies.set("preferredCurrency", country === "IN" ? "INR" : "USD", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; connect-src 'self' https:;"
  );

  if (pathname.startsWith("/api")) {
    response.headers.set("X-RateLimit-Limit", "120");
    response.headers.set("X-RateLimit-Window", "60s");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
