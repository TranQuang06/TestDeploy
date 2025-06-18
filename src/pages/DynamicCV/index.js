// pages/DynamicCV/index.js

import React, { useState, useEffect, memo } from "react";
import dynamic from "next/dynamic";
import MainLayout from "../../components/layout/MainLayout";
import Loading from "../../components/ui/Loading";

// Dynamic import để tránh lỗi SSR
const CVTemplateDetailed = dynamic(
  () => import("../../components/CVTemplateDetail"),
  {
    ssr: false,
    loading: () => <Loading.Page message="Đang tải CV template..." />,
  }
);

const DynamicCV = memo(() => {
  const [cvData, setCvData] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Import getCVDataByTemplate chỉ khi ở client
    import("../../data/cvTemplatesData")
      .then((module) => {
        const data = module.getCVDataByTemplate(1);
        setCvData(data);
      })
      .catch((error) => {
        console.error("Error loading CV data:", error);
        // Fallback data
        setCvData({
          fullname: "Họ và tên",
          position: "Vị trí ứng tuyển",
          photo: "/assets/img/creatCV/cv/avatar.png",
          objective: "Mục tiêu nghề nghiệp",
          personal: {
            phone: "Số điện thoại",
            email: "Email",
            address: "Địa chỉ",
          },
          education: [],
          experience: [],
          activities: [],
          certificates: [],
          references: [],
          awards: [],
          extraInfo: "",
        });
      });
  }, []);

  return (
    <MainLayout
      title="Tạo CV động"
      description="Tạo CV chuyên nghiệp với template động và tùy chỉnh theo nhu cầu"
      keywords="tạo CV, CV template, CV chuyên nghiệp, thiết kế CV"
    >
      {!isClient || !cvData ? (
        <Loading.Page message="Đang tải CV template..." />
      ) : (
        <CVTemplateDetailed data={cvData} />
      )}
    </MainLayout>
  );
});

DynamicCV.displayName = "DynamicCV";

export default DynamicCV;
