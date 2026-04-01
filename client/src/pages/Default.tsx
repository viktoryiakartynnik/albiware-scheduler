import { useState, useEffect } from "react";
import { PlusIcon, CalendarIcon, UsersIcon, BriefcaseIcon, MapPinIcon, SettingsIcon, CheckCircle2, X } from "lucide-react";
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

const baseEventCards = [
  {
    top: "top-[465px]",
    left: "left-[181px]",
    width: "w-[1083px]",
    bg: "#ede2f5",
    border: "#8238bb",
    label: "Saina 051476 - 25-1305-SAINA TEST-111118-call",
    overflow: false,
  },
  {
    top: "top-[745px]",
    left: "left-[747px]",
    width: "w-[564px]",
    bg: "#ede2f5",
    border: "#8238bb",
    label: "HVAC 6678 – Office Buildout – Full Installation-s- 56-65-2323",
    overflow: false,
  },
  {
    top: "top-[425px]",
    left: "left-[1030px]",
    width: "w-[281px]",
    bg: "#ede2f5",
    border: "#8238bb",
    label: "Gas Line Inspection – Safety Audit 051476",
    overflow: true,
  },
  {
    top: "top-[665px]",
    left: "left-[181px]",
    width: "w-[564px]",
    bg: "#e5effd",
    border: "#0063ec",
    label: "HVAC 6678 – Office Buildout – Full Installation-s- 56-65-2323",
    overflow: false,
  },
];

// Hardcoded "existing" events for conflict detection
const existingEventSlots = [
  { staffName: "Alan Thomas", startTime: "10:00 AM" },
  { staffName: "Alan Thomas", startTime: "11:00 AM" },
  { staffName: "Alan Thomas", startTime: "12:00 PM" },
  { staffName: "Michael Schaj", startTime: "10:00 AM" },
  { staffName: "Michael Schaj", startTime: "11:00 AM" },
  { staffName: "Michael Schaj", startTime: "12:00 PM" },
  { staffName: "Michael Schaj", startTime: "01:00 PM" },
  { staffName: "Anna Sorokin", startTime: "10:00 AM" },
  { staffName: "Anna Sorokin", startTime: "11:00 AM" },
  { staffName: "Anna Sorokin", startTime: "12:00 PM" },
  { staffName: "Chandler Steffy", startTime: "10:00 AM" },
  { staffName: "Chandler Steffy", startTime: "11:00 AM" },
  { staffName: "Moasfar Javed", startTime: "10:00 AM" },
  { staffName: "Moasfar Javed", startTime: "11:00 AM" },
  { staffName: "Moasfar Javed", startTime: "12:00 PM" },
  { staffName: "Moasfar Javed", startTime: "01:00 PM" },
  { staffName: "Carmen Flores", startTime: "10:00 AM" },
  { staffName: "Carmen Flores", startTime: "11:00 AM" },
  { staffName: "Carmen Flores", startTime: "12:00 PM" },
  { staffName: "Chiara Bondesan", startTime: "10:00 AM" },
  { staffName: "Chiara Bondesan", startTime: "11:00 AM" },
  { staffName: "Chiara Bondesan", startTime: "12:00 PM" },
  { staffName: "Chiara Bondesan", startTime: "01:00 PM" },
  { staffName: "Daniyal Shamoon", startTime: "10:00 AM" },
  { staffName: "Daniyal Shamoon", startTime: "12:00 PM" },
  { staffName: "Michele Rave", startTime: "12:00 PM" },
  { staffName: "Adam Smith", startTime: "10:00 AM" },
  { staffName: "Adam Smith", startTime: "11:00 AM" },
  { staffName: "Christy Blaker", startTime: "10:00 AM" },
  { staffName: "Christy Blaker", startTime: "12:00 PM" },
  { staffName: "Christy Blaker", startTime: "01:00 PM" },
  { staffName: "Bradley Lynch", startTime: "10:00 AM" },
  { staffName: "Bradley Lynch", startTime: "01:00 PM" },
  { staffName: "Shamoil Soni", startTime: "01:00 PM" },
  { staffName: "Connor Grace", startTime: "01:00 PM" },
];

interface SuccessToast {
  message: string;
  visible: boolean;
}

