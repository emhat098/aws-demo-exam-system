import { JWTPayload } from "jose";

export interface AppJWTPayload extends JWTPayload {
  permissions?: Array<string>;
}
