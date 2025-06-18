// pages/DynamicCV/index.js

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from "../../components/Header";
import { Spin } from 'antd';

// Dynamic import để tránh lỗi SSR
const CVTemplateDetailed = dynamic(
  () => import('../../components/CVTemplateDetail'),
  { 
    ssr: false,
    loading: () => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <Spin size="large" />
      </div>
    )
  }
);

export default function DynamicCV() {
  const [cvData, setCvData] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Import getCVDataByTemplate chỉ khi ở client
    import("../../data/cvTemplatesData").then((module) => {
      const data = module.getCVDataByTemplate(1);
      setCvData(data);
    }).catch((error) => {
      console.error('Error loading CV data:', error);
      // Fallback data
      setCvData({
        fullname: "Họ và tên",
        position: "Vị trí ứng tuyển",
        photo: "/assets/img/creatCV/cv/avatar.png",
        objective: "Mục tiêu nghề nghiệp",
        personal: {
          phone: "Số điện thoại",
          email: "Email",
          address: "Địa chỉ"
        },
        education: [],
        experience: [],
        activities: [],
        certificates: [],
        references: [],
        awards: [],
        extraInfo: ""
      });
    });
  }, []);

  if (!isClient) {
    return (
      <>
        <Header />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px' 
        }}>
          <Spin size="large" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      {cvData ? (
        <CVTemplateDetailed data={cvData} />
      ) : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px' 
        }}>
          <Spin size="large" />
        </div>
      )}
    </>
  );
}
