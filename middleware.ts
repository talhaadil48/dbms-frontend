import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { NextFetchEvent } from "next/server";

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  return clerkMiddleware()(req, event);
}

export const config = {
  matcher: [
    // Exclude the login route from middleware protection
    "/((?!login|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
