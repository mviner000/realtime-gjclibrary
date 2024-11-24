// SuggestionPopover.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BookSuggestion } from "@/types";

interface SuggestionPopoverProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeCell: number | null;
  suggestions: BookSuggestion[];
  onSuggestionClick: (suggestion: BookSuggestion) => void;
  onClose: () => void;
  lastInput: string;
  onCancel: (cellIndex: number) => void;  // New prop for handling cancellation
}

const SuggestionPopover: React.FC<SuggestionPopoverProps> = ({
  isOpen,
  setIsOpen,
  activeCell,
  suggestions,
  onSuggestionClick,
  onClose,
  lastInput,
  onCancel,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsModalOpen(true);
      setSearchTerm(lastInput);
    } else {
      setIsModalOpen(false);
    }
  }, [isOpen, lastInput]);

  useEffect(() => {
    if (isModalOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isModalOpen]);

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.callno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suggestion.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClose = () => {
    setIsModalOpen(false);
    setIsOpen(false);
    if (activeCell !== null) {
      onCancel(activeCell);  // Call onCancel with the active cell index
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md" onKeyDown={handleKeyDown}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Search Suggestions</h2>
        </div>
        <div className="grid gap-4">
          <Input
            ref={searchInputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="col-span-4"
            placeholder="Search suggestions..."
          />
          <div className="max-h-[300px] overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => {
                  onSuggestionClick(suggestion);
                  setIsModalOpen(false);
                  setIsOpen(false);
                }}
                className="px-3 py-2 hover:bg-green-100 dark:hover:text-black rounded-lg cursor-pointer"
              >
                {suggestion.callno} - {suggestion.title}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestionPopover;