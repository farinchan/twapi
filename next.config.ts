import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  // Static export removed to enable middleware
  trailingSlash: true,
  // Remove unoptimized images since we're not doing static export
  // images: {
  //   unoptimized: true,
  // },
  
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    // Additional Sass options can go here
  },
};

export default nextConfig;