export const Default = (): JSX.Element => {
  // Modal / panel states
  const [showAvailabilitySearch, setShowAvailabilitySearch] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showConflictDialog, setShowConflictDialog] = useState(false);

  // Availability mode
  const [availabilityMode, setAvailabilityMode] = useState(false);
  const [availabilityFilters, setAvailabilityFilters] = useState<AvailabilityFilters | null>(null);

  // Selected slot (from availability mode click)
  const [selectedSlot, setSelectedSlot] = useState<{ staffName: string; timeLabel: string } | null>(null);

  // Pre-fill for new event modal
  const [prefilledSlot, setPrefilledSlot] = useState<PrefilledSlot | null>(null);

  // Conflict handling
  const [conflictEvent, setConflictEvent] = useState<NewEventData | null>(null);
  const [conflictMessage, setConflictMessage] = useState("");

  // Created events
  const [customEvents, setCustomEvents] = useState<CustomEventData[]>([]);

  // Success toast
  const [successToast, setSuccessToast] = useState<SuccessToast>({ message: "", visible: false });

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (successToast.visible) {
      const timer = setTimeout(() => setSuccessToast({ message: "", visible: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [successToast.visible]);

  // ─── Handlers ─────────────────────────────────────────────

  const handleAvailabilitySearch = (filters: AvailabilityFilters) => {
    setAvailabilityFilters(filters);
    setAvailabilityMode(true);
    setSelectedSlot(null);
    showSuccess(`Showing availability from ${filters.startTime} to ${filters.endTime} — click a blue slot to schedule`);
  };

  const handleCancelAvailability = () => {
    setAvailabilityMode(false);
    setAvailabilityFilters(null);
    setSelectedSlot(null);
  };

  const handleSlotClick = (staffName: string, timeLabel: string) => {
    setSelectedSlot({ staffName, timeLabel });
    setPrefilledSlot({ staffName, timeLabel });
    setShowNewEventModal(true);
  };

  const handleNewEventClick = () => {
    setPrefilledSlot(null);
    setSelectedSlot(null);
    setShowNewEventModal(true);
  };

  const handleSaveEvent = (event: NewEventData) => {
    const newCustomEvent: CustomEventData = {
      id: event.id,
      staffName: event.staffName,
      startTime: event.startTime,
      title: event.title || event.reference,
      color: event.color,
    };
    setCustomEvents((prev) => [...prev, newCustomEvent]);
    setAvailabilityMode(false);
    setSelectedSlot(null);
    setPrefilledSlot(null);
    showSuccess(`Event "${event.title || event.reference}" scheduled for ${event.staffName} at ${event.startTime}`);
  };

  const handleConflict = (event: NewEventData, message: string) => {
    setConflictEvent(event);
    setConflictMessage(message);
    setShowNewEventModal(false);
    setShowConflictDialog(true);
  };

  const handleScheduleAnyway = (event: NewEventData) => {
    handleSaveEvent(event);
    showSuccess(`Event scheduled (conflict overridden) — ${event.staffName} at ${event.startTime}`);
  };

  const handleReassignStaff = () => {
    setPrefilledSlot(conflictEvent ? { staffName: "", timeLabel: conflictEvent.startTime } : null);
    setShowNewEventModal(true);
  };

  const handleChangeTime = () => {
    setPrefilledSlot(conflictEvent ? { staffName: conflictEvent.staffName, timeLabel: "" } : null);
    setShowNewEventModal(true);
  };

  const showSuccess = (message: string) => {
    setSuccessToast({ message, visible: true });
  };

  // All "occupied" event slots (base + custom)
  const allOccupiedSlots = [
    ...existingEventSlots,
    ...customEvents.map((e) => ({ staffName: e.staffName, startTime: e.startTime })),
  ];

  return (
    <div className="w-[1440px] min-h-[1024px] flex gap-[21px] bg-[#f8f9fa] shadow-shadow-sm">
      {/* ── Sidebar ── */}
      <aside className="flex mt-[5px] w-[78px] min-h-[1019px] flex-col items-center bg-white border-r border-[#e8e8e8] flex-shrink-0 pt-3">
        <div className="flex items-center justify-center w-full h-[85px]">
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
                className={`flex flex-col items-center justify-center w-full h-12 rounded-lg gap-0.5 group transition-colors ${
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
      <main className="mt-7 w-[1330px] h-[944px] relative">
        {/* Search bar + user controls */}
        <div className="absolute top-0 left-0 right-0">
          <FrameSubsection />
        </div>

        {/* Breadcrumb */}
        <nav className="absolute top-[60px] left-0 w-[1282px] [font-family:'Inter',Helvetica] font-semibold text-[#666666] text-sm tracking-[0] leading-5">
          Scheduler / Scheduling
        </nav>

        {/* Page title */}
        <h1 className="absolute top-[94px] left-0 font-black text-neutral-900 text-2xl leading-7 [font-family:'Inter',Helvetica] tracking-[0] whitespace-nowrap">
          Scheduler
        </h1>

        {/* New Event button */}
        <Button
          onClick={handleNewEventClick}
          className="inline-flex h-10 items-center gap-1 px-3 py-2 absolute top-[88px] right-0 bg-[#0065f4] hover:bg-[#0052c2] rounded-md border-0"
          data-testid="new-event-button"
        >
          <PlusIcon className="w-5 h-5 text-gray-100" />
          <span className="font-medium text-gray-100 text-sm leading-5 [font-family:'Inter',Helvetica] tracking-[0] whitespace-nowrap">
            New Event
          </span>
        </Button>

        {/* Availability Search button */}
        <Button
          variant="outline"
          onClick={() => setShowAvailabilitySearch(true)}
          className={`inline-flex h-10 items-center gap-1 px-3 py-2 absolute top-[88px] right-[132px] rounded-md border-2 border-solid transition-colors ${
            availabilityMode
              ? "border-[#0065f4] bg-[#e5effd] text-[#0065f4] hover:bg-[#d1e8ff]"
              : "border-[#0065f4] bg-transparent hover:bg-[#e5effd] text-[#0065f4]"
          }`}
          data-testid="availability-search-button"
        >
          <span className="font-medium text-sm leading-5 [font-family:'Inter',Helvetica] tracking-[0] whitespace-nowrap">
            {availabilityMode ? "✓ Search Active" : "Availability Search"}
          </span>
        </Button>

        {/* Cancel availability mode badge */}
        {availabilityMode && (
          <div className="absolute top-[88px] right-[300px] flex items-center gap-2 bg-[#e5effd] border border-[#0065f4] rounded-md px-3 h-10">
            <span className="text-xs font-semibold text-[#0065f4] font-['Inter',sans-serif]">
              Click a blue slot to schedule
            </span>
            <button
              onClick={handleCancelAvailability}
              className="text-[#0065f4] hover:text-[#0052c2] ml-1"
              data-testid="cancel-availability-mode"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* View controls */}
        <div className="absolute top-[136px] left-0 right-0">
          <ViewControlsSubsection />
        </div>

        {/* Calendar */}
        <div className="absolute top-[184px] left-0 right-0">
          <CalendarSubsection
            availabilityMode={availabilityMode}
            selectedSlot={selectedSlot}
            onSlotClick={handleSlotClick}
            customEvents={customEvents}
          />
        </div>

        {/* Event overlay cards */}
        {baseEventCards.map((card, index) => (
          <div
            key={index}
            className={`flex flex-col ${card.width} items-start justify-center pl-2 pr-0 pt-0.5 pb-1 absolute ${card.top} ${card.left} overflow-hidden border-l-4 border-solid h-[37px] rounded z-10`}
            style={{ backgroundColor: card.bg, borderLeftColor: card.border }}
          >
            <div
              className={`${card.overflow ? "w-fit mr-[-183.00px]" : "w-fit"} font-bold text-[#252627] whitespace-nowrap relative [font-family:'Inter',Helvetica] text-xs tracking-[0] leading-4`}
            >
              {card.label}
            </div>
          </div>
        ))}

        {/* Unassigned events label */}
        <div className="absolute top-[809px] left-0 h-5 flex items-center [font-family:'Inter',Helvetica] font-medium text-[#666666] text-xl tracking-[0] leading-5 whitespace-nowrap">
          Unassigned events
        </div>

        {/* Unassigned event cards */}
        <div className="absolute top-[836px] left-0 right-0">
          <FrameWrapperSubsection />
        </div>
      </main>

      {/* ── Modals & Panels ── */}

      {/* Availability Search Panel */}
      <AvailabilitySearchSheet
        open={showAvailabilitySearch}
        onClose={() => setShowAvailabilitySearch(false)}
        onSearch={handleAvailabilitySearch}
      />

      {/* New Event Modal */}
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

      {/* Conflict Resolution Dialog */}
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
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-[#d1fae5] rounded-xl shadow-lg px-4 py-3 max-w-[420px] animate-in slide-in-from-bottom-2 duration-300"
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
