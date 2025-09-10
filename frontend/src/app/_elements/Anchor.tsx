'use client';

import React from "react";
import Link from "next/link";
import { BaseElement } from "@/functionalities/createElement";

type LinkProps = {
    element: BaseElement;
    style?: React.CSSProperties;
};

const LinkComponent: React.FC<LinkProps> = ({ element, style }) => {
    const isExternal = element.href?.startsWith("http");

    if (isExternal) {
        return (
            <a
                href={element.href}
                aria-label={element.aria || ""}
                title={element.aria}
                id={element.id}
                style={{ ...style, position: "relative", zIndex:"2" }}
                target="_blank"
                rel="noopener noreferrer"
            >
                {element.content || "Link Text"}
            </a>
        );
    }

    return (
        <Link
            href={element.href || "#"}
            aria-label={element.aria || ""}
            id={element.id}
            style={{ ...style, position: "relative", zIndex:"2" }}
        >
            {element.content || "Link Text"}
        </Link>
    );
};

export default LinkComponent;
