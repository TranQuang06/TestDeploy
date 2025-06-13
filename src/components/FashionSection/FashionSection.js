import styles from "./FashionSection.module.css";

export default function FashionSection() {
  return (
    <section className={styles.section}>
      {/* Left side */}
      <div className={styles.left}>
        <h2 className={styles.title}>
          Dành cho những người tiên phong đô thị
        </h2>
        <p className={styles.subtitle}>
          Khám phá cơ hội nghề nghiệp phù hợp với bạn – bền vững, nhân văn, và đầy cảm hứng.
        </p>
        <button className={styles.ctaBtn}>Tham gia ngay</button>
      </div>

      {/* Right side */}
      <div className={styles.collage}>
        {/* 1. Small text card */}
        <div className={styles.smallCard}>
          <h4>Tìm kiếm việc làm</h4>
          <p>Lấy cảm hứng từ những hành trình vượt khó và nỗ lực không ngừng.</p>
          <span className={styles.smallCardArrow}>→</span>
        </div>

        {/* 2. Top-right image */}
        <img
          src="../../assets/img/HomePage/bg_03.avif"
          alt="Cap"
          className={styles.smallImage}
        />

        {/* 3. Bottom-left image */}
        <img
          src="../../assets/img/HomePage/bg_02.avif"
          alt="Urban portrait"
          className={styles.largeImage}
        />

        {/* 4. Big overlay card */}
        <div className={styles.overlayCard}>
          <h3>Hành trình My Work</h3>
          <p>
           Chúng tôi tạo ra nền tảng cho những "người khám phá đô thị" – những người khuyết tật đang tìm kiếm công việc phù hợp, nơi họ có thể phát triển, đóng góp và tỏa sáng. Từ công việc từ xa, bán thời gian đến vị trí toàn thời gian linh hoạt – My Work luôn đồng hành cùng bạn trên hành trình nghề nghiệp.
          </p>
        </div>
      </div>
    </section>
  );
}
