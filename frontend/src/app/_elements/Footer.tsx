import React from "react";
import { IoLogoInstagram } from "react-icons/io";
import { TiSocialFacebook } from "react-icons/ti";
import { FaTiktok, FaMapMarkerAlt } from "react-icons/fa";

import footerBackground from "@/assets/footer-background.jpg";
import footerTexture from "@/assets/footer-texture.svg";
import logoIcon from "@/assets/footerlogo.svg";

export default function Footer() {
    return (
        <footer className="relative w-full text-white overflow-hidden">
            {/* Background image */}
            <img
                src={footerBackground.src}
                alt="footer background"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.4),rgba(0,0,0,0.9))]"></div>

            {/* SVG texture overlay */}
            <div
                className="absolute hidden lg:block inset-0 opacity-[0.09] bg-multiply"
                style={{ backgroundImage: `url(${footerTexture.src})` }}
                aria-hidden="true"
            />


            <div className="relative z-10 px-2 sm:px-10 md:px-24 py-10">
                {/* Mobile layout (shown at <md) */}
                <div className="block lg:hidden space-y-8 text-center">
                    {/* Logo and social */}
                    <div className="flex flex-col justify-start gap-4">
                        <div className="flex flex-row justify-between">
                            <img src={logoIcon.src} alt="logo" className="w-36 sm:w-44 h-auto" />
                            <div className="flex gap-4 text-xl mt-2">
                                {[IoLogoInstagram, TiSocialFacebook, FaTiktok].map((Icon, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        className="flex items-center justify-center bg-[rgba(174,144,96,0.5)] h-9 w-9 rounded-full hover:bg-[rgba(174,144,96,0.7)] transition-colors"
                                    >
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <p className="text-xs font-light text-left">708)352-3300 | Kama@Kamabistro.com</p>

                        {/* Hours Section */}
                        <div className="flex flex-row items-center justify-between">
                            <div>
                                <h3 className="text-xs font-medium mb-2 text-left">Hours</h3>
                                <ul className="space-y-1 text-sm text-left">
                                    <li className="text-xs font-light">Mon: <span className="text-xs font-normal">Closed</span></li>
                                    <li className="text-xs font-light">Tue–Thu: <span className="text-xs font-normal">5pm – 9pm</span></li>
                                    <li className="text-xs font-light">Fri: <span className="text-xs font-normal">5pm – 10pm</span></li>
                                    <li className="text-xs font-light">Sat: <span className="text-xs font-normal">12pm – 10pm</span></li>
                                    <li className="text-xs font-light">Sun: <span className="text-xs font-normal">12pm – 9pm</span></li>
                                </ul>
                            </div>
                            <div className="space-y-3 text-sm text-left">
                                <p className="text-xs font-normal">
                                    <span className="text-xs font-light mb-2">Happy Hours:</span> <br />Mon–Fri: 5pm – 9pm
                                </p>
                                <p className="text-xs font-normal">
                                    <span className="text-xs font-light mb-2">Brunch Hours:</span> <br />Sat–Sun: 12pm – 3pm
                                </p>
                                <p className="text-xs font-normal">
                                    <span className="text-xs font-light mb-2">Business Hours:</span> <br />Mon–Fri: 4pm – 12am
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-white/40" />

                        <div className="flex text-xs font-light space-y-2">
                            <p>
                                <a href="#">Press</a> | <a href="#">Careers</a> | <a href="#">Privacy Policy</a>
                            </p>
                            <p>
                                | <a href="#">Terms Of Use</a> | <a href="#">Accessibility</a>
                            </p>
                        </div>

                        <div className="border-t border-white/40" />

                        <div className="flex flex-col items-start justify-start">
                            <h3 className="text-xs font-normal mb-3">Other Locations</h3>
                            <ul className="space-y-3 text-sm">
                                {[1, 2].map((loc) => (
                                    <li key={loc} className="flex items-center justify-center gap-2">
                                        <FaMapMarkerAlt className="shrink-0" />
                                        <span className="underline text-xs font-light">
                                            9 South La Grange Road, La Grange
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="border-t border-white/40 my-6" />

                        <p className="text-xs font-light text-gray-400">
                            © 2025 Kama Bistro – La Grange & Wicker Park. All Rights Reserved.
                        </p>
                    </div>
                </div>

                {/* Desktop layout (shown at md and above) */}
                <div className="hidden lg:block">
                    <div className="flex justify-between gap-6">
                        {/* Left: Logo + Links + Social */}
                        <div className="flex flex-col gap-4">
                            <img src={logoIcon.src} alt="logo" className="w-52 h-auto" />
                            <div className="text-base font-normal text-gray-300">
                                <p className="mt-2">
                                    <a href="#">Gift Cards</a> | <a href="#">Catering</a> | <a href="#">Private Dining</a>
                                </p>
                                <p className="mt-2">
                                    <a href="#">Privacy Policy</a> | <a href="#">Terms of Use</a> | <a href="#">Accessibility</a>
                                </p>
                            </div>
                            <div className="flex gap-3 text-xl">
                                {[IoLogoInstagram, TiSocialFacebook, FaTiktok].map((Icon, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        className="flex items-center justify-center bg-[rgba(174,144,96,0.5)] h-10 w-10 rounded-full hover:bg-[rgba(174,144,96,0.7)] transition-colors"
                                    >
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Middle: Hours */}
                        <div className="flex gap-14">
                            <ul className="space-y-1 mt-28">
                                <li className="text-xl font-medium">Hours</li>
                                <li className="text-base font-normal">Mon: Closed</li>
                                <li className="text-base font-normal">Tue–Thu: 5pm – 9pm</li>
                                <li className="text-base font-normal">Fri: 5pm – 10pm</li>
                                <li className="text-base font-normal">Sat: 12pm – 10pm</li>
                                <li className="text-base font-normal">Sun: 12pm – 9pm</li>
                            </ul>
                            <ul className="space-y-2 mt-32">
                                <li className="text-base font-light">
                                    <span className="text-base font-normal">Happy Hours:</span> <br />Mon–Fri: 5pm – 9pm
                                </li>
                                <li className="text-base font-light">
                                    <span className="text-base font-normal">Brunch Hours:</span> <br />Sat–Sun: 12pm – 3pm
                                </li>
                                <li className="text-base font-light">
                                    <span className="text-base font-normal">Business Hours:</span> <br />Mon–Fri: 4pm – 12am
                                </li>
                            </ul>
                        </div>

                        {/* Right: Locations */}
                        <div>
                            <ul className="space-y-3 mt-28 ">
                                <li className="text-xl font-medium">Locations</li>
                                {[1, 2].map((loc) => (
                                    <li key={loc} className="flex items-start gap-2">
                                        <FaMapMarkerAlt className="mt-1 shrink-0" />
                                        <span className="underline text-base font-normal cursor-pointer">
                                            9 South La Grange Road, La <br /> Grange, IL 60525
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 border-t w-[100vw] -mx-[6rem] border-white/40" />

                    <div className="mt-6 text-right text-sm text-gray-400">
                        © 2025 Kama Bistro – La Grange & Wicker Park. All Rights Reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
