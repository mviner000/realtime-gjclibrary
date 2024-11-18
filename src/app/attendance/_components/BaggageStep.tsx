import { Button } from "@/components/ui/button";

type BaggageStepProps = {
  isSubmitting: boolean;
  hasBaggage: boolean | "";
  onSubmit: (hasBaggage: boolean) => void;
};

export const BaggageStep = ({
  isSubmitting,
  hasBaggage,
  onSubmit,
}: BaggageStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Do you have any baggage?</h2>
      <div className="flex gap-4 justify-center">
        <Button
          onClick={() => onSubmit(true)}
          disabled={isSubmitting}
          variant={hasBaggage === true ? "default" : "outline"}
        >
          Yes
        </Button>
        <Button
          onClick={() => onSubmit(false)}
          disabled={isSubmitting}
          variant={hasBaggage === false ? "default" : "outline"}
        >
          No
        </Button>
      </div>
    </div>
  );
};
