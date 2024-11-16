import { useCallback, useEffect } from "react";

export const useKeyboardEvents = (resetTransaction: () => void) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        resetTransaction();
      }
    },
    [resetTransaction]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
};
