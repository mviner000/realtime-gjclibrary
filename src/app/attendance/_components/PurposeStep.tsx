import { Button } from "@/components/ui/button";

const PURPOSE_OPTIONS = [
  "transaction",
  "research",
  "clearance",
  "orientation_or_meeting",
  "silver_star",
  "others",
  "reading_study_or_review",
  "xerox",
  "print",
  "computer_use",
];

type PurposeStepProps = {
  purpose: string;
  onPurposeChange: (value: string) => void;
  onNext: () => void;
};

export const PurposeStep = ({
  purpose,
  onPurposeChange,
  onNext,
}: PurposeStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">What brings you here today?</h2>
      <select
        value={purpose}
        onChange={(e) => onPurposeChange(e.target.value)}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Purpose</option>
        {PURPOSE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt.replace(/_/g, " ").toUpperCase()}
          </option>
        ))}
      </select>
      <Button onClick={onNext} disabled={!purpose} className="w-full">
        Next
      </Button>
    </div>
  );
};
