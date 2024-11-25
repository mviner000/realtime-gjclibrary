import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { BookRecord } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BookTransactionCardProps {
  transaction: {
    id: number;
    callno: string | null;
    book_title: string | null;
    accession_number: string | null;
    records: BookRecord[];
  };
  onDelete: (id: number) => Promise<void>;
  isDeleting: boolean;
}

export function BookTransactionCard({
  transaction,
  onDelete,
  isDeleting,
}: BookTransactionCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [localIsDeleting, setLocalIsDeleting] = useState(false);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "MM-dd-yyyy");
  };

  const getDatesByType = (records: BookRecord[]) => {
    const borrowed = records.find((r) => r.record_type === "BORROWED");
    const returned = records.find((r) => r.record_type === "RETURNED");
    return {
      borrowed_date: borrowed?.datetime,
      returned_date: returned?.datetime,
    };
  };

  const getLatestRecord = (records: BookRecord[]) => {
    return records.sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    )[0];
  };

  const { borrowed_date, returned_date } = getDatesByType(transaction.records);
  const latestRecord = getLatestRecord(transaction.records);

  const handleDelete = async () => {
    setLocalIsDeleting(true);
    try {
      await onDelete(transaction.id);
    } finally {
      setLocalIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const getLatestRecordType = (records: BookRecord[]) => {
    const updatedRecords = records.map(r => 
      (r.record_type === "ADDITION" || r.record_type === "CLEARANCE") 
        ? { ...r, record_type: "PROCESSING..." } 
        : r
    );
  
    const sortedRecords = updatedRecords.sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );
  
    return sortedRecords[0]?.record_type || null;
  };
  


  const latestRecordType = getLatestRecordType(transaction.records);

  return (
    <>
      <Card className="group relative hover:outline hover:outline-1 hover:cursor-pointer hover:outline-green-500 transition-all transform hover:scale-105 mb-7 ml-5">
        <CardHeader>
          <div className="flex flex-row items-center justify-between space-x-4">
          {latestRecordType && (
            <div className="text-sm flex justify-between">
              <div className="space-y-1">
                <div className="text-sm flex justify-between">
                  <span className="font-black text-2xl">{latestRecordType}</span>
                </div>
              </div>
            </div>
          )}

            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:bg-destructive/90 hover:text-destructive-foreground flex-shrink-0"
                  disabled={isDeleting || localIsDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete transaction</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this transaction? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={localIsDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting || localIsDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {localIsDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <p className="text-lg mt-2 pt-2">
            {transaction.callno === "00000" ? "📰" : "📚"}{"  "}
            {transaction.book_title || "Unknown Title"}
          </p>
        </CardHeader>
        {transaction.callno !== "00000" && (
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
              <span className="font-semibold">{formatDate(borrowed_date)}</span>
            </p>
            <p>
              <strong>Returned Date:</strong>{" "}
              <span className="font-semibold">{formatDate(returned_date)}</span>
            </p>
          </CardContent>
        )}
        <CardFooter>
        <div className="w-full">
  {transaction.records.filter(
    (record) =>
      record.record_type !== "ADDITION" &&
      record.record_type !== "CLEARANCE"
  ).length > 0 && (
    <>
      <p className="text-sm text-gray-500 mb-2">Transaction History:</p>
      <div className="space-y-1">
        {transaction.records
          .filter(
            (record) =>
              record.record_type !== "ADDITION" &&
              record.record_type !== "CLEARANCE"
          )
          .sort(
            (a, b) =>
              new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
          )
          .map((record, index) => (
            <div key={index} className="text-sm flex justify-between">
              <span>{record.record_type}</span>
              {record.record_type !== "ADDITION" &&
                record.record_type !== "CLEARANCE" &&
                record.record_type !== null && (
                  <span>{formatDate(record.datetime)}</span>
                )}
            </div>
          ))}
      </div>
    </>
  )}
</div>

        </CardFooter>
      </Card>
    </>
  );
}
