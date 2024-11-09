"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { debounce } from "lodash"; // Make sure to install lodash if not already installed
import { env } from "@/env";

interface FormData {
  callno: string;
  accession_number: string;
  status: string;
  accounts_school_id: string;
  transaction_date: string;
}

interface BookSuggestion {
  callno: string;
  title: string;
}

const BookTransactionForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    callno: "",
    accession_number: "",
    status: "",
    accounts_school_id: "",
    transaction_date: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL!}/search_books?query=${encodeURIComponent(
          query
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "status") {
      const now = new Date().toISOString().split("T")[0];
      setFormData((prevData) => ({ ...prevData, transaction_date: now }));
    }

    if (name === "callno") {
      debouncedFetchSuggestions(value);
    }
  };

  const handleSuggestionClick = (suggestion: BookSuggestion) => {
    setFormData((prevData) => ({ ...prevData, callno: suggestion.callno }));
    setSuggestions([]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/book-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create book transaction"
        );
      }

      const result = await response.json();
      setSuccess("Book transaction created successfully!");
      console.log(result);
      // Optionally, reset form or redirect
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Create Book Transaction</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="callno" className="block mb-1">
            Call Number
          </label>
          <input
            type="text"
            id="callno"
            name="callno"
            value={formData.callno}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white text-black border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion.callno} - {suggestion.title}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label htmlFor="accession_number" className="block mb-1">
            Accession Number
          </label>
          <input
            type="text"
            id="accession_number"
            name="accession_number"
            value={formData.accession_number}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="status" className="block mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Status</option>
            <option value="BORROWED">Borrowed</option>
            <option value="RETURNED">Returned</option>
          </select>
        </div>
        <div>
          <label htmlFor="accounts_school_id" className="block mb-1">
            Account School ID
          </label>
          <input
            type="text"
            id="accounts_school_id"
            name="accounts_school_id"
            value={formData.accounts_school_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="transaction_date" className="block mb-1">
            Select Date
          </label>
          <input
            type="date"
            id="transaction_date"
            name="transaction_date"
            value={formData.transaction_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Create Transaction
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
  );
};

export default BookTransactionForm;
