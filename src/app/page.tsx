import Navbar from "./components/Navbar";
import Admin from "./CreateNewPopup";
import Hero from "./components/Hero";
import About from "./components/About";
import Footer from "./components/Footer";
import "./globals.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <img src="/aida-star.webp" alt="left decoration" className="star-left" />
      <img src="/aida-star.webp" alt="background decoration" className="star-bg-right" />

      <About />
      <Footer />
    </>
  );
}
