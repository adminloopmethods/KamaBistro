"use client";

import { useRef } from "react";
import Image from "next/image";
import { login } from "../../../assets/index";

const BackroundImage = () => {
    const bgRef = useRef<HTMLDivElement | null>(null);

    return (
        <div
            className="w-full h-full xl:max-w-6xl l-bg lg:flex-5 bg-repeat-none bg-center bg-cover p-10"
            ref={bgRef}
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.43)), url(${login.restaurant})`,
            }}
        >
            {/* Logo with spotlight gradient */}
            <div className="relative w-fit h-fit">
                <div
                    className="absolute rounded-full blur-2xl opacity-50 z-[1]"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(255, 255, 255, 0.55), transparent 70%)",
                        width: "400px",
                        height: "100px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                />

                {/* Optimized Next.js Image */}
                <Image
                    src={login.logo}
                    alt="Logo"
                    width={200}
                    height={80}
                    className="relative z-10"
                    priority // ensures it loads fast
                />
            </div>
        </div>
    );
};

export default BackroundImage;
