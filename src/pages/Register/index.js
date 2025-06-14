import styles from "../../pages/Register/Register.module.css";
import Link from "next/link";

import { useState, useEffect, useLayoutEffect, useRef } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁 icons
import gsap from "gsap";

// Firebase imports
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";

function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const btnRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  }); // Error & loading state
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);
  // useEffect(() => {
  //   AOS.init({ duration: 800, once: true });
  // }, []);

  // Check email verification status
  useEffect(() => {
    let unsubscribe;

    if (isRegistered) {
      // Listen for auth state changes to detect email verification
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Reload user to get latest emailVerified status
          await user.reload();

          if (user.emailVerified && !isEmailVerified) {
            setIsEmailVerified(true);
            setMessage("Email verified successfully! You can now sign in.");

            // Update Firestore
            await updateDoc(doc(db, "users", user.uid), {
              emailVerified: true,
              emailVerifiedAt: new Date().toISOString(),
            });
          }
        }
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isRegistered, isEmailVerified]);

  const checkEmailVerification = async () => {
    if (!auth.currentUser) return;

    setCheckingVerification(true);
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        setIsEmailVerified(true);
        setMessage("Email verified successfully! You can now sign in.");

        // Update Firestore
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          emailVerified: true,
          emailVerifiedAt: new Date().toISOString(),
        });
      } else {
        setMessage(
          "⚠️ Email not yet verified. Please check your email and click the verification link."
        );
      }
    } catch (error) {
      setMessage("❌ Error checking verification status. Please try again.");
    } finally {
      setCheckingVerification(false);
    }
  };
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.surname.trim()) newErrors.surname = "Surname is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage("");

    try {
      // Create user account with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user; // Update user profile with display name
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.surname}`,
      });

      // Send email verification
      await sendEmailVerification(user);

      // Save additional user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        surname: formData.surname,
        email: formData.email,
        createdAt: new Date().toISOString(),
        role: "job_seeker",
        profileComplete: false,
        emailVerified: false,
      });
      setMessage(
        "✅ Registration successful! Please check your email to verify your account before signing in."
      );
      setIsRegistered(true);

      // Reset form
      setFormData({
        firstName: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
      });

      // ❌ Không redirect tự động
      // User phải verify email trước khi có thể login
      // setTimeout(() => {
      //   window.location.href = "/SignIn";
      // }, 3000);
    } catch (error) {
      console.error("Registration error:", error);

      // Handle Firebase Auth errors
      let errorMessage = "Registration failed. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Please use another email.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "Password is too weak. Please use at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format.";
      }

      setMessage(`❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } });

    tl.from(leftRef.current, {
      x: -100,
      opacity: 0,
    }).from(
      rightRef.current,
      {
        x: 100,
        opacity: 0,
      },
      "-=0.8"
    ); // đồng thời với left

    // Optional: hiệu ứng field lần lượt
    gsap.from(".register-form input", {
      y: 20,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      delay: 1,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return; //  tránh lỗi nếu chưa mount

    gsap.set(btn, { scale: 1 });

    const handleEnter = () => gsap.to(btn, { scale: 1.05, duration: 0.2 });
    const handleLeave = () => gsap.to(btn, { scale: 1, duration: 0.2 });

    btn.addEventListener("mouseenter", handleEnter);
    btn.addEventListener("mouseleave", handleLeave);

    return () => {
      btn.removeEventListener("mouseenter", handleEnter);
      btn.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <>
      <div className={styles.registerWrapper}>
        <div className={styles.registerLeft} ref={leftRef}>
          <h2> Đăng Kí </h2>{" "}
          {message && (
            <div
              className={`${styles.message} ${
                message.includes("✅") ? styles.success : styles.error
              }`}
            >
              {message}
            </div>
          )}
          {/* Show different content based on registration status */}
          {!isRegistered ? (
            /* Registration Form */
            <form
              className={`${styles.registerForm} register-form`}
              onSubmit={handleSubmit}
            >
              <label> Tên đăng nhập </label>
              <input
                type="text"
                name="firstName"
                placeholder="john"
                value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? styles.inputError : ""}
              />
              {errors.firstName && (
                <span className={styles.errorText}>{errors.firstName}</span>
              )}

              <label> Họ </label>
              <input
                type="text"
                name="surname"
                placeholder="doe"
                value={formData.surname}
                onChange={handleInputChange}
                className={errors.surname ? styles.inputError : ""}
              />
              {errors.surname && (
                <span className={styles.errorText}>{errors.surname}</span>
              )}

              <label>Email </label>
              <input
                type="email"
                name="email"
                placeholder="johndoe@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? styles.inputError : ""}
              />
              {errors.email && (
                <span className={styles.errorText}>{errors.email}</span>
              )}

              <label>Mật khẩu</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="******"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`${styles.passwordInput} ${
                    errors.password ? styles.inputError : ""
                  }`}
                />
                <span onClick={togglePassword} className={styles.eyeIcon}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {errors.password && (
                <span className={styles.errorText}>{errors.password}</span>
              )}

              <label>Nhập lại mật khẩu</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="******"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`${styles.passwordInput} ${
                    errors.confirmPassword ? styles.inputError : ""
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <span className={styles.errorText}>
                  {errors.confirmPassword}
                </span>
              )}

              <div className={styles.registerOptions}>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                />
                Tôi đồng ý với{" "}
                <Link href="/terms" target="_blank" rel="noopener noreferrer">
                  Điều Khoản Dịch Vụ
                </Link>{" "}
                và{" "}
                <Link href="/privacy" target="_blank" rel="noopener noreferrer">
                  Chính Sách Bảo Mật
                </Link>
              </div>
              {errors.agreeToTerms && (
                <span className={styles.errorText}>{errors.agreeToTerms}</span>
              )}

              <button
                ref={btnRef}
                type="submit"
                disabled={isLoading}
                className={`${styles.registerButton} registerButton ${
                  isLoading ? styles.loading : ""
                }`}
              >
                {isLoading ? "Creating Account..." : "Đăng kí"}
              </button>
            </form>
          ) : (
            /* Post-Registration Instructions */
            <div className={styles.verificationInstructions}>
              <div className={styles.emailIcon}>📧</div>
              <h3>Check Your Email</h3>
              <p>
                We've sent a verification link to your email address. Please
                click the link in the email to verify your account.
              </p>
              <div className={styles.instructionSteps}>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>1</span>
                  <span>Check your inbox (and spam folder)</span>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>2</span>
                  <span>Click the verification link</span>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>3</span>
                  <span>Return here to sign in</span>
                </div>
              </div>
              <div className={styles.verificationActions}>
                <Link
                  href="/SignIn"
                  className={`${styles.signInButton} ${
                    !isEmailVerified ? styles.disabled : ""
                  }`}
                  onClick={(e) => {
                    if (!isEmailVerified) {
                      e.preventDefault();
                      setMessage(
                        "⚠️ Please verify your email first before signing in."
                      );
                    }
                  }}
                >
                  {isEmailVerified ? "Go to Sign In" : "Verify Email First"}
                </Link>

                <button
                  className={styles.checkVerificationButton}
                  onClick={checkEmailVerification}
                  disabled={checkingVerification}
                >
                  {checkingVerification
                    ? "Checking..."
                    : "Check Verification Status"}
                </button>

                <button
                  className={styles.registerAgainButton}
                  onClick={() => {
                    setIsRegistered(false);
                    setIsEmailVerified(false);
                    setMessage("");
                  }}
                >
                  Register Another Account
                </button>
              </div>
            </div>
          )}{" "}
          {!isRegistered && (
            <p className={styles.loginPrompt}>
              Bạn đã có tài khoản?{" "}
              <Link href="/SignIn" className={styles.loginLink}>
                Đăng nhập tại đây
              </Link>
            </p>
          )}
        </div>

        {/* Panel bên phải - trang trí, giới thiệu sản phẩm */}
        <div className={styles.registerRight} ref={rightRef}>
          <div className={styles.registerPanel}>
            <h4>Chào mừng đến với SuperStars</h4>
            <p>
              SuperStars giúp các nhà phát triển xây dựng các bảng điều khiển
              được tổ chức và mã hóa tốt với giao diện người dùng đẹp mắt và các
              mô-đun phong phú. Hãy tham gia cùng chúng tôi và bắt đầu xây dựng
              ứng dụng của bạn ngay hôm nay.
            </p>
            <p>
              Hơn 17 nghìn người đã tham gia cùng chúng tôi, đến lượt bạn rồi
            </p>
            <div className={styles.registerCta}>
              <h5>
                Có được công việc phù hợp và đúng đắn
                <br />
                địa điểm nộp đơn ngay bây giờ
              </h5>

              <div className={styles.ctaRow}>
                <p>
                  Hãy là một trong những người sáng lập đầu tiên trải nghiệm
                  cách dễ nhất để bắt đầu điều hành một doanh nghiệp.
                </p>
                <div className={styles.avatars}>
                  <img src="/avatar1.jpg" alt="avatar1" />
                  <img src="/avatar2.jpg" alt="avatar2" />
                  <img src="/avatar3.jpg" alt="avatar3" />
                  <span>+2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Register;
