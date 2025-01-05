import { AppJWTPayload } from "@/types/jwt";
import { createLocalJWKSet, createRemoteJWKSet, jwtVerify } from "jose";

// Ensure required environment variables exist
if (!process.env.AUTH0_ISSUER_BASE_URL) {
  throw new Error("AUTH0_ISSUER_BASE_URL environment is not set.");
}

if (!process.env.AUTH0_AWS_JWT_AUTHORIZER_AUDIENCE) {
  throw new Error("AUTH0_AWS_JWT_AUTHORIZER_AUDIENCE environment is not set.");
}

const jsonURL = `${process.env.AUTH0_ISSUER_BASE_URL}.well-known/jwks.json`;

/**
 * Verifies and decodes a JWT from Auth0.
 * @param jwt - The JWT to verify.
 * @returns {AppJWTPayload} - The decoded JWT payload.
 * @throws Unauthorized error if invalid.
 */
const verifyJWT = async (
  jwt: string | undefined
): Promise<AppJWTPayload | undefined> => {
  if (!jwt) {
    throw new Error("JWT is missing.");
  }

  try {
    const JWKS = createRemoteJWKSet(new URL(jsonURL), {
      cacheMaxAge: 604800,
      headers: {
        "Cache-Control": "max-age=604800, stale-while-revalidate=86400",
      },
    });

    const data = await jwtVerify(jwt, JWKS, {
      audience: process.env.AUTH0_AWS_JWT_AUTHORIZER_AUDIENCE,
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
    });
    if (data?.payload) {
      return data.payload as AppJWTPayload; // Return the decoded payload
    }
  } catch (error) {
    console.error("JWT Verification Failed:", error);
    throw new Error("Unauthorized");
  }
};

export default verifyJWT;
