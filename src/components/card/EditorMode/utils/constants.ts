export const NUMBER_OF_COLUMNS = 6;
export const CELLS_PER_COLUMN = 9;

export const TRANSACTION_ACTIONS = {
  Addition: "ADDITION",
  Borrowed: "BORROWED",
  Returned: "RETURNED",
  Extended: "EXTENDED",
} as const;

export const TOAST_MESSAGES = {
  SUCCESS: {
    title: "Success",
    description: "Transaction completed successfully!",
  },
  ERROR: {
    title: "Error",
    description: "Failed to complete transaction. Please try again.",
  },
  FETCH_ERROR: {
    title: "Error",
    description: "Failed to fetch accession numbers. Please try again.",
  },
};
