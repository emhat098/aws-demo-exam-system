import {
  getAccessToken,
  getSession,
  withMiddlewareAuthRequired,
} from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import verifyJWT from "./auth/auth0";
import { ADMIN_PERMISSIONS } from "./auth/constants";
import userEdgeToken from "./lib/user-token-edge";

const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();

  const token = await userEdgeToken(req, res);

  if (!token || token === null) {
    return redirectToURL(req, "/api/auth/login");
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    const payload = await verifyJWT(token?.accessToken as string);
    const isAllowed = ADMIN_PERMISSIONS.some((c) =>
      payload?.permissions?.includes(c)
    );
    if (!isAllowed) {
      return redirectToURL(req, `${req.nextUrl.basePath}/403`);
    }
  }

  return res;
};

function redirectToURL(req: NextRequest, url: string) {
  return NextResponse.redirect(new URL(url, req.nextUrl));
}

export default withMiddlewareAuthRequired(middleware);

export const config = {};
