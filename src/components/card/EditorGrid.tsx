import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Column from "./EditorMode/Column";
import SuggestionPopover from "./EditorMode/SuggestionsPopover";
import TransactionModal from "./EditorMode/TransactionModal";
import ConfirmationModal from "./EditorMode/ConfirmationModal";
import ActionSelectionModal from "./EditorMode/ActionSelectionModal";
import { GridProps, BookSuggestion, BookRecord } from "@/types";
import useAccessionSuggestions from "./EditorMode/hooks/useAccessionSuggestions";
import useBookSuggestions from "./EditorMode/hooks/useBookSuggestions";
import useGridData from "./EditorMode/hooks/useGridData";
import useTransactionData from "./EditorMode/hooks/useTransactionData";
import {
  fetchAccessionSuggestions,
  createBookTransaction,
  editBookTransaction,
} from "./EditorMode/utils/api";
import { formatGridData } from "./EditorMode/utils/formatters";
import { useInitialFetch } from "./EditorMode/hooks/useInitialFetch";
import { useKeyboardEvents } from "./EditorMode/utils/keyboardEvents";
import {
  NUMBER_OF_COLUMNS,
  TRANSACTION_ACTIONS,
  TOAST_MESSAGES,
} from "./EditorMode/utils/constants";
import UpdateBookRecordModal from "./EditorMode/UpdateBookRecordModal";
import UpdateConfirmationModal from "./EditorMode/UpdateConfirmationModal";
import { format } from "date-fns";

import { useAutoReload } from "./EditorMode/AutoReloadWrapper";

interface EditorGridProps extends GridProps {
  mode: "editor" | "checker" | "viewer" | "add";
}

