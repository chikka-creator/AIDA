import Image from "next/image";
import "../globals.css";
import { FaBookOpen } from "react-icons/fa";

export default function About() {
  return (
    <section className="about-section">
      <div className="about-container">

        {/* === TEKS KIRI === */}
        <div className="about-left">
          <h2 className="about-title">About us</h2>
          <h3 className="about-subtitle">Aida Creative Agency <img src="./aida-star.webp" alt="" /></h3>
          <p className="about-quote">“WE RUN YOUR SOCIALS SO YOU CAN RUN YOUR BUSINESS”</p>
          <p className="about-testimony">
            “Aida Creative made our brand content look much more professional on
            social media. Our engagement has increased significantly!”
          </p>
          <p className="about-owner">— Owner of <img src="/logo-kopi.webp" alt="" /></p>
        </div>

       <div className="photo-grid">
  <div className="photo photo1">
    <Image src="/gambar1.webp" alt="gambar Photo 1" fill />
  </div>
  <div className="photo photo2">
    <Image src="/gambar2.webp" alt="gambar Photo 2" fill />
  </div>
  <div className="photo photo3">
    <Image src="/gambar3.webp" alt="gambar Photo 3" fill />
  </div>
  <div className="photo photo4">
    <Image src="/gambar4.webp" alt="gambar Photo 4" fill />
  </div>
  <div className="photo photo5">
    <Image src="/gambar5.webp" alt="gambar Photo 5" fill />
  </div>
  <div className="photo photo6">
    <Image src="/gambar6.webp" alt="gambar Photo 6" fill />
  </div>
</div>


      </div>

      {/* === BOX DESKRIPSI BAWAH === */}
      <div className="about-desc">
        <FaBookOpen className="about-icon" />
        <p>
          Aida Creative is a Surabaya-based creative business established in
          2022. Starting with photography and videography, it has expanded to
          provide Social Media Management services, helping businesses build
          strong brand identity and a professional digital presence. With the
          slogan “WE RUN YOUR SOCIALS SO YOU CAN RUN YOUR BUSINESS!”, Aida
          Creative is committed to managing clients’ social media so they can
          focus on their core business.
        </p>
      </div>
    </section>
  );
}
