import { auth } from "@/auth";
import { DEFAULT_REDIRECT_PATH, DEFAULT_RESTRICTED_REDIRECT_PATH, RESTRICTED_PATHS } from "./app/utils/constants";

export default auth((req) => {

  if (!req.auth && !RESTRICTED_PATHS.includes(req.nextUrl.pathname)) {
    const newUrl = new URL(DEFAULT_RESTRICTED_REDIRECT_PATH, req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  if (req.auth && RESTRICTED_PATHS.includes(req.nextUrl.pathname)) {
    const newUrl = new URL(DEFAULT_REDIRECT_PATH, req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};