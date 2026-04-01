import { useState, useEffect } from "react";
import { PlusIcon, CheckCircle2, X, Search, Settings2 } from "lucide-react";
import albiLogo from "@assets/albi_icon_sky_white_1775052250721.png";
import schedulerIcon from "@assets/Scheduler_1775055102572.png";
import dashboardIcon from "@assets/dashboard_1775055102572.png";
import projectsIcon from "@assets/projects_1775055102572.png";
import assetsIcon from "@assets/assets_1775055102572.png";
import relationshipsIcon from "@assets/relationships_1775055102572.png";
import { Button } from "@/components/ui/button";
import { CalendarSubsection, CustomEventData, CellChip, DragChipData, UnassignedCard } from "./sections/CalendarSubsection";
import { FrameSubsection } from "./sections/FrameSubsection";
import { FrameWrapperSubsection } from "./sections/FrameWrapperSubsection";
import { ViewControlsSubsection } from "./sections/ViewControlsSubsection";
import { AvailabilitySearchSheet, AvailabilityFilters } from "./sections/AvailabilitySearchSheet";
import { NewEventModal, NewEventData, PrefilledSlot } from "./sections/NewEventModal";
import { ConflictResolutionDialog } from "./sections/ConflictResolutionDialog";
import { JobDetailModal, JobDetailPayload } from "./sections/JobDetailModal";

const mainNavItems = [
  { img: schedulerIcon,      label: "Scheduler",     active: true },
  { img: dashboardIcon,      label: "Dashboard" },
  { img: projectsIcon,       label: "Projects" },
  { img: assetsIcon,         label: "Assets" },
  { img: relationshipsIcon,  label: "Relationships" },
];

// Base occupied slots — drives staff-availability checks
const existingEventSlots = [
  { staffName: "Alan Thomas",      startTime: "10:00 AM" },
  { staffName: "Alan Thomas",      startTime: "11:00 AM" },
  { staffName: "Alan Thomas",      startTime: "12:00 PM" },
  { staffName: "Alan Thomas",      startTime: "02:00 PM" },
  { staffName: "Alan Thomas",      startTime: "04:00 PM" },
  { staffName: "Michael Schaj",    startTime: "10:00 AM" },
  { staffName: "Michael Schaj",    startTime: "11:00 AM" },
  { staffName: "Michael Schaj",    startTime: "12:00 PM" },
  { staffName: "Michael Schaj",    startTime: "01:00 PM" },
  { staffName: "Michael Schaj",    startTime: "03:00 PM" },
  { staffName: "Anna Sorokin",     startTime: "10:00 AM" },
  { staffName: "Anna Sorokin",     startTime: "11:00 AM" },
  { staffName: "Anna Sorokin",     startTime: "12:00 PM" },
  { staffName: "Anna Sorokin",     startTime: "02:00 PM" },
  { staffName: "Anna Sorokin",     startTime: "04:00 PM" },
  { staffName: "Connor Grace",     startTime: "01:00 PM" },
  { staffName: "Connor Grace",     startTime: "03:00 PM" },
  { staffName: "Connor Grace",     startTime: "05:00 PM" },
  { staffName: "Carmen Flores",    startTime: "10:00 AM" },
  { staffName: "Carmen Flores",    startTime: "11:00 AM" },
  { staffName: "Carmen Flores",    startTime: "12:00 PM" },
  { staffName: "Carmen Flores",    startTime: "03:00 PM" },
  { staffName: "Shamoil Soni",     startTime: "01:00 PM" },
  { staffName: "Shamoil Soni",     startTime: "03:00 PM" },
  { staffName: "Shamoil Soni",     startTime: "05:00 PM" },
  { staffName: "Chiara Bondesan",  startTime: "10:00 AM" },
  { staffName: "Chiara Bondesan",  startTime: "11:00 AM" },
  { staffName: "Chiara Bondesan",  startTime: "12:00 PM" },
  { staffName: "Chiara Bondesan",  startTime: "01:00 PM" },
  { staffName: "Chiara Bondesan",  startTime: "03:00 PM" },
  { staffName: "Christy Blaker",   startTime: "10:00 AM" },
  { staffName: "Christy Blaker",   startTime: "12:00 PM" },
  { staffName: "Christy Blaker",   startTime: "01:00 PM" },
  { staffName: "Christy Blaker",   startTime: "04:00 PM" },
  { staffName: "Adam Smith",       startTime: "10:00 AM" },
  { staffName: "Adam Smith",       startTime: "11:00 AM" },
  { staffName: "Adam Smith",       startTime: "03:00 PM" },
  { staffName: "Adam Smith",       startTime: "05:00 PM" },
  { staffName: "Daniyal Shamoon",  startTime: "10:00 AM" },
  { staffName: "Daniyal Shamoon",  startTime: "12:00 PM" },
  { staffName: "Daniyal Shamoon",  startTime: "02:00 PM" },
  { staffName: "Daniyal Shamoon",  startTime: "04:00 PM" },
  { staffName: "Michele Rave",     startTime: "12:00 PM" },
  { staffName: "Michele Rave",     startTime: "02:00 PM" },
  { staffName: "Michele Rave",     startTime: "04:00 PM" },
  { staffName: "Chandler Steffy",  startTime: "10:00 AM" },
  { staffName: "Chandler Steffy",  startTime: "11:00 AM" },
  { staffName: "Chandler Steffy",  startTime: "12:00 PM" },
  { staffName: "Chandler Steffy",  startTime: "03:00 PM" },
  { staffName: "Bradley Lynch",    startTime: "10:00 AM" },
  { staffName: "Bradley Lynch",    startTime: "01:00 PM" },
  { staffName: "Bradley Lynch",    startTime: "02:00 PM" },
  { staffName: "Bradley Lynch",    startTime: "04:00 PM" },
  { staffName: "Moasfar Javed",    startTime: "10:00 AM" },
  { staffName: "Moasfar Javed",    startTime: "11:00 AM" },
  { staffName: "Moasfar Javed",    startTime: "12:00 PM" },
  { staffName: "Moasfar Javed",    startTime: "01:00 PM" },
  { staffName: "Moasfar Javed",    startTime: "03:00 PM" },
];

