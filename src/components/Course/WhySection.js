import React from 'react';
import styles from './WhySection.module.css';
import { ToolOutlined, KeyOutlined, BookOutlined, ShareAltOutlined, ArrowRightOutlined } from '@ant-design/icons';

export default function WhySection() {
  return (
    <section className={styles.whySection}>
      <div className={styles.container}>
        {/* Left Card */}
        <div className={styles.leftCard}>
          <h2>Điều gì làm chúng tôi khác biệt?</h2>
          <p>
          Chúng tôi tạo ra một môi trường học tập nơi mọi rào cản được gỡ bỏ, và tiềm năng của bạn được khai phóng. Chúng tôi biến lý thuyết thành hành động, với sự hỗ trợ tối đa cho từng cá nhân.
          </p>
          <a href="#learn-more" className={styles.learnMore}>
            Xem thêm  <ArrowRightOutlined className={styles.learnMoreArrow} />
          </a>
        </div>

        {/* Features List (2 columns x 2 rows) */}
        <div className={styles.featuresList}>
          <div className={styles.featureItem}>
            <div className={styles.iconWrap}><ToolOutlined /></div>
            <div>
              <h3>Công cụ chuyên biệt & dễ tiếp cận</h3>
              <p>Các khóa học được thiết kế có ý thức về tính toàn diện, sử dụng ngôn ngữ và định dạng thân thiện, dễ dàng tiếp cận với các công nghệ hỗ trợ.</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.iconWrap}><KeyOutlined /></div>
            <div>
              <h3>Ví dụ thực tế & ứng dụng cao</h3>
              <p>Minh họa rõ ràng bằng các tình huống thực tế, giúp bạn dễ dàng áp dụng kiến thức vào công việc hàng ngày.</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.iconWrap}><BookOutlined /></div>
            <div>
              <h3>Kiến thức thực tiễn & hữu dụng</h3>
              <p>Tập trung vào các kỹ năng có thể mang lại lợi ích ngay lập tức trong môi trường làm việc chuyên nghiệp.</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.iconWrap}><ShareAltOutlined /></div>
            <div>
              <h3>Trao đổi kinh nghiệm & cộng đồng hỗ trợ</h3>
              <p>Tham gia vào một cộng đồng học tập đa dạng, nơi bạn có thể chia sẻ, học hỏi từ các chuyên gia và đồng nghiệp.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
