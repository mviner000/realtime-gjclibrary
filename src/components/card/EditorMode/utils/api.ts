import { env } from "@/env";
import { TransactionData } from "@/types";
import axios from "axios";

export const fetchAccessionSuggestions = async (query: string) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_API_URL!}/search_accessions?query=${encodeURIComponent(
      query
    )}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch accession suggestions");
  }
  return response.json();
};

export const fetchBookSuggestions = async (query: string) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_API_URL!}/search_books?query=${encodeURIComponent(
      query
    )}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch book suggestions");
  }
  return response.json();
};

export const createBookTransaction = async (
  transactionData: TransactionData
) => {
  const response = await fetch("/api/book-transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionData),
  });
  if (!response.ok) {
    throw new Error("Failed to create book transaction");
  }
  return response.json();
};

export const fetchBookTransactionData = async (account_school_id: string) => {
  const response = await fetch(`/api/book-transaction/${account_school_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch book transaction data");
  }
  return response.json();
};

export const fetchBookRecordsData = async (account_school_id: string) => {
  try {
    const response = await fetch(`/api/book-records/${account_school_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Handle specific cases based on status code
    if (response.status === 404) {
      throw new Error(
        `No book records found for account school ID ${account_school_id}`
      );
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch book records: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if data is empty or null
    if (!data || (Array.isArray(data) && data.length === 0)) {
      throw new Error(
        `No book records found for account school ID ${account_school_id}`
      );
    }

    return data;
  } catch (error) {
    console.error("Error fetching book records:", error);
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
};

export const fetchBookTitle = async (callno: string): Promise<string> => {
  try {
    const response = await axios.get(
      `${env.NEXT_PUBLIC_API_URL}/query_book_title/${callno}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error("Book not found");
    }
    throw new Error("Failed to fetch book title");
  }
};

export const editBookTransaction = async (transactionId: number, data: any) => {
  const response = await fetch(`/api/edit_book_transaction/${transactionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update book transaction");
  }
  return response.json();
};
