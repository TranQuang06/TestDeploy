import styles from "../../components/Dashboard/Dashboard.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import TabLeftSocial from "../../components/TabLeftSocial/TabLeftSocial";

function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <TabLeftSocial />
      </div>

      <div className={styles.mainContent}>
        <Header />

        {/* Main dashboard content goes here */}
        <div className={styles.content}>
          <h1>Dashboard Content</h1>
          <p>This is where your main dashboard content will be displayed.</p>
        </div>

        {/* <Footer /> */}
      </div>
    </div>
  );
}

export default Dashboard;
