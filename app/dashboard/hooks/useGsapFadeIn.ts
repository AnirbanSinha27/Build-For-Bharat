// app/dashboard/hooks/useGsapFadeIn.ts
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface UseGsapFadeInOptions {
  delay?: number;
  duration?: number;
  yDistance?: number;
}

/**
 * Adds a fade-in + slide-up GSAP animation to any element.
 * @param options - animation options
 */
export const useGsapFadeIn = (options: UseGsapFadeInOptions = {}) => {
  const { delay = 0, duration = 0.8, yDistance = 30 } = options;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: yDistance },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
        }
      );
    });

    return () => ctx.revert(); // Clean up GSAP context
  }, [delay, duration, yDistance]);

  return ref;
};
