"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import "../globals.css";

export default function KopiJotos() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const items = root.querySelectorAll(".fade-in");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="kopi-section">
      <div className="kopi-grid">
        {/* kiri atas */}
        <div className="kopi-img tall fade-in">
          <Image src="/gambar1.jpg" alt="Kopi 1" fill className="obj-cover" />
        </div>

        {/* tengah atas */}
        <div className="kopi-img wide fade-in">
          <Image src="/gambar2.jpg" alt="Kopi 2" fill className="obj-cover" />
        </div>

        {/* kanan atas */}
        <div className="kopi-img tall fade-in">
          <Image src="/gambar3.jpg" alt="Kopi 3" fill className="obj-cover" />
        </div>

        {/* tengah bawah (benar-benar di tengah) */}
        <div className="kopi-img bottom-center fade-in">
          <Image src="/gambar4.jpg" alt="Kopi 4" fill className="obj-cover" />
        </div>
      </div>

      <div className="kopi-text fade-in">
        <div className="kopi-left">
          <h2>KOPI JOTOS</h2>
          <p>Instagram Feed & Story Design</p>
        </div>
        <div className="kopi-right">
          <p className="kopi-desc">
           Kopi Jotos is a local café and eatery based in Banyuwangi, offering a range of coffee drinks and light bites in a cozy and welcoming environment.
            Known for its approachable concept and friendly vibe, the café attracts both young people and families as a place to relax, connect, or simply enjoy a daily cup of coffee.
          </p>
        </div>
      </div>
    </section>
  );
}
