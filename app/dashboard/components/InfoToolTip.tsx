"use client";

import React, { useRef, useEffect } from "react";
import { Info } from "lucide-react";
import gsap from "gsap";

interface InfoTooltipProps {
  content: string; // explanation or metric description
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Optional GSAP fade-in animation for the tooltip
  useEffect(() => {
    if (tooltipRef.current) {
      gsap.set(tooltipRef.current, { opacity: 0, y: 5 });
    }
  }, []);

  const handleMouseEnter = () => {
    if (tooltipRef.current) {
      gsap.to(tooltipRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (tooltipRef.current) {
      gsap.to(tooltipRef.current, {
        opacity: 0,
        y: 5,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <Info className="w-4 h-4" />
      </button>

      <div
        ref={tooltipRef}
        className="absolute right-7 top-0 z-10 w-64 p-2 rounded-lg bg-gray-800 text-white text-sm shadow-lg"
        style={{ pointerEvents: "none" }}
      >
        {content}
      </div>
    </div>
  );
};

export default InfoTooltip;
