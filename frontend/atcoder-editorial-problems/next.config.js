/** @type {import('next').NextConfig} */
const urlPrefix = '/AtCoderEditorialProblems';

const nextConfig = {
  output: 'export',
  // reactStrictMode: false,
  // assetPrefix: urlPrefix, 利用は非推奨

  /* static export時にコメントを外す */
  // basePath: urlPrefix,
  // trailingSlash: true,
};

module.exports = nextConfig;
