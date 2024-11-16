"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface CellData {
  value: string;
  isLineThrough: boolean;
}

export interface CellProps {
  index: number;
  isLastColumn: boolean;
  onChange: (index: number, value: string) => void;
  onLineThroughToggle?: (index: number) => void;
  cellData: CellData;
  studentId: string;
  mode: "editor" | "checker" | "viewer" | "add";
  onInsertClick?: () => void;
}

export interface ColumnProps {
  isLastColumn: boolean;
  startNumber: number;
  onDataChange: (index: number, value: string) => void;
  onLineThroughToggle?: (index: number) => void;
  gridData: { [key: number]: CellData };
  studentId: string;
  mode: "editor" | "checker" | "viewer" | "add";
  onInsertClick?: (index: number) => void;
}

export interface BookTransactionFormData {
  callno: string;
  accession_number: string;
  status: string;
  accounts_school_id: string;
  transaction_date: string;
}

export interface GridProps {
  mode: "editor" | "checker" | "viewer" | "add";
  studentId: string;
}

export const Cell: React.FC<CellProps> = ({
  index,
  isLastColumn,
  onChange,
  onLineThroughToggle,
  cellData,
  studentId,
  mode,
  onInsertClick,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value.slice(0, 28);
    onChange(index, newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (mode === "checker" && cellData.value && onLineThroughToggle) {
      onLineThroughToggle(index);
    }
  };

  return (
    <div
      className={`h-0 border-b border-black ${
        !isLastColumn ? "border-r" : ""
      } relative min-h-[3rem] flex items-center ${
        mode === "checker" ? "cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      <div className="w-full px-2">
        {mode === "add" && onInsertClick && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onInsertClick();
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          >
            Insert Here
          </Button>
        )}
        {mode === "editor" ? (
          <textarea
            ref={textareaRef}
            value={cellData.value}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-b border-dotted border-gray-400 focus:outline-none focus:border-black resize-none overflow-hidden"
            placeholder="Enter text..."
            rows={1}
            style={{ height: "auto", minHeight: "1.5rem" }}
          />
        ) : (
          <div
            className={`w-full overflow-hidden ${
              cellData.isLineThrough ? "line-through text-red-500" : ""
            }`}
          >
            <p className="font-sans whitespace-pre-wrap break-words font-bold">
              {cellData.value.toUpperCase()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const Column: React.FC<ColumnProps> = ({
  isLastColumn,
  startNumber,
  onDataChange,
  onLineThroughToggle,
  gridData,
  studentId,
  mode,
  onInsertClick,
}) => (
  <div className="flex flex-col">
    {[...Array(9)].map((_, index) => {
      const cellIndex = startNumber + index - 1;
      return (
        <Cell
          key={index}
          index={cellIndex}
          isLastColumn={isLastColumn}
          onChange={onDataChange}
          onLineThroughToggle={onLineThroughToggle}
          cellData={gridData[cellIndex] || { value: "", isLineThrough: false }}
          studentId={studentId}
          mode={mode}
          onInsertClick={
            onInsertClick ? () => onInsertClick(cellIndex) : undefined
          }
        />
      );
    })}
  </div>
);
