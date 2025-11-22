"use client";

import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";
import "../globals.css";
import { FaBookOpen } from "react-icons/fa";

export default function About() {
  const { t } = useLanguage();

  return (
    <section className="about-section">
      <div className="about-container">

        {/* === TEKS KIRI === */}
        <div className="about-left">
          <h2 className="about-title">{t.about.title}</h2>
          <h3 className="about-subtitle">
            {t.about.subtitle} <img src="./aida-star.webp" alt="" />
          </h3>
          <p className="about-quote">{t.about.quote}</p>
          <p className="about-testimony">{t.about.testimony}</p>
          <p className="about-owner">
            {t.about.owner} <img src="/logo-kopi.webp" alt="" />
          </p>
        </div>

        {/* === PHOTO GRID === */}
        <div className="photo-grid">
          <div className="photo photo1">
            <Image src="/foto1.webp" alt="gambar Photo 1" fill />
          </div>
          <div className="photo photo2">
            <Image src="/foto5.webp" alt="gambar Photo 2" fill />
          </div>
          <div className="photo photo3">
            <Image src="/foto39.webp" alt="gambar Photo 3" fill />
          </div>
          <div className="photo photo4">
            <Image src="/foto7.webp" alt="gambar Photo 4" fill />
          </div>
          <div className="photo photo5">
            <Image src="/foto45.webp" alt="gambar Photo 5" fill />
          </div>
          <div className="photo photo6">
            <Image src="/foto43.webp" alt="gambar Photo 6" fill />
          </div>
        </div>

      </div>

      {/* === BOX DESKRIPSI BAWAH === */}
      <div className="about-desc">
        <FaBookOpen className="about-icon" />
        <p>{t.about.description}</p>
      </div>
    </section>
  );
}