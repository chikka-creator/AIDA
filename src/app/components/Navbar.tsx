"use client";

import { useState, useRef, useEffect, JSX } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

export default function Navbar(): JSX.Element {
  const [active, setActive] = useState<string>("home");
  const [indicator, setIndicator] = useState<{ x: number; width: number }>({ x: 0, width: 0 });
  const navRef = useRef<HTMLUListElement | null>(null);
  const [langOpen, setLangOpen] = useState<boolean>(false);
  const [closing, setClosing] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("ENG");
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [animate, setAnimate] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const languages = ["ENG", "IND", "JPN"];

  const getFlag = (lang: string) => {
    switch (lang) {
      case "ENG":
        return "https://flagcdn.com/us.svg";
      case "IND":
        return "https://flagcdn.com/id.svg";
      case "JPN":
        return "https://flagcdn.com/jp.svg";
      default:
        return "";
    }
  };

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langOpen && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        handleCloseDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langOpen]);

  // Posisi dropdown agar sejajar
  useEffect(() => {
    if (langOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left,
      });
    }
  }, [langOpen]);

  const handleCloseDropdown = () => {
    setClosing(true);
    setTimeout(() => {
      setLangOpen(false);
      setClosing(false);
    }, 200);
  };

  // Efek muncul lembut navbar
  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timeout);
  }, []);

 // Hitung posisi indikator aktif dengan lebih akurat
useEffect(() => {
  if (!navRef.current) return;
  const activeLink = navRef.current.querySelector(`.nav-item.active a`);
  if (activeLink) {
    const linkEl = activeLink as HTMLElement;
    const rect = linkEl.getBoundingClientRect();
    const parentRect = navRef.current.getBoundingClientRect();

    // ambil margin kecil agar indikator pas dengan area klik a
    const newX = rect.left - parentRect.left - 8; // padding kiri kecil
    const newWidth = rect.width + 16; // tambahkan padding horizontal

    setIndicator({
      x: newX,
      width: newWidth,
    });
  }
}, [active]);


  return (
   <header className={`header ${animate ? "show" : ""}`}>
  <div className="logo">
    <img src="./hd.webp" alt="Aida Creative Logo" className="logo-img" />
  </div>
      <nav className="nav-container">
        <ul className="nav-list" ref={navRef}>
          {["home", "portofolio", "shop"].map((item) => (
            <li
              key={item}
              className={`nav-item ${active === item ? "active" : ""}`}
              onClick={() => setActive(item)}
            >
              <Link href={`#${item}`}>{item.charAt(0).toUpperCase() + item.slice(1)}</Link>
            </li>
          ))}

          <li className="nav-item lang" ref={buttonRef as any}>
            <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
              <img src={getFlag(language)} alt="flag" className="flag" />
              <span className="lang-text">{language}</span>
              <span className="arrow">▾</span>
            </button>
          </li>

          {/* indikator aktif */}
          <span
            className="nav-indicator"
            style={{
              transform: `translateX(${indicator.x}px)`,
              width: `${indicator.width}px`,
            }}
          ></span>
        </ul>
      </nav>

      {/* Dropdown Bahasa */}
      {langOpen &&
        createPortal(
          <ul
            className={`dropdown-menu ${closing ? "fade-out" : "fade-in"}`}
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
          >
            {languages.map((lang) => (
              <li
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  handleCloseDropdown();
                }}
              >
                <img src={getFlag(lang)} alt={`${lang} flag`} className="flag" />
                <span>{lang}</span>
              </li>
            ))}
          </ul>,
          document.body
        )}
    </header>
  );
}
