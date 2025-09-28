"use client";

import React, { useState, useEffect } from "react";
import { MenuCard } from "./MenuCard";
// import menuData from "@/assets/dummyMenu"; // your JSON menu
import menuData  from "@/assets/test.json"

type Props = {
    parentRef: HTMLElement;
};

export interface MenuItem {
    name: string;
    price: number;
    img: string;
    active: boolean;
    category: string;
}

const ITEMS_PER_PAGE = 15;
const FALLBACK_IMAGE = "/fallback-food.jpg"; // place a fallback image in /public

const classifyWidth = (w: number) => {
    if (w > 1200) return "xl";
    if (w >= 1024) return "lg";
    if (w >= 600) return "md";
    return "sm";
};

const MenuTabs: React.FC<Props> = ({ parentRef }) => {
    const [activeTab, setActiveTab] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [widthClass, setWidthClass] = useState<"sm" | "md" | "lg" | "xl">(
        classifyWidth(parentRef?.offsetWidth || 0)
    );

    // Update widthClass on parent resize
    useEffect(() => {
        if (!parentRef) return;
        const resizeObserver = new ResizeObserver(() => {
            setWidthClass(classifyWidth(parentRef.offsetWidth));
        });
        resizeObserver.observe(parentRef);
        return () => resizeObserver.disconnect();
    }, [parentRef]);

    // Flatten menu and filter out inactive, zero-price, and empty groups
    const flattenedMenu: MenuItem[] = [];
    menuData.menus.forEach((menu) => {
        menu.menuGroups.forEach((group) => {
            const validItems = group.menuItems.filter(
                (item) => (item.price !== null) && (item.active && item.price > 0)
            );

            if (validItems.length > 0) {
                validItems.forEach((item) => {
                    flattenedMenu.push({
                        name: item.name,
                        price: item.price || 0,
                        img: item.image || FALLBACK_IMAGE,
                        active: item.active,
                        category: group.name,
                    });
                });
            }
        });
    });

    // Categories (built dynamically, only non-empty groups)
    const categories = [
        { label: "All", value: "All" },
        ...Array.from(new Set(flattenedMenu.map((item) => item.category))).map(
            (cat) => ({
                label: cat,
                value: cat,
            })
        ),
    ];

    // Filtered items
    const filteredMenu =
        activeTab === "All"
            ? flattenedMenu
            : flattenedMenu.filter((item) => item.category === activeTab);

    // Pagination
    const totalPages = Math.ceil(filteredMenu.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedMenu = filteredMenu.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const getGridCols = () => {
        switch (widthClass) {
            case "xl":
            case "lg":
                return 3;
            case "md":
                return 2;
            case "sm":
            default:
                return 1;
        }
    };

    const gridCols = getGridCols();

    return (
        <div className="w-full bg-[rgba(244,236,227,1)] py-8 px-4">
            {/* Tabs */}
            <div className="flex scroll-two justify-start overflow-x-auto border-b border-gray-200 scrollbar-thin scrollbar-thumb-gray-300">
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => handleTabChange(cat.value)}
                        style={{fontFamily: "var(--font-playfair)"}}
                        className={`relative inline-block py-2 px-4 font-medium transition-colors whitespace-nowrap 
                            
                        }`}
                    >
                        {cat.label}
                        {activeTab === cat.value && (
                            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div
                className={`grid gap-16 mt-6`}
                style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
            >
                {paginatedMenu.map((item) => (
                    <MenuCard key={item.name} item={item} widthClass={widthClass} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MenuTabs;
