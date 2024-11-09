import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ActionSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionSelect: (
    action: "Addition" | "Borrowed" | "Returned" | "Extended"
  ) => void;
  bookTitle: string;
}

const ActionSelectionModal: React.FC<ActionSelectionModalProps> = ({
  isOpen,
  onClose,
  onActionSelect,
  bookTitle,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Do you really want to add a record for:{" "}
            <span className="font-medium underline text-blue-700">
              {bookTitle} ?
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="text-center text-2xl font-bold">
          Confirm this transaction, please
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button onClick={() => onActionSelect("Addition")} variant="emerald">
            Yes
          </Button>
          <Button onClick={onClose} variant="danger">
            No
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionSelectionModal;
