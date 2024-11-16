import React, { useState } from "react";
import { CellData, BookTransaction, BookRecord, TransactionData } from "@/types";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CardCalendar } from "@/components/ui/library-card-calendar-picker";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useBookTransactionsContext } from "@/app/students/_hooks/useBookTransactions";
import ConfirmationModal from "./ConfirmationModal";

interface ColumnProps {
  isLastColumn: boolean;
  startNumber: number;
  onDataChange: (index: number, value: string) => void;
  onLineThroughToggle: (index: number) => void;
  gridData: { [key: number]: CellData };
  studentId: string;
  mode: string;
  onInsertClick: (index: number) => void;
  getCellClassName: (cellIndex: number) => string;
  className?: string;
  onDateSelect: (cellIndex: number, date: Date) => void;
}

interface MoveConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sourceIndex: number;
  targetIndex: number;
  recordDetails: {
    value: string;
    recordType?: string;
    callNo?: string;
    datetime?: string;
    recordId?: number;
    accessionNumber?: string;
    bookTitle?: string;
  };
}

const HIDDEN_TEXTS = [
  "CLEARED",
  "BORROWED",
  "RETURNED",
  "ADDITION",
  "EXTENDED",
  "SUBTRACTION",
];

const shouldHideText = (text: string): boolean => {
  if (!text) return false;
  const upperText = text.trim().toUpperCase();
  return HIDDEN_TEXTS.some((hiddenText) => {
    const lines = upperText.split("\n");
    return lines.some((line) => line.trim() === hiddenText);
  });
};

const getDisplayText = (cellData: CellData): string => {
  if (!cellData || !cellData.value) return "";

  const lines = cellData.value.split("\n");
  if (lines.length < 2) return cellData.value;

  // If first line contains hidden text, return only the second line
  if (shouldHideText(lines[0])) {
    return lines.slice(1).join("\n");
  }

  return cellData.value;
};

