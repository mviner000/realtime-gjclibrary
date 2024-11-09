import React, { useState, useEffect } from "react";
import { CellData } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CardCalendar } from "@/components/ui/library-card-calendar-picker";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

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
  onDateSelect: (cellIndex: number, date: Date) => void; // Modified signature
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const Column: React.FC<ColumnProps> = ({
  isLastColumn,
  startNumber,
  onDataChange,
  gridData,
  getCellClassName,
  className,
  onDateSelect,
}) => {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);

  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    console.log("[Column] Calendar open change requested:", open);
    if (open) {
      setCalendarOpen(true);
    }
  };

  const handleClose = () => {
    console.log("[Column] Calendar closing");
    setCalendarOpen(false);
  };

  // Fixed type definition to match DayPicker's expected type
  const handleDateSelect = (cellIndex: number) => (date: Date | undefined) => {
    if (date) {
      // Directly pass the date to parent
      onDateSelect(cellIndex, date);
      setCalendarOpen(false);
    }
  };

  const handleClearClick = () => {
    toast({
      title: "Cleared feature is in BETA MODE ",
      description: "Waiting for confirmation for this feature.",
      action: <ToastAction altText="Goto schedule to undo">Close</ToastAction>,
    });
  };

  return (
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
        return (
          <div
            key={rowIndex}
            className={cn(
              "font-bold font-sans relative flex items-center justify-center border-b border-black last:border-b-1 text-center",
              getCellClassName(cellIndex)
            )}
            onMouseEnter={() => setHoveredCell(cellIndex)}
            onMouseLeave={() => setHoveredCell(null)}
          >
            {hoveredCell === cellIndex && (
              <button
                className="absolute left-0 top-0 p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearClick();
                }}
              >
                ✅
              </button>
            )}
            <textarea
              className={cn(
                "w-full bg-transparent text-center resize-none outline-none focus:outline-dashed focus:outline-green-500",
                cellData.isLineThrough && "line-through"
              )}
              value={truncateText(
                cellData.value
                  .replace(/BORROWED/g, "")
                  .replace(/ADDITION/g, "")
                  .replace(/EXTENDED/g, "")
                  .replace(/RETURNED/g, "")
                  .replace(/CLEARED/g, ""),
                17
              )}
              title={cellData.value}
              onChange={(e) => onDataChange(cellIndex, e.target.value)}
            />
            {hoveredCell === cellIndex && (
              <Popover
                open={calendarOpen}
                onOpenChange={(open) => setCalendarOpen(open)}
              >
                <PopoverTrigger asChild>
                  <button
                    className="absolute right-0 top-0 p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCalendarOpen(true);
                    }}
                  >
                    📅
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CardCalendar
                    selected={undefined}
                    onSelect={handleDateSelect(cellIndex)}
                    initialFocus
                    isOpen={calendarOpen}
                    onClose={() => setCalendarOpen(false)}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Column;
