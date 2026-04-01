import { useState, useEffect } from "react";
import {
  PlusIcon, CalendarIcon, UsersIcon, BriefcaseIcon,
  MapPinIcon, SettingsIcon, CheckCircle2, X, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarSubsection, CustomEventData } from "./sections/CalendarSubsection";
import { FrameSubsection } from "./sections/FrameSubsection";
import { FrameWrapperSubsection } from "./sections/FrameWrapperSubsection";
import { ViewControlsSubsection } from "./sections/ViewControlsSubsection";
import { AvailabilitySearchSheet, AvailabilityFilters } from "./sections/AvailabilitySearchSheet";
import { NewEventModal, NewEventData, PrefilledSlot } from "./sections/NewEventModal";
import { ConflictResolutionDialog } from "./sections/ConflictResolutionDialog";

const navItems = [
  { icon: CalendarIcon, label: "Scheduler", active: true },
  { icon: UsersIcon, label: "Customers" },
  { icon: BriefcaseIcon, label: "Jobs" },
  { icon: MapPinIcon, label: "Map" },
  { icon: SettingsIcon, label: "Settings" },
];

// Events that are pre-occupied (drives availability + conflict detection)
const existingEventSlots = [
  { staffName: "Alan Thomas", startTime: "10:00 AM" },
  { staffName: "Alan Thomas", startTime: "11:00 AM" },
  { staffName: "Alan Thomas", startTime: "12:00 PM" },
  { staffName: "Alan Thomas", startTime: "02:00 PM" },
  { staffName: "Alan Thomas", startTime: "04:00 PM" },
  { staffName: "Michael Schaj", startTime: "10:00 AM" },
  { staffName: "Michael Schaj", startTime: "11:00 AM" },
  { staffName: "Michael Schaj", startTime: "12:00 PM" },
  { staffName: "Michael Schaj", startTime: "01:00 PM" },
  { staffName: "Michael Schaj", startTime: "03:00 PM" },
  { staffName: "Anna Sorokin", startTime: "10:00 AM" },
  { staffName: "Anna Sorokin", startTime: "11:00 AM" },
  { staffName: "Anna Sorokin", startTime: "12:00 PM" },
  { staffName: "Anna Sorokin", startTime: "02:00 PM" },
  { staffName: "Anna Sorokin", startTime: "04:00 PM" },
  { staffName: "Connor Grace", startTime: "01:00 PM" },
  { staffName: "Connor Grace", startTime: "03:00 PM" },
  { staffName: "Connor Grace", startTime: "05:00 PM" },
  { staffName: "Carmen Flores", startTime: "10:00 AM" },
  { staffName: "Carmen Flores", startTime: "11:00 AM" },
  { staffName: "Carmen Flores", startTime: "12:00 PM" },
  { staffName: "Carmen Flores", startTime: "03:00 PM" },
  { staffName: "Shamoil Soni", startTime: "01:00 PM" },
  { staffName: "Shamoil Soni", startTime: "03:00 PM" },
  { staffName: "Shamoil Soni", startTime: "05:00 PM" },
  { staffName: "Chiara Bondesan", startTime: "10:00 AM" },
  { staffName: "Chiara Bondesan", startTime: "11:00 AM" },
  { staffName: "Chiara Bondesan", startTime: "12:00 PM" },
  { staffName: "Chiara Bondesan", startTime: "01:00 PM" },
  { staffName: "Chiara Bondesan", startTime: "03:00 PM" },
  { staffName: "Christy Blaker", startTime: "10:00 AM" },
  { staffName: "Christy Blaker", startTime: "12:00 PM" },
  { staffName: "Christy Blaker", startTime: "01:00 PM" },
  { staffName: "Christy Blaker", startTime: "04:00 PM" },
  { staffName: "Adam Smith", startTime: "10:00 AM" },
  { staffName: "Adam Smith", startTime: "11:00 AM" },
  { staffName: "Adam Smith", startTime: "03:00 PM" },
  { staffName: "Adam Smith", startTime: "05:00 PM" },
  { staffName: "Daniyal Shamoon", startTime: "10:00 AM" },
  { staffName: "Daniyal Shamoon", startTime: "12:00 PM" },
  { staffName: "Daniyal Shamoon", startTime: "02:00 PM" },
  { staffName: "Daniyal Shamoon", startTime: "04:00 PM" },
  { staffName: "Michele Rave", startTime: "12:00 PM" },
  { staffName: "Michele Rave", startTime: "02:00 PM" },
  { staffName: "Michele Rave", startTime: "04:00 PM" },
  { staffName: "Chandler Steffy", startTime: "10:00 AM" },
  { staffName: "Chandler Steffy", startTime: "11:00 AM" },
  { staffName: "Chandler Steffy", startTime: "12:00 PM" },
  { staffName: "Chandler Steffy", startTime: "03:00 PM" },
  { staffName: "Bradley Lynch", startTime: "10:00 AM" },
  { staffName: "Bradley Lynch", startTime: "01:00 PM" },
  { staffName: "Bradley Lynch", startTime: "02:00 PM" },
  { staffName: "Bradley Lynch", startTime: "04:00 PM" },
  { staffName: "Moasfar Javed", startTime: "10:00 AM" },
  { staffName: "Moasfar Javed", startTime: "11:00 AM" },
  { staffName: "Moasfar Javed", startTime: "12:00 PM" },
  { staffName: "Moasfar Javed", startTime: "01:00 PM" },
  { staffName: "Moasfar Javed", startTime: "03:00 PM" },
];

