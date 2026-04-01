import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AvailabilityFilters {
  date: string;
  startTime: string;
  endTime: string;
  skillType: string;
  duration: string;
  minStaff: string;
}

interface AvailabilitySearchSheetProps {
  open: boolean;
  onClose: () => void;
  onSearch: (filters: AvailabilityFilters) => void;
}

const skillTypes = [
  "Any",
  "Plumbing",
  "HVAC",
  "Electrical",
  "Gas Line",
  "General Maintenance",
  "Inspection",
  "Safety Audit",
];

const durations = [
  "30 minutes",
  "1 hour",
  "2 hours",
  "3 hours",
  "4 hours",
  "Full Day",
];

const timeOptions = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM",
];

// ─── Time helpers ─────────────────────────────────────────────────────────────

function parseTimeToMinutes(time: string): number {
  const [timePart, period] = time.split(" ");
  const [hStr, mStr] = timePart.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function parseDurationMinutes(duration: string): number {
  if (duration === "30 minutes") return 30;
  if (duration === "Full Day") return 8 * 60;
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1]) * 60 : 60;
}

function getEndTimeForDuration(startTime: string, duration: string): string {
  const startMins = parseTimeToMinutes(startTime);
  const durationMins = parseDurationMinutes(duration);
  const targetMins = Math.min(startMins + durationMins, parseTimeToMinutes("05:00 PM"));
  return timeOptions.reduce((best, t) => {
    return Math.abs(parseTimeToMinutes(t) - targetMins) < Math.abs(parseTimeToMinutes(best) - targetMins) ? t : best;
  });
}

export const AvailabilitySearchSheet = ({
  open,
  onClose,
  onSearch,
}: AvailabilitySearchSheetProps) => {
  const [filters, setFilters] = useState<AvailabilityFilters>({
    date: "2026-05-27",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    skillType: "Any",
    duration: "1 hour",
    minStaff: "1",
  });

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-[420px] p-0 bg-white border-l border-[#e8e8e8] flex flex-col"
        data-testid="availability-search-sheet"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-[#e8e8e8] flex-shrink-0">
          <SheetTitle className="text-[#0e1828] text-lg font-bold font-['Inter',sans-serif] text-left">
            Availability Search
          </SheetTitle>
          <p className="text-sm text-[#6b7280] font-['Inter',sans-serif] text-left mt-0.5">
            Find available staff for your job requirements
          </p>
        </SheetHeader>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Date */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Date
            </Label>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="h-10 border-[#dedede] focus:border-[#0065f4] font-['Inter',sans-serif] text-sm"
              data-testid="availability-date-input"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-3 items-end">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
                Start Time
              </Label>
              <Select
                value={filters.startTime}
                onValueChange={(v) => {
                  const newEnd = getEndTimeForDuration(v, filters.duration);
                  setFilters({ ...filters, startTime: v, endTime: newEnd });
                }}
              >
                <SelectTrigger
                  className="h-10 border-[#dedede] text-sm font-['Inter',sans-serif]"
                  data-testid="availability-start-time"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((t) => (
                    <SelectItem key={t} value={t} className="text-sm">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif] flex items-center gap-1">
                End Time
                <span className="text-[10px] text-[#9ca3af] font-normal">(auto)</span>
              </Label>
              <Select
                value={filters.endTime}
                onValueChange={(v) => setFilters({ ...filters, endTime: v })}
              >
                <SelectTrigger
                  className="h-10 border-[#dedede] text-sm font-['Inter',sans-serif]"
                  data-testid="availability-end-time"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((t) => (
                    <SelectItem key={t} value={t} className="text-sm">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Required Duration
            </Label>
            <Select
              value={filters.duration}
              onValueChange={(v) => {
                const newEnd = getEndTimeForDuration(filters.startTime, v);
                setFilters({ ...filters, duration: v, endTime: newEnd });
              }}
            >
              <SelectTrigger
                className="h-10 border-[#dedede] text-sm font-['Inter',sans-serif]"
                data-testid="availability-duration"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {durations.map((d) => (
                  <SelectItem key={d} value={d} className="text-sm">
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skill Type */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Required Skill / Job Type
            </Label>
            <Select
              value={filters.skillType}
              onValueChange={(v) => setFilters({ ...filters, skillType: v })}
            >
              <SelectTrigger
                className="h-10 border-[#dedede] text-sm font-['Inter',sans-serif]"
                data-testid="availability-skill-type"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {skillTypes.map((s) => (
                  <SelectItem key={s} value={s} className="text-sm">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Min Staff */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Minimum Staff Required
            </Label>
            <Select
              value={filters.minStaff}
              onValueChange={(v) => setFilters({ ...filters, minStaff: v })}
            >
              <SelectTrigger
                className="h-10 border-[#dedede] text-sm font-['Inter',sans-serif]"
                data-testid="availability-min-staff"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["1", "2", "3", "4", "5"].map((n) => (
                  <SelectItem key={n} value={n} className="text-sm">
                    {n} staff member{n !== "1" ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Info Box */}
          <div className="bg-[#f0f7ff] border border-[#c2d9f8] rounded-lg p-4">
            <p className="text-xs text-[#0065f4] font-['Inter',sans-serif] font-medium mb-1">
              How it works
            </p>
            <p className="text-xs text-[#344153] font-['Inter',sans-serif] leading-relaxed">
              After searching, available time slots will be highlighted in{" "}
              <span className="font-semibold text-[#0065f4]">blue</span> on the
              calendar. Click any highlighted slot to schedule an event.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e8e8e8] flex gap-3 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-10 border-[#dedede] text-[#344153] font-['Inter',sans-serif] text-sm"
            data-testid="cancel-availability-search"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSearch}
            className="flex-1 h-10 bg-[#0065f4] hover:bg-[#0052c2] text-white font-['Inter',sans-serif] text-sm font-medium"
            data-testid="search-availability-btn"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Availability
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
