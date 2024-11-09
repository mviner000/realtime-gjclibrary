import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BookSuggestion } from "@/types";

interface SuggestionPopoverProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeCell: number | null;
  suggestions: BookSuggestion[];
  onSuggestionClick: (suggestion: BookSuggestion) => void;
  onClose: () => void;
}

const SuggestionPopover: React.FC<SuggestionPopoverProps> = ({
  isOpen,
  setIsOpen,
  activeCell,
  suggestions,
  onSuggestionClick,
  onClose,
}) => {
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          data-cell-index={activeCell}
          className="absolute inset-0 pointer-events-none"
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0"
        align="start"
        sideOffset={5}
        onInteractOutside={onClose}
      >
        <ul className="max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.callno} - {suggestion.title}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default SuggestionPopover;
