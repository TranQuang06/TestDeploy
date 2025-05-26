import {RiseOutlined} from '@ant-design/icons';
import Link from "next/link";
import styles from "../Header/Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Logo */}
        <div className={styles.logo}>
          <img src="/asset/img/logo.png" alt="logo"/>
        </div>
        <nav>
          <ul className={styles.navigationList}>
            <li className={styles.navItem}>
              <Link href="#" className={styles.navLink}>Services</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="#" className={styles.navLink}>Specialists</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="#" className={styles.navLink}>Our works</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="#" className={styles.navLink}>Subscriptions</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="#" className={styles.navLink}>About</Link>
            </li>
          </ul>
        </nav>
        <Link href="/appointment" className={styles.cta}>
            Make an appointment <RiseOutlined />
        </Link>
      </div>
    </header>
  );
}
export default Header;