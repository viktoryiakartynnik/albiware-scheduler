import { useState, useMemo } from "react";
import {
  X, Calendar, Clock, User, Briefcase, FileText,
  CheckCircle2, XCircle, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export interface NewEventData {
  id: string;
  title: string;
  reference: string;
  date: string;
  startTime: string;
  endTime: string;
  staffName: string;
  staffName2?: string;
  jobType: string;
  notes: string;
  color: { bg: string; border: string };
  isSplitCoverage?: boolean;
}

export interface PrefilledSlot {
  staffName: string;
  timeLabel: string;
  date?: string;
}

interface NewEventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (event: NewEventData) => void;
  onConflict: (event: NewEventData, existing: string) => void;
  prefilledSlot?: PrefilledSlot | null;
  existingEvents?: { staffName: string; startTime: string; endTime: string }[];
}

const staffMembers = [
  "Alan Thomas",
  "Michael Schaj",
  "Anna Sorokin",
  "Connor Grace",
  "Carmen Flores",
  "Shamoil Soni",
  "Chiara Bondesan",
  "Christy Blaker",
  "Adam Smith",
  "Daniyal Shamoon",
  "Michele Rave",
  "Chandler Steffy",
  "Bradley Lynch",
  "Moasfar Javed",
];

const jobTypes = [
  { value: "plumbing", label: "Plumbing", color: { bg: "#fcf1d9", border: "#eca203" } },
  { value: "hvac", label: "HVAC", color: { bg: "#f2ebf8", border: "#8238bb" } },
  { value: "electrical", label: "Electrical", color: { bg: "#e5effd", border: "#0063ec" } },
  { value: "gas", label: "Gas Line", color: { bg: "#e5f1ed", border: "#007c54" } },
  { value: "inspection", label: "Inspection", color: { bg: "#fcf1d9", border: "#eca203" } },
  { value: "general", label: "General Maintenance", color: { bg: "#e5effd", border: "#0063ec" } },
];

const timeOptions = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM",
];

const jobPrefixes = ["PRJ", "GEN", "ELEC", "SRV", "HVAC", "AS", "MG", "PN"];

