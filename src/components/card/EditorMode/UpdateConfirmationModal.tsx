import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UpdateConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  updateData: {
    transactionId?: number;
    status?: string;
    transactionDate?: string;
    placingNumber?: number;
  } | null;
}

const UpdateConfirmationModal: React.FC<UpdateConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  updateData,
}) => {
  // If updateData is null, use an empty object as fallback
  const data = updateData || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Update</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to update this book record?</p>
          <ul className="list-disc list-inside">
            <li>Transaction ID: {data.transactionId ?? "N/A"}</li>
            <li>Status: {data.status ?? "N/A"}</li>
            <li>Transaction Date: {data.transactionDate ?? "N/A"}</li>
            <li className="hidden">
              Placing Number: {data.placingNumber ?? "N/A"}
            </li>
          </ul>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateConfirmationModal;
