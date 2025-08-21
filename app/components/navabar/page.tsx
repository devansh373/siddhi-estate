"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileServices, setShowMobileServices] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const services = [
    {
      title: "Property Sales and Rentals",
      link: "/sale-rentals",
    },
    {
      title: "Brokerage Services",
      link: "/broker",
    },
    {
      title: "Loans & Legal",
      link: "/loans-legal",
    },
    {
      title: "Redevelopment & Commercial",
      link: "/redevelopment-commercial",
    },
  ];

  return (
    <>
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-2 bg-opacity-80 bg-gray-50 mt-8 max-w-5xl mx-auto rounded-lg shadow-sm">
        <div className="text-lg font-bold text-gray-900 tracking-tight">
          Siddhi Estates & Consultancy 
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center relative">
          <Link
            href="/"
            className="text-gray-900 font-medium hover:text-[#d6a243] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-900 font-medium hover:text-[#d6a243] transition-colors"
          >
            About
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            {/* Services Button */}
            <button className="text-gray-900 font-medium hover:text-[#d6a243] transition-colors">
              Services
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute left-0 mt-2 w-64 bg-white shadow-md rounded-md z-50">
                {services.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className="block px-4 py-2 text-gray-800 hover:bg-[#f9f1dd] hover:text-[#d6a243] transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/properties"
            className="text-gray-900 font-medium hover:text-[#d6a243] transition-colors"
          >
            Properties
          </Link>
        </div>

        <Link
          href="/#contact"
          className="px-4 py-1.5 bg-[#d6a243] text-white rounded-lg hover:bg-[#b48735] transition-colors font-semibold"
        >
          Contact Us
        </Link>

        {/* Hamburger Button */}
        <div className="flex md:hidden bg-[#d6a243] text-white rounded-lg p-2 ml-2">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span className="text-xl font-bold">
              {isMobileMenuOpen ? "✖" : "☰"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-0 w-full z-50 bg-gray-50 rounded-lg shadow-lg px-4 py-4">
          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              className="text-gray-900 font-medium hover:text-[#d6a243]"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-900 font-medium hover:text-[#d6a243]"
            >
              About
            </Link>

            {/* Mobile Services Dropdown Toggle */}
            <button
              onClick={() => setShowMobileServices(!showMobileServices)}
              className="text-gray-900 font-medium text-left hover:text-[#d6a243]"
            >
              {showMobileServices ? "▼" : "▶"} Services
            </button>
            {showMobileServices && (
              <div className="ml-4 flex flex-col space-y-2">
                {services.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className="text-gray-800 hover:text-[#d6a243]"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/properties"
              className="text-gray-900 font-medium hover:text-[#d6a243]"
            >
              Properties
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
