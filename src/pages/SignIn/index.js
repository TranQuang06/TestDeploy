import styles from "../../pages/SignIn/SingIn.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebookF } from "react-icons/fa";

import Link from "next/link";
import { useRouter } from "next/router";

import { useState, useEffect, useLayoutEffect, useRef } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁 icons

import gsap from "gsap";
import { useAuth } from "../../contexts/AuthContext";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, isAuthenticated } = useAuth();
  const router = useRouter();

  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const btnRef = useRef(null);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await signIn(email, password);

      if (!user.emailVerified) {
        setError(
          "Please verify your email before signing in. Check your inbox for the verification link."
        );
        return;
      }

      router.push("/");
    } catch (error) {
      console.error("Sign in error:", error);

      // Handle Firebase Auth errors with user-friendly messages
      switch (error.code) {
        case "auth/user-not-found":
          setError("Không tìm thấy tài khoản với email này.");
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Mật khẩu không đúng. Vui lòng thử lại.");
          break;
        case "auth/invalid-email":
          setError("Địa chỉ email không hợp lệ.");
          break;
        case "auth/user-disabled":
          setError("Tài khoản này đã bị vô hiệu hóa.");
          break;
        case "auth/too-many-requests":
          setError("Quá nhiều lần thử không thành công. Vui lòng thử lại sau.");
          break;
        case "auth/network-request-failed":
          setError("Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.");
          break;
        case "auth/popup-closed-by-user":
          setError("Đăng nhập bị hủy.");
          break;
        default:
          setError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.");
          console.log("Unhandled error code:", error.code);
      }
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
    gsap.from(".signin-form input", {
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
      <div className={styles.signinWrapper}>
        <div className={styles.signinLeft} ref={leftRef}>
          <h2>Sign in</h2>
          {/* Form đăng nhập, có thể bổ sung validate ở bước sau */}
          <form
            className={`${styles.signinForm} signin-form`}
            onSubmit={handleSubmit}
          >
            <label>Email Address</label>
            <input
              type="email"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="******"
                className={styles.passwordInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span onClick={togglePassword} className={styles.eyeIcon}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <div className={styles.signinOptions}>
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <Link href="#">Forgot Password?</Link>
            </div>
            <button
              ref={btnRef}
              type="submit"
              className={`${styles.signinButton} signinButton`}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
            <div className={styles.signinBottom}>
              <p>
                Don’t have an account?{" "}
                <Link href="/Register" className={styles.link}>
                  Register
                </Link>
              </p>

              <div className={styles.signinSocials}>
                <div className={styles.socialIcon}>
                  <FcGoogle />
                </div>
                <div className={styles.socialIcon}>
                  <FaGithub />
                </div>
                <div className={styles.socialIcon}>
                  <FaFacebookF style={{ color: "#1877f2" }} />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Panel bên phải - trang trí, giới thiệu sản phẩm */}
        <div className={styles.signinRight} ref={rightRef}>
          <div className={styles.signinPanel}>
            <h4>Welcome to SuperStars</h4>
            <p>
              SuperStars helps developers to build organized and well coded
              dashboards full of beautiful UI and rich modules. Join us and
              start building your application today.
            </p>
            <p>More than 17k people joined us, it’s your turn</p>
            <div className={styles.signinCta}>
              <h5>
                Get your right job and right
                <br />
                place apply now
              </h5>

              <div className={styles.ctaRow}>
                <p>
                  Be among the first founders to experience the easiest way to
                  start run a business.
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
export default SignIn;
