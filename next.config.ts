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

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude PostgreSQL and other unused database drivers (but keep mysql2)
      config.externals.push({
        'pg': 'commonjs pg',
        'tedious': 'commonjs tedious',
        'sqlite3': 'commonjs sqlite3',
        'mariadb': 'commonjs mariadb',
        'oracledb': 'commonjs oracledb',
      });
    }
    return config;
  },

  // Allow serverComponentsExternalPackages for database packages
  serverComponentsExternalPackages: ['sequelize', 'mysql2'],
};

export default nextConfig;