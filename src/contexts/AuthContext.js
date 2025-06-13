import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          setIsAuthenticated(true);

          // Fetch user profile from Firestore
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            // Create basic user profile if it doesn't exist
            const basicProfile = {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            await setDoc(userDocRef, basicProfile);
            setUserProfile(basicProfile);
          }
        } else {
          setUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Sign up function
  const signUp = async (email, password, additionalData = {}) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Update user profile with display name if provided
      if (additionalData.displayName) {
        await updateProfile(user, {
          displayName: additionalData.displayName,
        });
      } // Create optimized user profile for social media
      const userProfile = {
        // Basic Info
        uid: user.uid,
        email: user.email,
        firstName: additionalData.firstName || "",
        lastName: additionalData.lastName || additionalData.surname || "",
        displayName:
          additionalData.displayName ||
          `${additionalData.firstName || ""} ${
            additionalData.lastName || additionalData.surname || ""
          }`.trim() ||
          user.displayName ||
          "",

        // Profile Info
        avatar: additionalData.avatar || user.photoURL || "",
        coverPhoto: additionalData.coverPhoto || "",
        bio: additionalData.bio || "",
        dateOfBirth: additionalData.dateOfBirth || "",
        gender: additionalData.gender || "",
        location: {
          city: additionalData.city || "",
          country: additionalData.country || "",
          coordinates: additionalData.coordinates || null,
        },

        // Professional Info
        profession: additionalData.profession || "",
        company: additionalData.company || "",
        website: additionalData.website || "",
        workExperience: additionalData.workExperience || "",

        // Contact Info
        phone: additionalData.phone || "",
        socialLinks: additionalData.socialLinks || {
          facebook: "",
          twitter: "",
          linkedin: "",
          instagram: "",
          github: "",
        },

        // Privacy & Settings
        privacySettings: {
          profileVisibility: "public",
          postDefaultVisibility: "public",
          allowMessagesFrom: "everyone",
          showEmail: false,
          showPhone: false,
          showLocation: false,
        },

        // Activity Stats
        stats: {
          postCount: 0,
          followerCount: 0,
          followingCount: 0,
          friendCount: 0,
          likesReceived: 0,
          commentsReceived: 0,
        },

        // Account Status
        role: additionalData.role || "user",
        isVerified: false,
        isActive: true,
        emailVerified: user.emailVerified,
        profileComplete: false,

        // Additional Features
        interests: additionalData.interests || [],
        skills: additionalData.skills || [],
        languages: additionalData.languages || [],
        timezone: additionalData.timezone || "",
        theme: additionalData.theme || "light",
        notifications: {
          email: true,
          push: true,
          likes: true,
          comments: true,
          follows: true,
          messages: true,
        },

        // Timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", user.uid), userProfile);
      setUserProfile(userProfile);

      return { user, userProfile };
    } catch (error) {
      console.error("Error in sign up:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error("Error in sign in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error in logout:", error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    try {
      if (!user) throw new Error("No user logged in");

      const userDocRef = doc(db, "users", user.uid);
      const updatedData = {
        ...profileData,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userDocRef, updatedData);
      setUserProfile((prev) => ({ ...prev, ...updatedData }));

      return updatedData;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  // Get user profile
  const getUserProfile = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    logout,
    updateUserProfile,
    getUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
