import * as React from "react";
import { Edit3, CheckSquare, LucideIcon, Eye } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Mode = {
  value: string;
  label: string;
  icon: LucideIcon;
};

const modes: Mode[] = [
  {
    value: "editor",
    label: "Editor Mode",
    icon: Edit3,
  },
  {
    value: "viewer",
    label: "Viewer Mode",
    icon: Eye,
  },
  {
    value: "checker",
    label: "Checker Mode",
    icon: CheckSquare,
  },
  {
    value: "add",
    label: "Add Mode",
    icon: CheckSquare,
  },
];

interface ComboboxPopoverForCheckerEditorModeProps {
  onModeChange: (mode: Mode | null) => void;
}

export function ComboboxPopoverForCheckerEditorMode({
  onModeChange,
}: ComboboxPopoverForCheckerEditorModeProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedMode, setSelectedMode] = React.useState<Mode | null>(modes[0]);

  const handleModeChange = (value: string) => {
    const newMode = modes.find((mode) => mode.value === value) || null;
    setSelectedMode(newMode);
    onModeChange(newMode);
    setOpen(false);
  };

  return (
    <div className="flex items-center space-x-1.5">
      <p className="text-sm text-muted-foreground font-semibold">
        Choose Your Mode:
      </p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[150px] justify-start"
          >
            {selectedMode ? (
              <>
                <selectedMode.icon className="mr-2 h-4 w-4 shrink-0" />
                {selectedMode.label}
              </>
            ) : (
              <>Select Mode</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Change mode..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {modes.map((mode) => (
                  <CommandItem
                    key={mode.value}
                    value={mode.value}
                    onSelect={handleModeChange}
                  >
                    <mode.icon
                      className={cn(
                        "mr-2 h-4 w-4",
                        mode.value === selectedMode?.value
                          ? "opacity-100"
                          : "opacity-40"
                      )}
                    />
                    <span>{mode.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
