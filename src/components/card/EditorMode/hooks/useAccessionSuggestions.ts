import { useState, useCallback } from "react";
import { debounce } from "lodash";
import { AccessionSuggestion } from "@/types";
import { fetchAccessionSuggestions } from "../utils/api";

const useAccessionSuggestions = () => {
  const [accessionSuggestions, setAccessionSuggestions] = useState<
    AccessionSuggestion[]
  >([]);

  const debouncedFetchAccessionSuggestions = useCallback(
    debounce(async (query: string) => {
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
      }
    }, 300),
    []
  );

  const handleAccessionChange = (value: string) => {
    debouncedFetchAccessionSuggestions(value);
  };

  const handleAccessionSuggestionClick = (suggestion: AccessionSuggestion) => {
    // You can implement any additional logic here if needed
    console.log("Accession suggestion clicked:", suggestion);
  };

  return {
    accessionSuggestions,
    setAccessionSuggestions,
    handleAccessionChange,
    handleAccessionSuggestionClick,
  };
};

export default useAccessionSuggestions;
