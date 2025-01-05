import { getAccessToken } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";

const userToken = async (req: NextRequest, res: NextResponse) => {
  try {
    return await getAccessToken(req, res);
  } catch {
    return false;
  }
};

export default userToken;
