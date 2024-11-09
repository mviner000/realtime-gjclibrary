import { BookRecord } from "@/types";

// Format date with error handling
export const formatDate = (dateString: string) => {
  if (!dateString) {
    console.error("Date string is empty or undefined:", dateString);
    return "INVALID DATE";
  }

  try {
    console.log("Input date string:", dateString);
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date object created from:", dateString);
      return "INVALID DATE";
    }

    const formatted = date
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();

    console.log("Formatted date:", formatted);
    return formatted;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "INVALID DATE";
  }
};

export const formatGridData = (record: BookRecord): string => {
  switch (record.record_type) {
    case "BORROWED":
    case "RETURNED":
    case "EXTENDED":
      return `${record.record_type}\n${formatDate(record.datetime)}`;
    case "ADDITION":
      return `ADDITION${record.callno}\n#${record.accession_number}`;
    default:
      return "";
  }
};
