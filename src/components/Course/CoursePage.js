// src/components/Social/SocialPage.js
import React, { useEffect, useRef, useState } from 'react'; // Thêm useState
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import styles from './CoursePage.module.css';

import Hero from './Hero';
import WhySection from './WhySection';

import TestimonialSection from './TestimonialSection';
import LogosCarousel from './LogosCarousel';
import NextStepsSection from './NextStepsSection';
import FreeCourseCTA from './FreeCourseCTA';
import Header from "../Header";
import Footer from '../Footer';
import CourseDetailPage from './CourseDetailPage';

gsap.registerPlugin(ScrollTrigger);

export default function CoursePage() {
  const heroRef = useRef(null);
  const whySectionRef = useRef(null);
  
  const testimonialSectionRef = useRef(null);
  const logosCarouselRef = useRef(null);
  const nextStepsSectionRef = useRef(null);
  const freeCourseCTARef = useRef(null);
  const courseDetailPageRef = useRef(null);

  // Thêm state để kiểm soát việc render client-side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Đảm bảo mã GSAP chỉ chạy trên client sau khi component đã mount
    setIsClient(true);

    if (isClient) { // Chỉ chạy GSAP khi đã là client
        // Đặt hiệu ứng ban đầu cho các phần tử (opacity 0, di chuyển xuống)
        gsap.set([
            whySectionRef.current,
            // topicsSectionRef.current,
            testimonialSectionRef.current,
            logosCarouselRef.current,
            nextStepsSectionRef.current,
            freeCourseCTARef.current,
            courseDetailPageRef.current,
        ], { autoAlpha: 0, y: 50 });

        // Hiệu ứng xuất hiện ban đầu cho Hero section (ngay khi tải trang)
        gsap.from(heroRef.current, {
            opacity: 0,
            y: -50,
            duration: 1,
            ease: "power3.out",
            delay: 0.2
        });

        // Tạo hiệu ứng scroll-triggered cho từng section còn lại
        const sections = [
            { ref: whySectionRef, trigger: whySectionRef.current, start: "top 80%" },
            // { ref: topicsSectionRef, trigger: topicsSectionRef.current, start: "top 80%" },
            { ref: testimonialSectionRef, trigger: testimonialSectionRef.current, start: "top 80%" },
            { ref: logosCarouselRef, trigger: logosCarouselRef.current, start: "top 80%" },
            { ref: nextStepsSectionRef, trigger: nextStepsSectionRef.current, start: "top 80%" },
            { ref: freeCourseCTARef, trigger: freeCourseCTARef.current, start: "top 80%" },
            { ref: courseDetailPageRef, trigger: courseDetailPageRef.current, start: "top 80%" },
        ];

        sections.forEach(({ ref, trigger, start }) => {
            if (ref.current && trigger) { // Đảm bảo ref.current không phải null
                ScrollTrigger.create({
                    trigger: trigger,
                    start: start,
                    end: "bottom top",
                    toggleActions: "play none none none",
                    onEnter: () => {
                        gsap.to(ref.current, {
                            autoAlpha: 1,
                            y: 0,
                            duration: 1,
                            ease: "power2.out",
                        });
                    },
                    // markers: true,
                });
            }
        });
    }


    // Hàm cleanup: quan trọng để loại bỏ các instance của ScrollTrigger khi component unmount
    return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isClient]); // Thêm isClient vào dependency array để re-run khi nó thay đổi

  return (
    <div style={{ background: "#fafcff", minHeight: "100vh" }}>
      <Header />
      {/* Chỉ render các section được bọc ref khi đã ở client */}
      {isClient ? (
        <>
          <div ref={heroRef}><Hero /></div>
          <div ref={whySectionRef}><WhySection /></div>
          {/* <div ref={topicsSectionRef}><TopicsSection /></div> */}
          <div ref={testimonialSectionRef}><TestimonialSection /></div>
          <div ref={logosCarouselRef}><LogosCarousel /></div>
          <div ref={nextStepsSectionRef}><NextStepsSection /></div>
          <div ref={freeCourseCTARef}><FreeCourseCTA /></div>
          <div ref={courseDetailPageRef}><CourseDetailPage /></div>
        </>
      ) : (
        // Render một phiên bản "tối thiểu" hoặc trống rỗng trên server
        // Điều này đảm bảo HTML server render khớp với HTML ban đầu trên client
        <>
          <div><Hero /></div>
          <div><WhySection /></div>
          <div><TestimonialSection /></div>
          <div><LogosCarousel /></div>
          <div><NextStepsSection /></div>
          <div><FreeCourseCTA /></div>
          <div><CourseDetailPage /></div>
        </>
      )}
      <Footer />
    </div>
  );
}