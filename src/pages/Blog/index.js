import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NewsSection from "../../components/NewsSection/NewsSection";
import LatestNewsSection from "../../components/LatestNewsSection/LatestNewsSection";
import TeamSection from "../../components/TeamSection/TeamSection";
import TestimonialsSection from "../../components/TestimonialsSection/TestimonialsSection";
import PopularBlogsSection from "../../components/PopularBlogsSection/PopularBlogsSection";

function Blog() {
  return (
    <>
      <Header />

      <NewsSection />

      <LatestNewsSection />

      <TeamSection />

      <TestimonialsSection />

      <PopularBlogsSection />

      <Footer />
    </>
  );
}
export default Blog;