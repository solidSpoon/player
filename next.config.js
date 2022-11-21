/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
}

module.exports = nextConfig


module.exports = {
    serverRuntimeConfig: {
        // Will only be available on the server side
        secretId: 'AKIDc2KZbcTEn7B3iANM7f2IRRWcVBj6Qk15',
        secretKey: 'DMrLj4NnARbeIuTwMgpBUgeklstjcMsC'
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        staticFolder: '/static',
    },
}