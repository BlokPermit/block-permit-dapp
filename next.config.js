/** @type {import('next').NextConfig} */
const nextConfig = {}
const withTM = require('next-transpile-modules')(["react-icons"]);
module.exports = withTM(nextConfig)

