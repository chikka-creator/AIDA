"use client";
import Image from "next/image";
import "./globals.css";
import Navbar from "./Navbar";
import Footer from "../components/Footer";
import KopiJotos from "./KopiJotos";
import AuthButton from "../components/AuthButton";
import PhotoSlideshow from "./PhotoSlideshow";
import CanvaEmbed from "../components/CanvaEmbed"; // Import komponen Canva
import { useLanguage } from "../contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  return (
    <main>
      {/* HEADER */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero">
        <p className="Services">{t.portofolio.services}</p>
        <div className="hero-row">
          <PhotoSlideshow />
          <div className="hero-box-vidio">
            <Image
              src="/vidio.webp"
              alt="Videography"
              fill
              className="img"
              unoptimized
            />
            <div className="overlay">{t.portofolio.videoGallery}</div>
          </div>
        </div>
        <div className="hero-row">
          <div className="hero-box wide">
            <Image src="/sosmed.webp" alt="Social Media Management" fill className="img" />
            <div className="overlay">{t.portofolio.socialMediaManagement}</div>
          </div>
        </div>
      </section>

      {/* CANVA PRESENTATION SECTION */}
      <section className="canva-section">
        <CanvaEmbed 
          embedUrl="https://www.canva.com/design/DAG4TRN_uYs/vW_LEw3aZz0nPHjP6VrRvQ/view?embed"
          height="600px"
          className="canva-showcase"
        />
      </section>

      {/* SECTION: VILLA SAHABAT TRAWAS */}
      {/* <section className="villa">
        <div className="villa-gallery">
          <Image src="/fotovilla.webp" alt="Villa 1" width={300} height={380} className="villa-photo" />
          <Image src="/fotovilla2.webp" alt="Villa 2" width={300} height={380} className="villa-photo" />
          <Image src="/fotovilla3.webp" alt="Villa 3" width={300} height={380} className="villa-photo" />
        </div>

        <h2 className="villa-title">VILLA SAHABAT TRAWAS</h2>

        <div className="villa-desc">
          <p>
            Combining natural beauty with modern hospitality. The villa offers mountain lodge-style
            accommodations with facilities. It caters to guests seeking tranquillity, aesthetic appeal,
            and immersive naturistic experiences, while retaining comfort and convenience for content
            creation and social media engagement.
          </p>
        </div>

        <p className="villa-sub">Photography & Drone</p>
      </section>  */}

      {/* SECTION: GRAHA PADEL CLUB */}
      {/* <section className="padel-section" aria-labelledby="padel-title">
        <div className="padel-overlay"></div>

        <div className="padel-inner">
          <div className="padel-top">
            <div className="padel-top-text">
              <p>
                Graha Padel Club is a high-end padel venue located at Graha Famili,
                Surabaya, featuring four indoor courts built to international standards.
                With advanced lighting, quality flooring, and excellent ancillary
                facilities including parking, café, and spaces to support events or open classes.
              </p>
            </div>

            <div className="padel-top-gallery">
              <div className="padel-top-left">
                <img src="/padel3.webp" alt="Padel vertical" />
              </div>

              <div className="padel-top-right">
                <img src="/padel2.webp" alt="Padel small top" className="small-top" />
                <img src="/padel6.webp" alt="Padel small bottom" className="small-bottom" />
              </div>
            </div>
          </div>

          <div className="padel-divider" aria-hidden="true"></div>

          <div className="padel-bottom">
            <div className="padel-bottom-left">
              <img src="/padel4.webp" alt="Padel bottom left" />
            </div>

            <div className="padel-bottom-center">
              <img src="/padel1.webp" alt="Padel bottom center" />
            </div>

            <div className="padel-bottom-right">
              <p>
                Graha Padel Club actively fosters an urban sports ecosystem by organizing
                regular events and encouraging community participation.
              </p>
            </div>
          </div>

          <div className="padel-title-wrap">
            <h2 id="padel-title">GRAHA PADEL CLUB</h2>
            <div className="padel-sub">Photography &amp; Drone</div>
          </div>
        </div>
      </section> */}

      {/* SECTION 3 */}
      {/* <KopiJotos /> */}

      {/* FOOTER */}
      <Footer />
    </main>
  );
}