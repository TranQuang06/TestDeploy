import styles from "../Footer/Footer.module.css"; 
import { SpotifyFilled , YoutubeFilled , FacebookFilled, LinkedinFilled, TwitterSquareFilled} from '@ant-design/icons';
import Link from 'next/link'; 



function Footer() {
  return (
    <div className={styles.footerWrapper}>
        {/* Phần podcast nổi trên footer*/}
        <div className={styles.podcastBox}>
        <div className={styles.podcastText}>
          <h2>The Nivi Nation </h2>
          <p> Elit at pharetra morbi dui posuere tortor aliquam elit elementum.
            Neque sit ipsum orci viverra etiam. Sit viverra posuere neque
            facilisis tellus phasellus donec sit.
          </p>
          {/* Phần nền tảng nghe podcast*/}
          <div className={styles.listenOn}>
            <span>Listen On:</span>
            <br></br><i className="Spotify"> <SpotifyFilled /></i>
            <i className="Youtube"> <YoutubeFilled /></i>
            <i className="Facebook"> <FacebookFilled /></i>
          </div>

        </div>
        {/* Nút View All Episodes */}
        <div className={styles.podcastButton}>
          <button> Nút View All Episodes </button>
        </div>
        </div>
        {/* Phần footer chính*/}
        <footer className={styles.footer}>
         
          <div className={styles.footerTop}>
            {/* Cột 1*/}
            <div className={styles.column}>
              <h3>Quick Links</h3>
              <ul>
                <li><Link href="/" > Landing</Link></li>
                <li><Link href="/homepage"> Homepage</Link></li>
                <li><Link href="/about"> About</Link></li>
                <li><Link href="/episodes"> Episodes</Link></li>
                <li><Link href="/blog"> Blog</Link></li>
                <li><Link href="/contact"> Contact</Link></li>
              </ul>
            </div>

            {/* Cột 2 */}
            <div className={styles.column}>
              <h3>Contact and Legal</h3>
              <ul>
                <li><Link href="/divi">Divipodcast@support.com</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms and Conditons</Link></li>
              </ul>
            </div>
            
            {/* Cột 3 */}
            <div className={styles.column}>
              <h3>Join the Conversation - Let's Connect!</h3>
              <div className={styles.socials}>
                <Link href="/face"><FacebookFilled /></Link>
                <Link href="/linked"> <LinkedinFilled /></Link>
                <Link href="/twitter"><TwitterSquareFilled /></Link>
              </div>
            </div>
          </div>

          {/* Đăng kí email */}
          <div className={styles.subscribeSection}>
            <h2> Never Miss an Episode - Join our Community!</h2>
            <div className={styles.subscribeForm}>
              <input type="email" placeholder="Email"/>
              <button> SUBSCRIBE FOR FREE</button>
            </div>
          </div>

          {/* Bản quyền  */}
          <div className={styles.copyRight}>
            <em> Copyright @ 2025 | <Link href="/">Privacy Policy</Link> </em>
          </div>
          
        </footer>
    </div>
  );
}
export default Footer;