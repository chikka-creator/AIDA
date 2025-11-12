import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Footer from "./components/Footer";
import AuthButton from "./components/AuthButton"; // New unified component
import "./globals.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <AuthButton /> {/* Shows Login OR User Menu based on session */}
      <Hero />
      <img src="/aida-star.webp" alt="left decoration" className="star-left" />
      <img src="/aida-star.webp" alt="background decoration" className="star-bg-right" />
      <About />
      <Footer />
    </>
  );
}