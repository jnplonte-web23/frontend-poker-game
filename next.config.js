/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	trailingSlash: true,
	// exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
	// 	return {
	// 		'/': { page: '/' },
	// 		'/about-us': { page: '/about-us' },
	// 	};
	// },
};
const withTM = require('next-transpile-modules')(['hashconnect']);

module.exports = nextConfig;
module.exports = withTM({});
