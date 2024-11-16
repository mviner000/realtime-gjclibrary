import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookTransaction } from "@/types";

interface BookTransactionCardProps {
  transaction: BookTransaction;
}

export const BookTransactionCard: React.FC<BookTransactionCardProps> = ({
  transaction,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{transaction.book_title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Call Number</TableCell>
              <TableCell>{transaction.callno || "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Accession Number</TableCell>
              <TableCell>{transaction.accession_number || "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Account School ID</TableCell>
              <TableCell>{transaction.account_school_id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Status</TableCell>
              <TableCell>{transaction.status}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h3 className="mt-4 mb-2 font-semibold">Records</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Date/Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transaction.records.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.record_type}</TableCell>
                <TableCell>
                  {new Date(record.datetime).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BookTransactionCard;
