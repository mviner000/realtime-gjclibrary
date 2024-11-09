import React, { useEffect, useState, useCallback } from "react";
import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { BookRecord } from "@/types";
import { format } from "date-fns";
import { useBookTransactionsContext } from "../_hooks/useBookTransactions";

export const BookTransactionByAccountId = () => {
  const { bookTransactions, error, refreshTransactions } =
    useBookTransactionsContext();
  const [reload, setReload] = useState(false);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "MM-dd-yyyy");
  };

  const getDatesByType = (records: BookRecord[]) => {
    const borrowed = records.find((r) => r.record_type === "BORROWED");
    const returned = records.find((r) => r.record_type === "RETURNED");
    const addition = records.find((r) => r.record_type === "ADDITION");
    const extended = records.find((r) => r.record_type === "EXTENDED");
    return {
      borrowed_date: borrowed?.datetime,
      addition_date: addition?.datetime,
      returned_date: returned?.datetime,
      extended_date: extended?.datetime,
    };
  };

  const getLatestRecord = (records: BookRecord[]) => {
    return records.sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    )[0];
  };

  // Function to handle reloading of data
  const handleReload = useCallback(() => {
    setReload(true);
  }, []);

  // Fetch data again when reload state changes
  useEffect(() => {
    if (reload) {
      refreshTransactions();
      setReload(false); // Reset the reload state
    }
  }, [reload, refreshTransactions]);

  // Listen for the custom event 'transactionFinished'
  useEffect(() => {
    const handleTransactionFinished = () => {
      handleReload();
    };

    window.addEventListener("transactionFinished", handleTransactionFinished);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener(
        "transactionFinished",
        handleTransactionFinished
      );
    };
  }, [handleReload]);

  if (error) {
    return <Alert variant="destructive">Error: {error}</Alert>;
  }

  if (!bookTransactions) {
    return (
      <Card>
        <CardHeader>
          <h1 className="text-lg font-bold">Loading...</h1>
        </CardHeader>
      </Card>
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
        .map((transaction) => {
          const { borrowed_date, returned_date, addition_date, extended_date } =
            getDatesByType(transaction.records);
          const latestRecord = getLatestRecord(transaction.records);

          return (
            <Card
              key={transaction.id}
              className="group hover:outline hover:outline-1 hover:cursor-pointer hover:outline-green-500 transition-all transform hover:scale-105 mb-7 ml-5"
            >
              <CardHeader>
                <span
                  className={`badge mb-2 text-center dark:text-white text-black ${
                    latestRecord?.record_type === "BORROWED"
                      ? "bg-purple-500  "
                      : latestRecord?.record_type === "RETURNED"
                      ? "bg-green-500 "
                      : latestRecord?.record_type === "EXTENDED"
                      ? "bg-blue-500 "
                      : "bg-transparent outline outline-1 text-black"
                  } px-2 py-1 rounded`}
                >
                  {latestRecord?.record_type === "ADDITION"
                    ? "NO DATA HISTORY YET"
                    : latestRecord?.record_type || "N/A"}
                </span>

                <p className="text-lg">
                  📚 {transaction.book_title || "Unknown Title"}
                </p>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Call Number:</strong> {transaction.callno || "N/A"}
                </p>
                <p>
                  <strong>Accession Number:</strong>{" "}
                  {transaction.accession_number || "N/A"}
                </p>
                <p>
                  <strong>Borrowed Date:</strong>{" "}
                  <span className="font-semibold">
                    {formatDate(borrowed_date)}
                  </span>
                </p>
                <p>
                  <strong>Returned Date:</strong>{" "}
                  <span className="font-semibold">
                    {formatDate(returned_date)}
                  </span>
                </p>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <p className="text-sm text-gray-500 mb-2">
                    Transaction History:
                  </p>
                  <div className="space-y-1">
                    {transaction.records
                      .filter((record) => record.record_type !== "ADDITION")
                      .sort(
                        (a, b) =>
                          new Date(b.datetime).getTime() -
                          new Date(a.datetime).getTime()
                      )
                      .map((record, index) => (
                        <div
                          key={index}
                          className="text-sm flex justify-between"
                        >
                          <span>{record.record_type}</span>
                          <span>{formatDate(record.datetime)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </CardFooter>
            </Card>
          );
        })}
    </div>
  );
};
