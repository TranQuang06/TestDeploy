import React, { memo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../Header';
import Footer from '../Footer';
import ChatButton from '../ChatButton/ChatButton';
import { APP_CONFIG } from '../../constants';

/**
 * Main Layout Component
 * Provides consistent layout structure across pages
 */
const MainLayout = memo(({ 
  children, 
  title, 
  description, 
  keywords,
  noIndex = false,
  showHeader = true,
  showFooter = true,
  showChat = true,
  className = '',
  ...props 
}) => {
  const router = useRouter();
  
  // Generate page title
  const pageTitle = title 
    ? `${title} | ${APP_CONFIG.name}`
    : APP_CONFIG.name;

  // Generate meta description
  const metaDescription = description || APP_CONFIG.description;

  // Generate canonical URL
  const canonicalUrl = `${APP_CONFIG.url}${router.asPath}`;

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="author" content={APP_CONFIG.author} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Robots */}
        {noIndex && <meta name="robots" content="noindex, nofollow" />}
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={APP_CONFIG.name} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
      </Head>

      <div className={`main-layout ${className}`} {...props}>
        {showHeader && <Header />}
        
        <main role="main" className="main-content">
          {children}
        </main>
        
        {showFooter && <Footer />}
        {showChat && <ChatButton />}
      </div>
    </>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
