"use client";

import { useState, useRef, useEffect, JSX } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
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
    router.push(path);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langOpen && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        handleCloseDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langOpen]);

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

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      setActive("home");
    } else if (pathname === "/portofolio") {
      setActive("portofolio");
    } else if (pathname === "/shop") {
      setActive("shop");
    }
  }, [pathname]);

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
  }, [active]);

  return (
    <header className={`header ${animate ? "show" : ""}`}>
      <div className="logo">
        <img src="./hd.webp" alt="Aida Creative Logo" className="logo-img" />
      </div>
      <nav className="nav-container">
        <ul className="nav-list" ref={navRef}>
          {navItems.map((item) => (
            <li
              key={item.label}
              className={`nav-item ${active === item.label ? "active" : ""}`}
              onClick={() => handleNavigation(item.path, item.label)}
            >
              <Link href={item.path}>
                {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
              </Link>
            </li>
          ))}

          <li className="nav-item lang" ref={buttonRef as any}>
            <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
              <img src={getFlag(language)} alt="flag" className="flag" />
              <span className="lang-text">{language}</span>
              <span className="arrow">▾</span>
            </button>
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