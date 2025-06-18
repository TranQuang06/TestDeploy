/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://your-domain.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/Admin',
    '/Admin/*',
    '/api/*',
    '/404',
    '/500',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/Admin',
          '/Admin/*',
          '/api/*',
          '/404',
          '/500',
        ],
      },
    ],
    additionalSitemaps: [
      'https://your-domain.com/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom priority and changefreq for different pages
    const customConfig = {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };

    // Higher priority for important pages
    if (path === '/') {
      customConfig.priority = 1.0;
      customConfig.changefreq = 'daily';
    } else if (path.includes('/FindJob') || path.includes('/CreateCV')) {
      customConfig.priority = 0.9;
      customConfig.changefreq = 'daily';
    } else if (path.includes('/Blog') || path.includes('/Course')) {
      customConfig.priority = 0.8;
      customConfig.changefreq = 'weekly';
    }

    return customConfig;
  },
};
