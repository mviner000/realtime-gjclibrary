import React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { BookTransaction } from "@/types";
import BookTransactionsSkeletonLoader from "./BookTransactionsSkeletonLoader";
import Link from "next/link";

export default function BookTransactionsAccordion() {
  const [transactions, setTransactions] = useState<BookTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = () => {
    setIsLoading(true);
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
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRefresh = () => {
    fetchTransactions();
  };

  if (isLoading) return <BookTransactionsSkeletonLoader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Latest Book Transactions</CardTitle>
          <CardDescription>last 10 book transactions</CardDescription>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {transactions.map((transaction, index) => (
            <AccordionItem key={transaction.id} value={`item-${index}`}>
              <AccordionTrigger>
                <span>
                  {transaction.callno} - #{transaction.accession_number}{" "}
                  <span className="font-normal"> borrowed by </span>
                  <span className="text-blue-500">
                    {transaction.account_school_id}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Book Title</TableCell>
                      <TableCell>{transaction.book_title || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Accession Number
                      </TableCell>
                      <TableCell>
                        {transaction.accession_number || "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Account School ID
                      </TableCell>
                      <TableCell>
                        <Link
                          className="hover:text-blue-500"
                          href={`student/${transaction.account_school_id}`}
                        >
                          {transaction.account_school_id}
                        </Link>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <h4 className="mt-4 mb-2 font-semibold">Records</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Date/Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transaction.records
                      .filter((record) => record.record_type !== "ADDITION")
                      .map((record, recordIndex) => (
                        <TableRow key={recordIndex}>
                          <TableCell>{record.record_type}</TableCell>
                          <TableCell>
                            {new Date(record.datetime).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
