"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const LoadingState: React.FC = () => {
  const dotsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (dotsRef.current.length) {
      gsap.to(dotsRef.current, {
        y: -6,
        stagger: 0.15,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) dotsRef.current[i] = el;
            }}
            className="w-3 h-3 rounded-full bg-blue-600"
          ></div>
        ))}
      </div>
      <p className="text-gray-600 text-sm font-medium tracking-wide">
        Loading district data...
      </p>
    </div>
  );
};

export default LoadingState;
