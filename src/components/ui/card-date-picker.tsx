"use client"

import React, { forwardRef } from "react"
import ReactDatePicker from "react-datepicker"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format } from 'date-fns'

import "react-datepicker/dist/react-datepicker.css"

export interface CardDatePickerProps {
    onChange: (date: Date | null) => void
    selected: Date | null
    className?: string
    onCalendarOpen?: () => void
    onCalendarClose?: () => void
}

export function CardDatePicker({ onChange, selected, className, onCalendarOpen, onCalendarClose }: CardDatePickerProps) {
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
    )

    CustomInput.displayName = "CustomInput"

    return (
        <ReactDatePicker
            selected={selected}
            onChange={onChange}
            customInput={<CustomInput />}
            dateFormat="dd MMM yyyy"
            className="w-full"
            onCalendarOpen={onCalendarOpen}
            onCalendarClose={onCalendarClose}
        />
    )
}