'use client';

import React, { useState } from 'react';

const TableReservationUI: React.FC = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState(1);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Reserve a Table</h1>
      <form className="flex flex-col gap-4">
        <div>
          <label className="block font-medium mb-1">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Number of People:</label>
          <input
            type="number"
            min={1}
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="button"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Reserve Table
        </button>
      </form>
    </div>
  );
};

export default TableReservationUI;
