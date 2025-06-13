import React, { useEffect, useRef, useState } from "react";
import styles from "./ImpressiveNumbersSection.module.css";

const data = {
  title: "Con số ấn tượng",
  subtitles: [
    `My Work là nền tảng công nghệ nhân sự (HR Tech) tiên phong tại Việt Nam, đặt mục tiêu mở ra cơ hội việc làm bình đẳng cho người khuyết tật. Với năng lực lõi về công nghệ và trí tuệ nhân tạo (AI), Superstars sứ mệnh tái định hình thị trường tuyển dụng — giúp kết nối nhanh chóng, hiệu quả giữa Nhà tuyển dụng và ứng viên khuyết tật. Bằng các công cụ tạo CV thông minh, phát triển kỹ năng cá nhân và xây dựng hồ sơ chuyên nghiệp, chúng tôi cam kết trao cho mỗi người lao động khuyết tật cơ hội việc làm phù hợp, nâng cao giá trị bản thân và tự tin khẳng định chỗ đứng trên thị trường lao động.`,
    `My Work – với hơn 9 triệu người dùng và hơn 200.000 doanh nghiệp hàng đầu tin tưởng – khao khát kiến tạo một cầu nối bền vững giữa ứng viên khuyết tật và nhà tuyển dụng: đúng người, đúng thời điểm, đúng cơ hội. Thông qua các giải pháp công nghệ tiên tiến, chúng tôi tiếp thêm lợi thế cho cả ứng viên và doanh nghiệp, hướng đến sự đồng hành lâu dài của người lao động khuyết tật và sự phát triển bền vững của tổ chức.`,
  ],
  numbers: [
    {
      value: "540.000+",
      title: "Nhà tuyển dụng uy tín",
      desc: "Các nhà tuyển dụng đến từ tất cả các ngành nghề và được xác thực bởi SuperStars",
      theme: "green",
    },
    {
      value: "200.000+",
      title: "Doanh nghiệp hàng đầu",
      desc: "SuperStars được nhiều doanh nghiệp hàng đầu tin tưởng và đồng hành, trong đó có các thương hiệu nổi bật như Samsung, Viettel, Vingroup, FPT, Techcombank,...",
      theme: "blue",
    },
    {
      value: "2.000.000+",
      title: "Việc làm đã được kết nối",
      desc: "SuperStars đồng hành và kết nối hàng ngàn ứng viên với những cơ hội việc làm hấp dẫn từ các doanh nghiệp uy tín.",
      theme: "green",
    },
    {
      value: "1.200.000+",
      title: "Lượt tải ứng dụng",
      desc: "Hàng triệu ứng viên sử dụng ứng dụng SuperStars để tìm kiếm việc làm, trong đó có 80% là ứng viên có kinh nghiệm từ 3 năm trở lên.",
      theme: "blue",
    },
  ],
  logoSrc: "/assets/img/huyhieu_ss.png", // chỉnh lại đường dẫn nếu cần
  logoAlt: "SuperStars Logo",
};

export default function ImpressiveNumbersSection() {
  // Thêm animate-section khi scroll vào vùng này (tùy chọn)
  const sectionRef = useRef(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`${styles["section-15"]} ${
        animate ? styles["animate-section"] : ""
      }`}
    >
      <div className={styles.container}>
        <h2 className={styles.title}>{data.title}</h2>
        {data.subtitles.map((text, idx) => (
          <div key={idx} className={styles["sub-title"]}>
            {text}
          </div>
        ))}

        <div className={styles["number-impress"]}>
          {data.numbers.map((item, idx) => (
            <div
              key={idx}
              className={`${styles["number-item"]} ${
                styles[`${item.theme}-gradient`]
              }`}
            >
              <div className={styles.number}>{item.value}</div>
              <div className={styles["number-title"]}>{item.title}</div>
              <div className={styles["number-desc"]}>{item.desc}</div>
            </div>
          ))}

          <div className={styles["center-logo"]}>
            <img
              src={data.logoSrc}
              alt={data.logoAlt}
              className={styles["center-logo-img"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
