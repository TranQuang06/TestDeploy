import styles from "../Footer/Footer.module.css";
import {
  SpotifyFilled,
  YoutubeFilled,
  FacebookFilled,
  LinkedinFilled,
  TwitterSquareFilled,
} from "@ant-design/icons";
import Link from "next/link";

function Footer() {
  return (
    <div className={styles.footerWrapper}>
      {/* Phần podcast nổi trên footer*/}
      <div className={styles.podcastBox}>
        <div className={styles.podcastText}>
          <h2>SuperStars </h2>
          <p>
            {" "}
            Chào mừng bạn đến với SuperStars – nơi kết nối những tài năng đặc
            biệt và các cơ hội việc làm ý nghĩa. Chúng tôi tin rằng mỗi cá nhân
            đều có những giá trị riêng để đóng góp. Hãy cùng khám phá những công
            việc phù hợp và xây dựng một tương lai vững chắc.
          </p>
          {/* Phần nền tảng nghe podcast*/}
          {/* <div className={styles.listenOn}>
            <span>Nghe trên:</span>
            <br></br><i className="Spotify"> <SpotifyFilled /></i>
            <i className="Youtube"> <YoutubeFilled /></i>
            <i className="Facebook"> <FacebookFilled /></i>
          </div> */}
        </div>
        {/* Nút View All Episodes */}
        <div className={styles.podcastButton}>
          <button>View All Episodes </button>
        </div>
      </div>
      {/* Phần footer chính*/}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          {/* Cột 1*/}
          <div className={styles.column}>
            <h3>LIÊN KẾT NHANH</h3>
            <ul>
              <li>
                <Link href="/homepage"> Trang chủ</Link>
              </li>
              <li>
                <Link href="/about"> Về chúng tôi</Link>
              </li>
              <li>
                <Link href="/episodes"> Cơ hội việc làm</Link>
              </li>
              <li>
                <Link href="/"> Landing</Link>
              </li>
              <li>
                <Link href="/blog"> Blog</Link>
              </li>
              <li>
                <Link href="/contact"> Liên hệ</Link>
              </li>
            </ul>
          </div>

          {/* Cột 2 */}
          <div className={styles.column}>
            <h3>LIÊN HỆ & PHÁP LÝ</h3>
            <ul>
              <li>
                <Link href="/divi">SuperStars123@gmail.com</Link>
              </li>
              <li>
                <Link href="/privacy">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link href="/terms">Điều khoản và điều kiện</Link>
              </li>
              <li>
                <Link href="/contact">Chính sách hỗ trợ người khuyết tật</Link>
              </li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div className={styles.column}>
            <h3>THAM GIA CỘNG ĐỒNG CỦA CHÚNG TÔI - HÃY KẾT NỐI!</h3>
            <div className={styles.socials}>
              <Link href="/face">
                <FacebookFilled />
              </Link>
              <Link href="/linked">
                {" "}
                <LinkedinFilled />
              </Link>
              <Link href="/twitter">
                <TwitterSquareFilled />
              </Link>
            </div>
          </div>
        </div>

        {/* Đăng kí email */}
        <div className={styles.subscribeSection}>
          <h2> Không bỏ lỡ cơ hội - Tham gia cộng đồng của chúng tôi!</h2>
          <div className={styles.subscribeForm}>
            <input type="email" placeholder="Email" />
            <button> Đăng kí free</button>
          </div>
        </div>

        {/* Bản quyền  */}
        <div className={styles.copyRight}>
          <em>
            {" "}
            Copyright @ 2025 | <Link href="/">Chính sách bảo mật </Link>{" "}
          </em>
        </div>
      </footer>
    </div>
  );
}
export default Footer;
