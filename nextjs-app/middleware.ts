import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import verifyJWT from "./auth/auth0";
import { ADMIN_PERMISSIONS } from "./auth/constants";
import userEdgeToken from "./lib/user-token-edge";

const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();

  const token = await userEdgeToken(req, res);

  if (!token || token === null) {
    return NextResponse.redirect(new URL("/api/auth/login", req.nextUrl));
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    const jwt = await verifyJWT(token?.accessToken as string);
    const isAllowed = ADMIN_PERMISSIONS.some((c) =>
      jwt?.permissions?.includes(c)
    );
    if (!isAllowed) {
      return NextResponse.redirect(
        new URL(`${req.nextUrl.basePath}/403`, req.nextUrl)
      );
    }
  }

  return res;
};

export default withMiddlewareAuthRequired(middleware);

export const config = {};
