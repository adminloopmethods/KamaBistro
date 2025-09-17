'use client';

import React, { useEffect, useState } from "react";
import { Menu, X, Calendar, Users, BookOpen, ShoppingCart, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/favicon.png";
import CustomSelect from "./Select";
import { useParams, useRouter } from "next/navigation";

// Top header nav
const topNavLinks = [
  { label: "Our Group", href: "/our-group" },
  { label: "Culture", href: "/our-culture" },
  { label: "Private Events", href: "/private-events" },
  { label: "Catering", href: "/catering" },
  { label: "Contact", href: "/contact-us" },
  { label: "Gift Cards", href: "https://www.toasttab.com/kama-bistro/giftcards", external: true },
];

// Bottom header nav (reordered & no homepage)
const bottomNavLinks = [
  { label: "Reserve", href: "/reserve-table" },
  { label: "Catering", href: "/caterings" },
  { label: "Menu", href: "/menu" },
  { label: "Order Online", href: "/order-online" },
  { label: "Private Events", href: "/private-events" },
];

const address: Record<string, string> = {
  "wicker-park": "1560 N. Milwaykee Ave., Chicago, IL",
  "la-grange": "9 South La Grange Road, La Grange, IL",
  "west-loop": "812 W Randolph St, Chicago, IL",
};

const HeaderTwo: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const [topMenuOpen, setTopMenuOpen] = useState(false);
  const [location, setLocation] = useState<string>("");

  const [navLinks, setNavLinks] = useState(
    bottomNavLinks.map((e) => ({
      ...e,
      href: `/${params.slug ? params.slug[0] : ""}${e.href}`,
    }))
  );

  useEffect(() => {
    setLocation(localStorage.getItem("location") || "");
  }, []);

  useEffect(() => {
    setNavLinks(
      bottomNavLinks.map((e) => ({
        ...e,
        href: `/${params.slug ? params.slug[0] : ""}${e.href}`,
      }))
    );
  }, [params.slug]);

  // Helper to get icon for mobile bottom nav
  const getIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "reserve":
        return <Calendar size={20} />;
      case "catering":
        return <Coffee size={20} />;
      case "menu":
        return <BookOpen size={20} />;
      case "order online":
        return <ShoppingCart size={20} />;
      case "private events":
        return <Users size={20} />;
      default:
        return <Menu size={20} />;
    }
  };

  return (
    <header className="w-full fixed z-50">
      {/* ===== Top Header ===== */}
      <div className="flex justify-between items-center bg-gradient-to-r from-[#AE9060] to-[#483C28] text-white px-4 lg:px-10 py-2">
        <Link href="/" aria-label="Go to Home">
          <Image
            src={logo}
            alt="Company Logo"
            className="h-12 w-auto sm:h-10 xs:h-4"
          />
        </Link>

        {/* Desktop top nav */}
        <div className="hidden lg:flex items-center space-x-6">
          {topNavLinks.map((link) => (
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-gray-300 transition"
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        {/* Mobile: menu toggle */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            className="p-2 rounded-lg hover:bg-gray-200"
            onClick={() => setTopMenuOpen(!topMenuOpen)}
          >
            {topMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Top mobile dropdown */}
      <AnimatePresence>
        {topMenuOpen && (
          <motion.nav
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="lg:hidden bg-white shadow-md overflow-hidden"
          >
            <div className="flex flex-col space-y-4 px-4 py-4">
              {topNavLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-black transition"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-gray-700 hover:text-black transition"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ===== Desktop Bottom Header ===== */}
      <div className="hidden lg:flex justify-between items-center bg-black text-white px-10 py-2">
        {/* Desktop location */}
        <CustomSelect
          options={[
            { value: "wicker-park", label: "Wicker Park" },
            { value: "la-grange", label: "La Grange" },
            { value: "west-loop", label: "West Loop" },
          ]}
          onChange={(value) => {
            localStorage.setItem("location", value);
            setLocation(value);
            router.push(value);
          }}
          firstOption="Select Location"
          Default={location || ""}
          addStyleClass="flex-row"
          styleClasses="bg-transparent text-white flex justify-between gap-2 items-center min-w-[200px]"
          listItemClass="text-black hover:bg-blue-100 rounded-lg"
          selectedDisplayClass="text-white font-semibold text-lg"
        />

        <div className="flex items-center space-x-6">
          {navLinks.map((link) => (
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
      </div>

      {/* ===== Mobile Bottom Fixed Nav ===== */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-black border-t border-gray-700 z-50">
        <div className="flex justify-between items-center px-4 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex flex-col items-center text-white text-xs hover:text-[#AE9060] transition"
            >
              {getIcon(link.label)}
              <span className="mt-1">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default HeaderTwo;
