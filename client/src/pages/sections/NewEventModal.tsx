import { useState, useMemo, useEffect, useRef } from "react";
import {
  X, Calendar, Clock, User, Briefcase, FileText,
  CheckCircle2, XCircle, Users, MapPin, Star, Contact,
  ChevronDown, Split,
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

export interface SplitSegment {
  startTime: string;
  endTime: string;
  staffName: string;
}

export interface NewEventData {
  id: string;
  title: string;
  reference: string;
  date: string;
  startTime: string;
  endTime: string;
  staffName: string;
  staffNames?: string[];
  staffName2?: string;
  jobType: string;
  notes: string;
  location?: string;
  clientName?: string;
  priority?: string;
  projectStatus?: string;
  color: { bg: string; border: string };
  isSplitCoverage?: boolean;
  splitSegments?: SplitSegment[];
}

export interface PrefilledSlot {
  staffName: string;
  timeLabel: string;
  date?: string;
  endTime?: string;
}

interface NewEventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (event: NewEventData) => void;
  onConflict?: (event: NewEventData, existing: string) => void;
  prefilledSlot?: PrefilledSlot | null;
  editEventData?: NewEventData | null;
  existingEvents?: { staffName: string; startTime: string; endTime: string }[];
  defaultSplitCoverage?: boolean;
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
  { value: "plumbing",   label: "Plumbing",            color: { bg: "#fcf1d9", border: "#eca203" } },
  { value: "hvac",       label: "HVAC",                color: { bg: "#f2ebf8", border: "#8238bb" } },
  { value: "electrical", label: "Electrical",          color: { bg: "#e5effd", border: "#0063ec" } },
  { value: "gas",        label: "Gas Line",            color: { bg: "#e5f1ed", border: "#007c54" } },
  { value: "inspection", label: "Inspection",          color: { bg: "#fcf1d9", border: "#eca203" } },
  { value: "general",    label: "General Maintenance", color: { bg: "#e5effd", border: "#0063ec" } },
];

const priorityOptions = [
  { value: "low",    label: "Low",    color: "bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]" },
  { value: "medium", label: "Medium", color: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]" },
  { value: "high",   label: "High",   color: "bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]" },
  { value: "urgent", label: "Urgent", color: "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]" },
];

const timeOptions = [
  "08:00 AM","08:30 AM","09:00 AM","09:30 AM",
  "10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM","01:00 PM","01:30 PM",
  "02:00 PM","02:30 PM","03:00 PM","03:30 PM",
  "04:00 PM","04:30 PM","05:00 PM",
];

