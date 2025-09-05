'use client';

import React, { useState } from 'react';

interface TableAvailabilityResponse {
  available_tables: number;
  message?: string;
}

const TableReservation: React.FC = () => {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [people, setPeople] = useState<number>(1);
  const [availableTables, setAvailableTables] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAvailableTables = async () => {
    if (!date || !time || !people) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setAvailableTables(null);

    try {
      // Replace this URL with your actual OpenTable API endpoint
      const res = await fetch(
        `/api/openTableAvailability?date=${date}&time=${time}&people=${people}`
      );

      const data: TableAvailabilityResponse = await res.json();

      if (res.ok) {
        setAvailableTables(data.available_tables);
      } else {
        setError(data.message || 'No tables available');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch available tables');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAvailableTables();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Reserve a Table</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block font-medium mb-1">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border p-2 rounded"
            required
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
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check Availability'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {availableTables !== null && !error && (
        <p className="text-green-600 mt-4">
          {availableTables > 0
            ? `${availableTables} tables available`
            : 'No tables available'}
        </p>
      )}
    </div>
  );
};

export default TableReservation;
