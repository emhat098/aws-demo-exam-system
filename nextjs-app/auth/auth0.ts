import { createRemoteJWKSet, jwtVerify } from "jose";

// Ensure required environment variables exist
if (!process.env.AUTH0_ISSUER_BASE_URL) {
  throw new Error("AUTH0_ISSUER_BASE_URL environment is not set.");
}

if (!process.env.AUTH0_AWS_JWT_AUTHORIZER_AUDIENCE) {
  throw new Error("AUTH0_AWS_JWT_AUTHORIZER_AUDIENCE environment is not set.");
}

const JWKS = createRemoteJWKSet(new URL(`${process.env.AUTH0_ISSUER_BASE_URL}.well-known/jwks.json`), {
  cacheMaxAge: 600000,
});

/**
 * Verifies and decodes a JWT from Auth0.
 * @param jwt - The JWT to verify.
 * @returns {AppJWTPayload} - The decoded JWT payload.
 * @throws Unauthorized error if invalid.
 */
const verifyJWT = async (jwt: string | undefined): Promise<AppJWTPayload> => {
  if (!jwt) {
    throw new Error("JWT is missing.");
  }

  try {
    const { payload } = await jwtVerify(jwt, JWKS, {
      audience: process.env.AUTH0_AWS_JWT_AUTHORIZER_AUDIENCE,
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
    });
    return payload as AppJWTPayload; // Return the decoded payload
  } catch (error) {
    console.error("JWT Verification Failed:", error);
    throw new Error("Unauthorized");
  }
};

export default verifyJWT;