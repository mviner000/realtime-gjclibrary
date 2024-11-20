import { Input } from "@/components/ui/input";
import { forwardRef } from "react";
import Image from "next/image";

interface IdInputProps {
  studentId: string;
  onChange: (value: string) => void;
  onEnter: () => void;
  disabled?: boolean;
}

const IdInput = forwardRef<HTMLInputElement, IdInputProps>(
  ({ studentId, onChange, onEnter, disabled }, ref) => {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto w-full max-w-[360px] aspect-square relative rounded-lg overflow-hidden group">
          <Image
            src="/images/gjchomepagelink.png"
            alt="QR Code"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-yellow-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <Input
          id="studentId"
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-2xl text-center text-2xl bg-slate-200 text-green-800 placeholder:text-green-600/70 
               border-4 border-green-600 
               transition-all duration-300 rounded-xl py-6 px-4 shadow-lg"
          ref={ref}
          onKeyPress={(e) => {
            if (e.key === "Enter" && studentId.trim() !== "") {
              onEnter();
            }
          }}
          disabled={disabled}
        />
      </div>
    );
  }
);

IdInput.displayName = "IdInput";

export default IdInput;
