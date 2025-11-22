"use client";

import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";
import "../globals.css";
import { FaWhatsapp } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const { t } = useLanguage();

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
            <FaInstagram size={22} color="#ffffff" />
          </a>

          <a
            href="http://www.youtube.com/@stephenhko"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
            aria-label="YouTube"
          >
            <FaYoutube size={22} color="#ffffff" />
          </a>

          <a
            href="https://wa.me/+6285156288171"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
            aria-label="WhatsApp"
          >
            <FaWhatsapp size={22} color="#ffffff" />
          </a>
        </div>

        <h3 className="footer-name">{t.footer.username}</h3>

        <p className="footer-text">{t.footer.rights}</p>
      </div>
    </footer>
  );
}