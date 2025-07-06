import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // const token = req
  const { pathname } = request.nextUrl;

  const token = await getToken({ req: request });
  if (pathname.startsWith("/user")) {
    if (!token || !token.user || !token.user.id) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (pathname !== "/admin/login") {
      if (!token || !token.user || token.user.role !== "Admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }
}
