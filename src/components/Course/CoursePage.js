// src/components/Social/SocialPage.js
import React from 'react';
import styles from './CoursePage.module.css'; // import CSS Module vừa tạo
import Hero from './Hero';
import WhySection from './WhySection';
import TopicsSection from './TopicsSection';
import TestimonialSection from './TestimonialSection';
import LogosCarousel from './LogosCarousel';
import NextStepsSection from './NextStepsSection';
import FreeCourseCTA from './FreeCourseCTA';
import Header from "../Header";
import Footer from '../Footer';
import CourseDetailPage from './CourseDetailPage';

export default function SocialPage() {
  return (
    <div style={{ background: "#fafcff", minHeight: "100vh" }}>
      <Header />
      <Hero />
      <WhySection />
      <TopicsSection />
      <TestimonialSection />
      <LogosCarousel />
      <NextStepsSection />
      <FreeCourseCTA />
      <CourseDetailPage courseId="python" />
      <Footer />
    </div>
    
  );
}
