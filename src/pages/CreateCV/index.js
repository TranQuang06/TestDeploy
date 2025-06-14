import styles from "../CreateCV/CreateCV.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ChatButton from "../../components/ChatButton/ChatButton";
import { useState, useEffect } from "react"; // Thêm import useState và useEffect
import { Row, Col, Tabs } from "antd";
import {
  PlusCircleOutlined,
  CheckOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import ResumeTemplatesTab from "../../components/CreatCV/ResumeTemplatesTab";
import CVGallerySection from "../../components/CVGallerySection/CVGallerySection";
import CVTemplateDetailed from "../../components/CVTemplateDetail";
import { getCVDataByTemplate } from "../../data/cvTemplatesData";

const onChange = (key) => {
  console.log(key);
};

// Di chuyển items vào trong component để có thể truyền props

function CreateCV() {
  const [activeCV, setActiveCV] = useState("kinhdoanh");
  const [imageLoading, setImageLoading] = useState(false);
  const [showCVDetail, setShowCVDetail] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0); // Lưu vị trí scroll

  const cvImages = {
    kinhdoanh: "/assets/img/creatCV/ct_cv1.png",
    laptrinh: "/assets/img/creatCV/ct_cv2.png",
    ketoan: "/assets/img/creatCV/ct_cv3.png",
  };

  // State để lưu dữ liệu CV hiện tại
  const [currentCVData, setCurrentCVData] = useState(null);

  // Handler khi nhấn nút "Dùng mẫu"
  const handleUseTemplate = (template) => {
    console.log("Selected template:", template); // Debug log

    // Lưu vị trí scroll hiện tại trước khi chuyển trang
    const currentScrollY = window.scrollY || window.pageYOffset;
    setScrollPosition(currentScrollY);
    console.log("Saved scroll position:", currentScrollY); // Debug log

    // Lấy dữ liệu CV tương ứng với template
    const cvData = getCVDataByTemplate(template.id);
    console.log("CV Data:", cvData); // Debug log

    setSelectedTemplate(template);
    setCurrentCVData(cvData);
    setShowCVDetail(true);

    // Scroll lên đầu trang với animation mượt
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handler quay lại danh sách
  const handleBackToList = () => {
    setShowCVDetail(false);
    setSelectedTemplate(null);
    setCurrentCVData(null);

    // Delay nhỏ để đảm bảo component đã render xong trước khi scroll
    setTimeout(() => {
      console.log("Restoring scroll position:", scrollPosition); // Debug log

      // Scroll về vị trí đã lưu với animation mượt
      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }, 100);
  };

  // useEffect để scroll lên đầu khi showCVDetail thay đổi
  useEffect(() => {
    if (showCVDetail) {
      // Delay nhỏ để đảm bảo component đã render xong
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [showCVDetail]);

  // useEffect để reset scroll position khi component mount
  useEffect(() => {
    // Reset scroll position về 0 khi component được load lần đầu
    setScrollPosition(0);
  }, []);

  // Items cho Tabs với props
  const items = [
    {
      key: "1",
      label: "Mẫu sơ yếu lý lịch",
      children: <ResumeTemplatesTab onUseTemplate={handleUseTemplate} />,
    },
    {
      key: "2",
      label: "Mẫu thư xin việc",
      children: "Content of Tab Pane 2",
    },
  ];

  // Hàm xử lý chuyển đổi ảnh với animation
  const handleCVChange = (cvType) => {
    if (cvType === activeCV) return;

    setImageLoading(true);

    // Delay để tạo hiệu ứng fade out trước
    setTimeout(() => {
      setActiveCV(cvType);
      // Delay nhỏ để fade in
      setTimeout(() => {
        setImageLoading(false);
      }, 50);
    }, 150);
  }; // Hàm xử lý scroll cho swiper với animation smooth
  const handleSwiperScroll = (direction) => {
    const swiperWrapper = document.querySelector(`.${styles.swiperWrapper}`);
    if (!swiperWrapper) return;

    // Ngăn chặn spam click bằng cách kiểm tra animation đang chạy
    if (swiperWrapper.isAnimating) return;

    const currentScroll = swiperWrapper.scrollLeft;
    const scrollAmount = 320;
    const maxScroll = swiperWrapper.scrollWidth - swiperWrapper.clientWidth;

    let targetScroll;
    if (direction === "prev") {
      targetScroll = Math.max(0, currentScroll - scrollAmount);
    } else {
      targetScroll = Math.min(maxScroll, currentScroll + scrollAmount);
    }

    // Nếu đã ở đầu/cuối thì không làm gì
    if (targetScroll === currentScroll) return;

    // Đánh dấu đang animation
    swiperWrapper.isAnimating = true;

    const startTime = performance.now();
    const duration = 300; // Giảm duration để phản hồi nhanh hơn

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function mượt hơn
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      swiperWrapper.scrollLeft =
        currentScroll + (targetScroll - currentScroll) * easedProgress;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // Animation hoàn thành
        swiperWrapper.scrollLeft = targetScroll;
        swiperWrapper.isAnimating = false;
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Nếu đang hiển thị CV detail, render CVTemplateDetailed
  if (showCVDetail && currentCVData) {
    return (
      <>
        <Header />
        <CVTemplateDetailed
          data={currentCVData}
          onBackList={handleBackToList}
        />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      {/* START OF SECTION ONE */}
      <div className={styles.sectionOne}>
        <Row className="container">
          <Col>
            <div className={styles.headerTitle}>Mẫu CV dành cho bạn bạn</div>
          </Col>
        </Row>
        <Row className="container">
          <Col className={styles.leftSide} span={14}>
            <div className={styles.leftSideContent}>
              <div className={styles.title}>Mẫu thư xin việc</div>
              <div className={styles.letterContent} contentEditable="true">
                <div>Java company</div>
                <div>More info...</div>
                <h3>Thư xin việc</h3>
                <div>
                  Kính gửi Phòng Tuyển dụng, Tôi viết thư này để bày tỏ sự quan
                  tâm đến các cơ hội việc làm tại quý công ty. Với kinh nghiệm
                  trong lập trình khả năng lập trình java, tôi tự tin có thể
                  đóng góp vào sự phát triển của quý vị. Tôi mong muốn được thảo
                  luận thêm về cách kinh nghiệm của mình phù hợp với nhu cầu của
                  công ty trong buổi phỏng vấn. <br></br>
                  Trân trọng,<br></br>
                  Nguyễn Ngọc Vũ
                </div>
              </div>
              <div className={styles.btnAdd}>
                <button>
                  <PlusCircleOutlined />
                  <span className={styles.btnText}>Thêm chữ ký</span>
                </button>
              </div>
            </div>
          </Col>
          <Col className={styles.rightSide} span={10}>
            <div className={styles.rightTitle}>
              CÔNG CỤ TẠO THƯ XIN VIỆC TRỰC TUYẾN MIỄN PHÍ
            </div>
            <div className={styles.rightHeader}>
              Khai thác tối đa nền tảng độc đáo của bạn.
            </div>
            <div className={styles.rightDescription}>
              Khi bạn xây dựng thư xin việc với RevampCV, hãy khuếch đại thêm hồ
              sơ ứng tuyển của bạn với các mẫu dễ đọc, phù hợp với thiết kế sơ
              yếu lý lịch của bạn.
            </div>
            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <div className={`${styles.featureDot} ${styles.featureRed}`}>
                  <CheckOutlined />
                </div>
                <span className={styles.featureText}>Mẫu thư được đọc kỹ</span>
              </li>
              <li className={styles.featureItem}>
                <div className={`${styles.featureDot} ${styles.featureBlue}`}>
                  <CheckOutlined />
                </div>
                <span className={styles.featureText}>
                  Các phần điền vào chỗ trống
                </span>
              </li>
              <li className={styles.featureItem}>
                <div className={`${styles.featureDot} ${styles.featureOrange}`}>
                  <CheckOutlined />
                </div>
                <span className={styles.featureText}>Tùy chỉnh trực quan</span>
              </li>
            </ul>

            <button className={styles.buildButton}>
              <ArrowRightOutlined className={styles.arrowIcon} />
              Tạo sơ yếu lí lịch
            </button>
          </Col>
        </Row>
      </div>
      {/* END OF SECTION ONE  */}
      {/* START OF SECTION TWO */}
      <div className={styles.sectionTwo}>
        <div className={styles.sectionTwoTitle}>
          Tạo CV của bạn trong vài phút
        </div>
        <div className="container">
          <div className={styles.boxList}>
            <div className={styles.boxItemLeft}>
              <div className={styles.boxImg}>
                <img
                  src="/assets/img/creatCV/boxItemImg.svg"
                  alt="Website templates"
                />
              </div>
              <div className={styles.boxContent}>
                <div className={styles.boxTitle}>
                  Mẫu trang web cho mọi ngành công nghiệp
                </div>
                <div className={styles.boxDescription}>
                  Tôi sẽ cho bạn thấy loại ngôn ngữ được sử dụng trong lĩnh vực
                  của bạn.
                </div>
              </div>
            </div>
            <div className={styles.boxItemRight}>
              <div className={styles.boxImg}>
                <img
                  src="/assets/img/creatCV/boxItemImg2.svg"
                  alt="Example title"
                />
              </div>
              <div className={styles.boxContent}>
                <div className={styles.boxTitle}>
                  Ví dụ tiêu đề cho trang web
                </div>
                <div className={styles.boxDescription}>
                  Hãy gửi nó cho chúng tôi và để các chuyên gia của chúng tôi
                  xem xét và hoàn thiện nó! Minh họa bằng các ví dụ thực tế.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* END OF SECTION TWO  */}
      {/* START OF SECTION THREE */}
      <div className={styles.sectionThree}>
        <div className="container">
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
        </div>
      </div>
      {/* Tham khảo cách viết CV  */}
      <div className={styles.reviewWriteCV}>
        <div className="container">
          <Row>
            <Col span={10} className={styles.leftSideContent}>
              <div className={styles.headerContent}>
                <div className={styles.reviewTitle}>Tham khảo cách viết CV</div>
                <div className={styles.reviewDescription}>
                  từ 20+ mẫu CV miễn phí
                </div>
              </div>
              <div className={styles.btnList}>
                <button
                  className={`${styles.btnCV} ${
                    activeCV === "kinhdoanh" ? styles.active : ""
                  }`}
                  onClick={() => handleCVChange("kinhdoanh")}
                >
                  Nhân Viên Kinh Doanh
                </button>
                <button
                  className={`${styles.btnCV} ${
                    activeCV === "laptrinh" ? styles.active : ""
                  }`}
                  onClick={() => handleCVChange("laptrinh")}
                >
                  Lập Trình Viên IT
                </button>
                <button
                  className={`${styles.btnCV} ${
                    activeCV === "ketoan" ? styles.active : ""
                  }`}
                  onClick={() => handleCVChange("ketoan")}
                >
                  Nhân Viên Kế Toán
                </button>
              </div>
              <div className={styles.btnAllCV}>
                <button className={styles.btnAllCVButton}>
                  Xem tất cả mẫu CV
                </button>
              </div>
            </Col>
            <Col span={12} className={styles.rightSideContent}>
              <div className={styles.cvImageContainer}>
                <img
                  src={cvImages[activeCV]}
                  alt={`CV mẫu cho ${activeCV}`}
                  className={`${styles.cvImage} ${
                    imageLoading ? styles.exiting : styles.entering
                  }`}
                  onLoad={() => setImageLoading(false)}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
      {/* End tham khảo cách viết CV */}
      {/* END OF SECTION THREE  */}
      {/* START OF SECTION FOUR - More CV Templates */}
      <div className={styles.sectionFour}>
        <div className="container">
          <div className={styles.sectionFourHeader}>
            <h2 className={styles.sectionFourTitle}>
              Bộ sưu tập CV chuyên nghiệp
            </h2>
            <p className={styles.sectionFourSubtitle}>
              Khám phá hàng trăm mẫu CV được thiết kế riêng cho từng ngành nghề
            </p>
          </div>
          <CVGallerySection onUseTemplate={handleUseTemplate} />
        </div>
      </div>{" "}
      {/* END OF SECTION FOUR */}
      {/* START OF SECTION FIVE - CV Swiper */}
      <div className={styles.sectionFive}>
        <div className="container">
          <section className={styles.menuSection}>
            <div className={styles.menuHeader}>
              <h2 className={styles.title}>Tham khảo cách viết CV</h2>
              <p className={styles.subtitle}>
                từ 50+ Mẫu CV ứng tuyển mới nhất 2025
              </p>
            </div>
            <div className={styles.swiperContainer}>
              <div className={styles.swiperWrapper}>
                <div className={styles.swiperSlide}>
                  <figure className={styles.cvFigure}>
                    <img src="/assets/img/creatCV/cv/cv1.png" alt="Mẫu CV" />
                    <figcaption className={styles.tagItem}>
                      Phát triển phần mềm
                    </figcaption>
                  </figure>
                </div>
                <div className={styles.swiperSlide}>
                  <figure className={styles.cvFigure}>
                    <img src="/assets/img/creatCV/cv/cv10.png" alt="Mẫu CV" />
                    <figcaption className={styles.tagItem}>
                      Lập trình
                    </figcaption>
                  </figure>
                </div>
                <div className={styles.swiperSlide}>
                  <figure className={styles.cvFigure}>
                    <img src="/assets/img/creatCV/cv/cv12.png" alt="Mẫu CV" />
                    <figcaption className={styles.tagItem}>
                      Sáng tạo nội dung
                    </figcaption>
                  </figure>
                </div>
                <div className={styles.swiperSlide}>
                  <figure className={styles.cvFigure}>
                    <img src="/assets/img/creatCV/cv/cv14.png" alt="Mẫu CV" />
                    <figcaption className={styles.tagItem}>
                      Phân tích dữ liệu
                    </figcaption>
                  </figure>
                </div>
                <div className={styles.swiperSlide}>
                  <figure className={styles.cvFigure}>
                    <img src="/assets/img/creatCV/cv/cv16.png" alt="Mẫu CV" />
                    <figcaption className={styles.tagItem}>
                      Kinh doanh
                    </figcaption>
                  </figure>
                </div>
                <div className={styles.swiperSlide}>
                  <figure className={styles.cvFigure}>
                    <img src="/assets/img/creatCV/cv/cv18.png" alt="Mẫu CV" />
                    <figcaption className={styles.tagItem}>
                      Nhiếp ảnh gia
                    </figcaption>
                  </figure>
                </div>
                <div className={styles.swiperSlide}>
                  <figure className={styles.cvFigure}>
                    <img src="/assets/img/creatCV/cv/cv20.png" alt="Mẫu CV" />
                    <figcaption className={styles.tagItem}>
                      Sáng tạo nội dung
                    </figcaption>
                  </figure>
                </div>
                <div className={styles.swiperSlide}>
                  <figure className={styles.cvFigure}>
                    <img src="/assets/img/creatCV/cv/cv21.png" alt="Mẫu CV" />
                    <figcaption className={styles.tagItem}>
                      Cải thiện giao tiếp
                    </figcaption>
                  </figure>
                </div>
                <div className={styles.swiperSlide}>
                  <figure className={styles.cvFigure}>
                    <img src="/assets/img/creatCV/cv/cv7.png" alt="Mẫu CV" />
                    <figcaption className={styles.tagItem}>
                      Thiết kế đồ họa
                    </figcaption>
                  </figure>
                </div>
                <div className={styles.swiperSlide}>
                  <figure className={styles.cvFigure}>
                    <img src="/assets/img/creatCV/cv/cv22.png" alt="Mẫu CV" />
                    <figcaption className={styles.tagItem}>
                      Thiết kế đồ họa
                    </figcaption>
                  </figure>
                </div>{" "}
              </div>
              <div
                className={styles.swiperButtonPrev}
                onClick={() => handleSwiperScroll("prev")}
              ></div>
              <div
                className={styles.swiperButtonNext}
                onClick={() => handleSwiperScroll("next")}
              ></div>
            </div>
          </section>
        </div>
      </div>
      {/* END OF SECTION FIVE */}
      <Footer />
      <ChatButton />
    </>
  );
}
export default CreateCV;
