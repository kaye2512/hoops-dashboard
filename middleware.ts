import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const storeId = pathname.split("/")[2]; // Assuming the URL pattern is /[storeId]/...

  if (storeId) {
    const response = NextResponse.next();
    response.headers.set("x-store-id", storeId);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:storeId/:path*",
};
