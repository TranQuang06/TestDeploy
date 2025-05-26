import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "../HomePage/HomePages.module.css";
import { FaStar } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';

function HomePage() {
  return (
    <>
      <Header />
      <section className={styles.hero}>
        {/* LEFT */}
        <div className={styles.left}>
          <h1>
            Cloud Hosting Built for<br/>
            Speed, Scale & Simplicity.
          </h1>
          <p>
            Deploy websites and apps on blazing-fast infrastructure — 
            with global servers, built-in security, and developer-friendly tools.
          </p>

          <div className={styles.searchBar}>
            <input type="text" placeholder="Search here" />
            <button>Search</button>
          </div>

          <div className={styles.domains}>
            
          </div>

          <div className={styles.ratings}>
            <div className={styles.rating}>
              <span>Google</span>
              
            </div>
            <div className={styles.rating}>
              <span>Trustpilot</span>
              
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <div className={styles.imageContainer}>
            <img src="https://images.unsplash.com/photo-1747106649672-c17636e6c6a6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Happy user" />
            <div className={styles.uptimeCard}>
              <div className={styles.upHeader}>
                <span>Uptime Guarantee</span>
                <FiArrowUpRight />
              </div>
              <div className={styles.percent}>99.99%</div>
              <div className={styles.barBg}>
                <div className={styles.bar} style={{ width: '90%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* PARTNERS */}
        <div className={styles.partners}>
          <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_White.png" alt="Coinbase" />
          <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_White.png" alt="Spotify" />
          <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_White.png" alt="Slack" />
          <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_White.png" alt="Dropbox" />
          <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_White.png" alt="Webflow" />
          <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_White.png" alt="Zoom" />
        </div>
      </section>
      <Footer />
    </>  
  );
}
export default HomePage;