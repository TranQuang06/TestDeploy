import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { runSocialMediaMigration } from "../../utils/migrationRunner";
import { getUsersStatistics } from "../../utils/userMigration";
import styles from "./MigrationPanel.module.css";
import {
  AiOutlinePlayCircle,
  AiOutlineLoading3Quarters,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineBarChart,
  AiOutlineDatabase,
} from "react-icons/ai";

const MigrationPanel = () => {
  const { user, userProfile } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Check if user is admin
  const isAdmin =
    userProfile?.role === "admin" || user?.email === "admin@example.com";

  const handleRunMigration = async () => {
    if (!isAdmin) {
      alert("Chỉ admin mới có thể chạy migration!");
      return;
    }

    setIsRunning(true);
    setError(null);
    setMigrationResult(null);

    try {
      const result = await runSocialMediaMigration();
      setMigrationResult(result);
    } catch (err) {
      setError(err.message);
      console.error("Migration error:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleLoadStats = async () => {
    setLoadingStats(true);
    try {
      const currentStats = await getUsersStatistics();
      setStats(currentStats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingStats(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className={styles.noAccess}>
        <AiOutlineCloseCircle className={styles.noAccessIcon} />
        <h3>Không có quyền truy cập</h3>
        <p>Chỉ admin mới có thể sử dụng panel này.</p>
      </div>
    );
  }

  return (
    <div className={styles.migrationPanel}>
      <div className={styles.header}>
        <h2>
          <AiOutlineDatabase className={styles.headerIcon} />
          Migration Panel
        </h2>
        <p>Quản lý và chạy migration cho hệ thống social media</p>
      </div>

      {/* Current Statistics */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>
            <AiOutlineBarChart className={styles.sectionIcon} />
            Thống kê hiện tại
          </h3>
          <button
            className={styles.loadStatsBtn}
            onClick={handleLoadStats}
            disabled={loadingStats}
          >
            {loadingStats ? (
              <AiOutlineLoading3Quarters className={styles.spinIcon} />
            ) : (
              "Tải thống kê"
            )}
          </button>
        </div>

        {stats && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.totalUsers}</div>
              <div className={styles.statLabel}>Tổng Users</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.activeUsers}</div>
              <div className={styles.statLabel}>Users Hoạt động</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.verifiedUsers}</div>
              <div className={styles.statLabel}>Users Verified</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {stats.profileCompletionRate}%
              </div>
              <div className={styles.statLabel}>Profile Hoàn thành</div>
            </div>
          </div>
        )}
      </div>

      {/* Migration Controls */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>
            <AiOutlinePlayCircle className={styles.sectionIcon} />
            Chạy Migration
          </h3>
        </div>

        <div className={styles.migrationInfo}>
          <h4>Migration sẽ thực hiện:</h4>
          <ul>
            <li>✅ Cập nhật cấu trúc users collection</li>
            <li>
              ✅ Tạo collections cho social media (posts, likes, comments,
              follows)
            </li>
            <li>✅ Tạo dữ liệu mẫu</li>
            <li>✅ Thiết lập indexes cần thiết</li>
          </ul>
        </div>

        <button
          className={styles.runMigrationBtn}
          onClick={handleRunMigration}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <AiOutlineLoading3Quarters className={styles.spinIcon} />
              Đang chạy migration...
            </>
          ) : (
            <>
              <AiOutlinePlayCircle />
              Chạy Migration
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {migrationResult && (
        <div className={styles.section}>
          <div className={styles.resultSuccess}>
            <AiOutlineCheckCircle className={styles.successIcon} />
            <h3>Migration thành công!</h3>

            <div className={styles.resultDetails}>
              <h4>Kết quả:</h4>
              <p>
                • Users đã migrate:{" "}
                {migrationResult.migrationResult?.migratedCount || 0}
              </p>
              <p>
                • Errors: {migrationResult.migrationResult?.errorCount || 0}
              </p>
              <p>
                • Tổng đã xử lý:{" "}
                {migrationResult.migrationResult?.totalProcessed || 0}
              </p>
            </div>

            {migrationResult.beforeStats && migrationResult.afterStats && (
              <div className={styles.compareStats}>
                <h4>So sánh trước/sau:</h4>
                <div className={styles.compareGrid}>
                  <div>
                    <strong>Trước:</strong>
                    <p>Total: {migrationResult.beforeStats.totalUsers}</p>
                    <p>
                      Complete:{" "}
                      {migrationResult.beforeStats.profileCompletionRate}%
                    </p>
                  </div>
                  <div>
                    <strong>Sau:</strong>
                    <p>Total: {migrationResult.afterStats.totalUsers}</p>
                    <p>
                      Complete:{" "}
                      {migrationResult.afterStats.profileCompletionRate}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className={styles.section}>
          <div className={styles.resultError}>
            <AiOutlineCloseCircle className={styles.errorIcon} />
            <h3>Migration thất bại!</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className={styles.section}>
        <div className={styles.instructions}>
          <h4>Lưu ý quan trọng:</h4>
          <ul>
            <li>⚠️ Migration chỉ nên chạy một lần</li>
            <li>🔄 Backup dữ liệu trước khi chạy</li>
            <li>🚫 Không refresh trang khi đang chạy migration</li>
            <li>📊 Kiểm tra thống kê sau khi migration xong</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MigrationPanel;
