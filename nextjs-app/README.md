# Client app

The application was setup by Next.js 14, Auth0, Ant Design and so on.

## Setup Auth0 Provider

Reference to: [Add Login to Your Next.js Application](https://auth0.com/docs/quickstart/webapp/nextjs/interactive#install-the-auth0-next-js-sdk)

Note:

- In the logout, we must be use `<a>` instead of `<Link>` component of Next.js for avoiding the prefetch future.
