"use client";
import Image from "next/image";
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about-section fade-in">
      <img src="./aida-star.png" alt="" className="star-bg"/>
      <h2 className="about-title fade-in">About us</h2>

      <div className="about-container fade-in">
        {/* Bagian teks kiri */}
        <div className="about-left">
          <h3>
            Aida Creative Agency{" "}
            <Image
              src="/aida-star.png"
              alt="star"
              width={20}
              height={20}
              className="star"
            />
          </h3>
          <p className="about-quote">
            “WE RUN YOUR SOCIALS SO YOU CAN RUN YOUR BUSINESS”
          </p>
          <p className="about-testimony">
            “Aida Creative made our brand content look much more professional on
            social media. Our engagement has increased significantly!”
          </p>
          <p className="about-owner">— Owner of ☕ KOPI SAKTI</p>
        </div>

        {/* Bagian kanan: galeri foto */}
        <div className="photo-layout fade-in">
          {/* Baris atas */}
          <div className="photo-row top-row">
            <div className="photo-shape shape-left">
              <Image src="/gambar1.jpg" alt="left" fill className="photo-img" />
            </div>
            <div className="photo-shape shape-center-left">
              <Image src="/gambar2.jpg" alt="center-left" fill className="photo-img" />
            </div>
            <div className="photo-shape shape-center-right">
              <Image src="/gambar3.jpg" alt="center-right" fill className="photo-img" />
            </div>
            <div className="photo-shape shape-right">
              <Image src="/gambar4.jpg" alt="right" fill className="photo-img" />
            </div>
          </div>

          {/* Baris bawah */}
          <div className="photo-row bottom-row">
            <div className="photo-shape shape-bottom">
              <Image src="/gambar5.jpg" alt="bottom" fill className="photo-img" />
            </div>
          </div>

          <div className="photo-shadow"></div>
        </div>
      </div>

      <div className="about-desc fade-in">
        <div className="open-book"></div>
        <p>
          Aida Creative is a Surabaya-based creative business established in
          2022. Starting with photography and videography, it has expanded to
          provide Social Media Management services, helping businesses build
          strong brand identity and a professional digital presence. With the
          slogan{" "}
          <strong>“WE RUN YOUR SOCIALS SO YOU CAN RUN YOUR BUSINESS”</strong>,
          Aida Creative is committed to managing clients’ social media so they
          can focus on their core business.
        </p>
      </div>
    </section>
  );
}
