/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',
  devIndicators: false,
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  },
  // Route the root to the English locale by default and canonicalize
  // locale-less paths. Pattern matches the production dashboard — add
  // another locale by extending the `/:lang(...)` groups.
  redirects: async () => [
    {
      source: '/',
      destination: '/en/dashboards/overview',
      permanent: true,
      locale: false,
    },
    {
      source: '/:lang(en)',
      destination: '/:lang/dashboards/overview',
      permanent: true,
      locale: false,
    },
    {
      source:
        '/:path((?!(?:en|api|_next|images|favicon.ico)\\b).*)',
      destination: '/en/:path',
      permanent: true,
      locale: false,
    },
  ],
}

export default nextConfig
