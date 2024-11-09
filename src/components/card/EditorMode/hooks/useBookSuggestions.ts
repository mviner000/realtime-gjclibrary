import { useState, useCallback } from "react";
import { debounce } from "lodash";
import { BookSuggestion } from "@/types";
import { fetchBookSuggestions } from "../utils/api";

const useBookSuggestions = () => {
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [selectedBookTitle, setSelectedBookTitle] = useState<string>("");

  const debouncedFetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        setIsPopoverOpen(false);
        return;
      }
      try {
        const data = await fetchBookSuggestions(query);
        setSuggestions(data);
        setIsPopoverOpen(data.length > 0);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }, 300),
    []
  );

  const handleSuggestionClick = (suggestion: BookSuggestion) => {
    setSelectedBookTitle(suggestion.title);
    // Implementation depends on how you want to handle this
    console.log("Suggestion clicked:", suggestion);
    // You might want to update the grid data or transaction data here
    closePopover();
  };

  const closePopover = () => {
    setSuggestions([]);
    setActiveCell(null);
    setIsPopoverOpen(false);
  };

  return {
    suggestions,
    isPopoverOpen,
    setIsPopoverOpen,
    activeCell,
    setActiveCell,
    debouncedFetchSuggestions,
    handleSuggestionClick,
    closePopover,
    selectedBookTitle,
  };
};

export default useBookSuggestions;
