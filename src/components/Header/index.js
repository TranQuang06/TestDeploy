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
              <Link href="/services" className={styles.navLink}>
                Services
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/specialists" className={styles.navLink}>
                Specialists
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/works" className={styles.navLink}>
                Our works
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/subscriptions" className={styles.navLink}>
                Subscriptions
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/about" className={styles.navLink}>
                About
              </Link>
            </li>
          </ul>
        </nav>

        {/* CTA Button */}
        <Link href="/appointment" className={styles.cta}>
          Make an appointment <RiseOutlined />
        </Link>
      </div>
    </header>
  );
}
export default Header;
