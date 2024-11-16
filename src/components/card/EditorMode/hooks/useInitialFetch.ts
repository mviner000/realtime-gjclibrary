import { useEffect, useRef, useState } from "react";
import { fetchBookRecordsData } from "../utils/api";
import { formatGridData } from "../utils/formatters";
import { BookRecord } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export const useInitialFetch = (
  studentId: string,
  updateGridData: (index: number, value: string) => void
) => {
  const hasInitialFetch = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookRecords = async () => {
      if (!studentId) {
        toast({
          title: "Invalid Student ID",
          description: "Please provide a valid student ID.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (hasInitialFetch.current) return;
      setIsLoading(true);
      setError(null);
      try {
        hasInitialFetch.current = true;

        const account_school_id = studentId;
        const bookRecordsData: BookRecord[] = await fetchBookRecordsData(
          account_school_id
        );

        if (bookRecordsData && bookRecordsData.length > 0) {
          const gridUpdates = new Map();
          bookRecordsData.forEach((record: BookRecord) => {
            let placingNumber = record.placing_number;
            if (placingNumber === 0) {
              placingNumber = 1;
            }
            if (placingNumber) {
              const displayValue = formatGridData(record);
              gridUpdates.set(placingNumber, displayValue);
            }
          });

          gridUpdates.forEach((value, placingNumber) => {
            updateGridData(placingNumber, value);
          });
        } else {
          toast({
            title: "No Records",
            description: "No book records found for this student.",
            variant: "emerald",
          });
        }
      } catch (error) {
        console.error("Error fetching book records:", error);
        setError("Failed to load existing book records.");
        toast({
          variant: "emerald",
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load existing book records. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookRecords();
  }, [studentId, updateGridData, toast]);

  return { isLoading, error };
};
