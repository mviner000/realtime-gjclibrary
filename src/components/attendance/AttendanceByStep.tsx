"use client";

import { useState, useEffect } from "react";
import { Attendance } from "@/types/attendance";
import { env } from "@/env";

export default function AttendanceByStep() {
  const [schoolId, setSchoolId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [status, setStatus] = useState("");
  const [hasBaggage, setHasBaggage] = useState<boolean | "">("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const API_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const PURPOSE_OPTIONS = [
    "transaction",
    "research",
    "clearance",
    "orientation_or_meeting",
    "silver_star",
    "others",
    "reading_study_or_review",
    "xerox",
    "print",
    "computer_use",
  ];

  const STATUS_OPTIONS = ["time_in", "time_out"];

  const BAGGAGE_OPTIONS = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${API_URL}/v2/attendance`);
      const data = (await response.json()) as Attendance[];
      const sortedRecords = data.sort((a: Attendance, b: Attendance) => {
        const aDate = new Date(a.time_in_date || a.date);
        const bDate = new Date(b.time_in_date || b.date);
        return bDate.getTime() - aDate.getTime();
      });
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasBaggage === "") {
      alert("Please select whether the visitor has baggage");
      return;
    }

    const currentDate = new Date().toISOString();
    const attendanceData = {
      school_id: schoolId,
      purpose,
      status,
      has_baggage: hasBaggage,
      date: currentDate.split("T")[0],
      [status === "time_in" ? "time_in_date" : "time_out_date"]: currentDate,
    };

    try {
      if (editingId) {
        await fetch(`${API_URL}/v2/attendance/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attendanceData),
        });
      } else {
        await fetch(`${API_URL}/v2/attendance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attendanceData),
        });
      }

      // Reset form
      setSchoolId("");
      setPurpose("");
      setStatus("");
      setHasBaggage("");
      setEditingId(null);
      fetchRecords();
    } catch (error) {
      console.error("Error saving attendance record:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <input
            type="text"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            placeholder="School ID"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Purpose</option>
            {PURPOSE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Status</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Has Baggage?
          </label>
          <div className="flex gap-4">
            {BAGGAGE_OPTIONS.map((option) => (
              <label key={option.label} className="inline-flex items-center">
                <input
                  type="radio"
                  value={option.value.toString()}
                  checked={hasBaggage === option.value}
                  onChange={(e) => setHasBaggage(e.target.value === "true")}
                  className="form-radio h-4 w-4 text-blue-600"
                  required
                />
                <span className="ml-2">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update Record" : "Add Record"}
        </button>
      </form>
    </div>
  );
}
