import styles from "./NewsSection.module.css";

export default function NewsSection() {
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>NEWS 24</h1>

      <div className={styles.grid}>
        {/* ô lớn bên trái */}
        <div className={styles.mainCard}>
          <span className={`${styles.tag} ${styles.economy}`}>Economy</span>
          <div className={styles.overlay}>
            <h3 className={styles.cardTitle}>
              Exploring the Intricacies of Markets, Money and Global Economies
            </h3>
          </div>
        </div>

        {/* ô nhỏ bên trên phải */}
        <div className={styles.sideCard}>
          <span className={`${styles.tag} ${styles.style}`}>Style</span>
          <div className={styles.overlay}>
            <h4 className={styles.cardTitle}>
              A Journey Through Colors, Textures, and Trends
            </h4>
          </div>
        </div>

        {/* ô nhỏ bên dưới phải */}
        <div className={styles.sideCard}>
          <span className={`${styles.tag} ${styles.art}`}>Art</span>
          <div className={styles.overlay}>
            <h4 className={styles.cardTitle}>
              Inspiring Creativity and Fostering Artistic Expression
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
}
