import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// View options for the calendar toggle
const viewOptions = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "agenda", label: "Agenda" },
];

export const ViewControlsSubsection = (): JSX.Element => {
  const [activeView, setActiveView] = useState<string>("day");

  return (
    <nav className="flex w-full h-10 items-center justify-between pl-0 pr-2 py-0 bg-white border border-solid border-border">
      {/* Left side: navigation arrows + date */}
      <div className="inline-flex items-center gap-6 pl-4 pr-0 py-0 flex-[0_0_auto]">
        {/* Chevron navigation buttons */}
        <div className="inline-flex items-center gap-1 flex-[0_0_auto]">
          <Button
            variant="ghost"
            size="icon"
            className="h-auto w-6 p-2 rounded hover:bg-gray-100"
            aria-label="Previous"
          >
            <ChevronLeftIcon className="w-5 h-5 text-[#0e1828]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-auto w-6 p-2 rounded hover:bg-gray-100"
            aria-label="Next"
          >
            <ChevronRightIcon className="w-5 h-5 text-[#0e1828]" />
          </Button>
        </div>

        {/* Current date display */}
        <div className="inline-flex items-center flex-[0_0_auto]">
          <span className="[font-family:'Inter',Helvetica] font-medium text-[#0e1828] text-sm tracking-[0] leading-5 whitespace-nowrap">
            May 27, 2026
          </span>
        </div>
      </div>

      {/* Right side: calendar icon, separator, view toggles, filters */}
      <div className="items-center gap-2 inline-flex flex-[0_0_auto]">
        {/* CalendarIcon icon button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-auto px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
          aria-label="Open calendar"
        >
          <CalendarIcon className="w-5 h-5 text-[#0e1828]" />
        </Button>

        {/* Vertical divider */}
        <Separator orientation="vertical" className="h-6 w-px bg-gray-200" />

        {/* View toggle group: Day / Week / Month / Agenda */}
        <ToggleGroup
          type="single"
          value={activeView}
          onValueChange={(val) => {
            if (val) setActiveView(val);
          }}
          className="inline-flex items-center gap-1 bg-transparent"
        >
          {viewOptions.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className={`gap-1 p-2 rounded text-sm font-medium leading-5 [font-family:'Inter',Helvetica] tracking-[0] whitespace-nowrap h-auto bg-gray-100 hover:bg-gray-200 data-[state=on]:bg-gray-100 data-[state=on]:shadow-none ${
                activeView === option.value
                  ? "text-[#004fe0]"
                  : "text-[#0e1828]"
              }`}
              aria-label={`${option.label} view`}
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {/* Filters button */}
        <Button
          variant="ghost"
          className="h-auto inline-flex items-center gap-1 pl-10 pr-3 py-2 rounded"
          aria-label="Open filters"
        >
          <span className="font-medium text-gray-900 text-sm leading-5 [font-family:'Inter',Helvetica] tracking-[0] whitespace-nowrap">
            Filters
          </span>
        </Button>
      </div>
    </nav>
  );
};
