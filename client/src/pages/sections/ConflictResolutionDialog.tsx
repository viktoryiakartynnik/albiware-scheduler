import { AlertTriangle, Clock, User, RefreshCw, CalendarX, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewEventData } from "./NewEventModal";

interface ConflictResolutionDialogProps {
  open: boolean;
  onClose: () => void;
  event: NewEventData | null;
  conflictMessage: string;
  onScheduleAnyway: (event: NewEventData) => void;
  onReassignStaff: () => void;
  onChangeTime: () => void;
}

export const ConflictResolutionDialog = ({
  open,
  onClose,
  event,
  conflictMessage,
  onScheduleAnyway,
  onReassignStaff,
  onChangeTime,
}: ConflictResolutionDialogProps) => {
  if (!event) return null;

  const jobType = event.jobType;
  const jobColors: Record<string, { bg: string; border: string }> = {
    plumbing: { bg: "#fcf1d9", border: "#eca203" },
    hvac: { bg: "#f2ebf8", border: "#8238bb" },
    electrical: { bg: "#e5effd", border: "#0063ec" },
    gas: { bg: "#e5f1ed", border: "#007c54" },
    inspection: { bg: "#fcf1d9", border: "#eca203" },
    general: { bg: "#e5effd", border: "#0063ec" },
  };
  const color = jobColors[jobType] || jobColors.general;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-[480px] p-0 bg-white rounded-xl border border-[#e8e8e8]"
        data-testid="conflict-dialog"
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-[#f5e6e6]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
            </div>
            <div>
              <DialogTitle className="text-[#0e1828] text-base font-bold font-['Inter',sans-serif]">
                Scheduling Conflict Detected
              </DialogTitle>
              <p className="text-sm text-[#6b7280] font-['Inter',sans-serif] mt-0.5">
                {conflictMessage}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Conflict Details */}
        <div className="px-6 py-4 space-y-4">
          {/* New event card */}
          <div>
            <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide font-['Inter',sans-serif] mb-2">
              Event you are trying to schedule
            </p>
            <div
              className="flex items-start gap-3 p-3 rounded-lg border-l-4"
              style={{ backgroundColor: color.bg, borderLeftColor: color.border }}
              data-testid="conflict-new-event"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#252627] font-['Inter',sans-serif] truncate">
                  {event.title || event.reference}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-xs text-[#6b7280] font-['Inter',sans-serif]">
                    <User className="w-3 h-3" />
                    {event.staffName}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#6b7280] font-['Inter',sans-serif]">
                    <Clock className="w-3 h-3" />
                    {event.startTime} – {event.endTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Conflict info */}
          <div className="bg-[#fef9e7] border border-[#fde68a] rounded-lg p-3">
            <p className="text-xs font-['Inter',sans-serif] text-[#92400e]">
              <span className="font-semibold">{event.staffName}</span> already has an event
              scheduled at <span className="font-semibold">{event.startTime}</span>. Choose how
              you would like to proceed.
            </p>
          </div>

          {/* Resolution Options */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#344153] uppercase tracking-wide font-['Inter',sans-serif]">
              Choose an action
            </p>

            {/* Reassign Staff */}
            <button
              onClick={() => {
                onClose();
                onReassignStaff();
              }}
              className="w-full flex items-center gap-3 p-3.5 rounded-lg border-2 border-[#e8e8e8] hover:border-[#0065f4] hover:bg-[#f0f7ff] transition-all group text-left"
              data-testid="resolve-reassign"
            >
              <div className="w-9 h-9 rounded-lg bg-[#f3f4f6] group-hover:bg-[#e5effd] flex items-center justify-center flex-shrink-0 transition-colors">
                <RefreshCw className="w-4 h-4 text-[#6b7280] group-hover:text-[#0065f4] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0e1828] font-['Inter',sans-serif]">
                  Reassign to a different staff member
                </p>
                <p className="text-xs text-[#6b7280] font-['Inter',sans-serif] mt-0.5">
                  Pick another available technician for this time slot
                </p>
              </div>
            </button>

            {/* Change Time */}
            <button
              onClick={() => {
                onClose();
                onChangeTime();
              }}
              className="w-full flex items-center gap-3 p-3.5 rounded-lg border-2 border-[#e8e8e8] hover:border-[#0065f4] hover:bg-[#f0f7ff] transition-all group text-left"
              data-testid="resolve-change-time"
            >
              <div className="w-9 h-9 rounded-lg bg-[#f3f4f6] group-hover:bg-[#e5effd] flex items-center justify-center flex-shrink-0 transition-colors">
                <CalendarX className="w-4 h-4 text-[#6b7280] group-hover:text-[#0065f4] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0e1828] font-['Inter',sans-serif]">
                  Choose a different time
                </p>
                <p className="text-xs text-[#6b7280] font-['Inter',sans-serif] mt-0.5">
                  Go back and select a different start / end time
                </p>
              </div>
            </button>

            {/* Schedule Anyway */}
            <button
              onClick={() => {
                if (event) onScheduleAnyway(event);
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3.5 rounded-lg border-2 border-[#e8e8e8] hover:border-[#ef4444] hover:bg-[#fff5f5] transition-all group text-left"
              data-testid="resolve-schedule-anyway"
            >
              <div className="w-9 h-9 rounded-lg bg-[#f3f4f6] group-hover:bg-[#fee2e2] flex items-center justify-center flex-shrink-0 transition-colors">
                <Zap className="w-4 h-4 text-[#6b7280] group-hover:text-[#ef4444] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0e1828] font-['Inter',sans-serif]">
                  Schedule anyway (override)
                </p>
                <p className="text-xs text-[#6b7280] font-['Inter',sans-serif] mt-0.5">
                  Force-schedule despite the conflict — staff will have two events
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#e8e8e8] bg-[#fafafa]">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full h-9 border-[#dedede] text-[#344153] font-['Inter',sans-serif] text-sm"
            data-testid="close-conflict-dialog"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
