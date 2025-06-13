import React from 'react';
import styles from '../SearchSection/SearchSection.module.css';

const SearchSection = () => {
    return (
        <section className={styles.searchSection}>
            <div className={styles.searchContainer}>
                <p className={styles.searchSubtitle}>Công việc mơ ước của bạn</p>
                <h2 className={styles.searchTitle}>
                    Khám phá và tìm kiếm<br/>công việc phù hợp ngay tại đây
                </h2>
            </div>
        </section>
    );
};

export default SearchSection;
