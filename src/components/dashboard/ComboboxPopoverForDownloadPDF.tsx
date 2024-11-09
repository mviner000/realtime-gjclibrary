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
        value: "tallied",
        label: "Tallied",
        icon: Tally5,
    },
    {
        value: "untallied",
        label: "Untallied",
        icon: ReceiptText,
    },
]

interface ComboboxPopoverForDownloadPDFProps {
    onStatusChange: (status: Status | null) => void;
}

export function ComboboxPopoverForDownloadPDF({ onStatusChange }: ComboboxPopoverForDownloadPDFProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(null)

    const handleStatusChange = (value: string) => {
        const newStatus = statuses.find((status) => status.value === value) || null;
        setSelectedStatus(newStatus);
        onStatusChange(newStatus);
        setOpen(false);
    };

    return (
        <div className="flex items-center space-x-3">
            <p className="text-sm text-muted-foreground">Selection</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-slate-500/10"
                    >
                        {selectedStatus ? (
                            <>
                                <selectedStatus.icon className="mr-2 h-4 w-4 shrink-0" />
                                {selectedStatus.label}
                            </>
                        ) : (
                            <>+ Select Content to Download</>
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