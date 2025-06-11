import React, { useState } from "react";
import { Select, Dropdown } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import styles from "../../pages/CreateCV/CreateCV.module.css";


// Component hiển thị một mẫu CV trong gallery
const CVGalleryCard = ({ template, onUseTemplate }) => {
  const menuItems = [
    { key: "preview", label: "Xem trước" },
    { key: "download", label: "Tải xuống" },
    { key: "edit", label: "Chỉnh sửa" },
  ];

  return (
    <div className={styles.templateCard}>
      <img
        src={template.image}
        alt={template.name}
        className={styles.templateImage}
      />
      <div className={styles.templateInfo}>
        <div className={styles.templateTitle}>{template.name}</div>
        {template.featured && (
          <div className={styles.recommendedBadge}>Featured</div>
        )}
      </div>

      <div className={styles.templateDetails}>
        <div className={styles.templateCategory}>{template.industry}</div>
        <div className={styles.templateRating}>
          <span className={styles.stars}>★★★★★</span>
          <span className={styles.downloads}>{template.views} views</span>
        </div>
      </div>

      <div className={styles.templateActions}>
        <button
          className={styles.useTemplateButton}
          onClick={() => onUseTemplate && onUseTemplate(template)}
        >
          Sử dụng ngay
        </button>
      </div>

      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <button className={styles.menuButton}>
          <EllipsisOutlined />
        </button>
      </Dropdown>
    </div>
  );
};

// Component chính cho CV Gallery
const CVGallerySection = ({ onUseTemplate }) => {
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  // Dữ liệu CV mới - khác với section 3
  const cvGalleryTemplates = [
    {
      id: 1,
      name: "CV Marketing Manager",
      image: "/assets/img/creatCV/cv/cv9.png",
      industry: "Marketing",
      featured: true,
      views: "5.2k",
    },
    {
      id: 2,
      name: "CV Data Analyst",
      image: "/assets/img/creatCV/cv/cv10.png",
      industry: "Data Science",
      featured: true,
      views: "4.8k",
    },
    {
      id: 3,
      name: "CV UI/UX Designer",
      image: "/assets/img/creatCV/cv/cv11.png",
      industry: "Design",
      featured: true,
      views: "6.1k",
    },
    {
      id: 4,
      name: "CV Project Manager",
      image: "/assets/img/creatCV/cv/cv12.png",
      industry: "Management",
      featured: false,
      views: "3.7k",
    },
    {
      id: 5,
      name: "CV Sales Executive",
      image: "/assets/img/creatCV/cv/cv13.png",
      industry: "Sales",
      featured: false,
      views: "4.2k",
    },
    {
      id: 6,
      name: "CV HR Specialist",
      image: "/assets/img/creatCV/cv/cv14.png",
      industry: "Human Resources",
      featured: false,
      views: "3.9k",
    },
    {
      id: 7,
      name: "CV Software Engineer",
      image: "/assets/img/creatCV/cv/cv15.png",
      industry: "Technology",
      featured: false,
      views: "7.3k",
    },
    {
      id: 8,
      name: "CV Financial Analyst",
      image: "/assets/img/creatCV/cv/cv16.png",
      industry: "Finance",
      featured: false,
      views: "2.8k",
    },
    {
      id: 9,
      name: "CV Content Writer",
      image: "/assets/img/creatCV/cv/17.png",
      industry: "Content",
      featured: false,
      views: "3.5k",
    },
    {
      id: 10,
      name: "CV Operations Manager",
      image: "/assets/img/creatCV/cv/cv18.png",
      industry: "Operations",
      featured: false,
      views: "2.9k",
    },
    {
      id: 11,
      name: "CV Digital Marketer",
      image: "/assets/img/creatCV/cv/cv19.png",
      industry: "Marketing",
      featured: false,
      views: "4.6k",
    },
    {
      id: 12,
      name: "CV Business Analyst",
      image: "/assets/img/creatCV/cv/cv20.png",
      industry: "Business",
      featured: false,
      views: "3.3k",
    },
  ];

  // Lọc CV theo industry
  const filteredTemplates =
    selectedIndustry === "all"
      ? cvGalleryTemplates
      : cvGalleryTemplates.filter(
          (template) =>
            template.industry.toLowerCase() === selectedIndustry.toLowerCase()
        );

  return (
    <div className={styles.cvGalleryContainer}>
      {/* Header với filter */}
      <div className={styles.tabHeader}>
        <div></div>
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={(value) => setSelectedIndustry(value)}
          placeholder="Chọn ngành nghề"
          options={[
            { value: "all", label: "Tất cả ngành nghề" },
            { value: "marketing", label: "Marketing" },
            { value: "technology", label: "Technology" },
            { value: "design", label: "Design" },
            { value: "finance", label: "Finance" },
            { value: "management", label: "Management" },
            { value: "sales", label: "Sales" },
            { value: "human resources", label: "Human Resources" },
            { value: "data science", label: "Data Science" },
            { value: "content", label: "Content" },
            { value: "operations", label: "Operations" },
            { value: "business", label: "Business" },
          ]}
        />
      </div>

      {/* Grid hiển thị CV */}
      <div className={styles.templateGrid}>
        {filteredTemplates.map((template) => (
          <CVGalleryCard key={template.id} template={template} onUseTemplate={onUseTemplate} />
        ))}
      </div>
    </div>
  );
};

export default CVGallerySection;
