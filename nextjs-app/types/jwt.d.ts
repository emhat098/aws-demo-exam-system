
interface AppJWTPayload extends JWTPayload {
   permissions?: Array<string>;
}