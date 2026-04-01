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
  endTime: "11:00 AM",
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
}: NewEventModalProps) => {
  const isEditMode = !!editEventData;
  const [form, setForm] = useState(defaultForm(prefilledSlot));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [colorOverride, setColorOverride] = useState<{ bg: string; border: string } | null>(null);

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
      } else {
        setForm(defaultForm(prefilledSlot));
        setColorOverride(null);
      }
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
    if (form.staffNames.length === 0) errs.staffNames = "At least one staff member is required";
    if (!form.startTime)    errs.startTime = "Start time is required";
    if (!form.endTime)      errs.endTime = "End time is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const primaryStaff = form.staffNames[0] || "";
    // In edit mode, skip conflict check
    const conflictMsg = isEditMode ? null : existingEvents.find(
      (e) => e.staffName === primaryStaff && e.startTime === form.startTime
    );
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
    };
    if (conflictMsg) {
      onConflict(eventData, `${primaryStaff} already has an event at ${form.startTime}`);
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
            <Label className="text-[#344153] text-sm font-semibold font-['Inter',sans-serif]">
              Assign Staff <span className="text-red-500">*</span>
            </Label>

            {/* Live availability count */}
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

            {/* Selected staff tags */}
            {form.staffNames.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.staffNames.map((name) => {
                  const st = staffStatuses[name];
                  return (
                    <div
                      key={name}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                        st === "available"
                          ? "bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]"
                          : "bg-[#fff1f1] text-[#dc2626] border-[#fecaca]"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st === "available" ? "bg-[#22c55e]" : "bg-[#ef4444]"}`} />
                      {name}
                      <button
                        onClick={() => removeStaff(name)}
                        className="ml-0.5 opacity-60 hover:opacity-100"
                        data-testid={`remove-staff-${name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add staff dropdown */}
            <Select
              value=""
              onValueChange={(v) => addStaff(v)}
            >
              <SelectTrigger
                className={`h-10 text-sm font-['Inter',sans-serif] ${errors.staffNames ? "border-red-400" : "border-[#dedede]"}`}
                data-testid="new-event-staff-select"
              >
                <SelectValue placeholder={form.staffNames.length === 0 ? "Select staff member…" : "Add another staff member…"} />
              </SelectTrigger>
              <SelectContent className="max-h-[280px]">
                {availableStaff.filter((s) => !form.staffNames.includes(s)).length > 0 && (
                  <SelectGroup>
                    <SelectLabel className="text-xs font-bold text-[#15803d] flex items-center gap-1.5 py-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#22c55e] inline-block" />
                      Available ({availableStaff.filter((s) => !form.staffNames.includes(s)).length})
                    </SelectLabel>
                    {availableStaff.filter((s) => !form.staffNames.includes(s)).map((s) => (
                      <SelectItem key={s} value={s} className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#22c55e] flex-shrink-0" />
                          <span className="font-medium text-[#0e1828]">{s}</span>
                          <CheckCircle2 className="w-3 h-3 text-[#22c55e] ml-auto" />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
                {unavailableStaff.filter((s) => !form.staffNames.includes(s)).length > 0 && (
                  <>
                    <Separator className="my-1" />
                    <SelectGroup>
                      <SelectLabel className="text-xs font-bold text-[#dc2626] flex items-center gap-1.5 py-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#ef4444] inline-block" />
                        Busy ({unavailableStaff.filter((s) => !form.staffNames.includes(s)).length})
                      </SelectLabel>
                      {unavailableStaff.filter((s) => !form.staffNames.includes(s)).map((s) => (
                        <SelectItem key={s} value={s} className="cursor-pointer opacity-60">
                          <div className="flex items-center gap-2">
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
            {errors.staffNames && <p className="text-xs text-red-500">{errors.staffNames}</p>}
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
