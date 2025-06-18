/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Optimize images
  images: {
    domains: ["firebasestorage.googleapis.com", "lh3.googleusercontent.com"],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Transpile packages for better compatibility
  transpilePackages: [
    "antd",
    "@ant-design/charts",
    "@ant-design/icons",
    "@rc-component/util",
    "rc-util",
    "rc-picker",
    "rc-table",
    "rc-tree",
    "rc-select",
    "rc-input",
    "rc-menu",
    "rc-dropdown",
    "rc-tooltip",
    "rc-dialog",
    "rc-drawer",
    "rc-collapse",
    "rc-tabs",
    "rc-pagination",
    "rc-upload",
    "rc-switch",
    "rc-slider",
    "rc-rate",
    "rc-progress",
    "rc-steps",
    "rc-checkbox",
    "rc-field-form",
    "rc-motion",
    "rc-notification",
    "rc-image",
    "rc-mentions",
    "rc-cascader",
    "rc-tree-select",
    "rc-textarea",
    "rc-input-number",
    "rc-segmented",
    "rc-resize-observer",
    "rc-overflow",
    "rc-virtual-list",
  ],

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          antd: {
            test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
            name: "antd",
            chunks: "all",
          },
          firebase: {
            test: /[\\/]node_modules[\\/]firebase[\\/]/,
            name: "firebase",
            chunks: "all",
          },
        },
      };
    }

    // Resolve fallbacks for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, stale-while-revalidate=60",
          },
        ],
      },
    ];
  },

  // Redirects for better SEO
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Experimental features
  experimental: {
    scrollRestoration: true,
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Output configuration
  output: "standalone",

  // Power by header
  poweredByHeader: false,
};

export default nextConfig;
