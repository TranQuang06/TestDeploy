// pages/DynamicCV/index.js

import React from 'react'
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CVTemplateDetailed from '../../components/CVTemplateDetail';
import { getCVDataByTemplate } from "../../data/cvTemplatesData";

export default function DynamicCV() {
  // Sử dụng dữ liệu từ template (mặc định template 1)
  const data = getCVDataByTemplate(1);
  
  return (
    <>
      <Header />
      {/* Thêm CVTemplateDetailed vào giữa Header và Footer */}
      <CVTemplateDetailed data={data} />
      <Footer />
    </>
  );
}
