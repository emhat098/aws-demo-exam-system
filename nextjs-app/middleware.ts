import {
  withMiddlewareAuthRequired,
  getAccessToken,
} from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_PERMISSIONS } from "./auth/constants";
import decodeJWT from "./auth/auth0";

const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();

  const token = await getAccessToken(req, res);

  if (req.nextUrl.pathname.startsWith("/admin")) {
    const payload = decodeJWT(token?.accessToken as string);
    if (payload) {
      const isAllowed = ADMIN_PERMISSIONS.some((c) =>
        payload?.permissions?.includes(c)
      );
      if (!isAllowed) {
        return redirectToURL(req, `${req.nextUrl.basePath}/403`);
      }
    }
  }
  return res;
};

function redirectToURL(req: NextRequest, url: string) {
  return NextResponse.redirect(new URL(url, req.nextUrl));
}

export default withMiddlewareAuthRequired(middleware);
