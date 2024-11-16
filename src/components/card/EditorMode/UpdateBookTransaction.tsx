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

interface UpdateBookTransactionProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    transactionId: number | null;
    status: string;
    transactionDate: string;
    placingNumber: number | null;
  };
  onSubmit: (data: any) => void;
}

const UpdateBookTransaction: React.FC<UpdateBookTransactionProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("BORROWED");
  const [transactionDate, setTransactionDate] = useState<string>("");
  const [placingNumber, setPlacingNumber] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setTransactionId(initialData.transactionId);
      setStatus(initialData.status);
      setTransactionDate(initialData.transactionDate);
      setPlacingNumber(initialData.placingNumber);
    }
  }, [initialData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = {
        transactionId,
        status,
        transaction_date: transactionDate,
        placing_number: placingNumber,
      };

      onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Book Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID</Label>
            <Input
              id="transactionId"
              type="number"
              value={transactionId ?? ""}
              onChange={(e) => setTransactionId(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={setStatus} defaultValue={status}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BORROWED">Borrowed</SelectItem>
                <SelectItem value="RETURNED">Returned</SelectItem>
                <SelectItem value="EXTENDED">Extended</SelectItem>
                <SelectItem value="ADDITION">Addition</SelectItem>
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="placingNumber">Placing Number</Label>
            <Input
              id="placingNumber"
              type="number"
              value={placingNumber ?? ""}
              onChange={(e) => setPlacingNumber(Number(e.target.value))}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Update Transaction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBookTransaction;
