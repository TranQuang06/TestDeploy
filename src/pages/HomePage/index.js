import React, { memo, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ChatButton from "../../components/ChatButton/ChatButton";
import Loading from "../../components/ui/Loading";
import { withIntersectionObserver } from "../../lib/hoc";
import styles from "../HomePage/HomePages.module.css";
import { FaStar } from "react-icons/fa";

// Lazy load heavy components
const SearchSection = dynamic(
  () => import("../../components/SearchSection/SearchSection"),
  {
    loading: () => <Loading.Card height="300px" />,
    ssr: false,
  }
);

const JobsSection = dynamic(
  () => import("../../components/JobsSection/JobsSection"),
  {
    loading: () => <Loading.Card height="400px" />,
    ssr: false,
  }
);

const FashionSection = dynamic(
  () => import("../../components/FashionSection/FashionSection"),
  {
    loading: () => <Loading.Card height="300px" />,
    ssr: false,
  }
);

const ImpressiveNumbersSection = dynamic(
  () =>
    import(
      "../../components/ImpressiveNumbersSection/ImpressiveNumbersSection"
    ),
  {
    loading: () => <Loading.Card height="200px" />,
    ssr: false,
  }
);

const ThiTruongHomNay = dynamic(
  () => import("../../components/ThiTruongHomNay/ThiTruong"),
  {
    loading: () => <Loading.Card height="300px" />,
    ssr: false,
  }
);

// Optimize with intersection observer for below-fold content
const LazySearchSection = withIntersectionObserver(SearchSection);
const LazyJobsSection = withIntersectionObserver(JobsSection);
const LazyFashionSection = withIntersectionObserver(FashionSection);
const LazyImpressiveNumbersSection = withIntersectionObserver(
  ImpressiveNumbersSection
);
const LazyThiTruongHomNay = withIntersectionObserver(ThiTruongHomNay);

const HomePage = memo(() => {
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
            <Image
              src="/assets/img/HomePage/img_01.avif"
              alt="Happy user"
              width={500}
              height={400}
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
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
          <Image
            src="/assets/img/HomePage/logo_01_vku.png"
            alt="VKU"
            width={120}
            height={40}
          />
          <Image
            src="/assets/img/HomePage/logo_02.png"
            alt="Partner 2"
            width={120}
            height={40}
          />
          <Image
            src="/assets/img/HomePage/logo_03.png"
            alt="Partner 3"
            width={120}
            height={40}
          />
          <Image
            src="/assets/img/HomePage/logo_01_vku.png"
            alt="VKU"
            width={120}
            height={40}
          />
          <Image
            src="/assets/img/HomePage/logo_04.png"
            alt="Partner 4"
            width={120}
            height={40}
          />
          <Image
            src="/assets/img/HomePage/logo_01_vku.png"
            alt="VKU"
            width={120}
            height={40}
          />
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

      {/* Lazy loaded sections */}
      <LazySearchSection />
      <LazyJobsSection />
      <LazyFashionSection />
      <LazyImpressiveNumbersSection />
      <LazyThiTruongHomNay />

      <Footer />
      <ChatButton />
    </>
  );
});

HomePage.displayName = "HomePage";

export default HomePage;
