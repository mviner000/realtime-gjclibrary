import React from "react";
import { GridProps, Column } from "./GridCommon";

const CheckerGrid: React.FC<GridProps> = ({ studentId }) => {
  const numberOfColumns = 6;

  const handleDataChange = (index: number, value: string) => {
    // In checker mode, we don't change the data
    console.log("Data change attempt in checker mode:", index, value);
  };

  const handleLineThroughToggle = (index: number) => {
    // Implement line-through toggle logic here
    console.log("Line-through toggled for index:", index);
  };

  return (
    <div className="mx-10 font-semibold text-center">
      <div className="grid grid-cols-6">
        {[...Array(numberOfColumns)].map((_, columnIndex) => (
          <Column
            key={columnIndex}
            isLastColumn={columnIndex === numberOfColumns - 1}
            startNumber={columnIndex * 9 + 1}
            onDataChange={handleDataChange}
            onLineThroughToggle={handleLineThroughToggle}
            gridData={{}}
            studentId={studentId}
            mode="checker"
          />
        ))}
      </div>
    </div>
  );
};

export default CheckerGrid;
