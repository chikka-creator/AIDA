"use client";

import { useState, useRef, useEffect, JSX } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage, Language } from "../contexts/LanguageContext";

export default function Navbar(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [active, setActive] = useState<string>("home");
  const [indicator, setIndicator] = useState<{ x: number; width: number }>({ x: 0, width: 0 });
  const navRef = useRef<HTMLUListElement | null>(null);
  const [langOpen, setLangOpen] = useState<boolean>(false);
  const [animate, setAnimate] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const allLanguages: Language[] = ["ENG", "IND", "JPN"];

  const navItems = [
    { label: "home", path: "/" },
    { label: "portofolio", path: "/portofolio" },
    { label: "shop", path: "/shop" },
  ];

  const getFlag = (lang: string) => {
    switch (lang) {
      case "ENG": return "https://flagcdn.com/us.svg";
      case "IND": return "https://flagcdn.com/id.svg";
      case "JPN": return "https://flagcdn.com/jp.svg";
      default: return "";
    }
  };

  const handleNavigation = (path: string, label: string) => {
    setActive(label);
    router.push(path);
    setMobileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle language selection
  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setLangOpen(false);
  };

  // Animation delay
  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  // Set active based on pathname
  useEffect(() => {
    if (pathname === "/") {
      setActive("home");
    } else if (pathname === "/portofolio") {
      setActive("portofolio");
    } else if (pathname === "/shop") {
      setActive("shop");
    }
  }, [pathname]);

  // Track previous pathname
  const prevPathnameRef = useRef<string>("");

  // Auto refresh once per page change
  useEffect(() => {
    if (prevPathnameRef.current === "") {
      prevPathnameRef.current = pathname;
    } else if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      window.location.reload();
    } else if (prevPathnameRef.current === pathname) {
      window.location.reload();
    }
  }, [pathname]);

  // Update indicator position
  useEffect(() => {
    if (!navRef.current) return;
    const activeLink = navRef.current.querySelector(`.nav-item.active a`);
    if (activeLink) {
      const linkEl = activeLink as HTMLElement;
      const rect = linkEl.getBoundingClientRect();
      const parentRect = navRef.current.getBoundingClientRect();
      const newX = rect.left - parentRect.left - 8;
      const newWidth = rect.width + 16;
      setIndicator({
        x: newX,
        width: newWidth,
      });
    }
  }, [active, language]);

  // Get available languages (exclude current)
  const availableLanguages = allLanguages.filter((l) => l !== language);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      {/* HAMBURGER BUTTON - INDEPENDENT & OUTSIDE HEADER */}
      <button
        className="hamburger-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`hamburger-line ${mobileMenuOpen ? "active" : ""}`}></span>
        <span className={`hamburger-line ${mobileMenuOpen ? "active" : ""}`}></span>
        <span className={`hamburger-line ${mobileMenuOpen ? "active" : ""}`}></span>
      </button>

      {/* HEADER */}
      <header className={`header ${animate ? "show" : ""}`}>
        <div className="logo">
          <img src="./hd.webp" alt="Aida Creative Logo" className="logo-img" />
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-container">
          <ul className="nav-list" ref={navRef}>
            {navItems.map((item) => (
              <li
                key={item.label}
                className={`nav-item ${active === item.label ? "active" : ""}`}
                onClick={() => handleNavigation(item.path, item.label)}
              >
                <Link href={item.path}>
                  {t.nav[item.label as keyof typeof t.nav]}
                </Link>
              </li>
            ))}

            {/* Language Dropdown */}
            <li className="nav-item lang">
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="lang-btn"
                  onClick={() => setLangOpen((prev) => !prev)}
                >
                  <img src={getFlag(language)} alt="flag" className="flag" />
                  <span className="lang-text">{language}</span>
                  <span className="arrow" style={{
                    transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}>▾</span>
                </button>

                {langOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '8px',
                      background: '#fff',
                      borderRadius: '8px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      padding: '6px 0',
                      minWidth: '100px',
                      zIndex: 9999,
                    }}
                  >
                    {availableLanguages.map((lang) => (
                      <div
                        key={lang}
                        onClick={() => handleSelectLanguage(lang)}
                        style={{
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontFamily: 'Poppins, sans-serif',
                          color: '#333',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <img
                          src={getFlag(lang)}
                          alt={`${lang} flag`}
                          style={{ width: '20px', height: '14px', borderRadius: '2px' }}
                        />
                        <span>{lang}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </li>

            <span
              className="nav-indicator"
              style={{
                transform: `translateX(${indicator.x}px)`,
                width: `${indicator.width}px`,
              }}
            ></span>
          </ul>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-list">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                className={`mobile-nav-item ${active === item.label ? "active" : ""}`}
                onClick={() => handleNavigation(item.path, item.label)}
              >
                {t.nav[item.label as keyof typeof t.nav]}
              </button>
            </li>
          ))}

          <li>
            <div className="mobile-lang-container">
              {allLanguages.map((lang) => (
                <button
                  key={lang}
                  className={`mobile-lang-btn ${language === lang ? "active" : ""}`}
                  onClick={() => handleSelectLanguage(lang)}
                >
                  <img src={getFlag(lang)} alt={`${lang} flag`} />
                  {lang}
                </button>
              ))}
            </div>
          </li>

          {/* Auth Button in Mobile Menu */}
          <li>
            <div id="mobile-auth-placeholder"></div>
          </li>
        </ul>
      </div>
    </>
  );
}