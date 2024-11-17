"use client";

import { useState, useEffect } from "react";
import { Attendance } from "@/types/attendance";

export default function AttendanceEditor() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [schoolId, setSchoolId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${API_URL}/v2/attendance`);
      const data = (await response.json()) as Attendance[];
      const uniqueRecords = Array.from(
        new Map(data.map((record: Attendance) => [record.id, record])).values()
      ) as Attendance[];
      setRecords(uniqueRecords);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentDate = new Date().toISOString();
    const attendanceData = {
      school_id: schoolId,
      purpose,
      status,
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
      setEditingId(null);
      fetchRecords();
    } catch (error) {
      console.error("Error saving attendance record:", error);
    }
  };

  const handleEdit = (record: Attendance) => {
    setSchoolId(record.school_id);
    setPurpose(record.purpose);
    setStatus(record.status);
    setEditingId(record.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}/v2/attendance/${id}`, {
        method: "DELETE",
      });
      fetchRecords();
    } catch (error) {
      console.error("Error deleting attendance record:", error);
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
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update Record" : "Add Record"}
        </button>
      </form>

      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.id} className="border p-4 rounded">
            <h3 className="font-semibold">School ID: {record.school_id}</h3>
            <p className="mt-2">Purpose: {record.purpose}</p>
            <p>Status: {record.status}</p>
            {record.baggage_number && (
              <p>Baggage Number: {record.baggage_number}</p>
            )}
            <div className="mt-4 space-x-2">
              <button
                onClick={() => handleEdit(record)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(record.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
