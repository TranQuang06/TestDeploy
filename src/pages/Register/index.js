import styles from "../../pages/Register/Register.module.css";
import Link from "next/link";


import { useState, useEffect, useLayoutEffect, useRef } from "react";


import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁 icons

import gsap from "gsap";


function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const btnRef = useRef(null);


  // useEffect(() => {
  //   AOS.init({ duration: 800, once: true });
  // }, []);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
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
          <div className={styles.brand}>
            <img src="/logo.png" alt="logo" />
            <h2>SuperStars</h2>
          </div>
          <h2> Register </h2>
          {/* Form đăng ký, có thể bổ sung validate ở bước sau */}
          <form className={`${styles.registerForm} register-form`}>
            <label> First Name </label>
            <input type="text" placeholder=" Vu " />
            <label> Surname </label>
            <input type="text" placeholder=" Nguyen " />
            <label>Email Address</label>
            <input type="email" placeholder="johndoe@gmail.com" />
            
            <label>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="******"
                className={styles.passwordInput}
              />
              <span onClick={togglePassword} className={styles.eyeIcon}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <div className={styles.registerOptions}>
              <input type="checkbox" />
              Tôi đồng ý với{" "}
              <Link href="/terms" target="_blank" rel="noopener noreferrer">
                Điều Khoản Dịch Vụ
              </Link>{" "}
              và{" "}
              <Link href="/privacy" target="_blank" rel="noopener noreferrer">
                Chính Sách Bảo Mật
              </Link>
            </div>
            <button
              ref={btnRef}
              type="submit"
              className={`${styles.registerButton} registerButton`}
            >
              Register
            </button>
          </form>
        </div>

        {/* Panel bên phải - trang trí, giới thiệu sản phẩm */}
        <div className={styles.registerRight} ref={rightRef}>
          <div className={styles.registerPanel}>
            <h4>Welcome to SuperStars</h4>
            <p>
              SuperStars helps developers to build organized and well coded
              dashboards full of beautiful UI and rich modules. Join us and
              start building your application today.
            </p>
            <p>More than 17k people joined us, it’s your turn</p>
            <div className={styles.registerCta}>
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
export default Register;
