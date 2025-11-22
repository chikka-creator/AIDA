'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";

export default function PhotoSlideshow() {
  const photos = [
    "/foto1.webp",
    "/foto2.webp",
    "/foto3.webp",
    "/foto4.webp",
    "/foto5.webp",
    "/foto6.webp",
    "/foto7.webp",
    "/foto8.webp",
    "/foto9.webp",
    "/foto10.webp",
    "/foto11.webp",
    "/foto12.webp",
    "/foto13.webp",
    "/foto14.webp",
    "/foto15.webp",
    "/foto16.webp",
    "/foto17.webp",
    "/foto18.webp",
    "/foto19.webp",
    "/foto20.webp",
    "/foto21.webp",
    "/foto22.webp",
    "/foto23.webp",
    "/foto24.webp",
    "/foto25.webp",
    "/foto26.webp",
    "/foto27.webp",
    "/foto28.webp",
    "/foto29.webp",
    "/foto30.webp",
    "/foto31.webp",
    "/foto32.webp",
    "/foto33.webp",
    "/foto34.webp",
    "/foto35.webp",
    "/foto36.webp",
    "/foto37.webp",
    "/foto38.webp",
    "/foto39.webp",
    "/foto40.webp",
    "/foto41.webp",
    "/foto42.webp",
    "/foto43.webp",
    "/foto44.webp",
    "/foto45.webp",
    "/foto46.webp"
  ];
  
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeOut(true);
      
      setTimeout(() => {
        setCurrentPhotoIndex((prevIndex) => 
          prevIndex === photos.length - 1 ? 0 : prevIndex + 1
        );
        setFadeOut(false);
      }, 600);
      
    }, 4000);

    return () => clearInterval(interval);
  }, [photos.length]);

  return (
    <>
      <style jsx global>{`
        .hero-box {
          position: relative;
          overflow: hidden;
        }
        
        .photo-slideshow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: all 0.8s ease-in-out;
          opacity: 1;
        }
        
        .photo-slideshow.fade-out {
          opacity: 0;
        }
      `}</style>
      
      <div className="hero-box">
        <div className={`photo-slideshow ${fadeOut ? 'fade-out' : ''}`}>
          <Image 
            src={photos[currentPhotoIndex]} 
            alt="Photography" 
            fill 
            className="img"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="overlay">{t.portofolio.photoGallery}</div>
      </div>
    </>
  );
}