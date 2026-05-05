import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  if (process.env.DEV_MODE === "true") {
    return NextResponse.next()
  }

  const token = request.cookies.get("swiggy_token")

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/chat/:path*"],
}
