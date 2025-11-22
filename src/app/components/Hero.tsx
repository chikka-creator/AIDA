"use client";

import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import "../globals.css";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main className="home-container">
      {/* Background decorations */}
      <img src="/aida-star.webp" alt="" className="background" />
      <img src="/aida-star.webp" alt="" className="background2" />
      <img src="/aida-star.webp" alt="right decoration" className="star-right" />
      <img src="/aida-star.webp" alt="background decoration" className="star-bg-left" />
      
      {/* Title content */}
      <div className="text-content">
        <h1 className="title">AIDA</h1>
        <p className="subtitle">Creative</p>
      </div>
    </main>
  );
}