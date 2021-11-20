/** @type {import('next').NextConfig} */
const path = require('path')

module.exports = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
        config.resolve.fallback.fs = false
      }
    return config
  },
  images: {
    domains: ['nishtechxedgesandbox.sitecoresandbox.cloud', 'images.ctfassets.net'],
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, '../styles')],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  env: {
    contentHubEndPoint: process.env.contentHubEndPoint,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    username: process.env.userId,
    password: process.env.password,
    CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN: process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN,
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT,
    CONTENTFUL_DELIVERY_API_ACCESS_TOKEN: process.env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN,
    CONTENTFUL_PREVIEW_API_ACCESS_TOKEN: process.env.CONTENTFUL_PREVIEW_API_ACCESS_TOKEN,
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_PREVIEW_OPTION: process.env.CONTENTFUL_PREVIEW_OPTION,
    CONTENT_CACHE_DURATION: process.env.CONTENT_CACHE_DURATION,
    XEDGE_DELIVERY_API_KEY: process.env.XEDGE_DELIVERY_API_KEY,
    XEDGE_PREVIEW_API_KEY: process.env.XEDGE_PREVIEW_API_KEY,
    XEDGE_PREVIEW_OPTION: process.env.XEDGE_PREVIEW_OPTION
  },
}
