// Thêm import useState nếu bạn cần sử dụng state
import { useState } from "react";
import { Row, Col, Tabs, Dropdown, Select } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import styles from "../../pages/CreateCV/CreateCV.module.css";

// Component hiển thị một mẫu CV
const ResumeCard = ({ template, onUseTemplate }) => {
  const menuItems = [
    { key: "view", label: "View Details" },
    { key: "use", label: "Use This Template" },
    { key: "share", label: "Share Template" },
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
        {template.recommended && (
          <div className={styles.recommendedBadge}>Recommended</div>
        )}
      </div>
      
      {/* Thêm thông tin chi tiết */}
      <div className={styles.templateDetails}>
        <div className={styles.templateCategory}>
          {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
        </div>
        <div className={styles.templateRating}>
          <span className={styles.stars}>★★★★☆</span>
          <span className={styles.downloads}>{template.downloads || '2.1k'} Used</span>
        </div>
      </div>
      
      {/* Thêm nút "Dùng mẫu" */}
      <div className={styles.templateActions}>
        <button
          className={styles.useTemplateButton}
          onClick={() => onUseTemplate && onUseTemplate(template)}
        >
          Dùng mẫu
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

// Component cho nội dung tab Resume Templates
const ResumeTemplatesTab = ({ onUseTemplate }) => {
    const [category, setCategory] = useState("all");
  
    // Dữ liệu mẫu với ảnh có sẵn
    const templates = [
      {
        id: 1,
        name: "Resume | Swiss",
        image: "/assets/img/creatCV/cv/cv1.png",
        category: "minimal",
        recommended: true,
        downloads: "3.2k",
      },
      {
        id: 2,
        name: "Resume | Creative",
        image: "/assets/img/creatCV/cv/cv2.png",
        category: "creative",
        recommended: true,
        downloads: "2.8k",
      },
      {
        id: 3,
        name: "Resume | Professional",
        image: "/assets/img/creatCV/cv/cv3.png",
        category: "professional",
        recommended: true,
        downloads: "4.1k",
      },
      {
        id: 4,
        name: "Resume | Modern",
        image: "/assets/img/creatCV/cv/cv4.png",
        category: "creative",
        recommended: false,
        downloads: "1.9k",
      },
      {
        id: 5,
        name: "Resume | Clean",
        image: "/assets/img/creatCV/cv/cv5.png",
        category: "minimal",
        recommended: false,
        downloads: "2.5k",
      },
      {
        id: 6,
        name: "Resume | Executive",
        image: "/assets/img/creatCV/cv/cv6.png",
        category: "professional",
        recommended: false,
        downloads: "1.7k",
      },
      {
        id: 7,
        name: "Resume | Designer",
        image: "/assets/img/creatCV/cv/cv7.png",
        category: "creative",
        recommended: false,
        downloads: "3.0k",
      },
      {
        id: 8,
        name: "Resume | Simple",
        image: "/assets/img/creatCV/cv/cv8.png",
        category: "minimal",
        recommended: false,
        downloads: "2.3k",
      },
    ];

  const filteredTemplates =
    category === "all"
      ? templates
      : templates.filter((t) => t.category === category);

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabHeader}>
        <div></div> {/* Để giữ khoảng trống bên trái */}
        <Select
          defaultValue="all"
          style={{ width: 180 }}
          onChange={(value) => setCategory(value)}
            className={styles.categorySelect}
          options={[
            { value: "all", label: "All Categories" },
            { value: "minimal", label: "Minimal" },
            { value: "creative", label: "Creative" },
            { value: "professional", label: "Professional" },
            { value: "uxui", label: "UX/UI Design" },
          ]}
        />
      </div>

      <div className={styles.templateGrid}>
        {filteredTemplates.map((template) => (
          <ResumeCard key={template.id} template={template} onUseTemplate={onUseTemplate} />
        ))}
      </div>
    </div>
  );
};
export default ResumeTemplatesTab;