/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  i18n: {
    locales: ["es"],
    defaultLocale: "es",
  },
}

export default nextConfig