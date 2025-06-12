import React, { useEffect, useState } from "react";
import styles from "./CourseDetailPage.module.css";
import {
  CheckCircleOutlined,
  StarFilled,
  BookOutlined,
} from "@ant-design/icons";

// Dữ liệu cứng fallback
const defaultCourse = {
  title: "Advanced Diploma Course in Generalist Human Resource Management",
  image: "/course-demo-img.png",
  rating: 4.5,
  reviews: 2220,
  students: 21450,
  description:
    "Learn the Role and Responsibilities at Individual, Group, and Organization Levels, Employee Life Cycle, Policy & Process. Master the intricacies of creating and implementing HR policies, process management and strategic planning.",
  author: {
    name: "Amanda Kim",
    org: "HR University",
    logo: "/assets/img/logo_hr_university.png",
    avatar: "/assets/img/avatar_amanda_kim.jpg",
    updated: "07.2024",
  },
  features: [
    "English",
    "English, Spanish, Russian, French, German",
    "10h 36m",
    "Certificate upon comition",
    "4 practice tests",
    "Assignments",
    "24 articles",
    "20 downloadable resources",
  ],
  learnings: [
    "Key factors in the development of HR and People Management as a Generalist HR.",
    "Generalist Human Resource Management, the Scope of HRM, Processes in HRM, and the Role of HRM in this framework.",
    "Skills required for Generalist HR Professionals with case studies, assignments, and coursework.",
    "Skills required for Generalist HR Professionals with case studies, assignments, and coursework.",
  ],
  price: "$68,00",
  oldPrice: "$90,00",
  discount: "75% off!",
};

export default function CourseDetailPage({ courseId = "" }) {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(defaultCourse);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
  
    fetch('https://dummyjson.com/products/category/laptops')
      .then(res => res.json())
      .then(data => {
        if (!data.products || !Array.isArray(data.products) || !data.products.length) {
          setError("No course data from API. Showing sample data.");
          setCourse(defaultCourse);
          return;
        }
        const item = data.products[0];
        setCourse({
          title: item.title || defaultCourse.title,
          image: item.thumbnail || defaultCourse.image,
          rating: item.rating || 4.5,
          reviews: item.stock || 1000,
          students: 5000,
          description: item.description || defaultCourse.description,
          author: defaultCourse.author,
          features: defaultCourse.features,
          learnings: defaultCourse.learnings,
          price: `$${item.price}` || defaultCourse.price,
          oldPrice: "$90,00",
          discount: `${item.discountPercentage || 75}% off!`,
        });
      })
      .catch(err => {
        setError("Failed to fetch course data. Showing sample data.");
        setCourse(defaultCourse);
      })
      .finally(() => setLoading(false));
  }, []);

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
              alt="HR University"
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
            What you'll learn
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
          <button className={styles.enrollBtn}>Start course</button>
          <div className={styles.guaranteeText}>
            14 day money back guarantee
          </div>
          <div className={styles.cardFeatures}>
            <h4>This course includes:</h4>
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
