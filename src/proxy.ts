 import { NextResponse } from "next/server";
 import type { NextRequest } from "next/server";
 import { getToken } from "next-auth/jwt";

 export async function proxy(request: NextRequest) {
   const token = await getToken({ req: request });
   const { pathname } = request.nextUrl;

   // Logged in user → prevent auth pages
   if (
     token &&
     (pathname.startsWith("/sign-in") ||
       pathname.startsWith("/sign-up") ||
       pathname.startsWith("/verify"))
   ) {
     return NextResponse.redirect(new URL("/dashboard", request.url));
   }

   // Not logged in → protect dashboard
   if (!token && pathname.startsWith("/dashboard")) {
     return NextResponse.redirect(new URL("/home", request.url));
   }

   return NextResponse.next(); // 👈 VERY IMPORTANT
 }

 export const config = {
   matcher: ["/sign-in", "/sign-up", "/dashboard/:path*", "/verify/:path*"],
 };
