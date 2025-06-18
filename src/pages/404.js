import React, { memo } from 'react';
import { Result, Button } from 'antd';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainLayout from '../components/layout/MainLayout';

/**
 * Custom 404 Page
 * Optimized with SEO and user experience
 */
const Custom404 = memo(() => {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <MainLayout
      title="Trang không tìm thấy"
      description="Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển."
      noIndex={true}
      showHeader={true}
      showFooter={true}
      showChat={false}
    >
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <Result
          status="404"
          title="404"
          subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại."
          extra={[
            <Link href="/" key="home">
              <Button type="primary" icon={<HomeOutlined />}>
                Về trang chủ
              </Button>
            </Link>,
            <Button key="back" icon={<ArrowLeftOutlined />} onClick={handleGoBack}>
              Quay lại
            </Button>,
          ]}
        />
      </div>
    </MainLayout>
  );
});

Custom404.displayName = 'Custom404';

export default Custom404;
