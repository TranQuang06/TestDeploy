import { useEffect, useRef, useState } from "react";
import styles from "./ThiThuong.module.css";
import { Line, Column } from "@ant-design/charts";

export default function ThiTruong() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState("industry");
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayValues, setDisplayValues] = useState({
    jobs24h: 0,
    totalJobs: 0,
    companies: 0,
  });

  // Hiệu ứng Intersection Observer - cải thiện để phát hiện chính xác hơn
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Không disconnect observer ngay lập tức để đảm bảo phát hiện chính xác
          setTimeout(() => observer.disconnect(), 100);
        }
      },
      { threshold: 0.3 } // Tăng threshold để đảm bảo phần tử hiển thị rõ hơn
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer?.disconnect();
  }, []);

  // Hiệu ứng đếm số - cải thiện để đảm bảo chạy khi hiển thị
  useEffect(() => {
    if (!isVisible || hasAnimated) return;

    // Đặt giá trị ban đầu là 0
    setDisplayValues({
      jobs24h: 0,
      totalJobs: 0,
      companies: 0,
    });

    // Giá trị mục tiêu
    const targets = {
      jobs24h: 1029,
      totalJobs: 51051,
      companies: 17169,
    };

    // Thời gian và cấu hình
    const duration = 2000; // Kéo dài thời gian đếm để dễ nhìn thấy
    const startTime = performance.now();

    // Hàm animation
    const animateNumbers = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function để tạo hiệu ứng mượt
      const easeOutQuad = (t) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);

      // Cập nhật giá trị hiển thị
      setDisplayValues({
        jobs24h: Math.floor(targets.jobs24h * easedProgress),
        totalJobs: Math.floor(targets.totalJobs * easedProgress),
        companies: Math.floor(targets.companies * easedProgress),
      });

      // Tiếp tục animation nếu chưa hoàn thành
      if (progress < 1) {
        requestAnimationFrame(animateNumbers);
      } else {
        // Đảm bảo hiển thị giá trị cuối cùng chính xác
        setDisplayValues(targets);
        setHasAnimated(true);
      }
    };

    // Bắt đầu animation
    requestAnimationFrame(animateNumbers);
  }, [isVisible, hasAnimated]);

  // Hiệu ứng hiển thị ngày hiện tại
  useEffect(() => {
    const dateElement = document.getElementById("date");
    if (dateElement) {
      const now = new Date();
      dateElement.textContent = now.toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
    }
  }, []);

  // Dữ liệu cho biểu đồ đường
  const lineChartData = [
    { date: "21/04", value: 56000 },
    { date: "25/04", value: 58500 },
    { date: "29/04", value: 55000 },
    { date: "03/05", value: 58000 },
    { date: "09/05", value: 48000 },
    { date: "14/05", value: 53000 },
  ];

  // Cấu hình cho biểu đồ đường
  const lineConfig = {
    data: lineChartData,
    xField: "date",
    yField: "value",
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 1000,
      },
    },
    color: "#00FF4C",
    lineStyle: {
      lineWidth: 10,
    },
    point: {
      size: 0,
      shape: "circle",
      style: {
        fill: "#00FF4C",
        stroke: "#00FF4C",
        lineWidth: 2,
      },
    },
    area: {
      style: {
        fill: "l(270) 0:#00FF4C 1:rgba(0,255,76,0.1)",
      },
    },
    yAxis: {
      min: 48000,
      max: 60000,
      label: {
        formatter: (v) => `${(v / 1000).toFixed(0)}k`,
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: "Cơ hội việc làm",
          value: datum.value.toLocaleString("vi-VN"),
        };
      },
    },
  };

  // Dữ liệu cho biểu đồ cột
  const chartData = {
    industry: [
      { category: "CNTT", value: 9500 },
      { category: "Marketing", value: 8000 },
      { category: "Kế toán", value: 6300 },
      { category: "Bán hàng", value: 11200 },
      { category: "Nhân sự", value: 4200 },
    ],
    salary: [
      { category: "< 3tr", value: 2000 },
      { category: "3-10tr", value: 9500 },
      { category: "10-20tr", value: 30000 },
      { category: "20-30tr", value: 32000 },
      { category: "> 30tr", value: 3500 },
      { category: "Thỏa thuận", value: 19000 },
    ],
  };

  // Bảng màu cho các loại biểu đồ

  // Cấu hình cho biểu đồ cột
  const columnConfig = {
    data: chartData[selectedChartType],
    xField: "category",
    yField: "value",
    columnWidthRatio: 0.7,
    color: ({ category }) => colorMap[category] || "#00FF4C",
    animation: {
      appear: {
        animation: "wave-in",
        duration: 1000,
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: "Số lượng",
          value: datum.value.toLocaleString("vi-VN") + " vị trí",
        };
      },
    },
  };

  return (
    <div
      ref={sectionRef}
      className={`${styles.section_5} ${isVisible ? styles.visible : ""}`}
    >
      <div className={styles.container}>
        <div className={styles.dashboard}>
          <div className={styles.dashboard_grid}>
            <div className={styles.left_panel}>
              <h1>
                Thị trường việc làm hôm nay <span id="date"></span>
              </h1>
              <div className={styles.robot_img}>
                <img
                  src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/welcome/dashboard/dashboard-item.png"
                  alt="Robot"
                />
              </div>
              <div className={styles.jobs}>
                <ul></ul>
              </div>
            </div>

            <div className={styles.right_panel}>
              <div className={styles.stats}>
                <div className={styles.stat_card}>
                  <h2 className={styles.count_up} data-target="1029">
                    {displayValues.jobs24h.toLocaleString("vi-VN")}
                  </h2>
                  <p>Việc làm mới 24h gần nhất</p>
                </div>
                <div className={styles.stat_card}>
                  <h2 className={styles.count_up} data-target="51051">
                    {displayValues.totalJobs.toLocaleString("vi-VN")}
                  </h2>
                  <p>Việc làm đang tuyển</p>
                </div>
                <div className={styles.stat_card}>
                  <h2 className={styles.count_up} data-target="17169">
                    {displayValues.companies.toLocaleString("vi-VN")}
                  </h2>
                  <p>Công ty đang tuyển</p>
                </div>
              </div>

              <div className={styles.charts}>
                <div className={styles.chart_card}>
                  <h3>
                    <i className="fas fa-chart-line"></i> Tăng trưởng cơ hội
                    việc làm
                  </h3>
                  <Line {...lineConfig} />
                </div>
                <div className={styles.chart_card}>
                  <div className={styles.chart_header}>
                    <h3>
                      <i className="fas fa-chart-bar"></i> Nhu cầu tuyển dụng
                      theo
                    </h3>
                    <select
                      value={selectedChartType}
                      onChange={(e) => setSelectedChartType(e.target.value)}
                      className={styles.chart_select}
                    >
                      <option value="industry">Ngành nghề</option>
                      <option value="salary">Mức lương</option>
                    </select>
                  </div>
                  <Column {...columnConfig} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
