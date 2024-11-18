type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`w-1/4 h-2 mx-1 rounded ${
              step <= currentStep ? "bg-blue-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <div className="text-sm text-gray-500 text-center">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};
