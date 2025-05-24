import Link from "next/link";
import styles from "../Header/Header.module.css"; // ✅ Import styles đúng cách

function Header() {
  return (
    <header className="bg-blue-500 text-white p-4">
      <h1 className={styles.headerTitle}>My Application SuperStars 123</h1>
      <nav>
        <ul className={styles.navigationList}>
          <li className={styles.navItem}>
            <Link href="/" className={styles.navLink}>Home</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/about" className={styles.navLink}>About</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
export default Header;