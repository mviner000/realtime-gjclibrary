// ViewerGrid.tsx
import React from "react";
import { GridProps, Column } from "./GridCommon";
import { Id } from "../../../convex/_generated/dataModel";
import ClearanceCheckbox from "../clearance/ClearanceCheckbox";
import ClearanceCheckboxes from "../clearance/ClearanceCheckboxes";

const ViewerGrid: React.FC<GridProps> = ({ studentId }) => {
  const numberOfColumns = 6;

  // Convert string ID to Convex ID type
  const accountId = studentId as Id<"accounts">;

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
      <ClearanceCheckboxes schoolId="52311077" clearedBy="admin123" />
    </div>
  );
};

export default ViewerGrid;
