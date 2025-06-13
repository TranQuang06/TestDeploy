import styles from "./DashBoardSocial.module.css";
import Header from "../Header";
import Footer from "../Footer";
import TabLeftSocial from "../TabLeftSocial/TabLeftSocial";

function DashBoardSocial() {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <TabLeftSocial />
      </div>

      <div className={styles.mainContent}>

        {/* Main dashboard content goes here */}
        <div className={styles.content}>
            
        </div>

        {/* <Footer /> */}
      </div>
    </div>
  );
}
export default DashBoardSocial;
