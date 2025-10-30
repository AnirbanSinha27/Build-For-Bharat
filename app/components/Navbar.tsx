"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, BarChart3, Home, Database } from "lucide-react";

const Navbar: React.FC = () => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current.querySelectorAll(".nav-item"),
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
        }
      );
    }
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 bg-linar-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md backdrop-blur-md border-b border-blue-500/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <Link href="/" className="nav-item flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="MGNREGA Logo"
                  className="w-10 h-10 rounded-full border-2 border-white/50 group-hover:border-white transition-all duration-300"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-linear-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent group-hover:opacity-90 transition">
                  MGNREGA Assam
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`nav-item px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                    isActive(link.path)
                      ? "bg-white/10 text-cyan-500"
                      : "text-gray-100 hover:text-cyan-500 hover:bg-white/10"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}

              <a
                href="https://data.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-item ml-2 px-4 py-2 rounded-lg flex items-center gap-2 text-gray-100 hover:text-purple-600 hover:bg-white/10 transition-all duration-300"
              >
                <Database className="w-4 h-4" />
                <span className="font-medium">Data Source</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nav-item md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden pt-16">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative bg-white text-gray-900 border-b border-gray-300 shadow-xl animate-slide-down">
            <div className="px-4 py-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(link.path)
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}

              <a
                href="https://data.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                <Database className="w-5 h-5 text-blue-700" />
                <span className="font-medium text-blue-700">Data Source</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