interface SuccessToast { message: string; visible: boolean }

export const Default = (): JSX.Element => {
  // Modal visibility
  const [showAvailabilitySearch, setShowAvailabilitySearch] = useState(false);
  const [showNewEventModal,      setShowNewEventModal]      = useState(false);
  const [showConflictDialog,     setShowConflictDialog]     = useState(false);
  const [showJobDetailModal,     setShowJobDetailModal]     = useState(false);

  // State for availability mode
  const [availabilityMode,    setAvailabilityMode]    = useState(false);
  const [availabilityFilters, setAvailabilityFilters] = useState<AvailabilityFilters | null>(null);
  const [selectedSlot,        setSelectedSlot]        = useState<{ staffName: string; timeLabel: string } | null>(null);

  // New event
  const [prefilledSlot, setPrefilledSlot] = useState<PrefilledSlot | null>(null);
  const [newEventSplitDefault, setNewEventSplitDefault] = useState(false);

  // Edit event
  const [editEventData, setEditEventData] = useState<NewEventData | null>(null);

  // Conflict
  const [conflictEvent,     setConflictEvent]     = useState<NewEventData | null>(null);
  const [conflictMessage,   setConflictMessage]   = useState("");
  const [conflictingEvents, setConflictingEvents] = useState<string[]>([]);
  const [isConflictViewMode,setIsConflictViewMode]= useState(false);

  // Job detail
  const [jobDetailPayload, setJobDetailPayload] = useState<JobDetailPayload | null>(null);

  // Custom events added this session
  const [customEvents, setCustomEvents] = useState<CustomEventData[]>([]);

  // Hardcoded chips that have been dragged away (key: staffName||timeLabel||index)
  const [removedBaseChips, setRemovedBaseChips] = useState<Set<string>>(new Set());

  // Toast
  const [successToast, setSuccessToast] = useState<SuccessToast>({ message: "", visible: false });

  useEffect(() => {
    if (successToast.visible) {
      const t = setTimeout(() => setSuccessToast({ message: "", visible: false }), 4500);
      return () => clearTimeout(t);
    }
  }, [successToast.visible]);

  // ─── Helpers ─────────────────────────────────────────────────────────

  const showSuccess = (msg: string) => setSuccessToast({ message: msg, visible: true });

  const allOccupiedSlots = [
    ...existingEventSlots,
    ...customEvents.map((e) => ({ staffName: e.staffName, startTime: e.startTime })),
  ];

  // ─── Availability Search ──────────────────────────────────────────────

  const handleAvailabilitySearch = (filters: AvailabilityFilters) => {
    setAvailabilityFilters(filters);
    setAvailabilityMode(true);
    setSelectedSlot(null);
    showSuccess(
      `Showing availability ${filters.startTime}–${filters.endTime} (${filters.duration}) · Fully available staff ranked first · Click blue cell to schedule`
    );
  };

  const handleCancelAvailability = () => {
    setAvailabilityMode(false);
    setAvailabilityFilters(null);
    setSelectedSlot(null);
  };

  // ─── Slot interactions ────────────────────────────────────────────────

  // Single-click on available (blue) cell
  const handleSlotClick = (staffName: string, timeLabel: string) => {
    setSelectedSlot({ staffName, timeLabel });
    setPrefilledSlot({ staffName, timeLabel });
    setShowNewEventModal(true);
  };

  // Double-click on ANY cell
  const handleDoubleClickSlot = (staffName: string, timeLabel: string) => {
    setPrefilledSlot({ staffName, timeLabel });
    setShowNewEventModal(true);
  };

  // Open New Event modal with Split Coverage pre-enabled (from the search banner)
  const handleOpenSplitCoverage = () => {
    setPrefilledSlot({
      staffName: "",
      timeLabel: availabilityFilters?.startTime || "10:00 AM",
      endTime:   availabilityFilters?.endTime   || "11:00 AM",
    });
    setNewEventSplitDefault(true);
    setShowNewEventModal(true);
  };

  // Click on a chip (existing job) — open Job Detail first
  const handleChipClick = (staffName: string, timeLabel: string, chip: CellChip, chipIndex: number) => {
    setJobDetailPayload({ chip, staffName, timeLabel, chipIndex, isConflict: false });
    setShowJobDetailModal(true);
  };

  // Open chip in Edit Event modal (from Job Detail "Edit" button)
  const handleEditChipOpen = () => {
    const payload = jobDetailPayload;
    if (!payload) return;
    const { chip, staffName, timeLabel } = payload;
    const typeMap: Record<string, string> = {
      "#eca203": "plumbing", "#8238bb": "hvac",
      "#0063ec": "electrical", "#007c54": "gas",
    };
    const evt: NewEventData = {
      id: chip.customEventId || `base-${staffName}-${timeLabel}`,
      title: chip.label,
      reference: chip.label,
      date: "2026-05-27",
      startTime: timeLabel,
      endTime: timeLabel,
      staffName,
      jobType: typeMap[chip.border] || "general",
      notes: "",
      color: { bg: chip.bg, border: chip.border },
    };
    setEditEventData(evt);
    setShowJobDetailModal(false);
    setShowNewEventModal(true);
  };

  // Click on conflict badge in a cell (view mode)
  const handleConflictCellClick = (staffName: string, timeLabel: string, events: string[]) => {
    const syntheticEvent: NewEventData = {
      id: "conflict-view",
      title: events[0] || `Multiple events at ${timeLabel}`,
      reference: "",
      date: "2026-05-27",
      startTime: timeLabel,
      endTime: "",
      staffName,
      jobType: "plumbing",
      notes: "",
      color: { bg: "#fef2f2", border: "#ef4444" },
    };
    setConflictEvent(syntheticEvent);
    setConflictingEvents(events);
    setConflictMessage(`${staffName} has ${events.length} events at ${timeLabel}`);
    setIsConflictViewMode(true);
    setShowConflictDialog(true);
  };

  // ─── New Event ────────────────────────────────────────────────────────

  const handleNewEventClick = () => {
    setPrefilledSlot(null);
    setSelectedSlot(null);
    setShowNewEventModal(true);
  };

  const handleSaveEvent = (event: NewEventData) => {
    const isEdit = !!editEventData;

    if (isEdit) {
      // Update existing custom event, or replace a base chip
      const existingCustom = customEvents.find((e) => e.id === event.id);
      if (existingCustom) {
        setCustomEvents((prev) =>
          prev.map((e) =>
            e.id === event.id
              ? { ...e, staffName: event.staffName, startTime: event.startTime,
                  title: event.title || event.reference, color: event.color,
                  status: "moved" as const }
              : e
          )
        );
      } else {
        // Base chip — mark it removed and add updated custom event
        const baseKey = event.id.replace(/^base-/, "");
        const [staffPart, timePart] = baseKey.split("-").reduce<[string, string]>(
          (acc, seg, i) => i === 0 ? [seg, ""] : [acc[0], acc[1] ? acc[1] + "-" + seg : seg],
          ["", ""]
        );
        setRemovedBaseChips((prev) => new Set([...prev, `${staffPart}||${timePart}||0`]));
        setCustomEvents((prev) => [...prev, {
          id: `edit-${Date.now()}`, staffName: event.staffName,
          startTime: event.startTime, title: event.title || event.reference,
          color: event.color, status: "moved" as const,
        }]);
      }
      setEditEventData(null);
      showSuccess(`Event updated for ${event.staffName} at ${event.startTime}`);
    } else if (event.splitSegments && event.splitSegments.length > 0) {
      // Split coverage: one chip per segment at its own time slot
      const newChips: CustomEventData[] = event.splitSegments
        .filter((seg) => seg.staffName)
        .map((seg, i) => ({
          id: `${event.id}-seg-${i}`,
          staffName: seg.staffName,
          startTime: seg.startTime,
          endTime: seg.endTime || undefined,
          title: event.title || event.reference || "",
          color: event.color,
          status: "new" as const,
          projectStatus: event.projectStatus,
        }));
      setCustomEvents((prev) => [...prev, ...newChips]);
      const who = newChips.map((c) => `${c.staffName} @ ${c.startTime}`).join(", ");
      showSuccess(`Split coverage: ${newChips.length} segment${newChips.length !== 1 ? "s" : ""} — ${who}`);
    } else {
      // Create new event — one chip per assigned staff member (same time slot)
      const allStaff = event.staffNames && event.staffNames.length > 0
        ? event.staffNames
        : [event.staffName].filter(Boolean);

      const newChips: CustomEventData[] = allStaff.map((sn, i) => ({
        id: i === 0 ? event.id : `${event.id}-${i + 1}`,
        staffName: sn,
        startTime: event.startTime,
        endTime: event.endTime || undefined,
        title: event.title || event.reference || "",
        color: event.color,
        status: "new" as const,
        projectStatus: event.projectStatus,
      }));
      setCustomEvents((prev) => [...prev, ...newChips]);

      const who = allStaff.length > 1 ? `${allStaff[0]} +${allStaff.length - 1} more` : allStaff[0];
      showSuccess(`"${event.title || event.reference}" scheduled for ${who} at ${event.startTime}`);
    }

    setAvailabilityMode(false);
    setSelectedSlot(null);
    setPrefilledSlot(null);
  };

  // ─── Conflict flow ────────────────────────────────────────────────────

  const handleConflict = (event: NewEventData, message: string) => {
    setConflictEvent(event);
    setConflictMessage(message);
    setConflictingEvents([]);
    setIsConflictViewMode(false);
    setShowNewEventModal(false);
    setShowConflictDialog(true);
  };

  const handleScheduleAnyway = (event: NewEventData) => {
    handleSaveEvent(event);
    showSuccess(`Conflict overridden — ${event.staffName} at ${event.startTime}`);
  };

  const handleReassignStaff = () => {
    // Open the Edit Event modal pre-filled with the conflicting event's data
    // so the user can change staff (not create a brand-new event)
    if (conflictEvent) {
      setEditEventData(conflictEvent);
      setShowConflictDialog(false);
      setShowNewEventModal(true);
    }
  };

  const handleChangeTime = () => {
    if (conflictEvent) {
      // Open as Edit Event so all existing data (title, staff, job type…)
      // stays intact — the user only needs to pick a different time.
      setEditEventData(conflictEvent);
      setShowConflictDialog(false);
      setShowNewEventModal(true);
    }
  };

  // ─── Drag and drop ────────────────────────────────────────────────────────

  const handleChipMoved = (drag: DragChipData, targetStaff: string, targetTime: string) => {
    if (drag.chip.customEventId) {
      // It's a custom event — update its position and mark as moved/rescheduled
      setCustomEvents((prev) =>
        prev.map((e) =>
          e.id === drag.chip.customEventId
            ? { ...e, staffName: targetStaff, startTime: targetTime, status: "moved" as const }
            : e
        )
      );
    } else {
      // Hardcoded chip — mark source as removed and create new custom event at target
      const key = `${drag.staffName}||${drag.timeLabel}||${drag.chipIndex}`;
      setRemovedBaseChips((prev) => new Set([...prev, key]));
      setCustomEvents((prev) => [
        ...prev,
        {
          id: `moved-${Date.now()}`,
          staffName: targetStaff,
          startTime: targetTime,
          title: drag.chip.label,
          color: { bg: drag.chip.bg, border: drag.chip.border },
          status: "moved" as const,
        },
      ]);
    }
    showSuccess(`"${drag.chip.label}" rescheduled → ${targetStaff} at ${targetTime}`);
  };

  // ─── Job Detail → Delete ────────────────────────────────────────────────
  const handleJobDetailDelete = () => {
    if (!jobDetailPayload) return;
    const { chip, staffName, timeLabel, chipIndex } = jobDetailPayload;
    if (chip.customEventId) {
      setCustomEvents((prev) => prev.filter((e) => e.id !== chip.customEventId));
    } else {
      const key = `${staffName}||${timeLabel}||${chipIndex}`;
      setRemovedBaseChips((prev) => new Set([...prev, key]));
    }
    setShowJobDetailModal(false);
    showSuccess(`"${chip.label}" deleted`);
  };

  // ─── Unassigned event drop onto grid ─────────────────────────────────────
  const handleUnassignedDrop = (card: UnassignedCard, targetStaff: string, targetTime: string) => {
    const defaultColor = card.color || { bg: "#fcf1d9", border: "#eca203" };
    const newChip: CustomEventData = {
      id: `unassigned-${Date.now()}`,
      staffName: targetStaff,
      startTime: targetTime,
      title: card.title,
      color: defaultColor,
      status: "new" as const,
    };
    setCustomEvents((prev) => [...prev, newChip]);
    showSuccess(`"${card.title}" assigned to ${targetStaff} at ${targetTime}`);
  };

  // ─── Job Detail → Duplicate ─────────────────────────────────────────────
  const handleJobDetailDuplicate = () => {
    if (!jobDetailPayload) return;
    const { chip, staffName, timeLabel } = jobDetailPayload;
    const newId = `dup-${Date.now()}`;
    setCustomEvents((prev) => [
      ...prev,
      {
        id: newId,
        staffName,
        startTime: timeLabel,
        title: `${chip.label} (Copy)`,
        color: { bg: chip.bg, border: chip.border },
        status: "new" as const,
      },
    ]);
    setShowJobDetailModal(false);
    showSuccess(`"${chip.label}" duplicated`);
  };

  return (
    <div className="w-[1440px] min-h-screen flex gap-0 bg-[#f8f9fa]">
      {/* ── Sidebar ── */}
      <aside className="w-[78px] min-h-screen flex flex-col items-center bg-white border-r border-[#e8e8e8] flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center justify-center w-full h-14">
          <img src={albiLogo} alt="Albi" className="w-10 h-10 object-contain" />
        </div>

        {/* Main nav */}
        <nav className="flex flex-col items-center w-full flex-1 pt-1">
          {mainNavItems.map((item) => (
            <div key={item.label} className="w-full h-12 flex items-center justify-center">
              <button
                className={`flex items-center justify-center rounded-[6px] transition-colors p-2 ${
                  item.active ? "bg-[#f3f4f6]" : "hover:bg-[#f9fafb]"
                }`}
                title={item.label}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <img
                  src={item.img}
                  alt={item.label}
                  className={`w-6 h-6 object-contain ${item.active ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
                />
              </button>
            </div>
          ))}
        </nav>

        {/* Bottom: Settings */}
        <div className="w-full h-12 flex items-center justify-center mb-3">
          <button
            className="p-2 text-[#9ca3af] hover:text-[#344153] hover:bg-[#f9fafb] rounded-[6px] transition-colors"
            title="Settings"
            data-testid="nav-settings"
          >
            <Settings2 className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <div className="flex-shrink-0 bg-white border-b border-[#e8e8e8] px-6 h-14 flex items-center">
          <FrameSubsection />
        </div>

        {/* Page header */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 flex-shrink-0">
          <div>
            <nav className="text-sm font-semibold text-[#666] font-['Inter',sans-serif] mb-1">
              Scheduler / Scheduling
            </nav>
            <h1 className="font-black text-neutral-900 text-2xl leading-7 font-['Inter',sans-serif]">
              Scheduler
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {availabilityMode && (
              <div className="flex items-center gap-2 bg-[#e5effd] border border-[#93c5fd] rounded-md px-3 h-10">
                <span className="text-xs font-semibold text-[#1d4ed8] font-['Inter',sans-serif]">
                  {availabilityFilters?.startTime}–{availabilityFilters?.endTime}
                </span>
                <button
                  onClick={handleCancelAvailability}
                  className="text-[#1d4ed8] hover:text-[#1e40af]"
                  data-testid="cancel-availability-mode"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => setShowAvailabilitySearch(true)}
              className={`h-10 px-3 gap-1.5 rounded-md border-2 border-solid transition-colors font-['Inter',sans-serif] text-sm font-medium ${
                availabilityMode
                  ? "border-[#0065f4] bg-[#e5effd] text-[#0065f4]"
                  : "border-[#0065f4] bg-transparent text-[#0065f4] hover:bg-[#e5effd]"
              }`}
              data-testid="availability-search-button"
            >
              <Search className="w-4 h-4" />
              {availabilityMode ? "✓ Search Active" : "Availability Search"}
            </Button>

            <Button
              onClick={handleNewEventClick}
              className="h-10 px-3 gap-1.5 bg-[#0065f4] hover:bg-[#0052c2] rounded-md font-['Inter',sans-serif] text-sm font-medium"
              data-testid="new-event-button"
            >
              <PlusIcon className="w-5 h-5" />
              New Event
            </Button>
          </div>
        </div>

        {/* View controls */}
        <div className="px-6 flex-shrink-0">
          <ViewControlsSubsection />
        </div>

        {/* ── Calendar ── */}
        <div className="px-6 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-[#9ca3af] font-['Inter',sans-serif]">
              Click job to view · Double-click or + button to add · Drag to reschedule · ← → edge to resize · Drag unassigned cards onto grid to assign
            </p>
            {customEvents.length > 0 && (
              <span className="text-xs font-semibold text-[#0065f4] font-['Inter',sans-serif]">
                {customEvents.length} new event{customEvents.length !== 1 ? "s" : ""} added today
              </span>
            )}
          </div>

          <CalendarSubsection
            availabilityMode={availabilityMode}
            availabilityFilters={availabilityFilters}
            selectedSlot={selectedSlot}
            onSlotClick={handleSlotClick}
            onDoubleClickSlot={handleDoubleClickSlot}
            onConflictClick={handleConflictCellClick}
            onChipClick={handleChipClick}
            onChipMoved={handleChipMoved}
            onUnassignedDrop={handleUnassignedDrop}
            onOpenSplitCoverage={handleOpenSplitCoverage}
            customEvents={customEvents}
            removedBaseChips={removedBaseChips}
          />
        </div>

        {/* ── Unassigned events ── */}
        <div className="px-6 pb-6">
          <h2 className="text-sm font-semibold text-[#666] font-['Inter',sans-serif] mb-3">
            Unassigned events
          </h2>
          <FrameWrapperSubsection />
        </div>
      </div>

      {/* ── Modals ── */}

      <AvailabilitySearchSheet
        open={showAvailabilitySearch}
        onClose={() => setShowAvailabilitySearch(false)}
        onSearch={handleAvailabilitySearch}
      />

      <NewEventModal
        open={showNewEventModal}
        onClose={() => {
          setShowNewEventModal(false);
          setPrefilledSlot(null);
          setEditEventData(null);
          setNewEventSplitDefault(false);
        }}
        onSave={handleSaveEvent}
        onConflict={handleConflict}
        prefilledSlot={prefilledSlot}
        editEventData={editEventData}
        defaultSplitCoverage={newEventSplitDefault}
        existingEvents={allOccupiedSlots.map((e) => ({
          staffName: e.staffName,
          startTime: e.startTime,
          endTime: "",
        }))}
      />

      <ConflictResolutionDialog
        open={showConflictDialog}
        onClose={() => setShowConflictDialog(false)}
        event={conflictEvent}
        conflictMessage={conflictMessage}
        conflictingEvents={conflictingEvents}
        isViewMode={isConflictViewMode}
        onScheduleAnyway={handleScheduleAnyway}
        onReassignStaff={handleReassignStaff}
        onChangeTime={handleChangeTime}
      />

      <JobDetailModal
        open={showJobDetailModal}
        onClose={() => setShowJobDetailModal(false)}
        payload={jobDetailPayload}
        onDelete={handleJobDetailDelete}
        onDuplicate={handleJobDetailDuplicate}
        onEditEvent={handleEditChipOpen}
      />

      {/* Success toast */}
      {successToast.visible && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-[#d1fae5] rounded-xl shadow-xl px-4 py-3 max-w-[440px]"
          data-testid="success-toast"
        >
          <div className="w-8 h-8 rounded-full bg-[#d1fae5] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          </div>
          <p className="text-sm text-[#0e1828] font-['Inter',sans-serif] font-medium flex-1">
            {successToast.message}
          </p>
          <button
            onClick={() => setSuccessToast({ message: "", visible: false })}
            className="text-[#9ca3af] hover:text-[#6b7280] flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
