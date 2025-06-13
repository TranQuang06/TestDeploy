import React, { useState, useEffect, useRef } from "react";
import {
  FaStar,
  FaStarHalfAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import styles from "./TestimonialsSection.module.css";
import { gsap } from 'gsap';

const testimonials = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1748914451679-4c996574a75f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    quote:
      "From the first consultation to the final handover, the Vastcon team...",
    name: "James D.",
    role: "Project Manager at CoreBuild",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1747491681738-d0ed9a30fed3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5,
    quote:
      "Working with Mason was a delight — they transformed our warehouse...",
    name: "Sophia L.",
    role: "Operations Director at LogiWare",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1744922679352-98dc9f5ddeb6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4,
    quote:
      "The structural engineering solutions provided by Mason were innovative...",
    name: "Michael R.",
    role: "CEO at BuildPlus",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("");
  const length = testimonials.length;
  const sectionRef = useRef(null);

  // Add animation for the section
  useEffect(() => {
    // Check if ref exists before accessing
    if (!sectionRef.current) return;
    
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      // Set initial state (invisible)
      gsap.set(sectionRef.current, { opacity: 0, y: 30 });
      
      gsap.to(
        sectionRef.current,
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",     // Start when 80% of section is in view
            end: "top 40%",       // End when 40% of section is in view
            toggleActions: "play none none reverse", // Play on enter, reverse on leave
            markers: false        // Set to true for debugging
          }
        }
      );
    }, 0);
  }, []);

  const changeSlide = (newIndex, dir) => {
    setDirection(dir);
    setCurrent(newIndex);
  };

  const prev = () => changeSlide((current - 1 + length) % length, "left");
  const next = () => changeSlide((current + 1) % length, "right");

  // Clear direction after animation
  useEffect(() => {
    if (direction) {
      const timer = setTimeout(() => setDirection(""), 500);
      return () => clearTimeout(timer);
    }
  }, [direction]);

  const { img, rating, quote, name, role } = testimonials[current];

  // Render star icons
  const stars = [];
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={i} />);
  if (halfStar) stars.push(<FaStarHalfAlt key="half" />);

  return (
    <section ref={sectionRef} className={styles.testimonials}>
      <div className={styles.header}>
        <h2 className={styles.title}>What Our Clients Say</h2>
        <p className={styles.subtitle}>
          We’re proud to be trusted by clients across residential, commercial,
          and industrial sectors. Here’s what they have to say about working
          with our team and the results we deliver.
        </p>
      </div>

      <div className={styles.carousel}>
        <button onClick={prev} className={styles.arrow} aria-label="Previous">
          <FaArrowLeft />
        </button>

        <div
          className={`${styles.cardWrapper} ${
            direction === "right" ? styles.slideInRight : ""
          } ${direction === "left" ? styles.slideInLeft : ""}`}
        >
          <div className={styles.card}>
            <div className={styles.avatarWrap}>
              <img src={img} alt={name} className={styles.avatar} />
            </div>
            <div className={styles.content}>
              <div className={styles.rating}>{stars}</div>
              <p className={styles.quote}>&ldquo;{quote}&rdquo;</p>
              <p className={styles.clientName}>{name}</p>
              <p className={styles.clientRole}>{role}</p>
            </div>
          </div>
        </div>

        <button onClick={next} className={styles.arrow} aria-label="Next">
          <FaArrowRight />
        </button>
      </div>
    </section>
  );
}
