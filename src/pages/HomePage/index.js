import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SearchSection from "../../components/SearchSection/SearchSection";
import JobsSection from "../../components/JobsSection/JobsSection";
import FashionSection from "../../components/FashionSection/FashionSection";
import ImpressiveNumbersSection from "../../components/ImpressiveNumbersSection/ImpressiveNumbersSection";
import ThiTruongHomNay from "../../components/ThiTruongHomNay/ThiTruong";
import styles from "../HomePage/HomePages.module.css";
import { FaStar } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import ChatButton from "../../components/ChatButton/ChatButton";

function HomePage() {
  return (
    <>
      <Header />
      {/* Hero */}
      <section className={styles.hero}>
        {/* LEFT */}
        <div className={styles.left}>
          <h1>
            Tìm việc làm phù hợp
            <br />
            dễ dàng và nhanh chóng{" "}
          </h1>
          <p>
            Khám phá hàng nghìn cơ hội việc làm được cập nhật mỗi ngày từ các
            công ty hàng đầu. Tạo CV, ứng tuyển và theo dõi công việc mơ ước của
            bạn ngay hôm nay.
          </p>

          <div className={styles.searchBar}>
            <input type="text" placeholder="Search here" />
            <button>Search</button>
          </div>

          <div className={styles.domains}></div>

          <div className={styles.ratings}>
            <div className={styles.rating}>
              <span>Google.com</span>
            </div>
            <div className={styles.rating}>
              <span>vku.und.vn</span>
            </div>
            <div className={styles.rating}>
              <span>udn.vn</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <div className={styles.imageContainer}>
            <img src="../assets/img/HomePage/img_01.avif" alt="Happy user" />
            <div className={styles.uptimeCard}>
              <div className={styles.upHeader}>
                <span>Mức độ hài lòng</span>
                <FaStar />
              </div>
              <div className={styles.percent}>99.99%</div>
              <div className={styles.barBg}>
                <div className={styles.bar} style={{ width: "90%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* PARTNERS */}
        <div className={styles.partners}>
          <img src="../assets/img/HomePage/logo_01_vku.png" alt="Coinbase" />
          <img src="../assets/img/HomePage/logo_02.png" alt="Spotify" />
          <img src="../assets/img/HomePage/logo_03.png" alt="Slack" />
          <img src="../assets/img/HomePage/logo_01_vku.png" alt="Dropbox" />
          <img src="../assets/img/HomePage/logo_04.png" alt="Webflow" />
          <img src="../assets/img/HomePage/logo_01_vku.png" alt="Zoom" />
        </div>
      </section>
      {/* End hero */}

      {/* Experience with Number */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          {/* Text bên trái */}
          <div className={styles.statsText}>
            <p className={styles.statsSubtitle}>
              Những con số biết nói từ My Work
            </p>
            <h2 className={styles.statsTitle}>Tham gia ngay hôm nay</h2>
          </div>

          {/* 3 cards bên phải */}
          <div className={styles.statsCards}>
            <div className={styles.statsCard}>
              <h3 className={styles.statsNumber}>
                92<span className={styles.statsPercent}>%</span>
              </h3>
              <p className={styles.statsDesc}>
                Người dùng đã tìm được công việc phù hợp với kỹ năng cá nhân
              </p>
            </div>

            <div className={styles.statsCard}>
              <h3 className={styles.statsNumber}>
                90<span className={styles.statsPercent}>%</span>
              </h3>
              <p className={styles.statsDesc}>
                Dữ liệu tuyển dụng được hệ thống lọc thông minh, nhanh chóng
              </p>
            </div>

            <div className={styles.statsCard}>
              <h3 className={styles.statsNumber}>
                89<span className={styles.statsPercent}>%</span>
              </h3>
              <p className={styles.statsDesc}>
                Nhà tuyển dụng uy tín đang tích cực kết nối với người tìm việc
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* End Experience with Number */}

      {/* SearchSection */}
      <SearchSection />
      {/* End SearchSection */}

      {/* JobsSection */}
      <JobsSection />
      {/* End JobsSection */}

      {/* FashionSection */}
      <FashionSection />
      {/* End FashionSection */}

      {/* ImpressiveNumbersSection */}
      <ImpressiveNumbersSection />
      {/* end ImpressiveNumbersSection */}

      {/* ThiTruongHomNay */}
      <ThiTruongHomNay />
      {/* end ThiTruongHomNay */}
      <Footer />
      <ChatButton />
    </>
  );
}
export default HomePage;
