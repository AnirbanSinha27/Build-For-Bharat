"use client";

import React from "react";
import { Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-10 py-6 border-t border-gray-200 text-center text-sm text-gray-600 bg-white">
      <p className="flex justify-center items-center gap-1">
        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for
        India’s Rural Citizens
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Data Source: <a href="https://data.gov.in" className="underline">data.gov.in</a> | Prototype for Assam
      </p>
    </footer>
  );
};

export default Footer;
