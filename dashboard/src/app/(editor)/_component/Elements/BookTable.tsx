"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { BaseElement } from "../../_functionality/createElement";
import { useMyContext } from "@/Context/EditorContext";
import { convertVWVHtoPxParentClamped } from "@/utils/convertVWVHtoParent";
import { ChevronDown, CalendarClock, Clock, UserPlus } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type BookTableElementProps = {
    element: BaseElement;
    editable?: boolean;
    style: React.CSSProperties;
    updateContent: (id: string, property: string, value: any) => void;
    updateElement: (id: string, updatedElement: BaseElement) => void;
    rmElement: (id: string) => void;
    parentRef: HTMLElement | null;
};

const BookTableElement = ({
    element,
    editable = true,
    style,
    updateContent,
    updateElement,
    rmElement,
    parentRef
}: BookTableElementProps) => {
    const elementRef = useRef<HTMLDivElement | null>(null);
    const { contextElement, toolbarRef, contextForSection, activeScreen } = useMyContext();
    const [divStyle, setDivStyle] = useState<React.CSSProperties>(style);
    const [isEditing, setEditing] = useState(false);

    // --- BookTable state ---
    const [time, setTime] = useState<string>("19:00");
    const [date, setDate] = useState<Date>(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d;
    });
    const [covers, setCovers] = useState<number>(2);

    const dtLocal = useMemo(() => `${date.toISOString().slice(0, 10)}T${time}`, [date, time]);
    const deepLink = useMemo(() => {
        const base = `https://www.opentable.com/restaurant/profile/${encodeURIComponent(
            element.id
        )}/reserve`;
        const params = new URLSearchParams();
        params.set("cover", String(covers));
        params.set("datetime", dtLocal);
        return `${base}?${params.toString()}`;
    }, [covers, dtLocal, element.id]);

    const peopleOptions = Array.from({ length: 12 }, (_, i) => i + 1);
    const timeOptions = ["17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"];

    const handleBook = () => {
        window.open(deepLink, "_blank", "noopener,noreferrer");
    };

    // --- Editing setup ---
    const activateTheEditing = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditing(true);
        contextForSection.setRmSection(() => () => rmElement(element.id));
        contextForSection.setCurrentSection(divStyle);
        contextForSection.setCurrentSectionSetter(() => setDivStyle);
        contextForSection.setSectionRef(elementRef);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!elementRef.current) return;
            const clickedToolbar = toolbarRef.current?.contains(e.target as Node) ?? false;
            const clickedElement = elementRef.current?.contains(e.target as Node) ?? false;
            if (!clickedToolbar && !clickedElement) setEditing(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [toolbarRef]);

    useEffect(() => {
        if (isEditing) contextElement.setElement(divStyle);
        updateElement(element.id, { ...element, style: { ...element.style, [activeScreen]: divStyle } });
    }, [divStyle]);

    useEffect(() => setDivStyle(style), [activeScreen]);

    const runningWidth = activeScreen !== "xl";
    const runningStyle = runningWidth ? convertVWVHtoPxParentClamped(divStyle, parentRef) : divStyle;

    return (
        <div
            id={element.id}
            ref={elementRef}
            style={runningStyle}
            onClick={activateTheEditing}
            className="relative w-full"
        >
            <div className="bg-gradient-to-r from-[#E3D9C9] to-[#D5C5AC] backdrop-blur-[10px] rounded-[24px] shadow-sm border border-[#AE906066] p-4 md:p-6 space-y-4 z-[50] w-full">
                {/* Date */}
                <label className="block relative w-full">
                    <span className="text-sm font-medium text-black">Date</span>
                    <div className="mt-1 w-full">
                        <DatePicker
                            selected={date}
                            onChange={(d: Date | null) => setDate(d || new Date())}
                            className="w-full rounded-[16px] pl-15 border border-[#AE906066] bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400 box-border"
                            aria-label="Select date"
                            dateFormat="MMMM d, yyyy"
                        />
                        <CalendarClock className="absolute left-4 top-10 pointer-events-none" />
                    </div>
                </label>

                {/* Time */}
                <label className="block relative">
                    <span className="text-sm font-medium text-black">Time</span>
                    <div className="mt-1">
                        <select
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            className="w-full appearance-none pl-15 rounded-[16px] border border-[#AE906066] bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400"
                            aria-label="Select time"
                        >
                            {timeOptions.map(t => (
                                <option key={t} value={t}>{to12h(t)}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-10 pointer-events-none" />
                        <Clock className="absolute left-4 top-10 pointer-events-none" />
                    </div>
                </label>

                {/* People */}
                <label className="block relative">
                    <span className="text-sm font-medium text-black">Guests</span>
                    <div className="mt-1">
                        <select
                            value={covers}
                            onChange={e => setCovers(Number(e.target.value))}
                            className="w-full appearance-none pl-15 rounded-[16px] border border-[#AE906066] bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400"
                            aria-label="Select number of guests"
                        >
                            {peopleOptions.map(p => (
                                <option key={p} value={p}>{p} {p === 1 ? "Person" : "People"}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-10 pointer-events-none" />
                        <UserPlus className="absolute left-4 top-10 pointer-events-none" />
                    </div>
                </label>

                <button
                    onClick={handleBook}
                    className="w-full rounded-[16px] px-6 py-4 font-semibold bg-[#AE9060] text-white hover:bg-[#9e7a40] active:bg-[#9e7a40] transition cursor-pointer"
                    aria-label="Book Table"
                >
                    Book Now
                </button>
            </div>
        </div>
    );
};

function to12h(hhmm: string) {
    const [h, m] = hhmm.split(":").map(Number);
    const am = h < 12;
    const hh = ((h + 11) % 12) + 1;
    return `${hh}:${m.toString().padStart(2, "0")} ${am ? "AM" : "PM"}`;
}

export default React.memo(BookTableElement);
