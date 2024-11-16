import React from "react";
import { useEffect, useState } from "react";
import BookTransactionCard from "./BookTransactionCard";
import { BookTransaction } from "@/types";

export default function BookTransactionsList() {
  const [transactions, setTransactions] = useState<BookTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/latest-book-transactions")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        return response.json();
      })
      .then((data: BookTransaction[]) => {
        setTransactions(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <BookTransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
}
