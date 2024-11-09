/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
      dangerouslyAllowSVG: true,
      remotePatterns: [
        {
          protocol: "https",
          hostname: "i.imgur.com",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "res.cloudinary.com",
          pathname: "/**",
        },
      ],
    },
  };
  
  export default nextConfig;
  