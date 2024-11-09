import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionData } from "@/types";
import { fetchBookTitle } from "./utils/api";
import { Loader2 } from "lucide-react";

import { useAutoReload } from "./AutoReloadWrapper";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  transactionData: TransactionData;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  transactionData,
}) => {
  const [bookTitle, setBookTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  useEffect(() => {
    const getBookTitle = async () => {
      if (isOpen && transactionData.callno) {
        try {
          const title = await fetchBookTitle(transactionData.callno);
          setBookTitle(title);
        } catch (error) {
          console.error("Error fetching book title:", error);
          setBookTitle("Unable to fetch book title");
        }
      }
    };

    getBookTitle();
  }, [isOpen, transactionData.callno]);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      window.dispatchEvent(new Event("transactionFinished"));
    } catch (error) {
      console.error("Error confirming transaction:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setIsCancelling(true);
    setTimeout(() => {
      onClose();
      setIsCancelling(false);
    }, 500);
  };

  const getStatusDisplay = () => {
    switch (transactionData.status) {
      case "BORROWED":
      case "RETURNED":
      case "EXTENDED":
      case "CLEARED":
      case "ADDITION":
        return transactionData.status;
      default:
        return "UNKNOWN";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Transaction</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 col-span-2 text-gray-900">
                  Book Title
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  📚 {bookTitle}
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 col-span-2 text-gray-900">
                  Call Number
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {transactionData.callno}
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 col-span-2 text-gray-900">
                  Accession Number
                </dt>
                <dd className="mt-1 font-bold text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-start">
                  #{transactionData.accession_number}
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 col-span-2 text-gray-900">
                  Status
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-start align-">
                  {getStatusDisplay()}
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 col-span-2 text-gray-900">
                  Transaction Date
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-start align-">
                  {transactionData.transaction_date}
                </dd>
              </div>
              <div className="hidden px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 col-span-2 text-gray-900">
                  Placing Number
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-start align-">
                  {transactionData.placing_number}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading || isCancelling}
          >
            {isCancelling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling
              </>
            ) : (
              "Cancel"
            )}
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading || isCancelling}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
