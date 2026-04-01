import React from "react";
import {
  X, User, Clock, MapPin, Briefcase, Hash, Calendar,
  AlertTriangle, CheckCircle2, Edit2, CalendarPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export interface ChipData {
  bg: string;
  border: string;
  label: string;
}

export interface JobDetailPayload {
  chip: ChipData;
  staffName: string;
  timeLabel: string;
  isConflict?: boolean;
}

interface JobDetailModalProps {
  open: boolean;
  onClose: () => void;
  payload: JobDetailPayload | null;
  onEditEvent?: () => void;
  onScheduleAnother?: () => void;
}

function inferJobType(chip: ChipData): string {
  if (chip.border === "#eca203") return "Plumbing";
  if (chip.border === "#8238bb") return "HVAC";
  if (chip.border === "#0063ec") return "Electrical";
  if (chip.border === "#007c54") return "Gas Line";
  return "General";
}

function inferJobTypeKey(chip: ChipData): string {
  if (chip.border === "#eca203") return "plumbing";
  if (chip.border === "#8238bb") return "hvac";
  if (chip.border === "#0063ec") return "electrical";
  if (chip.border === "#007c54") return "gas";
  return "general";
}

function extractRef(label: string): string {
  const m = label.match(/^([A-Z]+ \d+|[A-Z]+\d+)/);
  return m ? m[1] : "";
}

function extractTitle(label: string): string {
  const ref = extractRef(label);
  if (ref && label.startsWith(ref)) {
    return label.slice(ref.length).replace(/^[\s–-]+/, "").trim();
  }
  return label;
}

const statusBadges = [
  { label: "Scheduled", color: "bg-[#dcfce7] text-[#15803d]" },
  { label: "In Progress", color: "bg-[#dbeafe] text-[#1d4ed8]" },
  { label: "Needs Review", color: "bg-[#fef9c3] text-[#854d0e]" },
];

export const JobDetailModal = ({
  open,
  onClose,
  payload,
  onEditEvent,
  onScheduleAnother,
}: JobDetailModalProps) => {
  if (!payload) return null;

  const { chip, staffName, timeLabel, isConflict } = payload;
  const jobType = inferJobType(chip);
  const jobTypeKey = inferJobTypeKey(chip);
  const ref = extractRef(chip.label);
  const title = extractTitle(chip.label);

  // Pick a status pseudo-randomly based on the label
  const statusIndex = chip.label.charCodeAt(0) % 3;
  const status = statusBadges[statusIndex];

  // Derive end time (1 hour after start)
  const timeOptions = [
    "10:00 AM","11:00 AM","12:00 PM","01:00 PM",
    "02:00 PM","03:00 PM","04:00 PM","05:00 PM"
  ];
  const idx = timeOptions.indexOf(timeLabel);
  const endTime = idx >= 0 && idx < timeOptions.length - 1 ? timeOptions[idx + 1] : "";

  const jobTypeColors: Record<string, string> = {
    plumbing: "bg-[#fef3c7] text-[#d97706] border-[#fde68a]",
    hvac: "bg-[#f3e8ff] text-[#7c3aed] border-[#e9d5ff]",
    electrical: "bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]",
    gas: "bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]",
    general: "bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]",
  };
  const typeColor = jobTypeColors[jobTypeKey] || jobTypeColors.general;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-[440px] p-0 bg-white rounded-xl border border-[#e8e8e8] overflow-hidden"
        data-testid="job-detail-modal"
      >
        {/* Colored top strip */}
        <div
          className="h-2 w-full"
          style={{ backgroundColor: chip.border }}
        />

        {/* Header */}
        <div
          className="px-5 pt-4 pb-4 border-b border-[#f0f0f0]"
          style={{ backgroundColor: chip.bg }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {ref && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Hash className="w-3 h-3 text-[#9ca3af]" />
                  <span className="text-xs font-semibold text-[#6b7280] font-['Inter',sans-serif]">
                    {ref}
                  </span>
                </div>
              )}
              <h2
                className="text-base font-black text-[#0e1828] font-['Inter',sans-serif] leading-snug"
                data-testid="job-detail-title"
              >
                {title || chip.label}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-black/10 text-[#6b7280] flex-shrink-0"
              data-testid="close-job-detail"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md border ${typeColor}`}>
              {jobType}
            </span>
            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md ${status.color}`}>
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {status.label}
            </span>
            {isConflict && (
              <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md bg-[#fee2e2] text-[#dc2626]">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Conflict
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="px-5 py-4 space-y-3">
          <DetailRow icon={User} label="Assigned To" value={staffName} />
          <DetailRow
            icon={Clock}
            label="Scheduled Time"
            value={endTime ? `${timeLabel} – ${endTime}` : timeLabel}
          />
          <DetailRow icon={Calendar} label="Date" value="May 27, 2026" />
          <DetailRow icon={Briefcase} label="Job Type" value={jobType} />
          {title && (
            <DetailRow
              icon={MapPin}
              label="Location"
              value={
                title.includes("–")
                  ? title.split("–").slice(-1)[0].trim()
                  : "Albiware Work Site"
              }
            />
          )}
        </div>

        {/* Notes area */}
        <div className="px-5 pb-4">
          <div className="bg-[#f8f9fa] rounded-lg p-3 border border-[#e8e8e8]">
            <p className="text-xs font-semibold text-[#6b7280] font-['Inter',sans-serif] mb-1">
              Notes
            </p>
            <p className="text-xs text-[#344153] font-['Inter',sans-serif] leading-relaxed">
              Technician should bring full toolkit. Customer has been notified.
              Follow standard protocol for {jobType.toLowerCase()} work.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3 border-t border-[#e8e8e8] bg-[#fafafa] flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-9 text-sm border-[#dedede] text-[#344153] font-['Inter',sans-serif]"
            data-testid="job-detail-close"
          >
            Close
          </Button>
          {onScheduleAnother && (
            <Button
              variant="outline"
              onClick={() => { onClose(); onScheduleAnother(); }}
              className="flex-1 h-9 text-sm border-[#0065f4] text-[#0065f4] hover:bg-[#e5effd] font-['Inter',sans-serif]"
              data-testid="job-detail-schedule-another"
            >
              <CalendarPlus className="w-3.5 h-3.5 mr-1.5" />
              Add Event
            </Button>
          )}
          {onEditEvent && (
            <Button
              onClick={() => { onClose(); onEditEvent(); }}
              className="flex-1 h-9 text-sm bg-[#0065f4] hover:bg-[#0052c2] text-white font-['Inter',sans-serif]"
              data-testid="job-detail-edit"
            >
              <Edit2 className="w-3.5 h-3.5 mr-1.5" />
              Edit Event
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface DetailRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

const DetailRow = ({ icon: Icon, label, value }: DetailRowProps) => (
  <div className="flex items-center gap-3">
    <div className="w-7 h-7 rounded-md bg-[#f3f4f6] flex items-center justify-center flex-shrink-0">
      <Icon className="w-3.5 h-3.5 text-[#6b7280]" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-[#9ca3af] font-['Inter',sans-serif] leading-none mb-0.5">{label}</p>
      <p className="text-sm font-medium text-[#0e1828] font-['Inter',sans-serif] truncate">{value}</p>
    </div>
  </div>
);
