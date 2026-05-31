import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";

// 1. Specify protected and public routes
const protectedRoutes = ["/main_corriere", "/main_utente", "/auth/change-password"];
const publicRoutes = ["/auth/login", "/auth/signup", "/"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.jwt) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  // 5. Redirect to the correct home based on role if the user is authenticated
  if (isPublicRoute && session?.jwt) {
    const role = (session as any)?.user?.role;
    const destination = role === "Corriere" ? "/main_corriere" : "/main_utente";
    if (!req.nextUrl.pathname.startsWith(destination)) {
      return NextResponse.redirect(new URL(destination, req.nextUrl));
    }
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
