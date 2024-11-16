import React, { useEffect, useState, useCallback } from "react";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookRecord } from "@/types";
import { useBookTransactionsContext } from "../_hooks/useBookTransactions";
import { BookTransactionCard } from "./BookTransactionCard";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export const BookTransactionByAccountId = () => {
  const { bookTransactions, error, refreshTransactions } =
    useBookTransactionsContext();
  const [reload, setReload] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const handleDelete = useCallback(
    async (bookTransactionId: number) => {
      setDeletingIds((prev) => [...prev, bookTransactionId]);

      try {
        const response = await fetch(
          `/api/book-transaction/${bookTransactionId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.text();
        let jsonData;
        try {
          jsonData = JSON.parse(data);
        } catch {
          // Handle non-JSON response
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        if (!response.ok) {
          throw new Error(jsonData?.error || "Failed to delete transaction");
        }

        toast({
          title: "Success",
          description: "Transaction deleted successfully",
        });

        // Refresh the transactions list
        await refreshTransactions();

        // Reload the page after success
        window.location.reload();
      } catch (error) {
        console.error("Error deleting transaction:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to delete transaction",
        });
      } finally {
        setDeletingIds((prev) => prev.filter((id) => id !== bookTransactionId));
      }
    },
    [refreshTransactions] // Ensure dependencies are correctly included
  );

  useEffect(() => {
    if (reload) {
      refreshTransactions();
      setReload(false);
    }
  }, [reload, refreshTransactions]);

  useEffect(() => {
    const handleTransactionFinished = () => {
      refreshTransactions();
    };
    window.addEventListener("transactionFinished", handleTransactionFinished);
    return () => {
      window.removeEventListener(
        "transactionFinished",
        handleTransactionFinished
      );
    };
  }, [refreshTransactions]);

  if (!bookTransactions) {
    return (
      <Card className="w-full">
        <CardHeader className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <h1 className="text-lg font-bold mt-2">Loading transactions...</h1>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <p>Error loading transactions: {error}</p>
      </Alert>
    );
  }

  if (bookTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h1 className="text-lg font-bold">No transactions found</h1>
        </CardHeader>
        <CardContent>
          <p>There are currently no book transactions to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookTransactions
        .sort((a, b) => b.id - a.id)
        .map((transaction) => (
          <BookTransactionCard
            key={transaction.id}
            transaction={transaction}
            onDelete={handleDelete}
            isDeleting={deletingIds.includes(transaction.id)}
          />
        ))}
    </div>
  );
};