interface SuccessToast {
  message: string;
  visible: boolean;
}

export const Default = (): JSX.Element => {
  const [showAvailabilitySearch, setShowAvailabilitySearch] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showConflictDialog, setShowConflictDialog] = useState(false);

  const [availabilityMode, setAvailabilityMode] = useState(false);
  const [availabilityFilters, setAvailabilityFilters] = useState<AvailabilityFilters | null>(null);

  const [selectedSlot, setSelectedSlot] = useState<{ staffName: string; timeLabel: string } | null>(null);
  const [prefilledSlot, setPrefilledSlot] = useState<PrefilledSlot | null>(null);

  const [conflictEvent, setConflictEvent] = useState<NewEventData | null>(null);
  const [conflictMessage, setConflictMessage] = useState("");

  const [customEvents, setCustomEvents] = useState<CustomEventData[]>([]);
  const [successToast, setSuccessToast] = useState<SuccessToast>({ message: "", visible: false });

  useEffect(() => {
    if (successToast.visible) {
      const timer = setTimeout(() => setSuccessToast({ message: "", visible: false }), 4500);
      return () => clearTimeout(timer);
    }
  }, [successToast.visible]);

  // ─── Handlers ────────────────────────────────────────────────────────

  const showSuccess = (message: string) => setSuccessToast({ message, visible: true });

  const handleAvailabilitySearch = (filters: AvailabilityFilters) => {
    setAvailabilityFilters(filters);
    setAvailabilityMode(true);
    setSelectedSlot(null);
    showSuccess(`Availability shown ${filters.startTime}–${filters.endTime} · Click any blue cell or double-click to schedule`);
  };

  const handleCancelAvailability = () => {
    setAvailabilityMode(false);
    setAvailabilityFilters(null);
    setSelectedSlot(null);
  };

  // Single click: only fires in availability mode
  const handleSlotClick = (staffName: string, timeLabel: string) => {
    setSelectedSlot({ staffName, timeLabel });
    setPrefilledSlot({ staffName, timeLabel });
    setShowNewEventModal(true);
  };

  // Double click: fires on ANY cell, always opens modal
  const handleDoubleClickSlot = (staffName: string, timeLabel: string) => {
    setPrefilledSlot({ staffName, timeLabel });
    setShowNewEventModal(true);
  };

  // Conflict badge click from grid
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
    const summary = events.slice(0, 2).join(" · ") + (events.length > 2 ? ` +${events.length - 2} more` : "");
    setConflictEvent(syntheticEvent);
    setConflictMessage(`${staffName} has ${events.length} events at ${timeLabel}: ${summary}`);
    setShowConflictDialog(true);
  };

  const handleNewEventClick = () => {
    setPrefilledSlot(null);
    setSelectedSlot(null);
    setShowNewEventModal(true);
  };

  const handleSaveEvent = (event: NewEventData) => {
    const newChip: CustomEventData = {
      id: event.id,
      staffName: event.staffName,
      startTime: event.startTime,
      title: event.title || event.reference,
      color: event.color,
    };
    setCustomEvents((prev) => [...prev, newChip]);

    // If split coverage, add a chip for the second person too
    if (event.isSplitCoverage && event.staffName2) {
      setCustomEvents((prev) => [
        ...prev,
        {
          id: `${event.id}-2`,
          staffName: event.staffName2!,
          startTime: event.startTime,
          title: `${event.title || event.reference} (Split)`,
          color: { bg: "#fff7ed", border: "#f97316" },
        },
      ]);
    }

    setAvailabilityMode(false);
    setSelectedSlot(null);
    setPrefilledSlot(null);
    const who = event.isSplitCoverage
      ? `${event.staffName} + ${event.staffName2}`
      : event.staffName;
    showSuccess(`"${event.title || event.reference}" scheduled for ${who} at ${event.startTime}`);
  };

  const handleConflict = (event: NewEventData, message: string) => {
    setConflictEvent(event);
    setConflictMessage(message);
    setShowNewEventModal(false);
    setShowConflictDialog(true);
  };

  const handleScheduleAnyway = (event: NewEventData) => {
    handleSaveEvent(event);
    showSuccess(`Conflict overridden — ${event.staffName} at ${event.startTime}`);
  };

  const handleReassignStaff = () => {
    setPrefilledSlot(
      conflictEvent ? { staffName: "", timeLabel: conflictEvent.startTime } : null
    );
    setShowNewEventModal(true);
  };

  const handleChangeTime = () => {
    setPrefilledSlot(
      conflictEvent ? { staffName: conflictEvent.staffName, timeLabel: "" } : null
    );
    setShowNewEventModal(true);
  };

  const allOccupiedSlots = [
    ...existingEventSlots,
    ...customEvents.map((e) => ({ staffName: e.staffName, startTime: e.startTime })),
  ];

  return (
    <div className="w-[1440px] min-h-screen flex gap-0 bg-[#f8f9fa]">
      {/* ── Sidebar ── */}
      <aside className="w-[78px] min-h-screen flex flex-col items-center bg-white border-r border-[#e8e8e8] flex-shrink-0 pt-3">
        <div className="flex items-center justify-center w-full h-[72px]">
          <div className="w-10 h-10 rounded-lg bg-[#0065f4] flex items-center justify-center shadow-md">
            <span className="text-white font-black text-sm leading-none select-none">A</span>
          </div>
        </div>
        <nav className="flex flex-col items-center w-full gap-1 px-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`flex flex-col items-center justify-center w-full h-12 rounded-lg gap-0.5 transition-colors ${
                  item.active
                    ? "bg-[#e5effd] text-[#0065f4]"
                    : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#344153]"
                }`}
                title={item.label}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium leading-none">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <div className="flex-shrink-0">
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

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {availabilityMode && (
              <div className="flex items-center gap-2 bg-[#e5effd] border border-[#0065f4] rounded-md px-3 h-10">
                <span className="text-xs font-semibold text-[#0065f4] font-['Inter',sans-serif]">
                  Click blue · Double-click any cell
                </span>
                <button
                  onClick={handleCancelAvailability}
                  className="text-[#0065f4] hover:text-[#0052c2]"
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

        {/* ── Calendar grid ── */}
        <div className="px-6 pb-4 flex-shrink-0">
          {/* Hint row */}
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-[#9ca3af] font-['Inter',sans-serif]">
              Double-click any cell to schedule · Scroll right for more time slots
            </p>
            {customEvents.length > 0 && (
              <span className="text-xs font-semibold text-[#0065f4] font-['Inter',sans-serif]">
                {customEvents.length} new event{customEvents.length !== 1 ? "s" : ""} added today
              </span>
            )}
          </div>

          <CalendarSubsection
            availabilityMode={availabilityMode}
            selectedSlot={selectedSlot}
            onSlotClick={handleSlotClick}
            onDoubleClickSlot={handleDoubleClickSlot}
            onConflictClick={handleConflictCellClick}
            customEvents={customEvents}
          />
        </div>

        {/* ── Unassigned events ── */}
        <div className="px-6 pb-6">
          <h2 className="font-medium text-[#666] text-xl font-['Inter',sans-serif] mb-3">
            Unassigned events
          </h2>
          <FrameWrapperSubsection />
        </div>
      </div>

      {/* ── Modals & Panels ── */}

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
        }}
        onSave={handleSaveEvent}
        onConflict={handleConflict}
        prefilledSlot={prefilledSlot}
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
        onScheduleAnyway={handleScheduleAnyway}
        onReassignStaff={handleReassignStaff}
        onChangeTime={handleChangeTime}
      />

      {/* Success Toast */}
      {successToast.visible && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-[#d1fae5] rounded-xl shadow-xl px-4 py-3 max-w-[440px]"
          data-testid="success-toast"
          style={{ animation: "slideInFromBottom 0.3s ease-out" }}
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
