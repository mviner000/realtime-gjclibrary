"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { debounce } from "lodash";
import { env } from "@/env";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ToastComponent from "@/components/ui/ToastComponent";
import { usePathname } from "next/navigation";

interface BookTransactionFormData {
  callno: string;
  accession_number: string;
  status: string;
  accounts_school_id: string;
  transaction_date: string;
  placing_number: number;
}

interface BookSuggestion {
  callno: string;
  title: string;
}

interface BookTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookTransactionFormData) => Promise<void>;
}

const BookTransactionModal: React.FC<BookTransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const pathname = usePathname();
  const schoolId = pathname.split("/").pop();

  const [formData, setFormData] = useState<BookTransactionFormData>({
    callno: "",
    accession_number: "",
    status: "",
    accounts_school_id: schoolId || "",
    transaction_date: "",
    placing_number: 1, // Default value
  });

  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [toast, setToast] = useState({
    title: "",
    description: "",
    open: false,
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    if (schoolId) {
      setFormData((prevData) => ({
        ...prevData,
        accounts_school_id: schoolId,
      }));
    }
  }, [schoolId]);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL!}/search_books?query=${encodeURIComponent(
          query
        )}`,
        {
          credentials: "include", // Add this to include cookies
        }
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "placing_number" ? parseInt(value) : value,
    }));

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
        credentials: "include", // Add this to include cookies
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

      // Reload the page after success
      window.location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Book Transaction</DialogTitle>
          <DialogDescription>
            Enter the details for the new book transaction.
          </DialogDescription>
        </DialogHeader>
        <div className="mx-5">
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
                <option value="ADDITION">Addition</option>
                <option value="EXTENDED">Extend</option>
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
              <label htmlFor="placing_number" className="block mb-1">
                Placing Number
              </label>
              <input
                type="number"
                id="placing_number"
                name="placing_number"
                value={formData.placing_number}
                onChange={handleChange}
                required
                min="1"
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
        </div>
      </DialogContent>
      <ToastComponent
        title={toast.title}
        description={toast.description}
        open={toast.open}
        onOpenChange={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </Dialog>
  );
};

export default BookTransactionModal;
