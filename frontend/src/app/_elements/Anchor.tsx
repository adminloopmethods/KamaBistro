'use client';

import React from "react";
import Link from "next/link";
import { BaseElement } from "@/functionalities/createElement";

type LinkProps = {
    element: BaseElement;
    style?: React.CSSProperties;
};

const LinkComponent: React.FC<LinkProps> = ({ element, style }) => {
    return (
        <Link
            href={element.href || "#"}
            aria-label={element.ariaLabel || ""}
            id={element.id}
            style={{ ...style }}
        >
            {element.content || "Link Text"}
        </Link>
    );
};

export default React.memo(LinkComponent);
