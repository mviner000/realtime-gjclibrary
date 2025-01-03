import { useState, useCallback } from "react";
import { CellData } from "@/types";
import { cn } from "@/lib/utils";

const useGridData = () => {
  const [gridData, setGridData] = useState<{ [key: number]: CellData }>({});

  const updateGridData = (
    index: number,
    value: string,
    isLineThrough: boolean = false
  ) => {
    // Ensure index is at least 1
    const safeIndex = Math.max(1, index);
    setGridData((prevData) => ({
      ...prevData,
      [safeIndex]: { value, isLineThrough },
    }));
  };

  const resetCellContent = (index: number) => {
    setGridData((prevData) => ({
      ...prevData,
      [index]: { value: "", isLineThrough: false }
    }));
  };

  const resetCell = (index: number) => {
    setGridData((prevData) => {
      const newData = { ...prevData };
      if (newData[index]) {
        newData[index] = { value: "", isLineThrough: false };
      }
      return newData;
    });
  };

  const handleLineThroughToggle = (index: number) => {
    const currentData = gridData[index] || { value: "", isLineThrough: false };
    updateGridData(index, currentData.value, !currentData.isLineThrough);
  };

  // Rest of the functions remain the same
  const isBorrowedCell = useCallback(
    (cellData: CellData | undefined): boolean => {
      return !!(
        cellData &&
        typeof cellData.value === "string" &&
        cellData.value.includes("BORROWED")
      );
    },
    []
  );

  const isReturnedCell = useCallback(
    (cellData: CellData | undefined): boolean => {
      return !!(
        cellData &&
        typeof cellData.value === "string" &&
        cellData.value.includes("RETURNED")
      );
    },
    []
  );

  const isAdditionCell = useCallback(
    (cellData: CellData | undefined): boolean => {
      return !!(
        cellData &&
        typeof cellData.value === "string" &&
        cellData.value.includes("ADDITION")
      );
    },
    []
  );

  const isClearanceCell = useCallback(
    (cellData: CellData | undefined): boolean => {
      return !!(
        cellData &&
        typeof cellData.value === "string" &&
        cellData.value.includes("-cleared-")
      );
    },
    []
  );

  const isExtendedCell = useCallback(
    (cellData: CellData | undefined): boolean => {
      return !!(
        cellData &&
        typeof cellData.value === "string" &&
        cellData.value.includes("EXTENDED")
      );
    },
    []
  );

  const isClearedCell = useCallback(
    (cellData: CellData | undefined): boolean => {
      return !!(
        cellData &&
        typeof cellData.value === "string" &&
        cellData.value.includes("CLEARED")
      );
    },
    []
  );

  const getCellClassName = useCallback(
    (cellIndex: number) => {
      return cn(
        "custom-column-class",
        Math.floor(cellIndex / 9) % 2 === 0 ? "" : "",
        isBorrowedCell(gridData[cellIndex])
          ? "text-green-800 text-lg min-h-[25px] min-h-[50px]"
          : "",
        isExtendedCell(gridData[cellIndex])
          ? "text-blue-800 text-lg min-h-[25px] min-h-[50px]"
          : "",
        isClearedCell(gridData[cellIndex])
          ? "text-purple-800 text-lg min-h-[25px] min-h-[50px]"
          : "",
        isAdditionCell(gridData[cellIndex]) ? "-mt-[14px]" : "",
        isClearanceCell(gridData[cellIndex])
          ? " min-h-[25px] -mt-[5px] pb-[15px]"
          : "",
        isReturnedCell(gridData[cellIndex])
          ? "text-red-800 text-lg min-h-[50px] line-through"
          : ""
      );
    },
    [
      gridData,
      isBorrowedCell,
      isReturnedCell,
      isAdditionCell,
      isExtendedCell,
      isClearedCell,
      isClearanceCell,
    ]
  );

  return {
    gridData,
    updateGridData,
    resetCell,
    resetCellContent,
    handleLineThroughToggle,
    getCellClassName,
  };
};

export default useGridData;
