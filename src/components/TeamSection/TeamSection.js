import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTelegramPlane,
} from "react-icons/fa";
import styles from "./TeamSection.module.css";

const teamMembers = [
  {
    name: "Rahul Mehra",
    role: "Founder & Managing Director",
    img: "https://images.unsplash.com/photo-1626639900752-3ea9001925ae?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    socials: [
      "facebook",
      "twitter",
      "instagram",
      "linkedin",
      "youtube",
      "telegram",
    ],
  },
  {
    name: "Anjali Desai",
    role: "Senior Project Manager",
    img: "https://images.unsplash.com/photo-1728443433557-3fc9e37b58c2?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    socials: [
      "facebook",
      "twitter",
      "instagram",
      "linkedin",
      "youtube",
      "telegram",
    ],
  },
  {
    name: "Vikram Joshi",
    role: "Lead Structural Engineer",
    img: "https://images.unsplash.com/photo-1749406196982-ea35a1af66b1?q=80&w=1978&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    socials: [
      "facebook",
      "twitter",
      "instagram",
      "linkedin",
      "youtube",
      "telegram",
    ],
  },
];

const iconMap = {
  facebook: <FaFacebookF />,
  twitter: <FaTwitter />,
  instagram: <FaInstagram />,
  linkedin: <FaLinkedinIn />,
  youtube: <FaYoutube />,
  telegram: <FaTelegramPlane />,
};

export default function TeamSection() {
  return (
    <section className={styles.team}>
      <div className={styles.header}>
        <h2 className={styles.title}>Meet the Experts Behind Mason </h2>
        <div className={styles.descWrap}>
          <p className={styles.description}>
            Our strength lies in our people. At Mason, we’re proud to have a
            skilled, passionate, and experienced team that brings every project
            to life.
          </p>
          <button className={styles.cta}>Meet All Members</button>
        </div>
      </div>

      <div className={styles.grid}>
        {teamMembers.map((m) => (
          <div key={m.name} className={styles.card}>
            <div className={styles.avatarWrap}>
              <img src={m.img} alt={m.name} className={styles.avatar} />
            </div>
            <h3 className={styles.name}>{m.name}</h3>
            <p className={styles.role}>{m.role}</p>
            <div className={styles.socials}>
              {m.socials.map((key) => (
                <a key={key} href="#" className={styles.socialLink}>
                  {iconMap[key]}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
