import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const useAdminCheck = () => {
  const { user, userProfile, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [adminCheckError, setAdminCheckError] = useState(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (loading) return;

      if (!user) {
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }

      try {
        setIsChecking(true);
        setAdminCheckError(null);

        // First check userProfile from context
        if (userProfile) {
          const hasAdminRole =
            userProfile.role === "admin" ||
            userProfile.isAdmin === true ||
            (userProfile.permissions &&
              userProfile.permissions.includes("admin_panel_access"));

          setIsAdmin(hasAdminRole);
          setIsChecking(false);
          return;
        }

        // If no userProfile in context, fetch directly from Firestore
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const hasAdminRole =
            userData.role === "admin" ||
            userData.isAdmin === true ||
            (userData.permissions &&
              userData.permissions.includes("admin_panel_access"));

          setIsAdmin(hasAdminRole);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setAdminCheckError(error.message);
        setIsAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminStatus();
  }, [user, userProfile, loading]);

  return {
    isAdmin,
    isChecking,
    adminCheckError,
    user,
    userProfile,
  };
};
