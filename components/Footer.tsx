// src/app/AIDA/components/Footer.tsx
import Image from "next/image";
import "../globals.css";

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-overlay" aria-hidden />
      <div className="footer-content">
        <div className="footer-icons" role="navigation" aria-label="social links">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
            aria-label="Instagram"
          >
            {/* Instagram SVG */}
            <svg className="footer-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" />
            </svg>
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
            aria-label="YouTube"
          >
            {/* YouTube SVG */}
            <svg className="footer-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M21 7.5c0 0-0.2-1.6-0.8-2.3-.8-.9-1.7-.9-2.1-1C15.6 4 12 4 12 4s-3.6 0-5.9.2c-.4 0-1.3.1-2.1 1C3.2 5.9 3 7.5 3 7.5S3 9.6 3 11.6v.9C3 14.4 3 16.4 3 16.4s0.2 1.6.8 2.3c.8.9 1.8.9 2.2 1 1.6.2 6.5.2 6.5.2s3.6 0 5.9-.2c.4 0 1.3-.1 2.1-1 .6-.7.8-2.3.8-2.3s0-2 .0-4v-.9c0-2-.0-4-0-4z" stroke="currentColor" strokeWidth="0.6" fill="currentColor"/>
              <path d="M10 9.5l5 2.5-5 2.5v-5z" fill="#fff"/>
            </svg>
          </a>

          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
            aria-label="WhatsApp"
          >
            {/* WhatsApp SVG */}
            <svg className="footer-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M20 4.6A11.9 11.9 0 0 0 12.1 3 11.96 11.96 0 0 0 3 15.9c0 2 .5 3.8 1.4 5.5L3 21l1.7-.5A11.9 11.9 0 0 0 12.1 21 11.96 11.96 0 0 0 23 9.1c0-1.7-.4-3.2-1-4.5z" stroke="currentColor" strokeWidth="0.6" fill="currentColor"/>
              <path d="M17 14.2c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1-0.1 0.1-.2.1-.5 0.0-.3-.1-1.2-.4-2.2-1.3-.8-.7-1.3-1.6-1.4-1.9-.1-.3 0-.5.1-.7.1-.1.3-.3.5-.5.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6 0.0-.2-.5-.5-.9-.8-.4-.3-0.6-.6-0.8-.8-.2-.2-.4-.3-.6-.3s-.5 0.0-.8 0.2c-.3.2-1.1 1-1.1 2.4 0 1.4 1.1 2.8 1.2 3 0.1.2 2 3.1 5.1 4.2 3.2 1.1 3.2.7 3.8.6s2.1-.9 2.4-1.8c0.3-.9.3-1.7.2-1.8-.1-.2-0.4-.3-.7-.5z" fill="#fff"/>
            </svg>
          </a>
        </div>

        <h3 className="footer-name">Stephen Herbert</h3>

        <p className="footer-text">
          Copyright © 2025 Aida Creative
          <br />
          Powered by es teh anget.
        </p>
      </div>
    </footer>
  );
}
