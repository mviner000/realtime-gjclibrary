import { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { AccessionSuggestion } from "@/types";
import { fetchAccessionSuggestions } from "../utils/api";

const useAccessionSuggestions = () => {
  const [accessionSuggestions, setAccessionSuggestions] = useState<
    AccessionSuggestion[]
  >([]);

  // Create the fetch function without debounce first
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setAccessionSuggestions([]);
      return;
    }

    try {
      const data: string[] = await fetchAccessionSuggestions(query);
      setAccessionSuggestions(
        data.map((accession_number) => ({ accession_number }))
      );
    } catch (error) {
      console.error("Error fetching accession suggestions:", error);
      setAccessionSuggestions([]);
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

  const handleAccessionChange = useCallback(
    (value: string) => {
      debouncedFetchSuggestions(value);
    },
    [debouncedFetchSuggestions]
  );

  const handleAccessionSuggestionClick = useCallback(
    (suggestion: AccessionSuggestion) => {
      // You can implement any additional logic here if needed
      console.log("Accession suggestion clicked:", suggestion);
    },
    []
  );

  return {
    accessionSuggestions,
    setAccessionSuggestions,
    handleAccessionChange,
    handleAccessionSuggestionClick,
  };
};

export default useAccessionSuggestions;
