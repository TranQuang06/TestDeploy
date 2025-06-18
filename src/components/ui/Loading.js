import React, { memo } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

/**
 * Loading Component
 * Reusable loading indicator with different variants
 */

// Custom loading icon
const LoadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

// Loading variants
export const LoadingSpinner = memo(({ size = 'default', tip = 'Đang tải...' }) => (
  <div className="loading-spinner" style={{ textAlign: 'center', padding: '20px' }}>
    <Spin size={size} tip={tip} indicator={LoadingIcon} />
  </div>
));

export const LoadingPage = memo(({ message = 'Đang tải trang...' }) => (
  <div className="loading-page" style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    gap: '16px'
  }}>
    <Spin size="large" indicator={LoadingIcon} />
    <p style={{ margin: 0, color: '#666' }}>{message}</p>
  </div>
));

export const LoadingOverlay = memo(({ loading, children, tip = 'Đang xử lý...' }) => (
  <Spin spinning={loading} tip={tip} indicator={LoadingIcon}>
    {children}
  </Spin>
));

export const LoadingCard = memo(({ height = '200px' }) => (
  <div 
    className="loading-card"
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height,
      background: '#fafafa',
      borderRadius: '8px',
      border: '1px solid #f0f0f0'
    }}
  >
    <Spin indicator={LoadingIcon} />
  </div>
));

export const LoadingButton = memo(({ loading, children, ...props }) => (
  <button 
    {...props} 
    disabled={loading || props.disabled}
    style={{
      ...props.style,
      opacity: loading ? 0.6 : 1,
      cursor: loading ? 'not-allowed' : 'pointer'
    }}
  >
    {loading && <LoadingOutlined style={{ marginRight: '8px' }} />}
    {children}
  </button>
));

// Skeleton loading components
export const SkeletonCard = memo(() => (
  <div className="skeleton-card" style={{
    padding: '16px',
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    marginBottom: '16px'
  }}>
    <div className="skeleton-line" style={{
      height: '20px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-loading 1.5s infinite',
      borderRadius: '4px',
      marginBottom: '12px'
    }} />
    <div className="skeleton-line" style={{
      height: '16px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-loading 1.5s infinite',
      borderRadius: '4px',
      width: '80%',
      marginBottom: '8px'
    }} />
    <div className="skeleton-line" style={{
      height: '16px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-loading 1.5s infinite',
      borderRadius: '4px',
      width: '60%'
    }} />
    
    <style jsx>{`
      @keyframes skeleton-loading {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
    `}</style>
  </div>
));

export const SkeletonList = memo(({ count = 3 }) => (
  <div className="skeleton-list">
    {Array.from({ length: count }, (_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
));

// Set display names
LoadingSpinner.displayName = 'LoadingSpinner';
LoadingPage.displayName = 'LoadingPage';
LoadingOverlay.displayName = 'LoadingOverlay';
LoadingCard.displayName = 'LoadingCard';
LoadingButton.displayName = 'LoadingButton';
SkeletonCard.displayName = 'SkeletonCard';
SkeletonList.displayName = 'SkeletonList';

// Default export
const Loading = LoadingSpinner;
Loading.Page = LoadingPage;
Loading.Overlay = LoadingOverlay;
Loading.Card = LoadingCard;
Loading.Button = LoadingButton;
Loading.Skeleton = SkeletonCard;
Loading.SkeletonList = SkeletonList;

export default Loading;
