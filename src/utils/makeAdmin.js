// Temporary script to make current user an admin
// Run this ONCE in browser console while logged in to give yourself admin permissions

import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.js";

export const makeCurrentUserAdmin = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error("No user is currently logged in");
    }

    const userRef = doc(db, "users", auth.currentUser.uid);

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
    });

    console.log("✅ Current user is now an admin!");
    console.log("User ID:", auth.currentUser.uid);
    console.log("Email:", auth.currentUser.email);

    return true;
  } catch (error) {
    console.error("❌ Error making user admin:", error);
    return false;
  }
};

// Auto-run if this file is imported
if (typeof window !== "undefined") {
  // This will only run in browser, not during SSR
  window.makeCurrentUserAdmin = makeCurrentUserAdmin;
  console.log("Run makeCurrentUserAdmin() in console to grant admin access");
}
