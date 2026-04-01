import { useState, useMemo, useEffect } from "react";
import {
  X, Calendar, Clock, User, Briefcase, FileText,
  CheckCircle2, XCircle, Users, MapPin, Star, Contact
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
  location?: string;
  clientName?: string;
  priority?: string;
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
  editEventData?: NewEventData | null;
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

const defaultForm = (prefilledSlot?: PrefilledSlot | null) => ({
  title: "",
  reference: generateRef(),
  date: prefilledSlot?.date || "2026-05-27",
  startTime: prefilledSlot?.timeLabel || "10:00 AM",
  endTime: "11:00 AM",
  staffName: prefilledSlot?.staffName || "",
  staffName2: "",
  jobType: "plumbing",
  notes: "",
  location: "",
  clientName: "",
  priority: "medium",
  timezone: "UTC -06:00 Central",
  repeat: "Never",
  requiredAttendee: "Stephany Chandler Jr.",
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
}: NewEventModalProps) => {
  const isEditMode = !!editEventData;
  const [form, setForm] = useState(defaultForm(prefilledSlot));
  const [isSplitCoverage, setIsSplitCoverage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [colorOverride, setColorOverride] = useState<{ bg: string; border: string } | null>(null);

  // Re-sync form whenever modal opens — use editEventData or prefilledSlot
  useEffect(() => {
    if (open) {
      if (editEventData) {
        // Edit mode: pre-fill everything from the existing event
        setForm({
          title: editEventData.title || editEventData.reference || "",
          reference: editEventData.reference || generateRef(),
          date: editEventData.date || "2026-05-27",
          startTime: editEventData.startTime || "10:00 AM",
          endTime: editEventData.endTime || "11:00 AM",
          staffName: editEventData.staffName || "",
          staffName2: editEventData.staffName2 || "",
          jobType: editEventData.jobType || "plumbing",
          notes: editEventData.notes || "",
          location: editEventData.location || "",
          clientName: editEventData.clientName || "",
          priority: editEventData.priority || "medium",
          timezone: "UTC -06:00 Central",
          repeat: "Never",
          requiredAttendee: "Stephany Chandler Jr.",
          optionalAttendee: "",
        });
        setColorOverride(editEventData.color || null);
      } else {
        setForm(defaultForm(prefilledSlot));
        setColorOverride(null);
      }
      setIsSplitCoverage(false);
      setErrors({});
    }
  }, [open, editEventData?.id, prefilledSlot?.staffName, prefilledSlot?.timeLabel]);

  const selectedJobType = jobTypes.find((j) => j.value === form.jobType) || jobTypes[0];
  const effectiveColor = colorOverride || selectedJobType.color;

  // Live availability: recomputes whenever startTime changes
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

  const availableStaff   = staffMembers.filter((s) => staffStatuses[s] === "available");
  const unavailableStaff = staffMembers.filter((s) => staffStatuses[s] === "unavailable");

  const selectedStatus = form.staffName ? staffStatuses[form.staffName] : null;
  const selectedStatusConfig = selectedStatus ? getStatusConfig(selectedStatus) : null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Job title is required";
    if (!form.staffName)    errs.staffName = "Staff member is required";
    if (isSplitCoverage && !form.staffName2) errs.staffName2 = "Second staff member is required";
    if (!form.startTime)    errs.startTime = "Start time is required";
    if (!form.endTime)      errs.endTime = "End time is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    // In edit mode, skip conflict check (user is intentionally editing)
    const conflictMsg = isEditMode ? null : existingEvents.find(
      (e) => e.staffName === form.staffName && e.startTime === form.startTime
    );
    const eventData: NewEventData = {
      id: isEditMode ? (editEventData!.id) : `evt-${Date.now()}`,
      title: form.title,
      reference: form.reference,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      staffName: form.staffName,
      staffName2: isSplitCoverage ? form.staffName2 : undefined,
      jobType: form.jobType,
      notes: form.notes,
      location: form.location,
      clientName: form.clientName,
      priority: form.priority,
      color: effectiveColor,
      isSplitCoverage,
    };
    if (conflictMsg) {
      onConflict(eventData, `${form.staffName} already has an event at ${form.startTime}`);
    } else {
      onSave(eventData);
      onClose();
    }
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
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif] flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#6b7280]" />
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
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#6b7280]" />
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
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif] flex items-center gap-1.5">
              <Contact className="w-3.5 h-3.5 text-[#6b7280]" />
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
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#6b7280]" />
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

          {/* Required Attendee */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Required
            </Label>
            <Select value={form.requiredAttendee} onValueChange={(v) => f("requiredAttendee", v)}>
              <SelectTrigger className="h-10 text-sm font-['Inter',sans-serif] border-[#dedede]" data-testid="new-event-required-attendee">
                <SelectValue placeholder="Select required attendee…" />
              </SelectTrigger>
              <SelectContent>
                {attendeeOptions.map((a) => (
                  <SelectItem key={a} value={a} className="text-sm">{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Optional Attendee */}
          <div className="space-y-1.5">
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Optional
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

          {/* ── Staff Assignment ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#6b7280]" />
                Assign Staff <span className="text-red-500">*</span>
              </Label>
              <button
                onClick={() => {
                  setIsSplitCoverage(!isSplitCoverage);
                  if (isSplitCoverage) setForm((p) => ({ ...p, staffName2: "" }));
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

            {/* Live availability count — updates when startTime changes */}
            <div className="flex items-center gap-3 text-xs font-['Inter',sans-serif] py-0.5">
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
            <Select value={form.staffName} onValueChange={(v) => f("staffName", v)}>
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
                  <SelectValue placeholder="Select staff member…" />
                )}
              </SelectTrigger>
              <SelectContent className="max-h-[280px]">
                {availableStaff.length > 0 && (
                  <SelectGroup>
                    <SelectLabel className="text-xs font-bold text-[#15803d] flex items-center gap-1.5 py-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#22c55e] inline-block" />
                      Available at {form.startTime} ({availableStaff.length})
                    </SelectLabel>
                    {availableStaff.map((s) => (
                      <SelectItem key={s} value={s} className="cursor-pointer">
                        <div className="flex items-center gap-2 w-full">
                          <span className="w-2 h-2 rounded-full bg-[#22c55e] flex-shrink-0" />
                          <span className="font-medium text-[#0e1828]">{s}</span>
                          <CheckCircle2 className="w-3 h-3 text-[#22c55e] ml-auto" />
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
                        Busy at {form.startTime} ({unavailableStaff.length})
                      </SelectLabel>
                      {unavailableStaff.map((s) => (
                        <SelectItem key={s} value={s} className="cursor-pointer opacity-60">
                          <div className="flex items-center gap-2 w-full">
                            <span className="w-2 h-2 rounded-full bg-[#ef4444] flex-shrink-0" />
                            <span className="font-medium text-[#6b7280] line-through">{s}</span>
                            <XCircle className="w-3 h-3 text-[#ef4444] ml-auto" />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </>
                )}
              </SelectContent>
            </Select>
            {errors.staffName && <p className="text-xs text-red-500">{errors.staffName}</p>}

            {/* Split Coverage second staff */}
            {isSplitCoverage && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2 p-2 bg-[#fff7ed] rounded-md border border-[#fed7aa]">
                  <Users className="w-3.5 h-3.5 text-[#f97316] flex-shrink-0" />
                  <span className="text-xs font-semibold text-[#c2410c] font-['Inter',sans-serif]">
                    Second staff member (split coverage)
                  </span>
                </div>
                <Select value={form.staffName2} onValueChange={(v) => f("staffName2", v)}>
                  <SelectTrigger
                    className={`h-11 text-sm font-['Inter',sans-serif] border-[#fed7aa] ${errors.staffName2 ? "border-red-400" : ""}`}
                    data-testid="new-event-staff2-select"
                  >
                    {form.staffName2 ? (
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${staffStatuses[form.staffName2] === "available" ? "bg-[#22c55e]" : "bg-[#ef4444]"}`} />
                        <span className="font-medium text-[#0e1828] truncate">{form.staffName2}</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Select second staff…" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="max-h-[240px]">
                    {availableStaff.filter((s) => s !== form.staffName).map((s) => (
                      <SelectItem key={s} value={s}>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#22c55e] flex-shrink-0" />
                          <span>{s}</span>
                        </div>
                      </SelectItem>
                    ))}
                    {unavailableStaff.filter((s) => s !== form.staffName).map((s) => (
                      <SelectItem key={s} value={s} className="opacity-60">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ef4444] flex-shrink-0" />
                          <span className="line-through text-[#6b7280]">{s}</span>
                        </div>
                      </SelectItem>
                    ))}
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
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif] flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[#6b7280]" />
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
              {isSplitCoverage && <span className="ml-1.5 text-[#f97316]">· Split ×2</span>}
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
            {isEditMode ? "Save Changes" : isSplitCoverage ? "Create (Split Coverage)" : "Create Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
