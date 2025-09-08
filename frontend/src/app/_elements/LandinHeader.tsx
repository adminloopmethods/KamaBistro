'use client';

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/favicon.png";

// Top header nav
const topNavLinks = [
  { label: "Our Group", href: "/our-group" },
  { label: "Culture", href: "/culture" },
  { label: "Private Events", href: "/private-events" },
  { label: "Catering", href: "/catering" },
  { label: "Contact", href: "/contact" },
  { label: "Career", href: "/career" },
];

// Bottom header nav
const bottomNavLinks = [
  { label: "Homepage", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Reserve", href: "/reserve" },
  { label: "Order Online", href: "/order-online" },
  { label: "Private Events", href: "/private-events" },
  { label: "Catering", href: "/catering" },
];

const Header: React.FC = () => {
  const [topMenuOpen, setTopMenuOpen] = useState(false);
  const [bottomMenuOpen, setBottomMenuOpen] = useState(false);
  const [location, setLocation] = useState("Select Location");

  return (
    <header className="w-full fixed z-50">
      {/* ===== Top Header ===== */}
      <div className="hidden lg:flex justify-between items-center bg-black text-white px-10 py-3 rounded-b-xl">
        {/* Logo */}
        <a href="/" aria-label="Go to Home">
          <img src={logo.src} alt="Company Logo" className="h-12 w-auto" />
        </a>
        {/* Nav links */}
        <nav className="flex items-center space-x-6">
          {topNavLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-gray-300 transition"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/gift-cards"
            className="ml-4 px-4 py-2 bg-[#AE9060] text-white hover:bg-gray-800 transition"
          >
            Gift Cards
          </a>
        </nav>
      </div>

      {/* ===== Top Header Mobile ===== */}
      {/* <div className="lg:hidden flex justify-between items-center bg-black px-4 py-3">
        <a href="/" aria-label="Go to Home">
          <img src={logo.src} alt="Company Logo" className="h-10 w-auto" />
        </a>
        <button
          className="p-2 rounded-lg hover:bg-gray-100 text-white"
          aria-label={topMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setTopMenuOpen(!topMenuOpen)}
        >
          {topMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div> */}
      {/* <AnimatePresence>
        {topMenuOpen && (
          <motion.nav
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="lg:hidden bg-white shadow-md overflow-hidden"
          >
            <div className="flex flex-col space-y-4 px-4 py-4">
              {topNavLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-700 hover:text-black transition"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/gift-cards"
                className="w-full px-4 py-2 rounded-2xl bg-black text-white hover:bg-gray-800 transition text-center"
              >
                Gift Cards
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence> */}

      {/* ===== Bottom Header ===== */}
      <div className="flex flex-col lg:flex-row justify-between items-center bg-gray-100 px-4 lg:px-10 py-2">
        {/* Left: Location selector */}
        <div className="flex items-center space-x-2 w-full lg:w-auto mb-2 lg:mb-0">
          <span className="font-semibold">Location:</span>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-3 py-1 rounded border border-gray-300"
          >
            <option>Select Location</option>
            <option>New York</option>
            <option>Los Angeles</option>
            <option>Chicago</option>
            <option>San Francisco</option>
          </select>
        </div>

        {/* Right: Nav links */}
        <div className="hidden lg:flex items-center space-x-6">
          {bottomNavLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-gray-700 transition"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/book-now"
            className="ml-4 px-4 py-2 bg-[#AE9060] text-white hover:bg-gray-800 transition"
          >
            Book Now
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex justify-end w-full">
          <button
            className="p-2 rounded-lg hover:bg-gray-200"
            onClick={() => setBottomMenuOpen(!bottomMenuOpen)}
          >
            {bottomMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Bottom header mobile dropdown */}
      <AnimatePresence>
        {bottomMenuOpen && (
          <motion.nav
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="lg:hidden bg-white shadow-md overflow-hidden"
          >
            <div className="flex flex-col space-y-4 px-4 py-4">
              {bottomNavLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-700 hover:text-black transition"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/book-now"
                className="w-full px-4 py-2 rounded-2xl bg-black text-white hover:bg-gray-800 transition text-center"
              >
                Book Now
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
