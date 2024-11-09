import { useState, useEffect } from "react";
import { TransactionData } from "@/types";
import { createBookTransaction } from "../utils/api";

const useTransactionData = (pathname: string) => {
  const initialTransactionData: TransactionData = {
    callno: "",
    accession_number: "",
    status: "",
    accounts_school_id: "",
    transaction_date: new Date().toISOString().split("T")[0],
    placing_number: 0,
  };

  const [transactionData, setTransactionData] = useState<TransactionData>(
    initialTransactionData
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const schoolId = pathname.split("/").pop();
    if (schoolId) {
      setTransactionData((prev) => ({ ...prev, accounts_school_id: schoolId }));
    }
  }, [pathname]);

  const handleModalSubmit = async () => {
    try {
      const result = await createBookTransaction(transactionData);
      console.log("Transaction created:", result);
      setIsModalOpen(false);
      // You might want to update the UI or show a success message here
    } catch (error) {
      console.error("Error creating transaction:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const resetTransactionData = () => {
    setTransactionData(initialTransactionData);
  };

  return {
    transactionData,
    setTransactionData,
    isModalOpen,
    setIsModalOpen,
    handleModalSubmit,
    resetTransactionData,
  };
};

export default useTransactionData;
