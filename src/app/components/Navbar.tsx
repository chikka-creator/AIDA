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
  const [indicator, setIndicator] = useState<{ x: number; width: number }>({
    x: 0,
    width: 0,
  });
  const navRef = useRef<HTMLUListElement | null>(null);
  const [langOpen, setLangOpen] = useState<boolean>(false);
  const [animate, setAnimate] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // state untuk mobile menu
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const allLanguages: Language[] = ["ENG", "IND", "JPN"];

  const navItems = [
    { label: "home", path: "/" },
    { label: "portofolio", path: "/portofolio" },
    { label: "shop", path: "/shop" },
  ];

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

  const handleNavigation = (path: string, label: string) => {
    setActive(label);
    setMenuOpen(false); // tutup mobile menu kalau lagi kebuka
    router.push(path);
  };

  // Close dropdown ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setLangOpen(false);
  };

  // Animasi navbar turun dari atas
  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  // Set active berdasarkan pathname + auto close mobile menu
  useEffect(() => {
    if (pathname === "/") {
      setActive("home");
    } else if (pathname === "/portofolio") {
      setActive("portofolio");
    } else if (pathname === "/shop") {
      setActive("shop");
    } else if (pathname === "/owned-products") {
      setActive("shop");
    } else if (pathname === "/purchases") {
      setActive("shop");
    }

    // setiap ganti halaman, tutup menu mobile
    setMenuOpen(false);
  }, [pathname]);

  // 🔄 AUTO REFRESH 1x SETIAP MASUK PAGE BARU / KEMBALI KE PAGE LAMA
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR safety

    const current = pathname;
    const last = sessionStorage.getItem("last_pathname");
    const reloadedFor = sessionStorage.getItem("reloaded_for");

    // Pertama kali tab ini buka (belum ada last_pathname)
    if (!last) {
      sessionStorage.setItem("last_pathname", current);

      // Anggap user "baru masuk" ke page ini → refresh 1x
      if (reloadedFor !== current) {
        sessionStorage.setItem("reloaded_for", current);
        window.location.reload();
      }
      return;
    }

    // Pindah page (dari path lama ke path baru)
    if (last !== current) {
      // Kalau belum di-refresh untuk page ini dalam satu siklus masuk
      if (reloadedFor !== current) {
        sessionStorage.setItem("reloaded_for", current);
        sessionStorage.setItem("last_pathname", current);
        window.location.reload();
        return;
      }
    } else {
      // last === current → efek setelah reload
      if (reloadedFor === current) {
        // Beres reload → bersihkan flag supaya nanti kalau keluar-masuk lagi bisa refresh lagi
        sessionStorage.removeItem("reloaded_for");
      }
    }

    // Update last_pathname supaya selalu nyimpen page terakhir
    sessionStorage.setItem("last_pathname", current);
  }, [pathname]);

  // Update posisi indikator nav
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

  // Blur: kunci scroll body ketika mobile menu buka
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const availableLanguages = allLanguages.filter((l) => l !== language);

  return (
    <header className={`header ${animate ? "show" : ""}`}>
      {/* Logo */}
      <div className="logo">
        <img src="./hd.webp" alt="Aida Creative Logo" className="logo-img" />
      </div>

      {/* NAVBAR DESKTOP */}
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

          {/* Language Dropdown (desktop) */}
          <li className="nav-item lang">
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                type="button"
                className="lang-btn"
                onClick={() => setLangOpen((prev) => !prev)}
              >
                <img src={getFlag(language)} alt="flag" className="flag" />
                <span className="lang-text">{language}</span>
                <span
                  className="arrow"
                  style={{
                    transform: langOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                >
                  ▾
                </span>
              </button>

              {langOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    marginTop: "8px",
                    background: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    padding: "6px 0",
                    minWidth: "100px",
                    zIndex: 9999,
                  }}
                >
                  {availableLanguages.map((lang) => (
                    <div
                      key={lang}
                      onClick={() => handleSelectLanguage(lang)}
                      style={{
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontFamily: "Poppins, sans-serif",
                        color: "#333",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f0f0f0")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <img
                        src={getFlag(lang)}
                        alt={`${lang} flag`}
                        style={{
                          width: "20px",
                          height: "14px",
                          borderRadius: "2px",
                        }}
                      />
                      <span>{lang}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </li>

          {/* indikator putih */}
          <span
            className="nav-indicator"
            style={{
              transform: `translateX(${indicator.x}px)`,
              width: `${indicator.width}px`,
            }}
          ></span>
        </ul>
      </nav>

      {/* HAMBURGER BUTTON (muncul di mobile via CSS) */}
      <button
        type="button"
        className="hamburger-btn"
        aria-label="Toggle navigation menu"
        onClick={() => {
          setMenuOpen((prev) => !prev);
          setLangOpen(false);
        }}
      >
        <span className={`hamburger-line ${menuOpen ? "active" : ""}`} />
        <span className={`hamburger-line ${menuOpen ? "active" : ""}`} />
        <span className={`hamburger-line ${menuOpen ? "active" : ""}`} />
        <div className="hamburger-glass" />
      </button>

      {/* MOBILE MENU + OVERLAY */}

      {/* overlay yang nge-blur page, selalu ada tapi cuma kelihatan kalau menuOpen */}
      <div
        className={`mobile-menu-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* panel mobile menu: selalu di-render, geser off-screen kalau belum open */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <ul className="mobile-nav-list">
          {navItems.map((item) => (
            <li
              key={item.label}
              className={`mobile-nav-item ${
                active === item.label ? "active" : ""
              }`}
              onClick={() => handleNavigation(item.path, item.label)}
            >
              {t.nav[item.label as keyof typeof t.nav]}
            </li>
          ))}
        </ul>

        <div className="mobile-lang-container">
          {allLanguages.map((lang) => (
            <button
              key={lang}
              type="button"
              className={`mobile-lang-btn ${
                language === lang ? "active" : ""
              }`}
              onClick={() => handleSelectLanguage(lang)}
            >
              <img src={getFlag(lang)} alt={`${lang} flag`} />
              <span>{lang}</span>
            </button>
          ))}
        </div>

        {/* 🔹 TEMPAT LOGIN MOBILE: AuthButton.tsx akan inject tombol login / menu user di sini */}
        <div id="mobile-auth-placeholder" />
      </div>
    </header>
  );
}