function generateRef() {
  const prefix = jobPrefixes[Math.floor(Math.random() * jobPrefixes.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  const year = "25";
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix} ${num} – ${year}-${seq}`;
}

type StaffStatus = "available" | "unavailable";

function getStatusConfig(status: StaffStatus) {
  if (status === "available") {
    return {
      dot: "bg-[#22c55e]",
      text: "text-[#15803d]",
      badge: "bg-[#dcfce7] text-[#15803d]",
      label: "Available",
      icon: CheckCircle2,
    };
  }
  return {
    dot: "bg-[#ef4444]",
    text: "text-[#dc2626]",
    badge: "bg-[#fee2e2] text-[#dc2626]",
    label: "Unavailable",
    icon: XCircle,
  };
}

export const NewEventModal = ({
  open,
  onClose,
  onSave,
  onConflict,
  prefilledSlot,
  existingEvents = [],
}: NewEventModalProps) => {
  const defaultJobType = jobTypes[0];
  const [form, setForm] = useState({
    title: "",
    reference: generateRef(),
    date: "2026-05-27",
    startTime: prefilledSlot?.timeLabel || "10:00 AM",
    endTime: "11:00 AM",
    staffName: prefilledSlot?.staffName || "",
    staffName2: "",
    jobType: "plumbing",
    notes: "",
  });
  const [isSplitCoverage, setIsSplitCoverage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedJobType = jobTypes.find((j) => j.value === form.jobType) || defaultJobType;

  // Compute availability per staff for the selected start time
  const staffStatuses = useMemo<Record<string, StaffStatus>>(() => {
    const result: Record<string, StaffStatus> = {};
    for (const name of staffMembers) {
      const busy = existingEvents.some(
        (e) => e.staffName === name && e.startTime === form.startTime
      );
      result[name] = busy ? "unavailable" : "available";
    }
    return result;
  }, [existingEvents, form.startTime]);

  const availableStaff = staffMembers.filter((s) => staffStatuses[s] === "available");
  const unavailableStaff = staffMembers.filter((s) => staffStatuses[s] === "unavailable");

  const selectedStatus = form.staffName ? staffStatuses[form.staffName] : null;
  const selectedStatusConfig = selectedStatus ? getStatusConfig(selectedStatus) : null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Job title is required";
    if (!form.staffName) newErrors.staffName = "Staff member is required";
    if (isSplitCoverage && !form.staffName2) newErrors.staffName2 = "Second staff member is required";
    if (!form.startTime) newErrors.startTime = "Start time is required";
    if (!form.endTime) newErrors.endTime = "End time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkConflict = () => {
    if (!form.staffName) return null;
    const conflict = existingEvents.find(
      (e) => e.staffName === form.staffName && e.startTime === form.startTime
    );
    return conflict ? `${form.staffName} already has an event at ${form.startTime}` : null;
  };

  const handleSave = () => {
    if (!validate()) return;
    const conflictMsg = checkConflict();
    const eventData: NewEventData = {
      id: `evt-${Date.now()}`,
      title: form.title,
      reference: form.reference,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      staffName: form.staffName,
      staffName2: isSplitCoverage ? form.staffName2 : undefined,
      jobType: form.jobType,
      notes: form.notes,
      color: selectedJobType.color,
      isSplitCoverage,
    };
    if (conflictMsg) {
      onConflict(eventData, conflictMsg);
    } else {
      onSave(eventData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-[560px] p-0 bg-white rounded-xl overflow-hidden border border-[#e8e8e8]"
        data-testid="new-event-modal"
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-[#e8e8e8]">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[#0e1828] text-lg font-bold font-['Inter',sans-serif]">
              New Event
            </DialogTitle>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#f3f4f6] text-[#6b7280] transition-colors"
              data-testid="close-new-event-modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {prefilledSlot && (
            <div className="mt-2 flex items-center gap-2 bg-[#e5effd] rounded-md px-3 py-2">
              <Calendar className="w-4 h-4 text-[#0065f4] flex-shrink-0" />
              <span className="text-sm text-[#0065f4] font-['Inter',sans-serif] font-medium">
                {prefilledSlot.staffName && `${prefilledSlot.staffName} — `}
                {prefilledSlot.timeLabel && prefilledSlot.timeLabel}
              </span>
            </div>
          )}
        </DialogHeader>

        {/* Form Body */}
        <div className="px-6 py-5 space-y-4 max-h-[560px] overflow-y-auto">

          {/* Job Title */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif] flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#6b7280]" />
              Job Title <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              placeholder="e.g. PRJ 3057 – Building 221 – Pipe Replacement"
              className={`h-10 text-sm font-['Inter',sans-serif] ${errors.title ? "border-red-400" : "border-[#dedede]"}`}
              data-testid="new-event-title-input"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Reference */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#6b7280]" />
              Reference Number
            </Label>
            <Input
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              className="h-10 text-sm font-['Inter',sans-serif] border-[#dedede]"
              data-testid="new-event-reference-input"
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#6b7280]" />
              Date
            </Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="h-10 text-sm font-['Inter',sans-serif] border-[#dedede]"
              data-testid="new-event-date-input"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#6b7280]" />
                Start Time <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.startTime}
                onValueChange={(v) => {
                  setForm({ ...form, startTime: v });
                  if (errors.startTime) setErrors({ ...errors, startTime: "" });
                }}
              >
                <SelectTrigger
                  className={`h-10 text-sm font-['Inter',sans-serif] ${errors.startTime ? "border-red-400" : "border-[#dedede]"}`}
                  data-testid="new-event-start-time"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((t) => (
                    <SelectItem key={t} value={t} className="text-sm">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#6b7280]" />
                End Time <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.endTime}
                onValueChange={(v) => {
                  setForm({ ...form, endTime: v });
                  if (errors.endTime) setErrors({ ...errors, endTime: "" });
                }}
              >
                <SelectTrigger
                  className={`h-10 text-sm font-['Inter',sans-serif] ${errors.endTime ? "border-red-400" : "border-[#dedede]"}`}
                  data-testid="new-event-end-time"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((t) => (
                    <SelectItem key={t} value={t} className="text-sm">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ── Staff Assignment ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#6b7280]" />
                Assign Staff Member <span className="text-red-500">*</span>
              </Label>
              {/* Split Coverage toggle */}
              <button
                onClick={() => {
                  setIsSplitCoverage(!isSplitCoverage);
                  if (isSplitCoverage) setForm({ ...form, staffName2: "" });
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold transition-all ${
                  isSplitCoverage
                    ? "border-[#f97316] bg-[#fff7ed] text-[#c2410c]"
                    : "border-[#e8e8e8] bg-white text-[#6b7280] hover:border-[#f97316] hover:text-[#f97316]"
                }`}
                data-testid="split-coverage-toggle"
              >
                <Users className="w-3 h-3" />
                Split Coverage
              </button>
            </div>

            {/* Info bar showing counts */}
            <div className="flex items-center gap-3 text-xs font-['Inter',sans-serif]">
              <span className="flex items-center gap-1.5 text-[#15803d]">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] inline-block" />
                {availableStaff.length} available at {form.startTime}
              </span>
              {unavailableStaff.length > 0 && (
                <span className="flex items-center gap-1.5 text-[#dc2626]">
                  <span className="w-2 h-2 rounded-full bg-[#ef4444] inline-block" />
                  {unavailableStaff.length} busy
                </span>
              )}
            </div>

            {/* Primary staff select */}
            <Select
              value={form.staffName}
              onValueChange={(v) => {
                setForm({ ...form, staffName: v });
                if (errors.staffName) setErrors({ ...errors, staffName: "" });
              }}
            >
              <SelectTrigger
                className={`h-11 text-sm font-['Inter',sans-serif] ${errors.staffName ? "border-red-400" : "border-[#dedede]"}`}
                data-testid="new-event-staff-select"
              >
                {form.staffName && selectedStatusConfig ? (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${selectedStatusConfig.dot}`} />
                    <span className="font-medium text-[#0e1828] truncate">{form.staffName}</span>
                    <span className={`ml-auto text-xs px-1.5 py-0.5 rounded font-semibold flex-shrink-0 ${selectedStatusConfig.badge}`}>
                      {selectedStatusConfig.label}
                    </span>
                  </div>
                ) : (
                  <SelectValue placeholder="Select staff member..." />
                )}
              </SelectTrigger>
              <SelectContent className="max-h-[280px]">
                {availableStaff.length > 0 && (
                  <SelectGroup>
                    <SelectLabel className="text-xs font-bold text-[#15803d] flex items-center gap-1.5 py-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#22c55e] inline-block" />
                      Available ({availableStaff.length})
                    </SelectLabel>
                    {availableStaff.map((s) => (
                      <SelectItem key={s} value={s} className="cursor-pointer">
                        <div className="flex items-center gap-2 w-full">
                          <span className="w-2 h-2 rounded-full bg-[#22c55e] flex-shrink-0" />
                          <span className="font-medium text-[#0e1828]">{s}</span>
                          <span className="ml-auto text-xs text-[#15803d] font-semibold pl-4">Available</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
                {unavailableStaff.length > 0 && (
                  <>
                    <Separator className="my-1" />
                    <SelectGroup>
                      <SelectLabel className="text-xs font-bold text-[#dc2626] flex items-center gap-1.5 py-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#ef4444] inline-block" />
                        Unavailable ({unavailableStaff.length})
                      </SelectLabel>
                      {unavailableStaff.map((s) => (
                        <SelectItem key={s} value={s} className="cursor-pointer opacity-70">
                          <div className="flex items-center gap-2 w-full">
                            <span className="w-2 h-2 rounded-full bg-[#ef4444] flex-shrink-0" />
                            <span className="font-medium text-[#6b7280] line-through">{s}</span>
                            <span className="ml-auto text-xs text-[#dc2626] font-semibold pl-4">Busy</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </>
                )}
              </SelectContent>
            </Select>
            {errors.staffName && <p className="text-xs text-red-500">{errors.staffName}</p>}

            {/* Split Coverage — second staff */}
            {isSplitCoverage && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2 p-2 bg-[#fff7ed] rounded-md border border-[#fed7aa]">
                  <Users className="w-3.5 h-3.5 text-[#f97316] flex-shrink-0" />
                  <span className="text-xs font-semibold text-[#c2410c] font-['Inter',sans-serif]">
                    Split Coverage: second staff member
                  </span>
                </div>
                <Select
                  value={form.staffName2}
                  onValueChange={(v) => {
                    setForm({ ...form, staffName2: v });
                    if (errors.staffName2) setErrors({ ...errors, staffName2: "" });
                  }}
                >
                  <SelectTrigger
                    className={`h-11 text-sm font-['Inter',sans-serif] border-[#fed7aa] ${errors.staffName2 ? "border-red-400" : ""}`}
                    data-testid="new-event-staff2-select"
                  >
                    {form.staffName2 ? (
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${staffStatuses[form.staffName2] === 'available' ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} />
                        <span className="font-medium text-[#0e1828] truncate">{form.staffName2}</span>
                        <span className={`ml-auto text-xs px-1.5 py-0.5 rounded font-semibold flex-shrink-0 ${staffStatuses[form.staffName2] === 'available' ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#dc2626]'}`}>
                          {staffStatuses[form.staffName2] === 'available' ? 'Available' : 'Busy'}
                        </span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Select second staff member..." />
                    )}
                  </SelectTrigger>
                  <SelectContent className="max-h-[240px]">
                    {availableStaff.filter((s) => s !== form.staffName).length > 0 && (
                      <SelectGroup>
                        <SelectLabel className="text-xs font-bold text-[#15803d] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#22c55e] inline-block" />
                          Available
                        </SelectLabel>
                        {availableStaff.filter((s) => s !== form.staffName).map((s) => (
                          <SelectItem key={s} value={s}>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#22c55e] flex-shrink-0" />
                              <span>{s}</span>
                              <span className="ml-auto text-xs text-[#15803d] pl-4">Available</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                    {unavailableStaff.filter((s) => s !== form.staffName).length > 0 && (
                      <>
                        <Separator className="my-1" />
                        <SelectGroup>
                          <SelectLabel className="text-xs font-bold text-[#dc2626] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#ef4444] inline-block" />
                            Unavailable
                          </SelectLabel>
                          {unavailableStaff.filter((s) => s !== form.staffName).map((s) => (
                            <SelectItem key={s} value={s} className="opacity-70">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#ef4444] flex-shrink-0" />
                                <span className="text-[#6b7280] line-through">{s}</span>
                                <span className="ml-auto text-xs text-[#dc2626] pl-4">Busy</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {errors.staffName2 && <p className="text-xs text-red-500">{errors.staffName2}</p>}
              </div>
            )}
          </div>

          {/* Job Type */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Job Type
            </Label>
            <div className="flex flex-wrap gap-2">
              {jobTypes.map((jt) => (
                <button
                  key={jt.value}
                  onClick={() => setForm({ ...form, jobType: jt.value })}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold font-['Inter',sans-serif] border-2 transition-all ${
                    form.jobType === jt.value
                      ? "border-[#0065f4] text-[#0065f4] bg-[#e5effd]"
                      : "border-[#e8e8e8] text-[#6b7280] bg-white hover:border-[#c8d6e8]"
                  }`}
                  data-testid={`job-type-${jt.value}`}
                >
                  {jt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-2 py-1">
            <span className="text-xs text-[#6b7280] font-['Inter',sans-serif]">Preview:</span>
            <div
              className="inline-flex items-center px-2 py-1 rounded border-l-4 text-xs font-bold font-['Inter',sans-serif] text-[#252627]"
              style={{
                backgroundColor: selectedJobType.color.bg,
                borderLeftColor: selectedJobType.color.border,
              }}
              data-testid="event-preview-badge"
            >
              {form.title || "Job Title"}
              {isSplitCoverage && (
                <span className="ml-1.5 text-[#f97316]">· Split ×2</span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Notes
            </Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Add any additional notes or instructions..."
              className="text-sm font-['Inter',sans-serif] border-[#dedede] resize-none h-20"
              data-testid="new-event-notes"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e8e8e8] flex gap-3 bg-[#fafafa]">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-10 border-[#dedede] text-[#344153] font-['Inter',sans-serif] text-sm"
            data-testid="cancel-new-event"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 h-10 bg-[#0065f4] hover:bg-[#0052c2] text-white font-['Inter',sans-serif] text-sm font-medium"
            data-testid="save-new-event"
          >
            {isSplitCoverage ? "Create (Split Coverage)" : "Create Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
