/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
}

module.exports = nextConfig


module.exports = {
    serverRuntimeConfig: {
        // Will only be available on the server side
        secretId: '',
        secretKey: ''
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        staticFolder: '/static',
    },
}