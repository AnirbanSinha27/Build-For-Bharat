"use client";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import StateHighlight from "./components/StateHighlight";
import Footer from "@/app/dashboard/components/Footer";

export default function Home() {

  return (
    <main className="min-h-screen flex flex-col bg-slate-950 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with GSAP animation */}
      <HeroSection />

      <StateHighlight/>
      {/* Footer */}
      <Footer />
    </main>
  );
}