const processDisplayText = (text: string, maxLength: number = 30): string => {
  if (shouldHideText(text)) {
    const lines = text.split("\n");
    // Return the date part only if it exists
    return lines.length > 1 ? lines[1] : "";
  }
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const findTransactionAndRecordByPlacingNumber = (
  bookTransactions: BookTransaction[] | null,
  placingNumber: number
): { transaction: BookTransaction | null; record: BookRecord | null } => {
  if (!bookTransactions) return { transaction: null, record: null };

  for (const transaction of bookTransactions) {
    const record = transaction.records.find(
      (r) => r.placing_number === placingNumber
    );
    if (record) {
      return { transaction, record };
    }
  }
  return { transaction: null, record: null };
};

const MoveConfirmationDialog: React.FC<MoveConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  sourceIndex,
  targetIndex,
  recordDetails,
}) => (
  <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Move Operation</DialogTitle>
        <DialogDescription>
          Are you sure you want to move this record?
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-2">
        <p>
          <strong>From Cell:</strong> {sourceIndex} → <strong>To Cell:</strong>{" "}
          {targetIndex}
        </p>
        <p>
          <strong>Status:</strong> {recordDetails.recordType || "N/A"}
        </p>
        <p>
          <strong>Call Number:</strong> {recordDetails.callNo || "N/A"}
        </p>
        <p>
          <strong>Date:</strong> {recordDetails.datetime || "N/A"}
        </p>
        <p>
          <strong>Record ID:</strong> {recordDetails.recordId || "N/A"}
        </p>
        <p>
          <strong>Accession:</strong> {recordDetails.accessionNumber || "N/A"}
        </p>
        <p>
          <strong>Book Title:</strong> {recordDetails.bookTitle || "N/A"}
        </p>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Confirm Move</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const Column: React.FC<ColumnProps> = ({
  isLastColumn,
  startNumber,
  onDataChange,
  onLineThroughToggle,
  gridData,
  studentId,
  mode,
  onInsertClick,
  getCellClassName,
  className,
  onDateSelect,
}) => {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<number | null>(null);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [moveDetails, setMoveDetails] = useState<any>(null);
  const [calendarOpen, setCalendarOpen] = useState<{ [key: number]: boolean }>({});
  const { toast } = useToast();
  const { bookTransactions, refreshBookTransactions } =
    useBookTransactionsContext();

  
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [pendingTransactionData, setPendingTransactionData] = useState<TransactionData>({
    accounts_school_id: "",
    accession_number: "18031",
    callno: "00000",
    status: "CLEARANCE",
    placing_number: 0,
    transaction_date: new Date().toISOString().split('T')[0]
  });

  const handleDragStart = (e: React.DragEvent, cellIndex: number) => {
    if (editingCell === cellIndex) return;
    const cellData = gridData[cellIndex];
    if (cellData && cellData.value) {
      const { transaction, record } = findTransactionAndRecordByPlacingNumber(
        bookTransactions,
        cellIndex
      );

      const dragData = JSON.stringify({
        index: cellIndex,
        value: cellData.value,
        transaction: transaction,
        record: record,
      });
      e.dataTransfer.setData("application/json", dragData);
      e.dataTransfer.effectAllowed = "move";
      e.currentTarget.classList.add("opacity-50");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    e.currentTarget.classList.add("bg-yellow-100");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-yellow-100");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
  };

  const updatePlacingNumber = async (
    recordId: number,
    newPlacingNumber: number
  ) => {
    try {
      const response = await fetch(`/api/update-bookrecord/${recordId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          placing_number: newPlacingNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update placing number");
      }

      return data;
    } catch (error) {
      console.error("Error updating placing number:", error);
      throw error;
    }
  };

  const handleDrop = async (e: React.DragEvent, targetCellIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-yellow-100");

    try {
      const dragData = JSON.parse(e.dataTransfer.getData("application/json"));
      const { index: sourceIndex, value, transaction, record } = dragData;

      if (sourceIndex !== targetCellIndex) {
        setMoveDetails({
          sourceIndex,
          targetIndex: targetCellIndex,
          value,
          record,
          recordDetails: {
            value: processDisplayText(value),
            recordType: record?.record_type,
            callNo: transaction?.callno,
            datetime: record?.datetime
              ? new Date(record.datetime).toLocaleDateString()
              : undefined,
            recordId: record?.id,
            accessionNumber: transaction?.accession_number,
            bookTitle: transaction?.book_title,
          },
        });
        setMoveDialogOpen(true);
      }
    } catch (error) {
      console.error("Drop error:", error);
      toast({
        title: "Move Failed",
        description: "Failed to move content between cells. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleMoveConfirm = async () => {
    try {
      if (!moveDetails) return;

      const { sourceIndex, targetIndex, value, record, recordDetails } =
        moveDetails;

      await updatePlacingNumber(record.id, targetIndex);

      // Update the UI with processed text
      onDataChange(targetIndex, value);
      onDataChange(sourceIndex, "");

      // Refresh the book transactions data
      await refreshBookTransactions();

      toast({
        title: "Content Moved Successfully",
        description: (
          <div className="mt-2 space-y-2">
            <p>
              <strong>From Cell:</strong> {sourceIndex} →{" "}
              <strong>To Cell:</strong> {targetIndex}
            </p>
            <p>
              <strong>Status:</strong> {recordDetails.recordType}
            </p>
            <p>
              <strong>Call Number:</strong> {recordDetails.callNo}
            </p>
            <p>
              <strong>Date:</strong> {recordDetails.datetime}
            </p>
            <p>
              <strong>Record ID:</strong> {recordDetails.recordId}
            </p>
            <p>
              <strong>Accession:</strong> {recordDetails.accessionNumber}
            </p>
            <p>
              <strong>Book Title:</strong> {recordDetails.bookTitle}
            </p>
          </div>
        ),
        duration: 5000,
        action: (
          <ToastAction altText="Close" onClick={() => {}}>
            Dismiss
          </ToastAction>
        ),
      });
    } catch (error) {
      console.error("Move error:", error);
      toast({
        title: "Move Failed",
        description: "Failed to update placing number. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setMoveDialogOpen(false);
      setMoveDetails(null);
    }
  };

  const handleClearClick = async (cellIndex: number) => {
    // Directly set the transaction data and open confirmation modal
    setPendingTransactionData({
      accounts_school_id: studentId,
      accession_number: "18031",
      callno: "00000",
      status: "CLEARANCE",
      placing_number: cellIndex,
      transaction_date: new Date().toISOString().split('T')[0]
    });
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmationSubmit = async () => {
    try {
      const response = await fetch('/api/book-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pendingTransactionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create clearance transaction');
      }

      const data = await response.json();
      
      const recordDateTime = data.records[0]?.datetime 
        ? new Date(data.records[0].datetime).toLocaleDateString()
        : new Date().toLocaleDateString();
        
      onDataChange(pendingTransactionData.placing_number, `CLEARANCE\n${recordDateTime}`);
      
      await refreshBookTransactions();

      toast({
        title: "Clearance Added",
        description: `Successfully added clearance record for ${data.book_title}`,
        duration: 3000,
      });

      // Add a small delay before reloading
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error creating clearance:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add clearance record",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsConfirmationModalOpen(false);
    }
  };

  const handleModalCancel = () => {
    setIsConfirmationModalOpen(false);
    setPendingTransactionData({
      accounts_school_id: "",
      accession_number: "18031",
      callno: "00000",
      status: "CLEARANCE",
      placing_number: 0,
      transaction_date: new Date().toISOString().split('T')[0]
    });
  };

  const handleOpenChange = (open: boolean, cellIndex: number) => {
    // Only allow closing via ESC or outside click if this is the active cell
    if (!open && cellIndex === activeCell) {
      setCalendarOpen(prev => ({
        ...prev,
        [cellIndex]: false
      }));
      setActiveCell(null);
    } else if (open) {
      // When opening, set all other cells' calendars to false and this one to true
      const newCalendarState = Object.keys(calendarOpen).reduce((acc, key) => ({
        ...acc,
        [key]: false
      }), {});
      setCalendarOpen({
        ...newCalendarState,
        [cellIndex]: true
      });
      setActiveCell(cellIndex);
    }
  };

  
  const handleDateIconClick = (e: React.MouseEvent, cellIndex: number) => {
    e.stopPropagation();
    setActiveCell(cellIndex);
    setIsCalendarDialogOpen(true);
  };
  


  const handleDateSelect = (date: Date | undefined) => {
    if (date && activeCell !== null) {
      onDateSelect(activeCell, date);
      setIsCalendarDialogOpen(false);
    }
  };

  const handleClose = () => {
    // Reset all calendar popover states to false
    setCalendarOpen({});
    setActiveCell(null);
  };

  const handleCellClick = (cellIndex: number) => {
    setEditingCell(cellIndex);
  };

  const handleBlur = () => {
    setEditingCell(null);
  };

  return (
    <>
  
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleModalCancel}
        onConfirm={handleConfirmationSubmit}
        transactionData={pendingTransactionData}
      />
      <div
        className={cn(
          "flex flex-col",
          isLastColumn ? "" : "border-r border-black",
          className
        )}
      >
        {[...Array(9)].map((_, rowIndex) => {
          const cellIndex = Math.max(1, startNumber + rowIndex);
          const cellData = gridData[cellIndex] || {
            value: "",
            isLineThrough: false,
          };
          const isDraggable =
            cellData.value.trim() !== "" && editingCell !== cellIndex;
          const isEditing = editingCell === cellIndex;

          const displayText = processDisplayText(getDisplayText(cellData));

          return (
            <div
              key={rowIndex}
              className={cn(
                "font-bold font-sans relative flex items-center justify-center border-b border-black last:border-b-1 text-center min-h-[50px]",
                getCellClassName(cellIndex),
                isDraggable ? "cursor-move" : "cursor-text",
                "transition-colors duration-200"
              )}
              onMouseEnter={() => setHoveredCell(cellIndex)}
              onMouseLeave={() => setHoveredCell(null)}
              draggable={isDraggable}
              onDragStart={(e) => handleDragStart(e, cellIndex)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, cellIndex)}
              onDoubleClick={() => onLineThroughToggle(cellIndex)}
              onClick={() => handleCellClick(cellIndex)}
            >
              {hoveredCell === cellIndex && !isDraggable && (
                 <button
                 className="absolute left-0 top-0 p-1 hover:opacity-80"
                 onClick={(e) => {
                   e.stopPropagation();
                   handleClearClick(cellIndex);
                 }}
               >
                 ✅
               </button>
              )}

              {isEditing ? (
                <textarea
                  className="w-full h-[39px] bg-transparent text-center resize-none outline-none focus:outline-dashed focus:outline-green-500 pb-1 overflow-y-auto"
                  value={cellData.value}
                  onChange={(e) => onDataChange(cellIndex, e.target.value)}
                  onBlur={handleBlur}
                  autoFocus
                />
              ) : (
                <div
                  className={cn(
                    "w-full pt-[15px] select-none",
                    cellData.isLineThrough && "line-through",
                    isDraggable &&
                      "rounded px-2 shadow-sm hover:shadow-md transition-shadow duration-200"
                  )}
                  title={cellData.value}
                >
                  {displayText}
                </div>
              )}

              {hoveredCell === cellIndex &&
                !isDraggable &&
                mode === "editor" && (
                  <button
                  className="absolute right-0 top-0 p-1 hover:opacity-80"
                  onClick={(e) => handleDateIconClick(e, cellIndex)}
                >
                  📅
                </button>
                )}
            </div>
          );
        })}
      </div>

      <Dialog open={isCalendarDialogOpen} onOpenChange={setIsCalendarDialogOpen}>
      <DialogContent className="sm:max-w-[320px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Date</DialogTitle>
        </DialogHeader>
        <div className="flex-grow">
          <CardCalendar
            isOpen={isCalendarDialogOpen}
            onClose={() => setIsCalendarDialogOpen(false)}
            onDateSelect={handleDateSelect}
            activeCellIndex={activeCell}
            currentCellIndex={activeCell || 0}
          />
        </div>
        <DialogFooter className="flex justify-start text-left mt-4">
        <div className="absolute bottom-0 left-4 !important">
          <Button
            type="button"
            onClick={() => setIsCalendarDialogOpen(false)}
            className="!absolute !bottom-4 !left-4"
          >
            Close
          </Button>
        </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

      {moveDetails && (
        <MoveConfirmationDialog
          isOpen={moveDialogOpen}
          onClose={() => {
            setMoveDialogOpen(false);
            setMoveDetails(null);
          }}
          onConfirm={handleMoveConfirm}
          sourceIndex={moveDetails.sourceIndex}
          targetIndex={moveDetails.targetIndex}
          recordDetails={moveDetails.recordDetails}
        />
      )}
    </>
  );
};

export default Column;
