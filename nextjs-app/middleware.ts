import {
  getSession,
  withMiddlewareAuthRequired,
} from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";

const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();

  const user = await getSession(req, res);

  if (!user || user === null) {
    NextResponse.redirect("/api/auth/login");
  }

  return res;
};

export default withMiddlewareAuthRequired(middleware);

export const config = {
  matcher: "/",
};
