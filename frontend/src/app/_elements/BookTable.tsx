"use client";
import React, { useState, useMemo } from "react";
import { ChevronDown, CalendarClock, Clock, UserPlus } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Define the prop types for BookTable
interface BookTableProps {
  restref?: string;
}

const BookTable: React.FC<BookTableProps> = ({ restref = "59356" }) => {
  const [time, setTime] = useState<string>("19:00");

  // Store date as Date object
  const [date, setDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Add 1 day to the current date
    return d; // Return as Date object
  });

  const [covers, setCovers] = useState<number>(2);

  const dtLocal = useMemo(() => {
    // Build a local datetime string like "2025-06-02T19:00"
    return `${date.toISOString().slice(0, 10)}T${time}`;
  }, [date, time]);

  // OpenTable wants an ISO-ish string.
  // The “profile//reserve” URL // accepts datetime without timezone; OpenTable resolves it server-side.
  // For stronger TZ control, we still compute a best-effort ISO.
  const deepLink = useMemo(() => {
    const base = `https://www.opentable.com/booking/restref/availability?rid=${encodeURIComponent(restref)}`;

    const params = new URLSearchParams();
    params.set("partySize", String(covers));
    params.set("datetime", dtLocal); // “YYYY-MM-DDTHH:mm”

    return `${base}&${params.toString()}`;
  }, [covers, dtLocal, restref]);

  // ---- UI helpers
  const peopleOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const timeOptions = [
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ];

  const handleBook = () => {
    window.open(deepLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-gradient-to-r from-[#E3D9C9] to-[#D5C5AC] backdrop-blur-[10px] z-[10] rounded-[24px] shadow-sm border border-[#AE906066] p-4 md:p-6 space-y-4 w-[100%]">

      {/* Date */}
      <div className="block relative w-full">
        <span className="text-sm font-medium text-[black]">Date</span>
        <div className="mt-1 w-full ">
          <DatePicker
            selected={date}
            onChange={(date: Date | null) => setDate(date || new Date())}
            onSelect={() => { }} // triggers when a date is selected
            shouldCloseOnSelect={true}   // 👈 this is the key
            className="w-full rounded-[16px] pl-15 border border-[#AE906066] bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400 box-border"
            aria-label="Select date"
            dateFormat="MMMM d, yyyy"
          />
          <CalendarClock className="absolute left-4 top-10 pointer-events-none" />
        </div>
      </div>

      {/* Time */}
      <label className="block relative">
        <span className="text-sm font-medium text-[black]">Time</span>
        <div className="mt-1">
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full appearance-none pl-15 rounded-[16px] border border-[#AE906066] bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Select time"
          >
            {timeOptions.map((t) => (
              <option className="bg-amber-100/20" key={t} value={t}>
                {to12h(t)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-10 pointer-events-none" />
          <Clock className="absolute left-4 top-10 pointer-events-none" />
        </div>
      </label>

      {/* People */}
      <label className="block relative">
        <span className="text-sm font-medium text-[black]">Guests</span>
        <div className="mt-1">
          <select
            value={covers}
            onChange={(e) => setCovers(Number(e.target.value))}
            className="w-full appearance-none pl-15 rounded-[16px] border border-[#AE906066] bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Select number of guests"
          >
            {peopleOptions.map((p) => (
              <option className="bg-amber-100/20" key={p} value={p}>
                {p} {p === 1 ? "Person" : "People"}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-10 pointer-events-none" />
          <UserPlus className="absolute left-4 top-10 pointer-events-none" />
        </div>
      </label>

      <button
        onClick={handleBook}
        className="w-full rounded-[16px] px-6 py-4 font-semibold bg-[#AE9060] text-white hover:bg-[#9e7a40] active:bg-[#9e7a40] transition cursor-pointer"
      >
        Book Now
      </button>
    </div>
  );
};

// --- utils
function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const am = h < 12;
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${m.toString().padStart(2, "0")} ${am ? "AM" : "PM"}`;
}

export default BookTable;
