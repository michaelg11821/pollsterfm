import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const authConfig = {
  protectedRoutes: ["/account-settings"],
  signInPath: "/sign-in",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;

  try {
    const isProtectedRoute = authConfig.protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!isProtectedRoute) return NextResponse.next();

    if (!req.auth) {
      const signinUrl = new URL(authConfig.signInPath, req.url);

      signinUrl.searchParams.set("redirect", encodeURIComponent(pathname));

      return NextResponse.redirect(signinUrl);
    }

    return NextResponse.next();
  } catch (err: unknown) {
    console.error("middleware error:", err);

    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/account-settings/:path*"],
};
