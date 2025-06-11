import React from 'react';
import styles from '../SearchSection/SearchSection.module.css';

const SearchSection = () => {
    return (
        <section className={styles.searchSection}>
            <div className={styles.searchContainer}>
                <p className={styles.searchSubtitle}>Your Dream Job</p>
                <h2 className={styles.searchTitle}>
                    Explore and Find<br/>your Job Here
                </h2>

                <form
                    className={styles.searchForm}
                    onSubmit={e => e.preventDefault()}
                >
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search for a job"
                    />

                    <div className={styles.selectWrapper}>
                        <select
                            className={styles.searchSelect}
                            defaultValue=""
                        >
                            <option value="" disabled>Location</option>
                            <option value="HaNoi">Hà Nội</option>
                            <option value="HCM">TP. HCM</option>
                            <option value="DaNang">Đà Nẵng</option>
                        </select>
                        <span className={styles.selectArrow}>▾</span>
                    </div>

                    <button type="submit" className={styles.searchBtn}>
                        Search
                    </button>
                </form>
            </div>
        </section>
    );
};

export default SearchSection;
