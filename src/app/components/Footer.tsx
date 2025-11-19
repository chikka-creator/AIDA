import Image from "next/image";
import "../globals.css";
import { FaWhatsapp } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-overlay" aria-hidden />
      <div className="footer-content">
        <div className="footer-icons" role="navigation" aria-label="social links">
          <a
            href="https://www.instagram.com/aidacreative.id?igsh=MWFqazB1bGhrYm9lMg=="
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
            aria-label="Instagram"
          >
            {/* Instagram SVG */}
            <FaInstagram size={22} color="#ffffff" />
          </a>

          <a
            href="http://www.youtube.com/@stephenhko"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
            aria-label="YouTube"
          >
            {/* YouTube SVG */}
           <FaYoutube size={22} color="#ffffff" />
          </a>

          <a
            href="https://wa.me/+6285156288171"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
            aria-label="WhatsApp"
          >
            {/* WhatsApp SVG */}
           <FaWhatsapp size={22} color="#ffffff" />
          </a>
        </div>

        <h3 className="footer-name">@aidacreative.id</h3>

        <p className="footer-text">
          © 2025 es teh anget. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
