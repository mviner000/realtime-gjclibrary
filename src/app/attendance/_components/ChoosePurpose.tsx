import { Button } from "@/components/ui/button";
import Image from "next/image";

type ChoosePurposeProps = {
  handleScan: (purpose: string) => void;
  isSubmitting: boolean;
};

const Purposes = [
  {
    name: "Research",
    icon: "/images/purposes/research.png",
    key: "research",
  },
  {
    name: "Clearance",
    icon: "/images/purposes/clearance.png",
    key: "clearance",
  },
  {
    name: "Orientation/Meeting",
    icon: "/images/purposes/orientation_or_meeting.png",
    key: "orientation_or_meeting",
  },
  {
    name: "Transaction",
    icon: "/images/purposes/transaction.png",
    key: "transaction",
  },
  {
    name: "Silver Star",
    icon: "/images/purposes/silver_star.png",
    key: "silver_star",
  },
  {
    name: "Reading/Study/Review",
    icon: "/images/purposes/reading_study_or_review.png",
    key: "reading_study_or_review",
  },
  {
    name: "Xerox",
    icon: "/images/purposes/xerox.png",
    key: "xerox",
  },
  {
    name: "Print",
    icon: "/images/purposes/print.png",
    key: "print",
  },
  {
    name: "Computer Use",
    icon: "/images/purposes/computer_use.png",
    key: "computer_use",
  },
];

const ChoosePurpose: React.FC<ChoosePurposeProps> = ({
  handleScan,
  isSubmitting,
}) => {
  return (
    <div className="grid grid-cols-3 items-center justify-between gap-4">
      {Purposes.map((purpose) => (
        <Button
          key={purpose.name}
          disabled={isSubmitting}
          onClick={() => handleScan(purpose.key)}
          variant="ghost"
          className="flex h-full cursor-pointer flex-col items-center gap-2 rounded-xl p-4 hover:bg-customGold"
        >
          <div className="flex size-[100px] items-center justify-center rounded-lg border border-customGreen2 bg-white">
            <Image
              src={purpose.icon}
              width={50}
              height={50}
              alt={purpose.name}
              className="object-cover"
            />
          </div>

          <p className="min-w-[150px] rounded-lg border border-customGreen2 bg-white p-1 text-center text-xl font-semibold text-customGreen">
            {purpose.name}
          </p>
        </Button>
      ))}
    </div>
  );
};

export default ChoosePurpose;
