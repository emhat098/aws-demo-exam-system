/** @type {import('@auth0/auth0-react').Auth0ProviderOptions} */
const auth0Config = {
  domain: process.env.NEXT_AUTH0_DOMAIN,
  clientId: process.env.NEXT_AUTH0_CLIENT_ID,
};

export default auth0Config;
