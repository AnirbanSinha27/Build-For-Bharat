"use client";

import React, { useEffect, useRef } from "react";
import { Activity, BarChart3, TrendingUp, Users, MapPin, Home, Briefcase, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const formatNumber = (num: number): string => {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `${(num / 100000).toFixed(2)} L`;
  }
  return num.toLocaleString('en-IN');
};

const StateHighlight: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();

  const handleExplore = () => {
    router.push("/dashboard");
  };

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (card) {
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, index * 100);
      }
    });
  }, []);

  const stats = [
    {
      icon: <Users className="w-8 h-8 text-emerald-400" />,
      label: "Population",
      value: "3.12 Cr",
      subtext: "(2011 Census)",
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-blue-400" />,
      label: "Literacy Rate",
      value: "73.18%",
      subtext: "Male: 78.81% | Female: 67.27%",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-yellow-400" />,
      label: "State GDP",
      value: "₹4.3 Lakh Cr",
      subtext: "(2023-24 est.)",
    },
    {
      icon: <Activity className="w-8 h-8 text-purple-400" />,
      label: "GDP Growth",
      value: "8.2%",
      subtext: "Annual growth rate",
    },
    {
      icon: <MapPin className="w-8 h-8 text-red-400" />,
      label: "Area",
      value: "78,438 km²",
      subtext: "33 Districts",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-pink-400" />,
      label: "Per Capita Income",
      value: "₹1.15 Lakh",
      subtext: "(2022-23)",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 px-6 md:px-16 bg-black text-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
          Explore <span className="text-cyan-500">Assam's</span> MGNREGA Performance
          </h2>
          <p className="text-gray-400 text-lg">This dashboard helps you visualize key insights from Assam’s districts in the MGNREGA program showing how employment, wages, and works have evolved over time in an easy-to-understand format.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="rounded-xl p-6 hover:border-gray-700 hover:shadow-xl  transition-all duration-300 cursor-pointer group"
              style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.5s ease-out' }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-gray-800 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">
                    {item.label}
                  </h3>
                  <p className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {item.value}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.subtext}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-gray-900 border border-gray-800 rounded-sm">
          <h3 className="text-xl font-bold text-cyan-500 mb-4 text-center">About Assam</h3>
          <p className="text-gray-400 leading-relaxed">
            Assam is a state in northeastern India known for its rich biodiversity, tea industry, and cultural heritage. 
            It is the largest producer of tea in India and home to the one-horned rhinoceros in Kaziranga National Park. 
            The state's economy is primarily driven by agriculture, petroleum, and tourism sectors. Assamese and Bodo are 
            the official languages, with Dispur serving as the capital city.
          </p>
        </div>
      </div>
      <Button
  onClick={handleExplore}
  className="mt-10 mx-auto px-5 py-6 text-lg font-semibold text-white rounded-xl 
             bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 
             hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800
             shadow-md hover:shadow-lg cursor-pointer hover:scale-[1.03] transition-all duration-300 w-fit flex items-center justify-center"
>
  Go to Dashboard
</Button>
    </section>
  );
};

export default StateHighlight;