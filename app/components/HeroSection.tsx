"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const voiceButtonRef = useRef<HTMLButtonElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Simple fade-in animation using CSS transitions
    const elements = [
      headingRef.current,
      subheadingRef.current,
      descriptionRef.current,
      statsRef.current,
      detailsRef.current,
      voiceButtonRef.current
    ];

    elements.forEach((el, index) => {
      if (el) {
        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, index * 150);
      }
    });
  }, []);

  const speakInHindi = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const text = `महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम, जिसे संक्षेप में मनरेगा कहा जाता है, भारत सरकार की एक प्रमुख योजना है। यह योजना ग्रामीण क्षेत्रों में रहने वाले परिवारों को हर साल कम से कम सौ दिन का गारंटीकृत रोजगार प्रदान करती है। इस योजना का मुख्य उद्देश्य ग्रामीण क्षेत्रों में रोजगार सुरक्षा बढ़ाना, गरीबी कम करना, और बुनियादी ढांचे का विकास करना है। मनरेगा के तहत मजदूरी सीधे बैंक खाते में जमा की जाती है, जिससे पारदर्शिता सुनिश्चित होती है। यह योजना दो हजार पांच में शुरू की गई थी और यह दुनिया के सबसे बड़े रोजगार कार्यक्रमों में से एक है।`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col text-center items-center justify-center min-h-screen px-6 md:px-16 lg:px-24 py-22 overflow-hidden"
      style={{ backgroundColor: '#fffff' }}
    >

      {/* Main Content */}
      <div className="z-10 max-w-6xl w-full space-y-6">
        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none transition-all duration-700 ease-out"
          style={{ opacity: 0, transform: 'translateY(30px)' }}
        >
          MGNREGA
        </h1>

        {/* Subheading */}
        <h2
          ref={subheadingRef}
          className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-300 tracking-wide transition-all duration-700 ease-out"
          style={{ opacity: 0, transform: 'translateY(30px)' }}
        >
          Mahatma Gandhi National Rural Employment Guarantee Act
        </h2>

        {/* Description */}
        <p
          ref={descriptionRef}
          className="text-base md:text-lg lg:text-xl mx-auto text-gray-400 leading-relaxed max-w-4xl transition-all duration-700 ease-out"
          style={{ opacity: 0, transform: 'translateY(30px)' }}
        >
          A landmark social security initiative that guarantees 100 days of wage employment 
          per year to rural households whose adult members volunteer to do unskilled manual work.
        </p>

        {/* Key Stats - Single Line */}
        <div
          ref={statsRef}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12 py-6 transition-all duration-700 ease-out"
          style={{ opacity: 0, transform: 'translateY(30px)' }}
        >
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-black text-white">100</span>
            <span className="text-sm md:text-base text-gray-400">Days Guaranteed</span>
          </div>
          <div className="w-px h-12 bg-gray-700"></div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-black text-white">2005</span>
            <span className="text-sm md:text-base text-gray-400">Year Enacted</span>
          </div>
          <div className="w-px h-12 bg-gray-700"></div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-black text-white">#1</span>
            <span className="text-sm md:text-base text-gray-400">World's Largest Program</span>
          </div>
        </div>

        {/* Two Column Layout for Details */}
        <div
          ref={detailsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 transition-all duration-700 ease-out text-left"
          style={{ opacity: 0, transform: 'translateY(30px)' }}
        >
          {/* Key Objectives */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white border-l-4 border-white/60 pl-4">Key Objectives</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start">
                <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0"></span>
                <span>Enhance livelihood security in rural areas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0"></span>
                <span>Create durable assets and rural infrastructure</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0"></span>
                <span>Ensure transparent wage payment to bank accounts</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0"></span>
                <span>Empower women with 33% workforce participation</span>
              </li>
            </ul>
          </div>

          {/* Impact Areas */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white border-l-4 border-white/60 pl-4">Impact Areas</h3>
            <div className="flex flex-wrap gap-2 justify-start">
              {['Water Conservation', 'Rural Connectivity', 'Land Development', 'Drought Proofing', 'Irrigation', 'Afforestation'].map((area, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-gray-300 font-medium text-xs"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Voice Button */}
        <div className="pt-4">
          <button
            ref={voiceButtonRef}
            onClick={speakInHindi}
            className="flex cursor-pointer justify-center items-center gap-3 px-6 py-3 bg-white text-[#262624] rounded-full font-bold text-base hover:bg-gray-200  transform hover:scale-105 shadow-xl transition-all duration-700 ease-out"
            style={{ opacity: 0, transform: 'translateY(30px)' }}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-5 h-5" />
                <span>रोकें</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                <span>हिंदी में सुनें</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;