const EditorGrid: React.FC<EditorGridProps> = ({ studentId, mode }) => {
  const pathname = usePathname();
  const { toast } = useToast();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isActionSelectionModalOpen, setIsActionSelectionModalOpen] =
    useState(false);
  const [isUpdateConfirmationModalOpen, setIsUpdateConfirmationModalOpen] =
    useState(false);
  const [selectedAction, setSelectedAction] = useState<
    keyof typeof TRANSACTION_ACTIONS | null
  >(null);
  const [selectedBookTitle, setSelectedBookTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedCellIndex, setSelectedCellIndex] = useState<number | null>(
    null
  );
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [updateData, setUpdateData] = useState<{
    transactionId?: number;
    status?: string;
    transactionDate?: string;
    placingNumber?: number;
  } | null>(null);

  const [updateInitialData, setUpdateInitialData] = useState({
    transactionId: null,
    status: "BORROWED",
    transactionDate: "",
    placingNumber: null,
  });

  const {
    accessionSuggestions,
    setAccessionSuggestions,
    handleAccessionChange,
    handleAccessionSuggestionClick,
  } = useAccessionSuggestions();

  const {
    suggestions: bookSuggestions,
    isPopoverOpen,
    setIsPopoverOpen,
    activeCell,
    setActiveCell,
    debouncedFetchSuggestions,
    closePopover,
  } = useBookSuggestions();

  const {
    gridData,
    updateGridData,
    resetCell,
    handleLineThroughToggle,
    getCellClassName,
  } = useGridData();

  const {
    transactionData,
    setTransactionData,
    isModalOpen,
    setIsModalOpen,
    resetTransactionData,
  } = useTransactionData(pathname);

  useInitialFetch(studentId, updateGridData);

  const resetTransaction = () => {
    if (activeCell !== null) {
      resetCell(activeCell);
    }
    setActiveCell(null);
    closePopover();
    setIsModalOpen(false);
    setIsActionSelectionModalOpen(false);
    resetTransactionData();
    setAccessionSuggestions([]);
    setSelectedAction(null);
    setSelectedBookTitle("");
  };

  useKeyboardEvents(resetTransaction);

  const handleDataChange = (index: number, value: string) => {
    updateGridData(index, value);
    setActiveCell(index);
    debouncedFetchSuggestions(value);
  };

  const { triggerReload } = useAutoReload();

  const handleConfirmTransaction = async () => {
    try {
      const result = await createBookTransaction(transactionData);
      console.log("Transaction created:", result);

      // Create a partial BookRecord object
      const partialBookRecord: Partial<BookRecord> = {
        ...transactionData,
        record_type: transactionData.status,
        datetime: transactionData.transaction_date,
        account_school_id: transactionData.accounts_school_id, // Note the slight name difference
        // Add dummy values for missing required properties
        book_transaction_id: result.id || 0, // Assuming the API returns an id
        book_title: "Unknown Title", // You might want to store this in transactionData if available
      };

      const newDisplayValue = formatGridData(partialBookRecord as BookRecord);

      updateGridData(transactionData.placing_number, newDisplayValue);

      setIsModalOpen(false);
      setIsConfirmationModalOpen(false);
      toast(TOAST_MESSAGES.SUCCESS);
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast(TOAST_MESSAGES.ERROR);
    }
  };

  const handleSuggestionClick = async (suggestion: BookSuggestion) => {
    if (activeCell !== null) {
      updateGridData(activeCell, suggestion.callno);
      setTransactionData((prev) => ({
        ...prev,
        callno: suggestion.callno,
        placing_number: activeCell,
      }));
      closePopover();

      setSelectedBookTitle(suggestion.title);
      setIsActionSelectionModalOpen(true);
    }
  };

  const handleActionSelect = async (
    action: keyof typeof TRANSACTION_ACTIONS
  ) => {
    setSelectedAction(action);
    setIsActionSelectionModalOpen(false);

    try {
      const data: string[] = await fetchAccessionSuggestions(
        transactionData.callno
      );
      const suggestions = data.map((accessionNumber) => ({
        accession_number: accessionNumber,
      }));
      setAccessionSuggestions(suggestions);
      setTransactionData((prev) => ({ ...prev, status: action.toUpperCase() }));
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching accessions:", error);
      toast(TOAST_MESSAGES.FETCH_ERROR);
    }
  };

  const handleInsertClick = (index: number) => {
    console.log("Insert clicked at index:", index);
  };

  const handleModalSubmit = async () => {
    setIsConfirmationModalOpen(true);
  };

  const handleDateSelect = (cellIndex: number, date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setSelectedDate(formattedDate);
    setSelectedCellIndex(cellIndex);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateBookRecord = (data: any) => {
    setUpdateData({
      ...data,
      placing_number: data.placingNumber,
    });
    setIsUpdateModalOpen(false);
    setIsUpdateConfirmationModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    if (!updateData) return;

    try {
      const result = await editBookTransaction(updateData.transactionId!, {
        ...updateData,
        placing_number: updateData.placingNumber,
        transaction_date: updateData.transactionDate, // Ensure this is passed to the API
      });

      if (selectedCellIndex !== null) {
        const bookRecord: BookRecord = {
          record_type: result.status,
          datetime: updateData.transactionDate!, // Use the user-selected date
          placing_number: selectedCellIndex,
          book_transaction_id: result.id,
          account_school_id: studentId,
          status: result.status,
          callno: result.callno || "",
          accession_number: result.accession_number || "",
          book_title: result.book_callno || "",
        };

        const newDisplayValue = formatGridData(bookRecord);
        updateGridData(selectedCellIndex, newDisplayValue);
        setSelectedCellIndex(null);
        setUpdateData(null);
      }

      setIsUpdateConfirmationModalOpen(false);
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
      window.dispatchEvent(new Event("transactionFinished"));

      // Trigger auto-reload
      triggerReload();
    } catch (error) {
      console.error("Error updating book transaction:", error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-10 font-semibold text-center relative">
      <div className="grid grid-cols-6">
        {[...Array(NUMBER_OF_COLUMNS)].map((_, columnIndex) => (
          <Column
            key={columnIndex}
            isLastColumn={columnIndex === NUMBER_OF_COLUMNS - 1}
            startNumber={columnIndex * 9 + 1}
            onDataChange={handleDataChange}
            onLineThroughToggle={handleLineThroughToggle}
            gridData={gridData}
            studentId={studentId}
            mode="editor"
            onInsertClick={handleInsertClick}
            getCellClassName={getCellClassName}
            onDateSelect={handleDateSelect}
          />
        ))}
      </div>
      <SuggestionPopover
        isOpen={isPopoverOpen}
        setIsOpen={setIsPopoverOpen}
        activeCell={activeCell}
        suggestions={bookSuggestions}
        onSuggestionClick={handleSuggestionClick}
        onClose={closePopover}
      />
      <ActionSelectionModal
        isOpen={isActionSelectionModalOpen}
        onClose={() => setIsActionSelectionModalOpen(false)}
        onActionSelect={handleActionSelect}
        bookTitle={selectedBookTitle}
      />
      <TransactionModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        transactionData={transactionData}
        setTransactionData={setTransactionData}
        accessionSuggestions={accessionSuggestions}
        handleAccessionChange={handleAccessionChange}
        handleAccessionSuggestionClick={handleAccessionSuggestionClick}
        onSubmit={handleModalSubmit}
        onCancel={resetTransaction}
        selectedAction={selectedAction!}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleConfirmTransaction}
        transactionData={transactionData}
      />
      <UpdateBookRecordModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        initialData={{
          placingNumber: selectedCellIndex || 0,
          status: "",
          transactionDate: selectedDate, // Pass the selected date from the calendar
          accountSchoolId: studentId,
        }}
        onSubmit={handleUpdateBookRecord}
      />
      <UpdateConfirmationModal
        isOpen={isUpdateConfirmationModalOpen}
        onClose={() => setIsUpdateConfirmationModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        updateData={updateData}
      />
    </div>
  );
};

export default EditorGrid;
