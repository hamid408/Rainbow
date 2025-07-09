import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/auth/sign-in",
  "/auth/login-password",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/self-change-password",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("id_token")?.value;

  const currentPath = request.nextUrl.pathname;
  const isPublic = publicRoutes.includes(currentPath);

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if (token && currentPath === "/auth/sign-in") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  // new addition to check token validity
  if (token) {
    // Optionally decode and validate expiry if needed
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        const response = NextResponse.redirect(
          new URL("/auth/sign-in", request.url)
        );
        response.cookies.delete("id_token");
        return response;
      }
    } catch {
      // invalid token
      const response = NextResponse.redirect(
        new URL("/auth/sign-in", request.url)
      );
      response.cookies.delete("id_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
