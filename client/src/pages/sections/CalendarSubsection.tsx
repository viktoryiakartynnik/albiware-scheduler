import React, {
  createContext, useContext, useMemo,
  useState, useRef, useCallback,
} from "react";
import { AlertTriangle, Users } from "lucide-react";

// ─── Public types ──────────────────────────────────────────────────────────────

export interface CustomEventData {
  id: string;
  staffName: string;
  startTime: string;
  title: string;
  color: { bg: string; border: string };
  status?: "new" | "moved" | "rescheduled";
  projectStatus?: string;
}

export interface CellChip {
  bg: string;
  border: string;
  label: string;
  status?: "new" | "moved" | "rescheduled";
  customEventId?: string;
  projectStatus?: string;
}

export interface DragChipData {
  staffName: string;
  timeLabel: string;
  chipIndex: number;
  chip: CellChip;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CalendarContextType {
  availabilityMode: boolean;
  availableTimeColumns: Set<string>;
  selectedSlot: { staffName: string; timeLabel: string } | null;
  suggestedStaff: string | null;
  onSlotClick: (staffName: string, timeLabel: string) => void;
  onDoubleClickSlot: (staffName: string, timeLabel: string) => void;
  onConflictClick: (staffName: string, timeLabel: string, events: string[]) => void;
  onChipClick: (staffName: string, timeLabel: string, chip: CellChip, chipIndex: number) => void;
  customEvents: CustomEventData[];
  // drag-and-drop
  dragSourceKey: string | null;
  dragOverCell: { staffName: string; timeLabel: string } | null;
  onStartDrag: (data: DragChipData) => void;
  onEndDrag: () => void;
  onDragOverCell: (staffName: string, timeLabel: string) => void;
  onDragLeaveCell: () => void;
  onDropOnCell: (targetStaff: string, targetTime: string) => void;
  // chip duration resize (absolute value)
  chipDurations: Record<string, number>;
  onDurationChange: (chipKey: string, absoluteDuration: number) => void;
  continuationCells: Set<string>;
}

const CalendarContext = createContext<CalendarContextType>({
  availabilityMode: false,
  availableTimeColumns: new Set(),
  selectedSlot: null,
  suggestedStaff: null,
  onSlotClick: () => {},
  onDoubleClickSlot: () => {},
  onConflictClick: () => {},
  onChipClick: () => {},
  // ^ default no-op, override in provider
  customEvents: [],
  dragSourceKey: null,
  dragOverCell: null,
  onStartDrag: () => {},
  onEndDrag: () => {},
  onDragOverCell: () => {},
  onDragLeaveCell: () => {},
  onDropOnCell: () => {},
  chipDurations: {},
  onDurationChange: () => {},
  continuationCells: new Set(),
});

// ─── Props ────────────────────────────────────────────────────────────────────

export interface CalendarSubsectionProps {
  availabilityMode?: boolean;
  availabilityFilters?: { startTime: string; endTime: string } | null;
  selectedSlot?: { staffName: string; timeLabel: string } | null;
  onSlotClick?: (staffName: string, timeLabel: string) => void;
  onDoubleClickSlot?: (staffName: string, timeLabel: string) => void;
  onConflictClick?: (staffName: string, timeLabel: string, events: string[]) => void;
  onChipClick?: (staffName: string, timeLabel: string, chip: CellChip, chipIndex: number) => void;
  onChipMoved?: (drag: DragChipData, targetStaff: string, targetTime: string) => void;
  customEvents?: CustomEventData[];
  removedBaseChips?: Set<string>;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const ALL_STAFF = [
  "Alan Thomas", "Michael Schaj", "Anna Sorokin", "Connor Grace",
  "Carmen Flores", "Shamoil Soni", "Chiara Bondesan", "Christy Blaker",
  "Adam Smith", "Daniyal Shamoon", "Michele Rave", "Chandler Steffy",
  "Bradley Lynch", "Moasfar Javed",
];

const timeColumns = [
  "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
];

function timeToMinutes(t: string): number {
  const [timePart, period] = t.split(" ");
  const [hStr, mStr] = timePart.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

const calendarData: Record<string, Record<string, CellChip[]>> = {
  "Alan Thomas": {
    "10:00 AM": [{ bg: "#fcf1d9", border: "#eca203", label: "PRJ 3057 – Building 221 – Pipe Replacement" }],
    "11:00 AM": [{ bg: "#f2ebf8", border: "#8238bb", label: "AS 3341 – Safety Audit" }],
    "12:00 PM": [{ bg: "#fcf1d9", border: "#eca203", label: "Saina Kitchen Plumbing – Residential Unit 3A" }],
    "02:00 PM": [{ bg: "#e5effd", border: "#0063ec", label: "PRJ 3057 – Inspection Follow-up" }],
    "04:00 PM": [{ bg: "#fcf1d9", border: "#eca203", label: "GEN 5521 – Final Closeout Check" }],
  },
  "Michael Schaj": {
    "10:00 AM": [
      { bg: "#e5effd", border: "#0063ec", label: "PN 1045 – Lakeshore Plumbing Upgrade" },
      { bg: "#fcf1d9", border: "#eca203", label: "Saina 051476" },
    ],
    "11:00 AM": [{ bg: "#fcf1d9", border: "#eca203", label: "Saina 051476 – Follow-Up" }],
    "12:00 PM": [
      { bg: "#fcf1d9", border: "#eca203", label: "Fire Alarm Testing – Corporate HQ" },
      { bg: "#fcf1d9", border: "#eca203", label: "Saina 051476" },
    ],
    "01:00 PM": [
      { bg: "#fcf1d9", border: "#eca203", label: "GEN 5521 – Warehouse District" },
      { bg: "#fcf1d9", border: "#eca203", label: "Saina 051476" },
    ],
    "03:00 PM": [{ bg: "#f2ebf8", border: "#8238bb", label: "HVAC Check – Midtown Tower" }],
  },
  "Anna Sorokin": {
    "10:00 AM": [{ bg: "#e5f1ed", border: "#007c54", label: "Gas Line Inspection – Safety Audit" }],
    "11:00 AM": [{ bg: "#fcf1d9", border: "#eca203", label: "JOB 7712 – Elmwood Ave – Kitchen Plumbing" }],
    "12:00 PM": [{ bg: "#e5effd", border: "#0063ec", label: "ELEC 9903 – Unit 12B – Panel Upgrade" }],
    "02:00 PM": [{ bg: "#fcf1d9", border: "#eca203", label: "Water Heater Install – Unit 4C" }],
    "04:00 PM": [{ bg: "#e5f1ed", border: "#007c54", label: "Pressure Test – Gas Main" }],
  },
  "Connor Grace": {
    "01:00 PM": [
      { bg: "#e5f1ed", border: "#007c54", label: "Fire Alarm Testing – Corporate HQ" },
      { bg: "#e5f1ed", border: "#007c54", label: "Pipe Replacement – Building 221" },
    ],
    "03:00 PM": [{ bg: "#f2ebf8", border: "#8238bb", label: "GEN 9923 – Downtown Loop HVAC" }],
    "05:00 PM": [{ bg: "#fcf1d9", border: "#eca203", label: "Overtime – Emergency Call" }],
  },
  "Carmen Flores": {
    "10:00 AM": [{ bg: "#e5effd", border: "#0063ec", label: "GEN 5521 – Warehouse District" }],
    "11:00 AM": [{ bg: "#e5f1ed", border: "#007c54", label: "Gas Line Inspection – Safety Audit" }],
    "12:00 PM": [{ bg: "#f2ebf8", border: "#8238bb", label: "Saina 051476 – HVAC Review" }],
    "03:00 PM": [{ bg: "#fcf1d9", border: "#eca203", label: "SRV 12058 – River North" }],
  },
  "Shamoil Soni": {
    "01:00 PM": [
      { bg: "#fcf1d9", border: "#eca203", label: "Gas Line Inspection" },
      { bg: "#fcf1d9", border: "#eca203", label: "AS 3341 – Safety Audit" },
      { bg: "#f2ebf8", border: "#8238bb", label: "Saina 051476" },
    ],
    "03:00 PM": [{ bg: "#f2ebf8", border: "#8238bb", label: "HVAC Preventive Maintenance" }],
    "05:00 PM": [{ bg: "#fcf1d9", border: "#eca203", label: "End-of-Day Report – Site 7" }],
  },
  "Chiara Bondesan": {
    "10:00 AM": [
      { bg: "#fcf1d9", border: "#eca203", label: "Saina 051476 (A)" },
      { bg: "#fcf1d9", border: "#eca203", label: "Saina 051476 (B)" },
      { bg: "#f2ebf8", border: "#8238bb", label: "Saina 051476 (C)" },
    ],
    "11:00 AM": [
      { bg: "#fcf1d9", border: "#eca203", label: "Saina 051476 (D)" },
      { bg: "#f2ebf8", border: "#8238bb", label: "Saina 051476 (E)" },
    ],
    "12:00 PM": [
      { bg: "#f2ebf8", border: "#8238bb", label: "Saina 051476 (F)" },
      { bg: "#fcf1d9", border: "#eca203", label: "Saina 051476 (G)" },
    ],
    "01:00 PM": [
      { bg: "#fcf1d9", border: "#eca203", label: "Saina 051476 (H)" },
      { bg: "#f2ebf8", border: "#8238bb", label: "Saina 051476 (I)" },
    ],
    "03:00 PM": [{ bg: "#e5effd", border: "#0063ec", label: "Afternoon Shift – Eastside Apt" }],
  },
  "Christy Blaker": {
    "10:00 AM": [{ bg: "#fcf1d9", border: "#eca203", label: "SRV 12058 – River North" }],
    "12:00 PM": [{ bg: "#fcf1d9", border: "#eca203", label: "AS 3341 – Safety Audit" }],
    "01:00 PM": [{ bg: "#fcf1d9", border: "#eca203", label: "GEN 5521 – Warehouse District" }],
    "04:00 PM": [{ bg: "#e5effd", border: "#0063ec", label: "PRJ 8822 – Industrial Park" }],
  },
  "Adam Smith": {
    "10:00 AM": [{ bg: "#e5f1ed", border: "#007c54", label: "PRJ 3057 – Building 221" }],
    "11:00 AM": [{ bg: "#e5f1ed", border: "#007c54", label: "SRV 12058 – River North Complex" }],
    "03:00 PM": [{ bg: "#e5f1ed", border: "#007c54", label: "PRJ 3057 Part 2 – Inspection" }],
    "05:00 PM": [{ bg: "#fcf1d9", border: "#eca203", label: "Overtime – Emergency Response" }],
  },
  "Daniyal Shamoon": {
    "10:00 AM": [{ bg: "#fcf1d9", border: "#eca203", label: "GEN 5521 – Warehouse District" }],
    "12:00 PM": [{ bg: "#e5f1ed", border: "#007c54", label: "Kitchen Plumbing – Residential Unit 3A" }],
    "02:00 PM": [
      { bg: "#fcf1d9", border: "#eca203", label: "SRV 7712 – Afternoon Job" },
      { bg: "#e5effd", border: "#0063ec", label: "Overlap Call – Downtown" },
    ],
    "04:00 PM": [{ bg: "#f2ebf8", border: "#8238bb", label: "HVAC Filter Check" }],
  },
  "Michele Rave": {
    "12:00 PM": [{ bg: "#e5effd", border: "#0063ec", label: "Gas Line Inspection – Safety Audit" }],
    "02:00 PM": [{ bg: "#fcf1d9", border: "#eca203", label: "PRJ 5522 – Routine Service" }],
    "04:00 PM": [{ bg: "#fcf1d9", border: "#eca203", label: "Emergency Call – Burst Pipe" }],
  },
  "Chandler Steffy": {
    "10:00 AM": [{ bg: "#f2ebf8", border: "#8238bb", label: "HVAC 6678 – Office Buildout" }],
    "11:00 AM": [{ bg: "#f2ebf8", border: "#8238bb", label: "HVAC 6678 – Office Buildout Cont." }],
    "12:00 PM": [{ bg: "#fcf1d9", border: "#eca203", label: "SRV 12058 – River North" }],
    "03:00 PM": [
      { bg: "#f2ebf8", border: "#8238bb", label: "HVAC 9901 – Tune-Up" },
      { bg: "#fcf1d9", border: "#eca203", label: "SRV 3302 – Maintenance Call" },
    ],
  },
  "Bradley Lynch": {
    "10:00 AM": [{ bg: "#e5f1ed", border: "#007c54", label: "PRJ 3057 – Site Check" }],
    "01:00 PM": [{ bg: "#fcf1d9", border: "#eca203", label: "SRV 8422 – Southside Block – Sewer Inspection" }],
    "02:00 PM": [{ bg: "#e5f1ed", border: "#007c54", label: "PRJ 4892 – Riverside Gas Line" }],
    "04:00 PM": [{ bg: "#e5effd", border: "#0063ec", label: "ELEC 3300 – Panel Swap" }],
  },
  "Moasfar Javed": {
    "10:00 AM": [{ bg: "#e5f1ed", border: "#007c54", label: "JOB 6583945 – 25-1305 – SAINA TEST" }],
    "11:00 AM": [{ bg: "#e5effd", border: "#0063ec", label: "MG 1102 – After Hours – Burst Pipe" }],
    "12:00 PM": [
      { bg: "#fcf1d9", border: "#eca203", label: "Saina 051476 (AM)" },
      { bg: "#f2ebf8", border: "#8238bb", label: "Saina 051476 (PM)" },
    ],
    "01:00 PM": [
      { bg: "#fcf1d9", border: "#eca203", label: "Saina 051476 (X)" },
      { bg: "#f2ebf8", border: "#8238bb", label: "Saina 051476 (Y)" },
    ],
    "03:00 PM": [{ bg: "#e5f1ed", border: "#007c54", label: "PRJ 7701 – Evening Shift" }],
  },
};

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  new:         { label: "NEW",   cls: "bg-[#22c55e] text-white" },
  moved:       { label: "↕ MOVED", cls: "bg-[#3b82f6] text-white" },
  rescheduled: { label: "RESCHD", cls: "bg-[#f97316] text-white" },
};

// ─── Cell ────────────────────────────────────────────────────────────────────

interface RowCellProps {
  staffName: string;
  timeLabel: string;
  chips: CellChip[];
  isSuggestedRow?: boolean;
  maxColumns: number;
}

const CELL_WIDTH = 283;

const RowCell = ({ staffName, timeLabel, chips, isSuggestedRow, maxColumns }: RowCellProps) => {
  const {
    availabilityMode,
    availableTimeColumns,
    selectedSlot,
    onSlotClick,
    onDoubleClickSlot,
    onConflictClick,
    onChipClick,
    dragSourceKey,
    dragOverCell,
    onStartDrag,
    onEndDrag,
    onDragOverCell,
    onDragLeaveCell,
    onDropOnCell,
    chipDurations,
    onDurationChange,
  } = useContext(CalendarContext);

  const [hoveredChipIdx, setHoveredChipIdx] = useState<number | null>(null);

  const isConflict = chips.length >= 2;
  const isEmpty    = chips.length === 0;
  const isInRange  = availableTimeColumns.has(timeLabel);
  const isSelected = selectedSlot?.staffName === staffName && selectedSlot?.timeLabel === timeLabel;
  const isDragTarget = dragOverCell?.staffName === staffName && dragOverCell?.timeLabel === timeLabel;

  let bgClass = "bg-[#f8f9fa]";
  if (isDragTarget)   bgClass = "bg-[#eff6ff] ring-2 ring-inset ring-[#3b82f6]";
  else if (isSelected) bgClass = "bg-[#bfdbfe] ring-2 ring-inset ring-[#0065f4]";
  else if (availabilityMode && isSuggestedRow && isInRange && isEmpty)
    bgClass = "bg-[#fffbeb] hover:bg-[#fef3c7] cursor-pointer";
  else if (availabilityMode && isEmpty && isInRange)
    bgClass = "bg-[#f8f9fa] hover:bg-[#f3f8ff] cursor-pointer";
  else if (availabilityMode && !isInRange)
    bgClass = "bg-[#f8f9fa] opacity-50";
  else if (isConflict) bgClass = "bg-[#fff7ed]";

  const canClickSlot = availabilityMode && isEmpty && isInRange && !isSelected;

  return (
    <div
      className={`relative h-9 border-b border-r border-[#dcdfe3] overflow-visible flex items-center transition-colors ${bgClass} ${
        canClickSlot ? "group" : ""
      }`}
      style={{ width: "100%" }}
      onClick={canClickSlot ? () => onSlotClick(staffName, timeLabel) : undefined}
      onDoubleClick={() => onDoubleClickSlot(staffName, timeLabel)}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        onDragOverCell(staffName, timeLabel);
      }}
      onDragLeave={() => onDragLeaveCell()}
      onDrop={(e) => {
        e.preventDefault();
        onDropOnCell(staffName, timeLabel);
      }}
      data-testid={`cell-${staffName}-${timeLabel}`}
    >
      {/* Chips */}
      {chips.length > 0 && (
        <div
          className="flex items-center h-[33px] gap-px relative top-px pl-px"
          style={{ width: "100%", overflow: "visible" }}
        >
          {chips.map((chip, i) => {
            const chipKey = `${staffName}||${timeLabel}||${i}`;
            const isDragSource = dragSourceKey === chipKey;
            const statusBadge = chip.status ? STATUS_BADGE[chip.status] : null;
            const dur = chipDurations[chipKey] || 1;
            const isSingleChip = chips.length === 1;

            return (
              <div
                key={i}
                className="relative h-[33px] group/chip min-w-0"
                style={{ flex: 1 }}
              >
                {/* Chip body */}
                <div
                  className={`flex flex-col items-start justify-center pl-2 pt-0.5 pb-1 overflow-hidden border-l-4 border-solid h-[33px] rounded cursor-grab transition-all duration-100 w-full select-none ${
                    isDragSource ? "opacity-30" : ""
                  } ${isSingleChip ? "pr-4" : "pr-1"}`}
                  style={{
                    backgroundColor: hoveredChipIdx === i ? lightenColor(chip.bg) : chip.bg,
                    borderLeftColor: chip.border,
                    outline: hoveredChipIdx === i ? `2px solid ${chip.border}` : "none",
                    outlineOffset: "-1px",
                    boxShadow: hoveredChipIdx === i ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
                  }}
                  draggable
                  onDragStart={(e) => {
                    onStartDrag({ staffName, timeLabel, chipIndex: i, chip });
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragEnd={onEndDrag}
                  onMouseEnter={() => setHoveredChipIdx(i)}
                  onMouseLeave={() => setHoveredChipIdx(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChipClick(staffName, timeLabel, chip, i);
                  }}
                  data-testid={`chip-${staffName}-${timeLabel}-${i}`}
                >
                  <div className="flex items-center gap-1 w-full min-w-0">
                    <span className="text-[10px] font-bold text-[#252627] truncate flex-1 leading-tight pointer-events-none">
                      {chip.label}
                    </span>
                    {dur > 1 && (
                      <span className="text-[8px] font-black bg-[#7c3aed] text-white px-1 rounded leading-none flex-shrink-0 pointer-events-none">
                        {dur}h
                      </span>
                    )}
                    {statusBadge && (
                      <span className={`text-[7px] font-black px-0.5 rounded leading-none flex-shrink-0 pointer-events-none ${statusBadge.cls}`}>
                        {statusBadge.label}
                      </span>
                    )}
                    {chip.projectStatus && chip.projectStatus !== "not_started" && (() => {
                      const psColors: Record<string, string> = {
                        in_progress: "#3b82f6",
                        on_hold: "#f59e0b",
                        completed: "#22c55e",
                        cancelled: "#ef4444",
                      };
                      const color = psColors[chip.projectStatus];
                      return color ? (
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0 ring-1 ring-white pointer-events-none"
                          style={{ backgroundColor: color }}
                          title={chip.projectStatus.replace("_", " ")}
                        />
                      ) : null;
                    })()}
                  </div>
                </div>

                {/* Drag-to-resize handle — right edge of single chips only */}
                {isSingleChip && (
                  <div
                    className="absolute right-0 top-0 bottom-0 w-3 z-20 flex items-center justify-center cursor-ew-resize"
                    title="Drag to change duration"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const startX = e.clientX;
                      const startDuration = chipDurations[chipKey] || 1;
                      let lastDur = startDuration;

                      const onMouseMove = (me: MouseEvent) => {
                        const deltaX = me.clientX - startX;
                        const durDelta = Math.round(deltaX / CELL_WIDTH);
                        const newDur = Math.max(1, Math.min(startDuration + durDelta, maxColumns));
                        if (newDur !== lastDur) {
                          lastDur = newDur;
                          onDurationChange(chipKey, newDur);
                        }
                      };
                      const onMouseUp = () => {
                        window.removeEventListener("mousemove", onMouseMove);
                        window.removeEventListener("mouseup", onMouseUp);
                      };
                      window.addEventListener("mousemove", onMouseMove);
                      window.addEventListener("mouseup", onMouseUp);
                    }}
                  >
                    <div className="w-0.5 h-5 bg-black/30 rounded-full group-hover/chip:bg-black/50" />
                  </div>
                )}

                {/* Hover tooltip */}
                {hoveredChipIdx === i && !isDragSource && (
                  <div
                    className="absolute bottom-full left-0 mb-1 z-50 pointer-events-none"
                    style={{ minWidth: 200, maxWidth: 300 }}
                  >
                    <div
                      className="bg-white rounded-lg shadow-xl border border-[#e8e8e8] p-2.5"
                      style={{ borderLeft: `3px solid ${chip.border}` }}
                    >
                      <p className="text-xs font-bold text-[#0e1828] leading-snug mb-1 font-['Inter',sans-serif]">
                        {chip.label}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-[#6b7280] font-['Inter',sans-serif]">
                        <span>{staffName}</span>
                        <span>·</span>
                        <span>{timeLabel}</span>
                        {dur > 1 && (
                          <>
                            <span>·</span>
                            <span className="text-[#7c3aed] font-semibold">{dur}h duration</span>
                          </>
                        )}
                        {chip.status && (
                          <>
                            <span>·</span>
                            <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${STATUS_BADGE[chip.status].cls}`}>
                              {STATUS_BADGE[chip.status].label}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-[10px] text-[#6b7280] mt-1 font-['Inter',sans-serif]">
                        Click to view · Drag to reschedule · Drag right edge to resize
                      </p>
                    </div>
                    <div
                      className="absolute left-3 top-full w-0 h-0"
                      style={{
                        borderLeft: "5px solid transparent",
                        borderRight: "5px solid transparent",
                        borderTop: "5px solid #e8e8e8",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Conflict badge */}
      {isConflict && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onConflictClick(staffName, timeLabel, chips.map((c) => c.label));
          }}
          className="absolute top-1 right-1 w-5 h-5 bg-[#ef4444] text-white text-[9px] font-black rounded-full flex items-center justify-center z-10 hover:bg-[#dc2626] transition-colors shadow-sm leading-none"
          title={`${chips.length} conflicting events — click to resolve`}
          data-testid={`conflict-badge-${staffName}-${timeLabel}`}
        >
          !
        </button>
      )}

      {/* Drop zone hint (no chips, in-range, availability mode) */}
      {availabilityMode && isEmpty && isInRange && (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity ${
          isDragTarget ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}>
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-sm ${
            isDragTarget
              ? "text-[#1d4ed8] bg-[#dbeafe]"
              : isSuggestedRow
              ? "text-[#d97706] bg-white/90"
              : "text-[#6b7280] bg-white/90"
          }`}>
            {isDragTarget ? "Drop here" : isSuggestedRow ? "★ Schedule here" : "+ Schedule"}
          </span>
        </div>
      )}

      {/* Drag target overlay (non-availability mode) */}
      {isDragTarget && !availabilityMode && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[9px] font-semibold text-[#1d4ed8] bg-[#dbeafe] px-1.5 py-0.5 rounded shadow-sm">
            Drop here
          </span>
        </div>
      )}

      {/* Selected label */}
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[9px] font-bold text-[#0065f4]">Selected</span>
        </div>
      )}
    </div>
  );
};

function lightenColor(hex: string): string {
  if (!hex.startsWith("#") || hex.length < 7) return hex;
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + 10);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + 10);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + 10);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// ─── Main component ───────────────────────────────────────────────────────────

export const CalendarSubsection = ({
  availabilityMode = false,
  availabilityFilters = null,
  selectedSlot = null,
  onSlotClick = () => {},
  onDoubleClickSlot = () => {},
  onConflictClick = () => {},
  onChipClick = () => {},
  onChipMoved,
  customEvents = [],
  removedBaseChips = new Set(),
}: CalendarSubsectionProps): JSX.Element => {

  // ── Chip durations state ─────────────────────────────────────────────────────
  const [chipDurations, setChipDurations] = useState<Record<string, number>>({});

  const handleDurationChange = useCallback((chipKey: string, absoluteDuration: number) => {
    setChipDurations((prev) => ({
      ...prev,
      [chipKey]: Math.max(1, Math.min(absoluteDuration, timeColumns.length)),
    }));
  }, []);

  // ── Drag state ──────────────────────────────────────────────────────────────
  const dragDataRef = useRef<DragChipData | null>(null);
  const [dragSourceKey, setDragSourceKey] = useState<string | null>(null);
  const [dragOverCell, setDragOverCell] = useState<{ staffName: string; timeLabel: string } | null>(null);

  const handleStartDrag = useCallback((data: DragChipData) => {
    dragDataRef.current = data;
    setDragSourceKey(`${data.staffName}||${data.timeLabel}||${data.chipIndex}`);
  }, []);

  const handleEndDrag = useCallback(() => {
    dragDataRef.current = null;
    setDragSourceKey(null);
    setDragOverCell(null);
  }, []);

  const handleDragOverCell = useCallback((staffName: string, timeLabel: string) => {
    setDragOverCell({ staffName, timeLabel });
  }, []);

  const handleDragLeaveCell = useCallback(() => {
    setDragOverCell(null);
  }, []);

  const handleDropOnCell = useCallback((targetStaff: string, targetTime: string) => {
    const drag = dragDataRef.current;
    setDragSourceKey(null);
    setDragOverCell(null);
    dragDataRef.current = null;
    if (!drag) return;
    if (drag.staffName === targetStaff && drag.timeLabel === targetTime) return;
    onChipMoved?.(drag, targetStaff, targetTime);
  }, [onChipMoved]);

  // ── Availability ────────────────────────────────────────────────────────────
  const availableTimeColumns = useMemo<Set<string>>(() => {
    if (!availabilityFilters) return new Set(timeColumns);
    const start = timeToMinutes(availabilityFilters.startTime);
    const end   = timeToMinutes(availabilityFilters.endTime);
    return new Set(
      timeColumns.filter((t) => {
        const tm = timeToMinutes(t);
        return tm >= start && tm < end;
      })
    );
  }, [availabilityFilters]);

  const getFreeSlots = useCallback((name: string, filteredTimes: string[]) =>
    filteredTimes.filter((t) => {
      const base = (calendarData[name]?.[t] || []).filter(
        (_, idx) => !removedBaseChips.has(`${name}||${t}||${idx}`)
      );
      const hasCustom = customEvents.some((e) => e.staffName === name && e.startTime === t);
      return base.length === 0 && !hasCustom;
    }).length,
  [customEvents, removedBaseChips]);

  const displayedStaff = useMemo(() => {
    if (!availabilityMode || !availabilityFilters) return ALL_STAFF;
    const filteredTimes = [...availableTimeColumns];
    const total = filteredTimes.length;
    return [...ALL_STAFF].sort((a, b) => {
      const aFree = getFreeSlots(a, filteredTimes);
      const bFree = getFreeSlots(b, filteredTimes);
      const aFull = aFree === total ? 1 : 0;
      const bFull = bFree === total ? 1 : 0;
      if (aFull !== bFull) return bFull - aFull;
      return bFree - aFree;
    });
  }, [availabilityMode, availabilityFilters, availableTimeColumns, getFreeSlots]);

  const suggestedStaff = useMemo(() => {
    if (!availabilityMode || !displayedStaff.length) return null;
    const filteredTimes = [...availableTimeColumns];
    if (filteredTimes.length === 0) return displayedStaff[0];
    return displayedStaff.find((name) =>
      filteredTimes.every((t) => {
        const base = (calendarData[name]?.[t] || []).filter(
          (_, idx) => !removedBaseChips.has(`${name}||${t}||${idx}`)
        );
        const hasCustom = customEvents.some((e) => e.staffName === name && e.startTime === t);
        return base.length === 0 && !hasCustom;
      })
    ) || displayedStaff[0];
  }, [availabilityMode, displayedStaff, availableTimeColumns, customEvents, removedBaseChips]);

  const hasFullCoverage = useMemo(() => {
    if (!availabilityMode || !availabilityFilters) return true;
    const filteredTimes = [...availableTimeColumns];
    if (filteredTimes.length === 0) return true;
    return displayedStaff.some((name) =>
      filteredTimes.every((t) => {
        const base = (calendarData[name]?.[t] || []).filter(
          (_, idx) => !removedBaseChips.has(`${name}||${t}||${idx}`)
        );
        const hasCustom = customEvents.some((e) => e.staffName === name && e.startTime === t);
        return base.length === 0 && !hasCustom;
      })
    );
  }, [availabilityMode, availabilityFilters, availableTimeColumns, displayedStaff, customEvents, removedBaseChips]);

  // ── Continuation cells ───────────────────────────────────────────────────────
  const continuationCells = useMemo<Set<string>>(() => {
    const covered = new Set<string>();
    for (const staff of ALL_STAFF) {
      for (const [timeIdx, time] of timeColumns.entries()) {
        const baseChips = (calendarData[staff]?.[time] || []).filter(
          (_, idx) => !removedBaseChips.has(`${staff}||${time}||${idx}`)
        );
        const customChips = customEvents.filter((e) => e.staffName === staff && e.startTime === time);
        const totalCount = baseChips.length + customChips.length;
        for (let chipIdx = 0; chipIdx < totalCount; chipIdx++) {
          const chipKey = `${staff}||${time}||${chipIdx}`;
          const duration = chipDurations[chipKey] || 1;
          if (duration > 1) {
            for (let d = 1; d < duration; d++) {
              if (timeIdx + d < timeColumns.length) {
                covered.add(`${staff}||${timeColumns[timeIdx + d]}`);
              }
            }
          }
        }
      }
    }
    return covered;
  }, [chipDurations, customEvents, removedBaseChips]);

  const colCount = timeColumns.length;

  return (
    <CalendarContext.Provider
      value={{
        availabilityMode,
        availableTimeColumns,
        selectedSlot,
        suggestedStaff,
        onSlotClick,
        onDoubleClickSlot,
        onConflictClick,
        onChipClick,
        customEvents,
        dragSourceKey,
        dragOverCell,
        onStartDrag: handleStartDrag,
        onEndDrag: handleEndDrag,
        onDragOverCell: handleDragOverCell,
        onDragLeaveCell: handleDragLeaveCell,
        onDropOnCell: handleDropOnCell,
        chipDurations,
        onDurationChange: handleDurationChange,
        continuationCells,
      }}
    >
      <div
        className="w-full border border-solid border-[#e8e8e8] overflow-auto rounded-sm"
        style={{ maxHeight: "504px" }}
        data-testid="calendar-grid"
      >
        {/* Availability banner */}
        {availabilityMode && availabilityFilters && (
          <>
            <div className="sticky top-0 z-40 bg-[#e5effd] border-b border-[#93c5fd] px-4 py-1.5 flex items-center gap-2 flex-wrap">
              <div className="w-3 h-3 rounded-full bg-[#3b82f6] flex-shrink-0" />
              <span className="text-xs font-semibold text-[#1d4ed8] font-['Inter',sans-serif]">
                Searching: {availabilityFilters.startTime}–{availabilityFilters.endTime}
              </span>
              {suggestedStaff && hasFullCoverage && (
                <>
                  <span className="text-xs text-[#3b82f6] font-['Inter',sans-serif]">·</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-[#d97706] bg-[#fef9c3] border border-[#fde68a] px-2 py-0.5 rounded-md font-['Inter',sans-serif]">
                    ★ Best match: {suggestedStaff}
                  </span>
                  <span className="text-xs text-[#3b82f6] font-['Inter',sans-serif]">·</span>
                  <span className="text-xs text-[#1d4ed8] font-['Inter',sans-serif]">
                    Fully available staff ranked first
                  </span>
                </>
              )}
            </div>

            {/* No full coverage warning */}
            {!hasFullCoverage && (
              <div className="sticky top-[34px] z-40 bg-[#fffbeb] border-b border-[#fde68a] px-4 py-2 flex items-center gap-2.5 flex-wrap">
                <AlertTriangle className="w-4 h-4 text-[#d97706] flex-shrink-0" />
                <span className="text-xs font-semibold text-[#92400e] font-['Inter',sans-serif]">
                  No single staff member is fully available for this window.
                </span>
                <span className="text-xs text-[#78350f] font-['Inter',sans-serif]">
                  Consider using
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#c2410c] bg-[#fff7ed] border border-[#fed7aa] px-2 py-0.5 rounded-md font-['Inter',sans-serif]">
                  <Users className="w-3 h-3" />
                  Split Coverage
                </span>
                <span className="text-xs text-[#78350f] font-['Inter',sans-serif]">
                  to combine two staff members for this time slot.
                </span>
              </div>
            )}
          </>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `140px repeat(${colCount}, ${CELL_WIDTH}px)`,
            gridTemplateRows: `36px repeat(${displayedStaff.length}, 36px)`,
            width: "max-content",
            minWidth: "100%",
          }}
        >
          {/* Corner */}
          <div
            className="sticky top-0 left-0 z-30 bg-white border-b border-r border-[#dcdfe3]"
            style={{ gridColumn: 1, gridRow: 1 }}
          />

          {/* Time headers */}
          {timeColumns.map((time, ci) => {
            const inRange = availableTimeColumns.has(time);
            return (
              <div
                key={time}
                className={`sticky top-0 z-20 border-b border-r border-[#dcdfe3] flex items-center px-3 transition-colors ${
                  availabilityMode && inRange
                    ? "bg-[#eff6ff]"
                    : availabilityMode
                    ? "bg-white opacity-60"
                    : "bg-white"
                }`}
                style={{ gridColumn: ci + 2, gridRow: 1 }}
              >
                <span className={`[font-family:'Inter',Helvetica] font-medium text-sm ${
                  availabilityMode && inRange ? "text-[#1d4ed8]" : "text-[#0e1828]"
                }`}>
                  {time}
                </span>
                {availabilityMode && inRange && (
                  <span className="ml-1.5 text-[8px] font-bold text-[#3b82f6] leading-none">✓</span>
                )}
              </div>
            );
          })}

          {/* Staff rows */}
          {displayedStaff.map((staff, si) => {
            const isSuggested = staff === suggestedStaff;

            const freeInRange = availabilityMode
              ? [...availableTimeColumns].filter((t) => {
                  const base = (calendarData[staff]?.[t] || []).filter(
                    (_, idx) => !removedBaseChips.has(`${staff}||${t}||${idx}`)
                  );
                  const hasCustom = customEvents.some((e) => e.staffName === staff && e.startTime === t);
                  return base.length === 0 && !hasCustom;
                }).length
              : 0;

            return (
              <React.Fragment key={staff}>
                {/* Staff name cell */}
                <div
                  className={`sticky left-0 z-10 border-b border-r border-[#dcdfe3] flex items-center justify-between px-3 transition-colors ${
                    isSuggested
                      ? "bg-[#fffbeb] border-l-[3px] border-l-[#f59e0b]"
                      : "bg-white"
                  }`}
                  style={{ gridColumn: 1, gridRow: si + 2 }}
                >
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    {isSuggested && (
                      <span className="text-[10px] flex-shrink-0">★</span>
                    )}
                    <span className={`[font-family:'Inter',Helvetica] font-medium text-sm whitespace-nowrap truncate ${
                      isSuggested ? "text-[#92400e] font-semibold" : "text-[#0e1828]"
                    }`}>
                      {staff}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                    {isSuggested && (
                      <span className="text-[7px] font-black text-white bg-[#f59e0b] px-1 py-0.5 rounded leading-none">
                        BEST
                      </span>
                    )}
                    {availabilityMode && freeInRange > 0 && (
                      <span className={`text-[9px] font-bold text-white rounded-full w-4 h-4 flex items-center justify-center ${
                        isSuggested ? "bg-[#f59e0b]" : "bg-[#3b82f6]"
                      }`}>
                        {freeInRange}
                      </span>
                    )}
                  </div>
                </div>

                {/* Time cells */}
                {timeColumns.map((time, ci) => {
                  const cellKey = `${staff}||${time}`;

                  // Skip cells that are "covered" by a spanning chip from a previous column
                  if (continuationCells.has(cellKey)) {
                    return null;
                  }

                  const baseChips = (calendarData[staff]?.[time] || []).filter(
                    (_, idx) => !removedBaseChips.has(`${staff}||${time}||${idx}`)
                  );

                  const matchingCustomEvents = customEvents.filter(
                    (e) => e.staffName === staff && e.startTime === time
                  );

                  const allChips: CellChip[] = [
                    ...baseChips,
                    ...matchingCustomEvents.map((ce) => ({
                      bg: ce.color.bg,
                      border: ce.color.border,
                      label: ce.title,
                      status: ce.status,
                      customEventId: ce.id,
                    })),
                  ];

                  // Single-chip cells can span multiple columns based on duration
                  const colSpan = allChips.length === 1
                    ? Math.min(chipDurations[`${staff}||${time}||0`] || 1, timeColumns.length - ci)
                    : 1;
                  const maxCols = timeColumns.length - ci;

                  return (
                    <div
                      key={`${staff}-${time}`}
                      style={{
                        gridColumn: colSpan > 1 ? `${ci + 2} / span ${colSpan}` : ci + 2,
                        gridRow: si + 2,
                      }}
                    >
                      <RowCell
                        staffName={staff}
                        timeLabel={time}
                        chips={allChips}
                        isSuggestedRow={isSuggested}
                        maxColumns={maxCols}
                      />
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </CalendarContext.Provider>
  );
};
