import { AlertTriangle, Clock, User, RefreshCw, CalendarX, Zap, Eye, X } from "lucide-react";
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
  conflictingEvents?: string[];
  isViewMode?: boolean;
  onScheduleAnyway: (event: NewEventData) => void;
  onReassignStaff: () => void;
  onChangeTime: () => void;
}

export const ConflictResolutionDialog = ({
  open,
  onClose,
  event,
  conflictMessage,
  conflictingEvents = [],
  isViewMode = false,
  onScheduleAnyway,
  onReassignStaff,
  onChangeTime,
}: ConflictResolutionDialogProps) => {
  if (!event) return null;

  const jobColors: Record<string, { bg: string; border: string }> = {
    plumbing:   { bg: "#fcf1d9", border: "#eca203" },
    hvac:       { bg: "#f2ebf8", border: "#8238bb" },
    electrical: { bg: "#e5effd", border: "#0063ec" },
    gas:        { bg: "#e5f1ed", border: "#007c54" },
    inspection: { bg: "#fcf1d9", border: "#eca203" },
    general:    { bg: "#e5effd", border: "#0063ec" },
  };
  const color = jobColors[event.jobType] || jobColors.general;

  const handleReassign = () => {
    if (!isViewMode) onClose();
    onReassignStaff();
  };

  const handleChangeTime = () => {
    if (!isViewMode) onClose();
    onChangeTime();
  };

  const handleScheduleAnyway = () => {
    if (event) onScheduleAnyway(event);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-[460px] p-0 bg-white rounded-xl border border-[#e2e5e9] shadow-lg"
        data-testid="conflict-dialog"
      >
        {/* Header */}
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-[#e8e8e8]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#d97706] flex-shrink-0 mt-px" />
              <DialogTitle className="text-[#0e1828] text-[15px] font-semibold font-['Inter',sans-serif]">
                {isViewMode ? "Scheduling Conflict" : "Scheduling Conflict Detected"}
              </DialogTitle>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#f3f4f6] text-[#9ca3af] hover:text-[#6b7280] flex-shrink-0 transition-colors"
              data-testid="close-conflict-dialog-x"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-[#6b7280] font-['Inter',sans-serif] mt-0 leading-snug pl-[26px]">
            {conflictMessage}
          </p>
        </DialogHeader>

        <div className="px-5 py-4 space-y-4 max-h-[440px] overflow-y-auto">

          {/* Event card */}
          <div
            className="flex items-start gap-3 px-3.5 py-3 rounded-lg border-l-[3px]"
            style={{ backgroundColor: color.bg, borderLeftColor: color.border }}
            data-testid="conflict-new-event"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#252627] font-['Inter',sans-serif] truncate">
                {event.title || event.reference || "Untitled event"}
              </p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-[#6b7280] font-['Inter',sans-serif]">
                  <User className="w-3 h-3" />
                  {event.staffName}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#6b7280] font-['Inter',sans-serif]">
                  <Clock className="w-3 h-3" />
                  {event.startTime}{event.endTime ? ` – ${event.endTime}` : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Conflicting events */}
          {conflictingEvents.length > 0 && (
            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wide font-['Inter',sans-serif]">
                Already in this slot ({conflictingEvents.length})
              </p>
              <div className="space-y-1">
                {conflictingEvents.map((ev, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#fef9e7] border border-[#fde68a]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] flex-shrink-0" />
                    <span className="text-xs text-[#92400e] font-['Inter',sans-serif] truncate">{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning note */}
          {!isViewMode && (
            <p className="text-xs text-[#6b7280] font-['Inter',sans-serif] bg-[#f9fafb] border border-[#e8e8e8] rounded-lg px-3 py-2.5">
              <span className="font-medium text-[#344153]">{event.staffName}</span> is already booked at{" "}
              <span className="font-medium text-[#344153]">{event.startTime}</span>. Choose how to proceed below.
            </p>
          )}

          {/* Resolution options */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wide font-['Inter',sans-serif]">
              {isViewMode ? "Options" : "How would you like to proceed?"}
            </p>

            {/* Reassign */}
            <button
              onClick={handleReassign}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg border border-[#e2e5e9] hover:border-[#0065f4] hover:bg-[#f5f9ff] transition-all group text-left"
              data-testid="resolve-reassign"
            >
              <div className="w-8 h-8 rounded-md bg-[#f3f4f6] group-hover:bg-[#e5effd] flex items-center justify-center flex-shrink-0 transition-colors">
                <RefreshCw className="w-3.5 h-3.5 text-[#6b7280] group-hover:text-[#0065f4] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0e1828] font-['Inter',sans-serif]">
                  Reassign staff
                </p>
                <p className="text-xs text-[#9ca3af] font-['Inter',sans-serif] mt-0.5">
                  Pick another available technician for this slot
                </p>
              </div>
            </button>

            {/* Change Time */}
            <button
              onClick={handleChangeTime}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg border border-[#e2e5e9] hover:border-[#0065f4] hover:bg-[#f5f9ff] transition-all group text-left"
              data-testid="resolve-change-time"
            >
              <div className="w-8 h-8 rounded-md bg-[#f3f4f6] group-hover:bg-[#e5effd] flex items-center justify-center flex-shrink-0 transition-colors">
                <CalendarX className="w-3.5 h-3.5 text-[#6b7280] group-hover:text-[#0065f4] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0e1828] font-['Inter',sans-serif]">
                  Change time
                </p>
                <p className="text-xs text-[#9ca3af] font-['Inter',sans-serif] mt-0.5">
                  Go back and select a different start / end time
                </p>
              </div>
            </button>

            {/* Schedule Anyway */}
            {!isViewMode && (
              <button
                onClick={handleScheduleAnyway}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg border border-[#e2e5e9] hover:border-[#f87171] hover:bg-[#fff8f8] transition-all group text-left"
                data-testid="resolve-schedule-anyway"
              >
                <div className="w-8 h-8 rounded-md bg-[#f3f4f6] group-hover:bg-[#fee2e2] flex items-center justify-center flex-shrink-0 transition-colors">
                  <Zap className="w-3.5 h-3.5 text-[#6b7280] group-hover:text-[#ef4444] transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0e1828] font-['Inter',sans-serif]">
                    Schedule anyway
                  </p>
                  <p className="text-xs text-[#9ca3af] font-['Inter',sans-serif] mt-0.5">
                    Override and create overlapping events
                  </p>
                </div>
              </button>
            )}

            {/* View all — view mode only */}
            {isViewMode && (
              <button
                onClick={onClose}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg border border-[#e2e5e9] hover:border-[#9ca3af] hover:bg-[#f9fafb] transition-all group text-left"
                data-testid="resolve-view-all"
              >
                <div className="w-8 h-8 rounded-md bg-[#f3f4f6] group-hover:bg-[#e9eaec] flex items-center justify-center flex-shrink-0 transition-colors">
                  <Eye className="w-3.5 h-3.5 text-[#6b7280] transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0e1828] font-['Inter',sans-serif]">
                    Dismiss
                  </p>
                  <p className="text-xs text-[#9ca3af] font-['Inter',sans-serif] mt-0.5">
                    Close and continue reviewing the schedule
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#e8e8e8]">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full h-9 border-[#e2e5e9] text-[#344153] font-['Inter',sans-serif] text-sm hover:bg-[#f9fafb]"
            data-testid="close-conflict-dialog"
          >
            {isViewMode ? "Close" : "Cancel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
