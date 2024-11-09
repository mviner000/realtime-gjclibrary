"use client"

import * as React from "react"
import {
    Tally5,
    ReceiptText,
    LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type Status = {
    value: string
    label: string
    icon: LucideIcon
}

const statuses: Status[] = [
    {
        value: "weekly",
        label: "Weekly",
        icon: Tally5,
    },
    {
        value: "daily",
        label: "Daily",
        icon: ReceiptText,
    },
]

interface ComboboxPopoverForDateWeeklySelectionProps {
    onStatusChange: (status: Status | null) => void;
}

export function ComboboxPopoverForDateWeeklySelection({ onStatusChange }: ComboboxPopoverForDateWeeklySelectionProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(null)

    React.useEffect(() => {
        // Load the last selected status from localStorage
        const savedStatus = localStorage.getItem('selectedTimeFrame');
        if (savedStatus) {
            const parsedStatus = JSON.parse(savedStatus);
            const matchedStatus = statuses.find(status => status.value === parsedStatus.value);
            if (matchedStatus) {
                setSelectedStatus(matchedStatus);
                onStatusChange(matchedStatus);
            }
        } else {
            // If no saved status, default to 'weekly'
            const defaultStatus = statuses.find(status => status.value === 'weekly');
            if (defaultStatus) {
                setSelectedStatus(defaultStatus);
                onStatusChange(defaultStatus);
                localStorage.setItem('selectedTimeFrame', JSON.stringify(defaultStatus));
            }
        }
    }, [onStatusChange]);

    const handleStatusChange = (value: string) => {
        const newStatus = statuses.find((status) => status.value === value) || null;
        setSelectedStatus(newStatus);
        onStatusChange(newStatus);
        setOpen(false);
        // Save the selected status to localStorage
        if (newStatus) {
            localStorage.setItem('selectedTimeFrame', JSON.stringify(newStatus));
        }
    };

    return (
        <div className="flex items-center space-x-3">
            <p className="text-sm text-muted-foreground">Selection</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="justify-start bg-slate-500/10"
                    >
                        {selectedStatus ? (
                            <>
                                <selectedStatus.icon className="mr-2 h-4 w-4 shrink-0" />
                                {selectedStatus.label}
                            </>
                        ) : (
                            <>+ Select Content to Display</>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                        <CommandInput placeholder="Change status..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {statuses.map((status) => (
                                    <CommandItem
                                        key={status.value}
                                        value={status.value}
                                        onSelect={handleStatusChange}
                                    >
                                        <status.icon
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                status.value === selectedStatus?.value
                                                    ? "opacity-100"
                                                    : "opacity-40"
                                            )}
                                        />
                                        <span>{status.label}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}