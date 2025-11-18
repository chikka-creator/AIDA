'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";

export default function PhotoSlideshow() {
  const photos = [
    "/gambar1.webp",
    "/fotovilla.webp",
    "/fotovilla2.webp",
    "/fotovilla3.webp",
    "/padel1.webp",
    "/padel2.webp"
  ];
  
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Mulai fade out
      setFadeOut(true);
      
      // Setelah 600ms, ganti foto dan fade in
      setTimeout(() => {
        setCurrentPhotoIndex((prevIndex) => 
          prevIndex === photos.length - 1 ? 0 : prevIndex + 1
        );
        setFadeOut(false);
      }, 600);
      
    }, 4000); // Ganti foto setiap 4 detik

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
        <div className="overlay">Photography</div>
      </div>
    </>
  );
}