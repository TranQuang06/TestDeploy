import React, { useEffect, useState } from "react";
import styles from "./CourseDetailPage.module.css";
import {
  CheckCircleOutlined,
  StarFilled,
  BookOutlined,
} from "@ant-design/icons";

// Dữ liệu cứng fallback
const defaultCourse = {
  title: "Lập trình Java nâng cao",
  image: "/assets/img/Course/Java.png",
  rating: 4.5,
  reviews: 2220,
  students: 21450,
  description:
    "Bạn sẽ được học về ngôn ngữ lập trình từ A đến Z  ",
  author: {
    name: "Vũ Nguyễn coder",
    org: "VKU University",
    logo: "/assets/img/Course/LogoTruong.png",
    avatar: "/assets/img/Course/GiangVien1.png",
    updated: "07.2024",
  },
  features: [
    "English",
    "English, VietNamese",
    "10h 36m",
    "Giấy chứng nhận khi đến",
    "4 bài kiểm tra thực hành",
    "Bài tập",
    "24 bài viết",
    "20 tài nguyên có thể tải xuống",
  ],
  learnings: [
    "Lập trình hướng đối tượng nâng cao (interface, abstract, generic).",
    "Xử lý đa luồng, networking, và I/O nâng cao.",
    "Làm việc với cơ sở dữ liệu qua JDBC.",
    "Xây dựng giao diện người dùng bằng Swing/JavaFX.",
  ],
  price: "$68,00",
  oldPrice: "$90,00",
  discount: "75% off!",
};

export default function CourseDetailPage({ courseId = "" }) {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(defaultCourse);
  const [error, setError] = useState(null);

  

  return (
    <div className={styles.pageWrapper}>
      {error && (
        <div style={{ color: "red", margin: "8px 0" }}>
          {error}
        </div>
      )}

      {/* Left Column */}
      <div className={styles.leftCol}>
        <div className={styles.levelSection}>
          <span className={styles.levelIntermediate}>Intermediate</span>
          <span className={styles.levelAdvanced}>Advanced</span>
        </div>
        <h1 className={styles.title}>{course.title}</h1>
        <div className={styles.ratingSection}>
          <StarFilled style={{ color: "#FFD700", fontSize: 18 }} />
          <span className={styles.ratingValue}>{course.rating}</span>
          <span className={styles.ratingCount}>({course.reviews})</span>
          <span className={styles.studentCount}>
            {course.students} students
          </span>
        </div>
        <div className={styles.desc}>{course.description}</div>
        <div className={styles.authorSection}>
          <div className={styles.avatarGroup}>
            <img
              src={course.author.logo}
              alt="VKU University"
              className={styles.avatarCircle}
            />
            <img
              src={course.author.avatar}
              alt={course.author.name}
              className={styles.avatarCircle}
            />
          </div>
          <span>
            Created by{" "}
            <b>
              {course.author.name}, {course.author.org}
            </b>
          </span>
          <span className={styles.updated}>
            Last updated {course.author.updated}
          </span>
        </div>
        <div className={styles.tabsSection}>
          <span className={styles.tabActive}>Overview</span>
          <span>Course content</span>
          <span>Instructor</span>
          <span>Reviews</span>
        </div>
        <div className={styles.whatLearnSection}>
          <h2>
            <BookOutlined
              style={{ marginRight: 8, color: "#1976d2", fontSize: 22 }}
            />
            Bạn sẽ học được gì?
          </h2>
          <div className={styles.learnBox}>
            <ul>
              {course.learnings.map((item, i) => (
                <li key={i}>
                  <CheckCircleOutlined
                    style={{ color: "#37bc81", marginRight: 8, fontSize: 18 }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className={styles.rightCol}>
        <div className={styles.card}>
          <img src={course.image} alt="Course" className={styles.courseImg} />
          <div className={styles.priceSection}>
            <span className={styles.currentPrice}>{course.price}</span>
            <span className={styles.oldPrice}>{course.oldPrice}</span>
            <span className={styles.discount}>{course.discount}</span>
          </div>
          <button className={styles.enrollBtn}>Bắt đầu khóa học</button>
          <div className={styles.guaranteeText}>
            Đảm bảo hoàn tiền trong vòng 14 ngày
          </div>
          <div className={styles.cardFeatures}>
            <h4>Khóa học bao gồm:</h4>
            <ul>
              {course.features.map((f, i) => (
                <li key={i}>
                  <CheckCircleOutlined /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
