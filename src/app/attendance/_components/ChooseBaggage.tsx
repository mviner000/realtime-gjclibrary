import { Button } from "@/components/ui/button";

type ChooseBaggageProps = {
  handleBaggageChoice: (hasBaggage: boolean) => void;
  isSubmitting: boolean;
};

const ChooseBaggage: React.FC<ChooseBaggageProps> = ({
  handleBaggageChoice,
  isSubmitting,
}) => {
  const handleChoice = (choice: boolean) => {
    console.log(`Baggage selection choice: ${choice ? "Yes" : "No"}`);
    handleBaggageChoice(choice);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        style={{
          WebkitTextStroke: "2px #198835",
        }}
        className="font-oswald text-4xl font-bold"
      >
        Do you have any baggage?
      </div>
      <div className="flex gap-8">
        <Button
          disabled={isSubmitting}
          onClick={() => handleChoice(true)}
          variant="ghost"
          className="flex h-24 w-32 cursor-pointer flex-col items-center gap-2 rounded-xl p-4 hover:bg-customGold"
        >
          <p className="rounded-lg border border-customGreen2 bg-white p-2 text-center text-xl font-semibold text-customGreen">
            Yes
          </p>
        </Button>
        <Button
          disabled={isSubmitting}
          onClick={() => handleChoice(false)}
          variant="ghost"
          className="flex h-24 w-32 cursor-pointer flex-col items-center gap-2 rounded-xl p-4 hover:bg-customGold"
        >
          <p className="rounded-lg border border-customGreen2 bg-white p-2 text-center text-xl font-semibold text-customGreen">
            No
          </p>
        </Button>
      </div>
    </div>
  );
};

export default ChooseBaggage;
