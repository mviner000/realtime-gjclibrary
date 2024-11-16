import React, { useState, useEffect, useCallback } from "react";
import { useBookTransactionsContext } from "@/app/student/_hooks/useBookTransactions";

interface AutoReloadWrapperProps {
  children: React.ReactNode;
}

const AutoReloadWrapper: React.FC<AutoReloadWrapperProps> = ({ children }) => {
  const bookTransactionsContext = useBookTransactionsContext();
  const [shouldReload, setShouldReload] = useState(false);

  const triggerReload = useCallback(() => {
    setShouldReload(true);
  }, []);

  useEffect(() => {
    if (shouldReload && bookTransactionsContext) {
      bookTransactionsContext.refreshTransactions();
      setShouldReload(false);
    }
  }, [shouldReload, bookTransactionsContext]);

  useEffect(() => {
    const handleTransactionFinished = () => {
      triggerReload();
    };

    window.addEventListener("transactionFinished", handleTransactionFinished);

    return () => {
      window.removeEventListener(
        "transactionFinished",
        handleTransactionFinished
      );
    };
  }, [triggerReload]);

  if (bookTransactionsContext?.isRefreshing) {
    return (
      <div className="text-center py-4">
        Refreshing in {bookTransactionsContext.refreshCount} seconds...
      </div>
    );
  }

  return (
    <AutoReloadContext.Provider value={{ triggerReload }}>
      {children}
    </AutoReloadContext.Provider>
  );
};

export const AutoReloadContext = React.createContext<{
  triggerReload: () => void;
}>({
  triggerReload: () => {},
});

export const useAutoReload = () => React.useContext(AutoReloadContext);

export default AutoReloadWrapper;
