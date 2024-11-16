"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { CardDatePicker } from "@/components/ui/card-date-picker";

interface CellProps {
  index: number;
  isLastColumn: boolean;
  onChange: (value: string) => void;
  onDateChange: (date: Date | null) => void;
  studentId: string;
  mode: "editor" | "checker" | "viewer";
}

const Cell: React.FC<CellProps> = ({
  index,
  isLastColumn,
  onChange,
  onDateChange,
  studentId,
  mode,
}) => {
  const [inputType, setInputType] = useState<"text" | "date">("text");
  const [textValue, setTextValue] = useState("");
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLineThrough, setIsLineThrough] = useState(false);
  const cellRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedValue = localStorage.getItem(`gridData_${studentId}_${index}`);
    const savedLineThrough = localStorage.getItem(
      `gridLineThrough_${studentId}_${index}`
    );
    if (savedValue) {
      if (savedValue.includes("T")) {
        setInputType("date");
        setDateValue(new Date(savedValue));
      } else {
        setInputType("text");
        setTextValue(savedValue);
      }
    }
    setIsLineThrough(savedLineThrough === "true");
  }, [index, studentId]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value.slice(0, 28);
    setTextValue(newValue);
    onChange(newValue);
    if (newValue) {
      localStorage.setItem(`gridData_${studentId}_${index}`, newValue);
    } else {
      localStorage.removeItem(`gridData_${studentId}_${index}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  };

  const handleDateChange = (date: Date | null) => {
    setDateValue(date);
    onDateChange(date);
    if (date) {
      localStorage.setItem(
        `gridData_${studentId}_${index}`,
        date.toISOString()
      );
    } else {
      localStorage.removeItem(`gridData_${studentId}_${index}`);
    }
    setIsDatePickerOpen(false);
  };

  const toggleInputType = () => {
    setInputType(inputType === "text" ? "date" : "text");
    setIsDatePickerOpen(inputType === "text");
  };

  const handleClick = (e: React.MouseEvent) => {
    if (mode === "checker" && (textValue || dateValue)) {
      const newLineThroughState = !isLineThrough;
      setIsLineThrough(newLineThroughState);
      localStorage.setItem(
        `gridLineThrough_${studentId}_${index}`,
        newLineThroughState.toString()
      );
    }
  };

  return (
    <div
      ref={cellRef}
      className={`h-0 border-b border-black ${
        !isLastColumn ? "border-r" : ""
      } relative min-h-[3rem] flex items-center ${
        mode === "checker" ? "cursor-pointer" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="w-full px-2">
        {mode === "editor" && (isHovered || isDatePickerOpen) ? (
          <>
            {inputType === "text" ? (
              <textarea
                ref={textareaRef}
                value={textValue}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-b border-dotted border-gray-400 focus:outline-none focus:border-black resize-none overflow-hidden"
                placeholder="Enter text..."
                rows={1}
                style={{ height: "auto", minHeight: "1.5rem" }}
              />
            ) : (
              <CardDatePicker
                selected={dateValue}
                onChange={handleDateChange}
                className="w-full"
                onCalendarOpen={() => setIsDatePickerOpen(true)}
                onCalendarClose={() => setIsDatePickerOpen(false)}
              />
            )}
            <button
              onClick={toggleInputType}
              className="text-xs text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              {inputType === "text" ? "Date" : "Text"}
            </button>
          </>
        ) : (
          <div
            className={`w-full overflow-hidden ${
              isLineThrough ? "red-line-through" : ""
            }`}
          >
            {inputType === "date" && dateValue ? (
              <span
                className={`text-purple-700 text-lg font-extrabold px-2 py-1 rounded ${
                  isLineThrough ? "red-line-through" : ""
                }`}
              >
                {format(dateValue, "dd MMM yyyy").toUpperCase()}
              </span>
            ) : (
              <p
                className={`font-sans whitespace-pre-wrap break-words font-bold ${
                  isLineThrough ? "red-line-through" : ""
                }`}
              >
                {textValue.toUpperCase()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface ColumnProps {
  isLastColumn: boolean;
  startNumber: number;
  onDataChange: (index: number, value: string) => void;
  studentId: string;
  mode: "editor" | "checker" | "viewer";
}

const Column: React.FC<ColumnProps> = ({
  isLastColumn,
  startNumber,
  onDataChange,
  studentId,
  mode,
}) => (
  <div className="flex flex-col">
    {[...Array(13)].map((_, index) => (
      <Cell
        key={index}
        index={startNumber + index - 1}
        isLastColumn={isLastColumn}
        onChange={(value) => onDataChange(startNumber + index - 1, value)}
        onDateChange={(date) =>
          onDataChange(startNumber + index - 1, date ? date.toISOString() : "")
        }
        studentId={studentId}
        mode={mode}
      />
    ))}
  </div>
);

interface GridProps {
  mode?: "editor" | "checker" | "viewer";
}

const Grid: React.FC<GridProps> = ({ mode = "editor" }) => {
  const numberOfColumns = 6;
  const pathname = usePathname();
  const [studentId, setStudentId] = useState<string>("");

  useEffect(() => {
    const pathParts = pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    if (id && !isNaN(Number(id))) {
      setStudentId(id);
    }
  }, [pathname]);

  const handleDataChange = (index: number, value: string) => {
    if (value && studentId) {
      localStorage.setItem(`gridData_${studentId}_${index}`, value);
    } else if (studentId) {
      localStorage.removeItem(`gridData_${studentId}_${index}`);
    }
  };

  if (!studentId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-10 font-semibold text-center">
      <div className="grid grid-cols-6">
        {[...Array(numberOfColumns)].map((_, columnIndex) => (
          <Column
            key={columnIndex}
            isLastColumn={columnIndex === numberOfColumns - 1}
            startNumber={columnIndex * 13 + 1}
            onDataChange={handleDataChange}
            studentId={studentId}
            mode={mode}
          />
        ))}
      </div>
    </div>
  );
};

export default Grid;
