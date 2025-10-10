"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const images = [
    "/images/photo1.jpg",
    "/images/photo2.jpg",
    "/images/photo3.jpg",
  ]; // ganti dengan foto kamu sendiri di /public/images/
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000); // ganti gambar setiap 4 detik
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="hero-section">
      <div className="rotating-logo">
        <img src="/logo.png" alt="AIDA Logo Background" />
      </div>

      <div className="hero-content">
        <h1 className="hero-title left">AIDA</h1>

        <div className="hero-image-wrapper">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`slide-${index}`}
              className={`hero-image ${
                index === currentImage ? "active" : ""
              }`}
            />
          ))}
        </div>

        <h1 className="hero-title right">AIDA</h1>

        <p className="hero-subtitle">creative</p>
      </div>
    </section>
  );
}
