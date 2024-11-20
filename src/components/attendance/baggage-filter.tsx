"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
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
import { cn } from "@/lib/utils";

const filterTypes = [
  { value: "name", label: "Name" },
  { value: "schoolId", label: "School ID" },
  { value: "baggageNumber", label: "Baggage Number" },
];

export default function BaggageFilter({
  onFilterChange,
}: {
  onFilterChange: (type: string, value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [filterType, setFilterType] = useState(() => {
    // Get last used filter type from localStorage or use default
    const savedFilterType = localStorage.getItem("lastFilterType");
    const defaultType = filterTypes[0];

    if (savedFilterType) {
      const found = filterTypes.find((type) => type.value === savedFilterType);
      return found || defaultType;
    }

    return defaultType;
  });
  const [filterValue, setFilterValue] = useState("");

  // Save filter type to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("lastFilterType", filterType.value);
  }, [filterType]);

  const handleFilterTypeChange = (type: (typeof filterTypes)[0]) => {
    setFilterType(type);
    setOpen(false);
    onFilterChange(type.value, filterValue);
  };

  const handleFilterValueChange = (value: string) => {
    setFilterValue(value);
    onFilterChange(filterType.value, value);
  };

  const handleClearFilter = () => {
    setFilterValue("");
    onFilterChange(filterType.value, "");
  };

  return (
    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 px-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full sm:w-[180px] justify-between"
          >
            {filterType.label}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full sm:w-[180px] p-0">
          <Command>
            <CommandInput placeholder="Search filter type..." />
            <CommandList>
              <CommandEmpty>No filter type found.</CommandEmpty>
              <CommandGroup>
                {filterTypes.map((type) => (
                  <CommandItem
                    key={type.value}
                    value={type.value}
                    onSelect={() => handleFilterTypeChange(type)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        filterType.value === type.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {type.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder={`Filter by ${filterType.label.toLowerCase()}...`}
          value={filterValue}
          onChange={(e) => handleFilterValueChange(e.target.value)}
          className="pl-10 pr-10 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {filterValue && (
          <button
            onClick={handleClearFilter}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
