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
    const display = style?.display || "inline-block";

    // Remove &nbsp; and <br> (case-insensitive)
    const cleanContent = element.content
        ? element.content.replace(/(&nbsp;|<br\s*\/?>)/gi, "").trim()
        : "";

    if (isExternal) {
        return (
            <a
                href={element.href}
                aria-label={element.aria || ""}
                title={element.aria}
                id={element.id}
                style={{ ...style, position: "relative", zIndex: 2, display }}
                target="_blank"
                rel="noopener noreferrer"
            >
                {cleanContent}
            </a>
        );
    }

    return (
        <Link
            href={element.href || "#"}
            aria-label={element.aria || ""}
            id={element.id}
            style={{ ...style, position: "relative", zIndex: 2, display }}
        >
            {cleanContent}
        </Link>
    );
};

export default LinkComponent;
