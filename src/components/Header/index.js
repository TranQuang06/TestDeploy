import React, { useState, useEffect } from "react";
import { RiseOutlined } from "@ant-design/icons";
import Link from "next/link";
import styles from "../Header/Header.module.css";

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}
    >
      <div className={styles.headerContainer}>
        {/* Logo */}
        <div className={styles.logo}>
          {/* Không lồng <a> bên trong Link, gán className/href trực tiếp */}
          <Link href="/" className={styles.logoLink}>
            <img
              src="/assets/img/logo.png"
              alt="logo"
              className={styles.logoImg}
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav>
          <ul className={styles.navigationList}>
            <li className={styles.navItem}>
              <Link href="/FindJob" className={styles.navLink}>
                Việc làm
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/CreateCV" className={styles.navLink}>
                Tạo CV
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/works" className={styles.navLink}>
                Công cụ
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/Blog" className={styles.navLink}>
                Về chúng tôi
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/about" className={styles.navLink}>
                Social
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/JobsMapPage" className={styles.navLink}>
                Bản đồ My Work
              </Link>
            </li>
          </ul>
        </nav>

        {/* CTA Button */}
        <Link href="/SignIn" className={styles.cta}>
          Tham gia vào cộng đồng ngay <RiseOutlined />
        </Link>
      </div>
    </header>
  );
}
export default Header;
