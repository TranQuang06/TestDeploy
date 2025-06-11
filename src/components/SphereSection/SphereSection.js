import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import styles from "./SphereSection.module.css";

export default function SphereSection() {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();

    // Gradient background như TopCV

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Geometry & Material
    const geometry = new THREE.SphereGeometry(1.6, 128, 128);
    const material = new THREE.PointsMaterial({
      color: 0xff6f61, // Màu cam đào hoặc tùy chọn
      size: 0.01,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    points.position.y = -0.2; // ✅ Đẩy quả cầu xuống dưới trong không gian 3D

    // Light glow
    const pointLight = new THREE.PointLight(0xfffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.003;
      points.rotation.x += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div ref={mountRef} className={styles.container}></div>
    </div>
  );
}
