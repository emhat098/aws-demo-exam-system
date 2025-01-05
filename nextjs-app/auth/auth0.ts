import { AppJWTPayload } from "@/types/jwt";
import { decodeJwt } from "jose";

/**
 * Verifies and decodes a JWT from Auth0.
 * @param jwt - The JWT to verify.
 * @returns {AppJWTPayload} - The decoded JWT payload.
 * @throws Unauthorized error if invalid.
 */
const decodeJWT = (jwt: string | undefined): AppJWTPayload | undefined => {
  if (!jwt) {
    throw new Error("JWT is missing.");
  }

  try {
    const data = decodeJwt(jwt);
    return data;
  } catch (error) {
    console.error("JWT Verification Failed:", error);
    throw new Error("Unauthorized");
  }
};

export default decodeJWT;
