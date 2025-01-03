# Client app

The application was setup by Next.js 14, Auth0, Ant Design and so on.

## Integration Auth0 to Next.js Application

Reference to: [Add Login to Your Next.js Application](https://auth0.com/docs/quickstart/webapp/nextjs/interactive#install-the-auth0-next-js-sdk)

## Add the component log out and log in.

- Log in and log out component: `user-avatar.tsx`

## Implement router `api/auth/[auth0]/route.ts`

On later, we are going to receive data from lambda function that protected by Auth0 Authorize. So we are going to create an new API to process authenticate on Lambda function

```ts
import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AWS_JWT_AUTHORIZER_AUDIENCE,
    },
  }),
});
```

The `audience` is the `Identifier` of API.

Note:

- In the logout, we must be use `<a>` instead of `<Link>` component of Next.js for avoiding the prefetch future.
