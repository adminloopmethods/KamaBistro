'use client';

import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/favicon.png";
import CustomSelect from "./Select";
import { useRouter } from "next/navigation";

// Top header nav
const topNavLinks = [
  { label: "Our Group", href: "/our-group" },
  { label: "Culture", href: "/our-culture" },
  { label: "Private Events", href: "/private-dinning" },
  { label: "Catering", href: "/catering" },
  { label: "Contact", href: "/contact" },
  // { label: "Career", href: "/career" },
];

// Bottom header nav
const bottomNavLinks = [
  { label: "Homepage", href: "/landing" },
  { label: "Menu", href: "/landing/menu" },
  { label: "Reserve", href: "/landing/reservetable" },
  { label: "Order Online", href: "/landing/order-online" },
  { label: "Private Events", href: "/landing/privatedinning" },
  { label: "Catering", href: "/landing/caterings" },
];

const address: Record<string, string> = {
  "location1": "9 South La, Grange Road, IL",
  "location2": "9 South La, Grange Road, GL",
  "location3": "9 South La, Grange Road, OL",
}

const HeaderTwo: React.FC = () => {
  const [topMenuOpen, setTopMenuOpen] = useState(false);
  const [bottomMenuOpen, setBottomMenuOpen] = useState(false);
  const [location, setLocation] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    setLocation(localStorage.getItem("location") || "")
  }, [])

  return (
    <header className="w-full fixed z-50">
      {/* ===== Top Header ===== */}
      <div className="hidden lg:flex justify-between items-center bg-gradient-to-r from-[#AE9060] to-[#483C28] text-white px-10 py-2">
        {/* Logo */}
        <Link href="/" aria-label="Go to Home">
          <Image src={logo} alt="Company Logo" className="h-12 w-auto" />
        </Link>

        {/* Nav links */}
        <nav className="flex items-center space-x-6">
          {topNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-gray-300 transition"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/https://www.toasttab.com/kama-bistro/giftcards"
            className="hover:text-gray-300 transition"
          >
            Gift Cards
          </a>
        </nav>
      </div>

      {/* ===== Bottom Header ===== */}
      <div className="flex lg:flex-row justify-between items-center bg-black text-white px-4 lg:px-10 py-2">
        {/* Left: Location selector */}
        <div className="flex flex-col items-center space-x-2 w-full lg:w-auto mb-2 lg:mb-0">

          <CustomSelect options={[
            { value: "location1", label: "Wicker Park" },
            { value: "location2", label: "location2" },
            { value: "location3", label: "location3" },
          ]}
            onChange={(value) => {
              localStorage.setItem("location", value)
              setLocation(value)
              router.push(value)
            }}
            firstOption="Select Location"
            Default={location || ""}
            // baseClasses="flex"
            addStyleClass="flex-row"
            styleClasses="bg-transparent text-white flex justify-between gap-2 items-center border border-stone-300/30 min-w-[200px]"
            listItemClass="text-black hover:bg-blue-100 rounded-lg"
            selectedDisplayClass="text-white font-semibold text-lg"
          />
          <span className="text-white">{address[location]}</span>
        </div>

        {/* Right: Nav links */}
        <div className="hidden lg:flex items-center space-x-6">
          {bottomNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-[#AE9060] hover:underline underline-offset-4 transition"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book-now"
            className="ml-4 px-4 py-2 bg-[#AE9060] text-white hover:bg-gray-800 transition"
          >
            Book Now
          </Link>
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
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-700 hover:text-black transition"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book-now"
                className="w-full px-4 py-2 rounded-2xl bg-black text-white hover:bg-gray-800 transition text-center"
              >
                Book Now
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default HeaderTwo;
