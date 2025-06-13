import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../config/firebase";
import { initializeSampleData } from "../../utils/createSampleData";
import styles from "./AdminSetup.module.css";

const AdminSetup = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sampleLoading, setSampleLoading] = useState(false);
  const [message, setMessage] = useState("");

  const makeCurrentUserAdmin = async () => {
    if (!user) {
      setMessage("❌ No user is currently logged in");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const userRef = doc(db, "users", user.uid);

      // Update user document to add admin role
      await updateDoc(userRef, {
        role: "admin",
        isAdmin: true,
        adminSince: new Date().toISOString(),
        permissions: [
          "read_all_users",
          "write_all_users",
          "run_migrations",
          "admin_panel_access",
          "database_operations",
        ],
        updatedAt: new Date().toISOString(),
      });

      setMessage(
        "✅ You are now an admin! Please refresh the page and try the migration again."
      );

      // Force page refresh after 2 seconds to update auth context
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error making user admin:", error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSampleData = async () => {
    setSampleLoading(true);
    setMessage("");

    try {
      const result = await initializeSampleData();

      if (result.success) {
        setMessage(
          "✅ Sample data created successfully! You can now test the social media features."
        );
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error creating sample data: ${error.message}`);
    } finally {
      setSampleLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <p>Please log in first to set up admin access.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3>🛠️ Admin Setup</h3>
      <p>
        <strong>Current User:</strong> {user.email}
      </p>
      <p>
        If you're getting permission errors during migration, click the button
        below to grant admin access to your account.
      </p>
      <p className={styles.warning}>
        ⚠️ This should only be done by the application owner/developer.
      </p>
      <button
        onClick={makeCurrentUserAdmin}
        disabled={loading}
        className={styles.adminButton}
      >
        {loading ? "Setting up admin..." : "Make Me Admin"}
      </button>

      <button
        onClick={handleCreateSampleData}
        disabled={sampleLoading}
        className={styles.sampleButton}
      >
        {sampleLoading ? "Creating sample data..." : "Create Sample Data"}
      </button>

      {message && (
        <div
          className={`${styles.message} ${
            message.includes("✅") ? styles.success : styles.error
          }`}
        >
          {message}
        </div>
      )}

      <div className={styles.instructions}>
        <h4>Instructions:</h4>
        <ol>
          <li>Click "Make Me Admin" above</li>
          <li>Wait for the page to refresh</li>
          <li>Go back to the Migration Panel</li>
          <li>Try running the migration again</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminSetup;
