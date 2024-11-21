import { useState, useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { SemesterLabel } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

const getOrdinalSuffix = (year: number): string => {
  if (year === 1) return "1st";
  if (year === 2) return "2nd";
  if (year === 3) return "3rd";
  return `${year}th`;
};

const semesterLabels: SemesterLabel[] = [
  "1st Yr - 1st Sem",
  "1st Yr - 2nd Sem",
  "2nd Yr - 1st Sem",
  "2nd Yr - 2nd Sem",
  "3rd Yr - 1st Sem",
  "3rd Yr - 2nd Sem",
  "4th Yr - 1st Sem",
  "4th Yr - 2nd Sem",
  "5th Yr - 1st Sem",
  "5th Yr - 2nd Sem",
];

const initialCheckedState: Record<SemesterLabel, boolean> =
  semesterLabels.reduce(
    (acc, label) => ({ ...acc, [label]: false }),
    {} as Record<SemesterLabel, boolean>
  );

interface Props {
  schoolId: string;
  clearedBy: string;
}

export default function ClearanceCheckboxes({ schoolId, clearedBy }: Props) {
  const numericSchoolId = schoolId.toString();
  const { toast } = useToast();

  const clearanceRecords = useQuery(
    api.queries.clearance.getClearanceBySchoolId,
    {
      schoolId: numericSchoolId,
    }
  );

  const toggleClearance = useMutation(
    api.queries.clearance.toggleClearanceStatus
  );

  const [checkedState, setCheckedState] =
    useState<Record<SemesterLabel, boolean>>(initialCheckedState);

  useEffect(() => {
    if (clearanceRecords) {
      const newCheckedState = { ...initialCheckedState };
      clearanceRecords.forEach((record) => {
        if (record.semester_label in newCheckedState) {
          newCheckedState[record.semester_label as SemesterLabel] =
            record.isCleared;
        }
      });
      setCheckedState(newCheckedState);
    }
  }, [clearanceRecords]);

  const handleCheckboxChange = async (semesterLabel: SemesterLabel) => {
    const newValue = !checkedState[semesterLabel];

    setCheckedState((prev) => ({ ...prev, [semesterLabel]: newValue }));

    try {
      await toggleClearance({
        schoolId: numericSchoolId,
        semesterLabel,
        isCleared: newValue,
        clearedBy,
      });
      toast({
        title: "Clearance Updated",
        description: `${semesterLabel} clearance ${newValue ? "approved" : "revoked"}.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to update clearance:", error);
      setCheckedState((prev) => ({ ...prev, [semesterLabel]: !newValue }));
      toast({
        title: "Error",
        description: "Failed to update clearance. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "N/A";
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((year) => (
            <div key={year} className="space-y-2">
              <h3 className="font-medium">{getOrdinalSuffix(year)} Year</h3>
              {["1st Sem", "2nd Sem"].map((sem) => {
                const yearPrefix = getOrdinalSuffix(year);
                const label = `${yearPrefix} Yr - ${sem}` as SemesterLabel;
                const record = clearanceRecords?.find(
                  (r) => r.semester_label === label
                );
                const tooltipContent = record
                  ? `Cleared: ${record.isCleared ? "Yes" : "No"}
Cleared At: ${formatDate(record.cleared_at ? new Date(record.cleared_at) : null)}
Cleared By: ${record.cleared_by || "N/A"}`
                  : "No clearance record";

                return (
                  <Tooltip key={label}>
                    <TooltipTrigger asChild>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkedState[label]}
                          onChange={() => handleCheckboxChange(label)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-sm">{sem}</span>
                      </label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="whitespace-pre-line">{tooltipContent}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
