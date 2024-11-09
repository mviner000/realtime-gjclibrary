import React, { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "react-datepicker/dist/react-datepicker.css";

export interface DatePickerProps {
    onChange: (date: Date | null) => void;
    selected: Date | null;
    className?: string;
}

export function DatePicker2({ onChange, selected, className }: DatePickerProps) {
    const CustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(
        ({ value, onClick }, ref) => (
            <Button
                variant="outline"
                onClick={onClick}
                ref={ref}
                className={cn("w-[240px] justify-start text-left font-normal", className)}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value}
            </Button>
        )
    );

    CustomInput.displayName = "CustomInput"

    return (
        <ReactDatePicker
            selected={selected}
            onChange={onChange} // This will now accept both Date and null
            customInput={<CustomInput />}
            dateFormat="MMMM d, yyyy"
            className="w-full"
        />
    );
}
