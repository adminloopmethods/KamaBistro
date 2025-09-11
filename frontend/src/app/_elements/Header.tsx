'use client';

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/favicon.png";

// Example nav links
const navLinksLeft = [
  { label: "Our Group", href: "/our-group" },
  { label: "Culture", href: "/our-culture" },
  { label: "Private Events", href: "/private-events" },
];

const navLinksRight = [
  { label: "Catering", href: "/catering" },
  { label: "Contact", href: "/contact-us" },
  // { label: "Career", href: "/career" },
];

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed lg:top-2 left-0 w-full bg-transparent z-[50] lg:p-2 lg:px-10">
      <div className="lg:container lg:mx-auto w-full flex bg-black items-center justify-between px-4 lg:rounded-xl">

        {/* Mobile & Tablet Layout */}
        <div className="flex items-center justify-between w-full lg:hidden">
          <a href="/" aria-label="Go to Home">
            <img src={logo.src} alt="Company Logo" className="h-10 w-auto" />
          </a>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 text-white"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Layout (from 1024px up) */}
        <nav
          className="hidden lg:flex gap-[40px] text-[17px] items-center justify-center space-x-6 w-full relative"
          aria-label="Main navigation"
        >
          {/* Left links */}
          {navLinksLeft.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-50 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}

          {/* Logo in center */}
          <a href="/" aria-label="Go to Home">
            <img src={logo.src} alt="Company Logo" width={173} className=" w-auto mx-4 aspect-[2.5/1]" />
          </a>

          {/* Right links */}
          {navLinksRight.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-50 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}

          {/* CTA Button */}
          <a
            href="https://www.toasttab.com/kama-bistro/giftcards"
            className="ml-4 px-5 py-3 bg-[#AE9060] text-white hover:bg-gray-800 transition xl:block"
          >
            Gift Cards
          </a>
        </nav>
      </div>

      {/* Mobile & Tablet Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="lg:hidden bg-white shadow-md overflow-hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-4 px-4 py-4">
              {[...navLinksLeft, ...navLinksRight].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-700 hover:text-black transition-colors"
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
      </AnimatePresence>
    </header>
  );
};

export default Header;
