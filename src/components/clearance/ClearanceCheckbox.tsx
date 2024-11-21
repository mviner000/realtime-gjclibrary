import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

interface ClearanceCheckboxProps {
  schoolId: string;
  semesterLabel:
    | "1st Yr - 1st Sem"
    | "1st Yr - 2nd Sem"
    | "2nd Yr - 1st Sem"
    | "2nd Yr - 2nd Sem"
    | "3rd Yr - 1st Sem"
    | "3rd Yr - 2nd Sem"
    | "4th Yr - 1st Sem"
    | "4th Yr - 2nd Sem"
    | "5th Yr - 1st Sem"
    | "5th Yr - 2nd Sem";
  clearedBy: string;
  initialIsCleared?: boolean;
}

const ClearanceCheckbox = ({
  schoolId,
  semesterLabel,
  clearedBy,
  initialIsCleared = false,
}: ClearanceCheckboxProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(initialIsCleared);
  const createClearance = useMutation(api.queries.clearance.createClearance);

  const handleChange = async (checked: boolean) => {
    if (checked) {
      try {
        await createClearance({
          schoolId,
          semesterLabel,
          clearedBy,
        });

        setIsChecked(true);
        toast({
          title: "Clearance Updated",
          description: "Successfully marked as cleared",
        });
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to update clearance status",
          variant: "destructive",
        });
        setIsChecked(false);
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="clearance"
        checked={isChecked}
        onCheckedChange={handleChange}
        disabled={isChecked} // Prevent unchecking once cleared
      />
      <label
        htmlFor="clearance"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Mark as Cleared
      </label>
    </div>
  );
};

export default ClearanceCheckbox;
