import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Footer from "./components/Footer";
import "./globals.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <img src="/aida-star" alt="" className="star-bg" />
      <img src="/aida-star.png" alt="left decoration" className="star-left" />
      <img src="/aida-star.png" alt="background decoration" className="star-bg-right" />

      <About />
      <Footer />
    </>
  );
}
