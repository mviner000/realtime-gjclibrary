"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayPickerSingleProps } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useRef, useEffect, useCallback } from "react";

export type CalendarProps = Omit<DayPickerSingleProps, "mode"> & {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect?: (date: Date) => void;
  activeCellIndex: number | null;
  currentCellIndex: number;
};

function CardCalendar({
  className,
  classNames,
  showOutsideDays = true,
  isOpen,
  onClose,
  onDateSelect,
  activeCellIndex,
  currentCellIndex,
  ...props
}: CalendarProps) {
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [month, setMonth] = React.useState<Date>(new Date());
  const [yearInput, setYearInput] = React.useState(year.toString());
  const popoverRef = useRef<HTMLDivElement>(null);

  const years = Array.from({ length: 10 }, (_, i) => year - 5 + i);

  useEffect(() => {
    console.log("[CardCalendar] Calendar state:", isOpen ? "open" : "closed");
  }, [isOpen]);

  // Memoize the keyboard event handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        isOpen &&
        activeCellIndex === currentCellIndex
      ) {
        console.log("[CardCalendar] ESC pressed, closing calendar");
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    },
    [isOpen, onClose, activeCellIndex, currentCellIndex]
  );

  useEffect(() => {
    if (isOpen && activeCellIndex === currentCellIndex) {
      window.addEventListener("keydown", handleKeyDown, true);
      return () => window.removeEventListener("keydown", handleKeyDown, true);
    }
  }, [isOpen, activeCellIndex, currentCellIndex, handleKeyDown]);

  const handleYearChange = (newYear: number) => {
    console.log("[CardCalendar] Year changed to:", newYear);
    setYear(newYear);
    setMonth(new Date(newYear, month.getMonth(), 1));
  };

  const handleYearSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newYear = parseInt(yearInput, 10);
    if (!isNaN(newYear) && newYear > 0 && newYear < 10000) {
      handleYearChange(newYear);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      console.log("[CardCalendar] Date selected:", format(date, "yyyy-MM-dd"));
      onDateSelect?.(date);
    }
  };

  return (
    <div
      ref={popoverRef}
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col cursor-pointer"
    >
      <DayPicker
        mode="single"
        showOutsideDays={showOutsideDays}
        className={cn("p-3 flex-1 flex flex-col", className)}
        onSelect={handleDateSelect}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
          month: "space-y-4 flex-1",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            Button.defaultProps?.className,
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1 flex-1 h-[340px]",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            Button.defaultProps?.className,
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-emerald-500/50"
          ),
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
        }}
        month={month}
        onMonthChange={(newMonth) => {
          console.log(
            "[CardCalendar] Month changed to:",
            format(newMonth, "yyyy-MM")
          );
          setMonth(newMonth);
        }}
        footer={
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="p-2"
              onClick={(e) => {
                e.stopPropagation();
                setMonth(new Date(year, month.getMonth() - 1, 1));
              }}
            >
              Prev Month
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  {year}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
              >
                <form onSubmit={handleYearSubmit} className="flex space-x-2">
                  <Input
                    type="number"
                    value={yearInput}
                    onChange={(e) => setYearInput(e.target.value)}
                    min="1"
                    max="9999"
                    className="w-full"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button type="submit" onClick={(e) => e.stopPropagation()}>
                    Go
                  </Button>
                </form>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {years.map((y) => (
                    <Button
                      key={y}
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleYearChange(y);
                      }}
                    >
                      {y}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setMonth(new Date(year, month.getMonth() + 1, 1));
              }}
            >
              Next Month
            </Button>
          </div>
        }
        {...props}
      />
    </div>
  );
}

CardCalendar.displayName = "CardCalendar";

export { CardCalendar };
