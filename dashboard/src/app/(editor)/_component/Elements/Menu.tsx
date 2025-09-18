"use client";

import React, { useState } from "react";
// import menu from "@/data/menu";
import menu from "@/assets/dummyMenu"
import MenuCard from "./MenuCard";

const MenuTabs: React.FC = () => {
    const categories = Array.from(new Set(menu.map((item) => item.category)));
    const [activeTab, setActiveTab] = useState(categories[0]);

    const filteredMenu = menu.filter(
        (item) => item.active && item.category === activeTab
    );

    return (
        <div className="w-full">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`relative pb-2 font-medium transition-colors ${activeTab === cat ? "text-black" : "text-gray-500"
                            }`}
                    >
                        {cat}

                        {/* Gradient underline */}
                        {activeTab === cat && (
                            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Grid of Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {filteredMenu.map((item) => (
                    <MenuCard key={item.name} item={item} />
                ))}
            </div>
        </div>
    );
};

export default MenuTabs;