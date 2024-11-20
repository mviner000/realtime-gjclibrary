import { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { BookSuggestion } from "@/types";
import { fetchBookSuggestions } from "../utils/api";

const useBookSuggestions = () => {
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [selectedBookTitle, setSelectedBookTitle] = useState<string>("");

  // Separate the fetch logic from debounce
  const fetchSuggestions = useCallback(async (query: string) => {
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
      setSuggestions([]);
      setIsPopoverOpen(false);
    }
  }, []);

  // Create a debounced version of the fetch function
  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    [fetchSuggestions]
  );

  // Cleanup the debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [debouncedFetchSuggestions]);

  const handleSuggestionClick = useCallback((suggestion: BookSuggestion) => {
    setSelectedBookTitle(suggestion.title);
    setSuggestions([]);
    setActiveCell(null);
    setIsPopoverOpen(false);
  }, []);

  const closePopover = useCallback(() => {
    setSuggestions([]);
    setActiveCell(null);
    setIsPopoverOpen(false);
  }, []);

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
