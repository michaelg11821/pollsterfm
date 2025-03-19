import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/profile"];

  const session = await auth();

  if (!session && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const signinUrl = new URL("/sign-in", request.url);

    signinUrl.searchParams.set("redirect", encodeURIComponent(pathname));

    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}
