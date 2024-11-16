import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { BookTransaction } from "@/types";

interface BookTransactionsContextType {
  bookTransactions: BookTransaction[] | null;
  error: string | null;
  refreshTransactions: () => void;
  refreshBookTransactions: () => Promise<void>;
  isRefreshing: boolean;
  refreshCount: number;
}

const BookTransactionsContext = createContext<
  BookTransactionsContextType | undefined
>(undefined);

export const useBookTransactions = (accountSchoolId: string) => {
  const [bookTransactions, setBookTransactions] = useState<
    BookTransaction[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const NEXT_HANDLER_API_URL = `/api/book-transaction/${accountSchoolId}`;

      const response = await fetch(NEXT_HANDLER_API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (response.status === 404) {
        setBookTransactions([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log("Raw response:", text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        throw new Error("Invalid JSON response from server");
      }

      setBookTransactions(result);
    } catch (error: any) {
      console.error("Fetch error:", error);
      setError(`Failed to fetch book transactions: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [accountSchoolId]);

  const refreshBookTransactions = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchBookTransactions();
    } finally {
      setIsRefreshing(false);
      setRefreshCount(5);
    }
  }, [fetchBookTransactions]);

  const refreshTransactions = useCallback(() => {
    setIsRefreshing(true);
    setRefreshCount(5);

    const countdownInterval = setInterval(() => {
      setRefreshCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval);
          fetchBookTransactions();
          setIsRefreshing(false);
          return 5;
        }
        return prevCount - 1;
      });
    }, 1000);
  }, [fetchBookTransactions]);

  useEffect(() => {
    fetchBookTransactions();
  }, [fetchBookTransactions]);

  return {
    bookTransactions,
    error,
    refreshTransactions,
    refreshBookTransactions,
    isRefreshing,
    refreshCount,
    isLoading,
  };
};

export const BookTransactionsProvider: React.FC<{
  children: React.ReactNode;
  accountSchoolId: string;
}> = ({ children, accountSchoolId }) => {
  const {
    bookTransactions,
    error,
    refreshTransactions,
    refreshBookTransactions,
    isRefreshing,
    refreshCount,
  } = useBookTransactions(accountSchoolId);

  return (
    <BookTransactionsContext.Provider
      value={{
        bookTransactions,
        error,
        refreshTransactions,
        refreshBookTransactions,
        isRefreshing,
        refreshCount,
      }}
    >
      {children}
    </BookTransactionsContext.Provider>
  );
};

export const useBookTransactionsContext = () => {
  const context = useContext(BookTransactionsContext);
  if (context === undefined) {
    throw new Error(
      "useBookTransactionsContext must be used within a BookTransactionsProvider"
    );
  }
  return context;
};
