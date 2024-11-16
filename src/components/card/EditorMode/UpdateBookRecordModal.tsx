import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { fetchBookTransactionData } from "./utils/api";
import { CardCalendar } from "@/components/ui/library-card-calendar-picker";

interface UpdateBookRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    placingNumber: number;
    status: string;
    transactionDate: string;
    accountSchoolId: string;
  };
  onSubmit: (data: any) => void;
}

interface Transaction {
  id: number;
  accession_number: string;
  callno: string;
  status: string;
  transaction_date: string;
}

const UpdateBookRecordModal: React.FC<UpdateBookRecordModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [status, setStatus] = useState<string>("");
  const [transactionDate, setTransactionDate] = useState<string>("");
  const [placingNumber, setPlacingNumber] = useState<number>(0);
  const { toast } = useToast();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (isOpen && initialData.accountSchoolId) {
      fetchBookTransactionData(initialData.accountSchoolId)
        .then((data) => {
          setTransactions(data);
        })
        .catch((error) => {
          console.error("Error fetching book transaction data:", error);
          toast({
            title: "Error",
            description: "Failed to fetch book transaction data",
            variant: "destructive",
          });
        });
    }
  }, [isOpen, initialData.accountSchoolId, toast]);

  useEffect(() => {
    if (initialData) {
      setPlacingNumber(initialData.placingNumber);
      setTransactionDate(initialData.transactionDate);
      setStatus(initialData.status || "");
    }
  }, [initialData]);

  const handleTransactionSelect = (transactionId: string) => {
    const selected = transactions.find(
      (t) => t.id.toString() === transactionId
    );
    if (selected) {
      setSelectedTransaction(selected);
      // Remove this line to maintain the current status
      // setStatus(selected.status);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedTransaction) {
      onSubmit({
        transactionId: selectedTransaction.id,
        status,
        transactionDate, // Use the user-selected date
        placingNumber,
      });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setTransactionDate(date.toISOString().split("T")[0]);
      setIsCalendarOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Book Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction</Label>
            <Select onValueChange={handleTransactionSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select transaction" />
              </SelectTrigger>
              <SelectContent>
                {transactions.map((transaction) => (
                  <SelectItem
                    key={transaction.id}
                    value={transaction.id.toString()}
                  >
                    {transaction.callno} - #{transaction.accession_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={setStatus} value={status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BORROWED">Borrow</SelectItem>
                  <SelectItem value="EXTENDED">Extend</SelectItem>
                  <SelectItem value="RETURNED">Returned</SelectItem>
                  <SelectItem value="CLEARED">Cleared</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionDate">Transaction Date</Label>
              <Input
                id="transactionDate"
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-2 hidden">
            <Label htmlFor="placingNumber">Placing Number</Label>
            <Input
              id="placingNumber"
              type="number"
              value={placingNumber}
              onChange={(e) => setPlacingNumber(Number(e.target.value))}
              readOnly
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!selectedTransaction}>
              Update Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBookRecordModal;
