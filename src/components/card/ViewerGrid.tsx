import React from "react";
import { GridProps, Column } from "./GridCommon";

const ViewerGrid: React.FC<GridProps> = ({ studentId }) => {
  const numberOfColumns = 6;

  const handleDataChange = (index: number, value: string) => {
    // In viewer mode, we don't change the data
    console.log("Data change attempt in viewer mode:", index, value);
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
            gridData={{}}
            studentId={studentId}
            mode="viewer"
          />
        ))}
      </div>
    </div>
  );
};

export default ViewerGrid;
