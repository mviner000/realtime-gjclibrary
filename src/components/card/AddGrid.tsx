import React, { useState } from "react";
import { GridProps, Column, BookTransactionFormData } from "./GridCommon";
import BookTransactionModal from "../BookTransactionModal";

const AddGrid: React.FC<GridProps> = ({ studentId }) => {
  const numberOfColumns = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleDataChange = (index: number, value: string) => {
    // In add mode, we don't change existing data
    console.log("Data change attempt in add mode:", index, value);
  };

  const handleInsertClick = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedIndex(null);
  };

  const handleModalSubmit = async (
    data: BookTransactionFormData
  ): Promise<void> => {
    if (selectedIndex !== null) {
      const dataString = JSON.stringify(data);
      console.log("New data to be inserted:", dataString);
      // Here you would typically send this data to your backend
    }
    handleModalClose();
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
            mode="add"
            onInsertClick={handleInsertClick}
          />
        ))}
      </div>
      <BookTransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default AddGrid;
