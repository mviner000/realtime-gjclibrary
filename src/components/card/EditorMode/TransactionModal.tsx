import React, { useEffect, useState } from "react";
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
import { AccessionSuggestion, TransactionData } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "recharts";

interface TransactionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  transactionData: TransactionData;
  setTransactionData: React.Dispatch<React.SetStateAction<TransactionData>>;
  accessionSuggestions: AccessionSuggestion[];
  handleAccessionChange: (value: string) => void;
  handleAccessionSuggestionClick: (suggestion: AccessionSuggestion) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  selectedAction: "Addition" | "Borrowed" | "Returned" | "Extended" | "Clearance" | null;
  isFixedTransaction?: boolean;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  setIsOpen,
  transactionData,
  setTransactionData,
  accessionSuggestions,
  handleAccessionChange,
  handleAccessionSuggestionClick,
  onSubmit,
  onCancel,
  selectedAction,
  isFixedTransaction = false,
}) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isFixedTransaction) {
      setTransactionData(prev => ({
        ...prev,
        accession_number: "18031",
        status: "CLEARANCE",
        transaction_date: new Date().toISOString().split('T')[0]
      }));
    }
  }, [isFixedTransaction, setTransactionData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (selectedAction) {
      setTransactionData((prev) => ({
        ...prev,
        status: selectedAction.toUpperCase(),
      }));
    }
  }, [selectedAction, setTransactionData]);

  const handleSubmit = async () => {
    try {
      await onSubmit();
      setIsOpen(false);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while submitting the transaction.";
      setError(errorMessage);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
        setIsOpen(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isFixedTransaction ? "Clearance Record" : "Enter Book Record Details"}
          </DialogTitle>
        </DialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 py-4">
          <Select
            value={transactionData.accession_number}
            onValueChange={(value) => {
              setTransactionData((prev) => ({
                ...prev,
                accession_number: value,
              }));
              handleAccessionSuggestionClick({ accession_number: value });
            }}
            disabled={isFixedTransaction}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Accession Number" />
            </SelectTrigger>
            <SelectContent>
              {accessionSuggestions.map((suggestion, index) => (
                <SelectItem key={index} value={suggestion.accession_number}>
                  {suggestion.accession_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="hidden">
            <Select
              value={transactionData.status}
              onValueChange={(value) =>
                setTransactionData((prev) => ({ ...prev, status: value }))
              }
              disabled={isFixedTransaction}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CLEARANCE">CLEARANCE</SelectItem>
                <SelectItem value="BORROWED">BORROWED</SelectItem>
                <SelectItem value="RETURNED">RETURNED</SelectItem>
                <SelectItem value="EXTENDED">EXTENDED</SelectItem>
                <SelectItem value="ADDITION">ADDITION</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-xs mt-3 font-bold text-center">
              {isFixedTransaction ? "Clearance Date" : "This will be the date book borrowed"}
            </div>
            <div className="space-y-2">
              <Label>Transaction Date</Label>
              <Input
                type="date"
                value={transactionData.transaction_date}
                onChange={(e) =>
                  setTransactionData((prev) => ({
                    ...prev,
                    transaction_date: e.target.value,
                  }))
                }
                disabled={isFixedTransaction}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;