const jobPrefixes = ["PRJ","GEN","ELEC","SRV","HVAC","AS","MG","PN"];
function generateRef() {
  const prefix = jobPrefixes[Math.floor(Math.random() * jobPrefixes.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix} ${num} – 25-${Math.floor(Math.random() * 9000) + 1000}`;
}

type StaffStatus = "available" | "unavailable";

function getStatusConfig(status: StaffStatus) {
  if (status === "available") {
    return { dot: "bg-[#22c55e]", text: "text-[#15803d]", badge: "bg-[#dcfce7] text-[#15803d]", label: "Available" };
  }
  return { dot: "bg-[#ef4444]", text: "text-[#dc2626]", badge: "bg-[#fee2e2] text-[#dc2626]", label: "Unavailable" };
}

const COLOR_PRESETS = [
  { border: "#eca203", bg: "#fcf1d9" },
  { border: "#8238bb", bg: "#f2ebf8" },
  { border: "#0063ec", bg: "#e5effd" },
  { border: "#007c54", bg: "#e5f1ed" },
  { border: "#ef4444", bg: "#fef2f2" },
  { border: "#f97316", bg: "#fff7ed" },
  { border: "#6366f1", bg: "#eef2ff" },
  { border: "#0891b2", bg: "#e0f2fe" },
  { border: "#ec4899", bg: "#fdf2f8" },
];

const attendeeOptions = [
  "Stephany Chandler Jr.",
  "Marcus Webb",
  "Alicia Torres",
  "James Holloway",
  "Priya Nair",
  "Devon Caldwell",
];

const projectStatusOptions = [
  { value: "not_started", label: "Not Started",  color: "#9ca3af", bg: "#f3f4f6" },
  { value: "in_progress", label: "In Progress",  color: "#3b82f6", bg: "#dbeafe" },
  { value: "on_hold",     label: "On Hold",      color: "#f59e0b", bg: "#fef3c7" },
  { value: "completed",   label: "Completed",    color: "#22c55e", bg: "#dcfce7" },
  { value: "cancelled",   label: "Cancelled",    color: "#ef4444", bg: "#fee2e2" },
];

const defaultForm = (prefilledSlot?: PrefilledSlot | null) => ({
  title: "",
  reference: generateRef(),
  date: prefilledSlot?.date || "2026-05-27",
  startTime: prefilledSlot?.timeLabel || "10:00 AM",
  endTime: prefilledSlot?.endTime || "11:00 AM",
  staffNames: prefilledSlot?.staffName ? [prefilledSlot.staffName] : [] as string[],
  jobType: "plumbing",
  notes: "",
  location: "",
  clientName: "",
  priority: "medium",
  projectStatus: "not_started",
  timezone: "UTC -06:00 Central",
  repeat: "Never",
  optionalAttendee: "",
});

export const NewEventModal = ({
  open,
  onClose,
  onSave,
  onConflict,
  prefilledSlot,
  editEventData,
  existingEvents = [],
  defaultSplitCoverage = false,
}: NewEventModalProps) => {
  const isEditMode = !!editEventData;
  const [form, setForm] = useState(defaultForm(prefilledSlot));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [colorOverride, setColorOverride] = useState<{ bg: string; border: string } | null>(null);

  // Staff dropdown (inline multi-select)
  const staffDropdownRef = useRef<HTMLDivElement>(null);
  const [staffDropdownOpen, setStaffDropdownOpen] = useState(false);

  // Split coverage
  const [splitCoverage, setSplitCoverage] = useState(defaultSplitCoverage);
  const [splitSegments, setSplitSegments] = useState<SplitSegment[]>([
    { startTime: "10:00 AM", endTime: "11:00 AM", staffName: "" },
    { startTime: "11:00 AM", endTime: "12:00 PM", staffName: "" },
  ]);

  // Close staff dropdown on outside click
  useEffect(() => {
    if (!staffDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (!staffDropdownRef.current?.contains(e.target as Node)) {
        setStaffDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [staffDropdownOpen]);

  // Re-sync form whenever modal opens — use editEventData or prefilledSlot
  useEffect(() => {
    if (open) {
      if (editEventData) {
        const preNames = editEventData.staffNames && editEventData.staffNames.length > 0
          ? editEventData.staffNames
          : editEventData.staffName ? [editEventData.staffName] : [];
        setForm({
          title: editEventData.title || editEventData.reference || "",
          reference: editEventData.reference || generateRef(),
          date: editEventData.date || "2026-05-27",
          startTime: editEventData.startTime || "10:00 AM",
          endTime: editEventData.endTime || "11:00 AM",
          staffNames: preNames,
          jobType: editEventData.jobType || "plumbing",
          notes: editEventData.notes || "",
          location: editEventData.location || "",
          clientName: editEventData.clientName || "",
          priority: editEventData.priority || "medium",
          projectStatus: editEventData.projectStatus || "not_started",
          timezone: "UTC -06:00 Central",
          repeat: "Never",
          optionalAttendee: "",
        });
        setColorOverride(editEventData.color || null);
        if (editEventData.splitSegments && editEventData.splitSegments.length > 0) {
          setSplitCoverage(true);
          setSplitSegments(editEventData.splitSegments);
        } else {
          setSplitCoverage(defaultSplitCoverage);
        }
      } else {
        setForm(defaultForm(prefilledSlot));
        setColorOverride(null);
        setSplitCoverage(defaultSplitCoverage);
        const splitStart = prefilledSlot?.timeLabel || "10:00 AM";
        const splitEnd   = prefilledSlot?.endTime   || "11:00 AM";
        const splitMidIdx = Math.floor((timeOptions.indexOf(splitStart) + timeOptions.indexOf(splitEnd)) / 2);
        const splitMid = timeOptions[Math.max(timeOptions.indexOf(splitStart) + 1, splitMidIdx)] || splitEnd;
        setSplitSegments([
          { startTime: splitStart, endTime: splitMid, staffName: "" },
          { startTime: splitMid, endTime: splitEnd, staffName: "" },
        ]);
      }
      setErrors({});
      setStaffDropdownOpen(false);
    }
  }, [open, editEventData?.id, prefilledSlot?.staffName, prefilledSlot?.timeLabel]);

  // Split coverage helpers
  const addSplitSegment = () => {
    const last = splitSegments[splitSegments.length - 1];
    const nextIdx = timeOptions.indexOf(last.endTime);
    const nextEnd = timeOptions[nextIdx + 1] || last.endTime;
    setSplitSegments((prev) => [...prev, { startTime: last.endTime, endTime: nextEnd, staffName: "" }]);
  };
  const removeSplitSegment = (idx: number) => {
    setSplitSegments((prev) => prev.filter((_, i) => i !== idx));
  };
  const updateSegment = (idx: number, key: keyof SplitSegment, value: string) => {
    setSplitSegments((prev) => prev.map((seg, i) => i === idx ? { ...seg, [key]: value } : seg));
  };

  const selectedJobType = jobTypes.find((j) => j.value === form.jobType) || jobTypes[0];
  const effectiveColor = colorOverride || selectedJobType.color;

  // Convert "HH:MM AM/PM" → minutes from midnight
  const timeToMin = (t: string): number => {
    if (!t) return 0;
    const [timePart, mer] = t.split(" ");
    const [h, m] = timePart.split(":").map(Number);
    let hours = h % 12;
    if (mer === "PM") hours += 12;
    return hours * 60 + (m || 0);
  };

  // Live availability: recomputes whenever startTime OR endTime changes
  const staffStatuses = useMemo<Record<string, StaffStatus>>(() => {
    const selStart = timeToMin(form.startTime);
    const selEnd   = form.endTime ? timeToMin(form.endTime) : selStart + 60;
    const result: Record<string, StaffStatus> = {};
    for (const name of staffMembers) {
      const busy = existingEvents.some((e) => {
        if (e.staffName !== name) return false;
        const evStart = timeToMin(e.startTime);
        const evEnd   = e.endTime ? timeToMin(e.endTime) : evStart + 60;
        return evStart < selEnd && evEnd > selStart;
      });
      result[name] = busy ? "unavailable" : "available";
    }
    return result;
  }, [existingEvents, form.startTime, form.endTime]);

  const availableStaff   = staffMembers.filter((s) => staffStatuses[s] === "available");
  const unavailableStaff = staffMembers.filter((s) => staffStatuses[s] === "unavailable");

  // Auto-suggest split coverage when nobody is free for the selected range
  const allBusy = availableStaff.length === 0 && existingEvents.length > 0;

  // Per-segment availability: check each segment's time window independently
  const segmentStaffStatuses = useMemo<Record<string, StaffStatus>[]>(() => {
    return splitSegments.map((seg) => {
      const segStart = timeToMin(seg.startTime);
      const segEnd   = seg.endTime ? timeToMin(seg.endTime) : segStart + 60;
      const result: Record<string, StaffStatus> = {};
      for (const name of staffMembers) {
        const busy = existingEvents.some((e) => {
          if (e.staffName !== name) return false;
          const evStart = timeToMin(e.startTime);
          const evEnd   = e.endTime ? timeToMin(e.endTime) : evStart + 60;
          return evStart < segEnd && evEnd > segStart;
        });
        result[name] = busy ? "unavailable" : "available";
      }
      return result;
    });
  }, [splitSegments, existingEvents]);

  // Multi-staff helpers
  const addStaff = (name: string) => {
    if (!form.staffNames.includes(name)) {
      setForm((p) => ({ ...p, staffNames: [...p.staffNames, name] }));
      setErrors((p) => ({ ...p, staffNames: "" }));
    }
  };
  const removeStaff = (name: string) => {
    setForm((p) => ({ ...p, staffNames: p.staffNames.filter((s) => s !== name) }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Job title is required";
    if (splitCoverage) {
      if (!splitSegments.some((s) => s.staffName))
        errs.staffNames = "At least one segment must have a staff member";
    } else {
      if (form.staffNames.length === 0) errs.staffNames = "At least one staff member is required";
    }
    if (!form.startTime) errs.startTime = "Start time is required";
    if (!form.endTime)   errs.endTime   = "End time is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const primaryStaff = form.staffNames[0] || "";
    const eventData: NewEventData = {
      id: isEditMode ? (editEventData!.id) : `evt-${Date.now()}`,
      title: form.title,
      reference: form.reference,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      staffName: primaryStaff,
      staffNames: form.staffNames,
      jobType: form.jobType,
      notes: form.notes,
      location: form.location,
      clientName: form.clientName,
      priority: form.priority,
      projectStatus: form.projectStatus,
      color: effectiveColor,
      splitSegments: splitCoverage ? splitSegments.filter((s) => s.staffName) : undefined,
    };
    // Always save — conflicts are shown visually as stacked chips in the grid
    onSave(eventData);
    onClose();
  };

  const f = (key: keyof typeof form, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-[580px] p-0 bg-white rounded-xl overflow-hidden border border-[#e8e8e8]"
        data-testid="new-event-modal"
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-[#e8e8e8]">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[#0e1828] text-lg font-bold font-['Inter',sans-serif]">
              {isEditMode ? "Edit Event" : "New Event"}
            </DialogTitle>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#f3f4f6] text-[#6b7280] transition-colors"
              data-testid="close-new-event-modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {prefilledSlot && (prefilledSlot.staffName || prefilledSlot.timeLabel) && (
            <div className="mt-2 flex items-center gap-2 bg-[#e5effd] rounded-md px-3 py-2">
              <Calendar className="w-4 h-4 text-[#0065f4] flex-shrink-0" />
              <span className="text-sm text-[#0065f4] font-['Inter',sans-serif] font-medium">
                {prefilledSlot.staffName && `${prefilledSlot.staffName}`}
                {prefilledSlot.staffName && prefilledSlot.timeLabel && " — "}
                {prefilledSlot.timeLabel}
              </span>
            </div>
          )}
        </DialogHeader>

        {/* Form */}
        <div className="px-6 py-4 space-y-4 max-h-[560px] overflow-y-auto">

          {/* Job Title */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Job Title <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.title}
              onChange={(e) => f("title", e.target.value)}
              placeholder="e.g. PRJ 3057 – Building 221 – Pipe Replacement"
              className={`h-10 text-sm font-['Inter',sans-serif] ${errors.title ? "border-red-400" : "border-[#dedede]"}`}
              data-testid="new-event-title-input"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Reference */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Reference Number
            </Label>
            <Input
              value={form.reference}
              onChange={(e) => f("reference", e.target.value)}
              className="h-10 text-sm font-['Inter',sans-serif] border-[#dedede]"
              data-testid="new-event-reference-input"
            />
          </div>

          {/* Client Name */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Client Name
            </Label>
            <Input
              value={form.clientName}
              onChange={(e) => f("clientName", e.target.value)}
              placeholder="e.g. Saina Properties Ltd."
              className="h-10 text-sm font-['Inter',sans-serif] border-[#dedede]"
              data-testid="new-event-client-input"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Location / Address
            </Label>
            <Input
              value={form.location}
              onChange={(e) => f("location", e.target.value)}
              placeholder="e.g. 221 Building, Lakeshore Blvd"
              className="h-10 text-sm font-['Inter',sans-serif] border-[#dedede]"
              data-testid="new-event-location-input"
            />
          </div>

          {/* Starts */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Starts <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={form.date}
                onChange={(e) => f("date", e.target.value)}
                className="h-10 text-sm font-['Inter',sans-serif] border-[#dedede] flex-1"
                data-testid="new-event-date-input"
              />
              <Select value={form.startTime} onValueChange={(v) => f("startTime", v)}>
                <SelectTrigger
                  className={`h-10 text-sm font-['Inter',sans-serif] w-[140px] ${errors.startTime ? "border-red-400" : "border-[#dedede]"}`}
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
          </div>

          {/* Ends */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Ends <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                type="date"
                value={form.date}
                readOnly
                className="h-10 text-sm font-['Inter',sans-serif] border-[#dedede] flex-1 bg-[#fafafa]"
              />
              <Select value={form.endTime} onValueChange={(v) => f("endTime", v)}>
                <SelectTrigger
                  className={`h-10 text-sm font-['Inter',sans-serif] w-[140px] ${errors.endTime ? "border-red-400" : "border-[#dedede]"}`}
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

          {/* All Day + Time Zone + Repeat row */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-[#344153] font-['Inter',sans-serif]">
              <input type="checkbox" className="w-4 h-4 rounded accent-[#0065f4]" data-testid="new-event-allday" />
              All Day
            </label>
          </div>

          {/* Time Zone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
                Time Zone
              </Label>
              <Select value={form.timezone} onValueChange={(v) => f("timezone", v)}>
                <SelectTrigger className="h-10 text-sm font-['Inter',sans-serif] border-[#dedede]" data-testid="new-event-timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC -06:00 Central" className="text-sm">(UTC -06:00) Central</SelectItem>
                  <SelectItem value="UTC -05:00 Eastern" className="text-sm">(UTC -05:00) Eastern</SelectItem>
                  <SelectItem value="UTC -07:00 Mountain" className="text-sm">(UTC -07:00) Mountain</SelectItem>
                  <SelectItem value="UTC -08:00 Pacific" className="text-sm">(UTC -08:00) Pacific</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
                Repeat
              </Label>
              <Select value={form.repeat} onValueChange={(v) => f("repeat", v)}>
                <SelectTrigger className="h-10 text-sm font-['Inter',sans-serif] border-[#dedede]" data-testid="new-event-repeat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Never" className="text-sm">Never</SelectItem>
                  <SelectItem value="Daily" className="text-sm">Daily</SelectItem>
                  <SelectItem value="Weekly" className="text-sm">Weekly</SelectItem>
                  <SelectItem value="Bi-Weekly" className="text-sm">Bi-Weekly</SelectItem>
                  <SelectItem value="Monthly" className="text-sm">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ── Staff Assignment ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
                Assign Staff <span className="text-red-500">*</span>
              </Label>
              <span className="text-xs text-[#9ca3af] font-['Inter',sans-serif]">
                <span className="text-[#15803d] font-medium">{availableStaff.length}</span> available
                {unavailableStaff.length > 0 && (
                  <> · <span className="text-[#dc2626] font-medium">{unavailableStaff.length}</span> busy</>
                )}
                {" "}{form.startTime}–{form.endTime}
              </span>
            </div>

            {/* Inline multi-select — tags inside the trigger */}
            {!splitCoverage && (
              <div ref={staffDropdownRef} className="relative">
                <div
                  className={`min-h-[40px] border rounded-md flex flex-wrap items-center gap-1.5 px-3 py-1.5 cursor-pointer bg-white transition-colors ${
                    staffDropdownOpen
                      ? "border-[#93b9f9]"
                      : errors.staffNames
                      ? "border-red-400"
                      : "border-[#dedede]"
                  }`}
                  onClick={() => setStaffDropdownOpen((o) => !o)}
                  data-testid="new-event-staff-select"
                >
                  {form.staffNames.map((name) => {
                    const st = staffStatuses[name];
                    return (
                      <span
                        key={name}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border flex-shrink-0 ${
                          st === "available"
                            ? "bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]"
                            : "bg-[#fff1f1] text-[#dc2626] border-[#fecaca]"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${st === "available" ? "bg-[#22c55e]" : "bg-[#ef4444]"}`} />
                        {name}
                        <button
                          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); removeStaff(name); }}
                          className="ml-0.5 opacity-60 hover:opacity-100"
                          data-testid={`remove-staff-${name}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                  {form.staffNames.length === 0 ? (
                    <span className="text-sm text-[#9ca3af] font-['Inter',sans-serif]">Select staff member…</span>
                  ) : (
                    <span className="text-xs text-[#9ca3af] font-['Inter',sans-serif]">+ add more</span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-[#9ca3af] ml-auto flex-shrink-0 transition-transform ${staffDropdownOpen ? "rotate-180" : ""}`} />
                </div>

                {/* Dropdown panel */}
                {staffDropdownOpen && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#e8e8e8] rounded-md shadow-lg max-h-[260px] overflow-y-auto">
                    {availableStaff.filter((s) => !form.staffNames.includes(s)).length > 0 && (
                      <div className="px-2 pt-2 pb-1">
                        <p className="text-[10px] font-bold text-[#15803d] uppercase tracking-wide px-2 pb-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                          Available ({availableStaff.filter((s) => !form.staffNames.includes(s)).length})
                        </p>
                        {availableStaff.filter((s) => !form.staffNames.includes(s)).map((s) => (
                          <button
                            key={s}
                            className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-[#f0fdf4] rounded-md text-left"
                            onMouseDown={(e) => { e.preventDefault(); addStaff(s); }}
                            data-testid={`staff-option-${s}`}
                          >
                            <span className="w-2 h-2 rounded-full bg-[#22c55e] flex-shrink-0" />
                            <span className="text-sm font-medium text-[#0e1828] font-['Inter',sans-serif]">{s}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] ml-auto" />
                          </button>
                        ))}
                      </div>
                    )}
                    {unavailableStaff.filter((s) => !form.staffNames.includes(s)).length > 0 && (
                      <>
                        {availableStaff.filter((s) => !form.staffNames.includes(s)).length > 0 && (
                          <div className="border-t border-[#e8e8e8] mx-2" />
                        )}
                        <div className="px-2 pt-1 pb-2">
                          <p className="text-[10px] font-bold text-[#dc2626] uppercase tracking-wide px-2 pb-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                            Busy ({unavailableStaff.filter((s) => !form.staffNames.includes(s)).length})
                          </p>
                          {unavailableStaff.filter((s) => !form.staffNames.includes(s)).map((s) => (
                            <button
                              key={s}
                              className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-[#fff1f1] rounded-md text-left"
                              onMouseDown={(e) => { e.preventDefault(); addStaff(s); }}
                            >
                              <span className="w-2 h-2 rounded-full bg-[#ef4444] flex-shrink-0" />
                              <span className="text-sm font-medium text-[#6b7280] line-through font-['Inter',sans-serif]">{s}</span>
                              <XCircle className="w-3.5 h-3.5 text-[#ef4444] ml-auto" />
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            {errors.staffNames && <p className="text-xs text-red-500">{errors.staffNames}</p>}

            {/* All-busy banner — auto-suggest split coverage */}
            {allBusy && !splitCoverage && (
              <div className="flex items-start gap-2 rounded-lg border border-[#fde68a] bg-[#fffbeb] px-3 py-2">
                <span className="text-[#d97706] text-base leading-none mt-0.5">⚠</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#92400e] font-['Inter',sans-serif]">No staff available {form.startTime}–{form.endTime}</p>
                  <p className="text-xs text-[#b45309] font-['Inter',sans-serif] mt-0.5">
                    All team members are busy during this time.{" "}
                    <button
                      type="button"
                      onClick={() => setSplitCoverage(true)}
                      className="underline font-semibold hover:text-[#92400e] transition-colors"
                    >
                      Enable Split Coverage
                    </button>{" "}
                    to divide the job between staff at different sub-intervals.
                  </p>
                </div>
              </div>
            )}

            {/* Split Coverage toggle */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setSplitCoverage((v) => !v)}
                className={`flex items-center gap-2 text-xs font-semibold font-['Inter',sans-serif] transition-colors ${
                  splitCoverage ? "text-[#0065f4]" : "text-[#6b7280] hover:text-[#344153]"
                }`}
                data-testid="split-coverage-toggle"
              >
                <Split className="w-3.5 h-3.5" />
                Split Coverage
              </button>
              <button
                type="button"
                onClick={() => setSplitCoverage((v) => !v)}
                className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${splitCoverage ? "bg-[#0065f4]" : "bg-[#d1d5db]"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${splitCoverage ? "translate-x-4" : ""}`} />
              </button>
            </div>

            {/* Split Coverage segments */}
            {splitCoverage && (
              <div className="rounded-lg border border-[#e2e5e9] bg-[#f8f9fa] p-3 space-y-2">
                <p className="text-xs text-[#6b7280] font-['Inter',sans-serif]">
                  Assign different staff for each time segment. Each creates a separate chip in the grid.
                </p>
                {splitSegments.map((seg, idx) => (
                  <div key={idx} className="bg-white border border-[#e8e8e8] rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#344153] font-['Inter',sans-serif]">Segment {idx + 1}</span>
                      {splitSegments.length > 2 && (
                        <button onClick={() => removeSplitSegment(idx)} className="text-[#ef4444] hover:opacity-70 transition-opacity">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-[#9ca3af] font-['Inter',sans-serif] uppercase tracking-wide">From</Label>
                        <Select value={seg.startTime} onValueChange={(v) => updateSegment(idx, "startTime", v)}>
                          <SelectTrigger className="h-8 text-xs border-[#dedede] font-['Inter',sans-serif]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((t) => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-[#9ca3af] font-['Inter',sans-serif] uppercase tracking-wide">To</Label>
                        <Select value={seg.endTime} onValueChange={(v) => updateSegment(idx, "endTime", v)}>
                          <SelectTrigger className="h-8 text-xs border-[#dedede] font-['Inter',sans-serif]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((t) => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {(() => {
                      const segStatuses = segmentStaffStatuses[idx] || {};
                      const segAvail   = staffMembers.filter((s) => segStatuses[s] === "available");
                      const segBusy    = staffMembers.filter((s) => segStatuses[s] === "unavailable");
                      return (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Label className="text-[10px] text-[#9ca3af] font-['Inter',sans-serif] uppercase tracking-wide">Staff member</Label>
                            <span className="text-[9px] text-[#15803d] font-medium font-['Inter',sans-serif]">
                              {segAvail.length} free this segment
                            </span>
                          </div>
                          <Select value={seg.staffName} onValueChange={(v) => updateSegment(idx, "staffName", v)}>
                            <SelectTrigger className={`h-8 text-xs border-[#dedede] font-['Inter',sans-serif] ${!seg.staffName ? "text-[#9ca3af]" : ""}`}>
                              <SelectValue placeholder="Select staff…" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {segAvail.map((s) => (
                                <SelectItem key={s} value={s} className="text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                                    {s}
                                  </div>
                                </SelectItem>
                              ))}
                              {segBusy.length > 0 && (
                                <>
                                  <Separator className="my-1" />
                                  {segBusy.map((s) => (
                                    <SelectItem key={s} value={s} className="text-xs opacity-60">
                                      <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                                        {s}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    })()}
                  </div>
                ))}
                <button
                  onClick={addSplitSegment}
                  className="w-full py-2 text-xs text-[#0065f4] border border-dashed border-[#93b9f9] rounded-lg hover:bg-[#f0f7ff] transition-colors font-['Inter',sans-serif] font-medium"
                  data-testid="add-split-segment"
                >
                  + Add Segment
                </button>
              </div>
            )}
          </div>

          {/* Optional Attendee */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Optional Attendee
            </Label>
            <Select value={form.optionalAttendee} onValueChange={(v) => f("optionalAttendee", v)}>
              <SelectTrigger className="h-10 text-sm font-['Inter',sans-serif] border-[#dedede]" data-testid="new-event-optional-attendee">
                <SelectValue placeholder="Select optional attendee…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" className="text-sm text-[#9ca3af]">None</SelectItem>
                {attendeeOptions.map((a) => (
                  <SelectItem key={a} value={a} className="text-sm">{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Project Status */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Project Status
            </Label>
            <div className="flex flex-wrap gap-2">
              {projectStatusOptions.map((ps) => {
                const isSelected = form.projectStatus === ps.value;
                return (
                  <button
                    key={ps.value}
                    onClick={() => f("projectStatus", ps.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border-2 transition-all ${
                      isSelected
                        ? "border-current"
                        : "border-[#e8e8e8] text-[#6b7280] bg-white hover:border-[#d1d5db]"
                    }`}
                    style={isSelected ? { backgroundColor: ps.bg, color: ps.color, borderColor: ps.color } : {}}
                    data-testid={`project-status-${ps.value}`}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: ps.color }}
                    />
                    {ps.label}
                  </button>
                );
              })}
            </div>
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
                  onClick={() => f("jobType", jt.value)}
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

          {/* Priority */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Priority
            </Label>
            <div className="flex gap-2">
              {priorityOptions.map((p) => (
                <button
                  key={p.value}
                  onClick={() => f("priority", p.value)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-semibold font-['Inter',sans-serif] border transition-all ${
                    form.priority === p.value
                      ? `${p.color} border-current ring-1 ring-current ring-offset-1`
                      : "border-[#e8e8e8] text-[#9ca3af] bg-white hover:border-[#d1d5db]"
                  }`}
                  data-testid={`priority-${p.value}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Job Color
            </Label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map((c) => {
                const isSelected = colorOverride?.border === c.border;
                return (
                  <button
                    key={c.border}
                    onClick={() => setColorOverride(isSelected ? null : c)}
                    className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                      isSelected ? "border-[#0e1828] scale-110 shadow-md" : "border-white shadow ring-1 ring-[#e8e8e8]"
                    }`}
                    style={{ backgroundColor: c.border }}
                    title={isSelected ? "Reset to job type color" : "Set custom color"}
                    data-testid={`color-swatch-${c.border.replace("#","")}`}
                  />
                );
              })}
              {colorOverride && (
                <button
                  onClick={() => setColorOverride(null)}
                  className="text-xs text-[#9ca3af] hover:text-[#344153] transition-colors ml-1"
                  data-testid="color-reset"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9ca3af] font-['Inter',sans-serif]">Preview:</span>
            <div
              className="inline-flex items-center px-2 py-1 rounded border-l-4 text-xs font-bold font-['Inter',sans-serif] text-[#252627]"
              style={{ backgroundColor: effectiveColor.bg, borderLeftColor: effectiveColor.border }}
              data-testid="event-preview-badge"
            >
              {form.title || "Job Title"}
              {form.staffNames.length > 1 && <span className="ml-1.5 text-[#0065f4]">· {form.staffNames.length} staff</span>}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Notes / Instructions
            </Label>
            <Textarea
              value={form.notes}
              onChange={(e) => f("notes", e.target.value)}
              placeholder="Add any additional notes, special instructions, or equipment requirements…"
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
            {isEditMode ? "Save Changes" : form.staffNames.length > 1 ? `Create Event (${form.staffNames.length} Staff)` : "Create Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
