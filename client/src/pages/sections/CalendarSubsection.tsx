import React, { createContext, useContext } from "react";

export interface CustomEventData {
  id: string;
  staffName: string;
  startTime: string;
  title: string;
  color: { bg: string; border: string };
}

interface CellChip {
  bg: string;
  border: string;
  label: string;
}

interface CalendarContextType {
  availabilityMode: boolean;
  selectedSlot: { staffName: string; timeLabel: string } | null;
  onSlotClick: (staffName: string, timeLabel: string) => void;
  onDoubleClickSlot: (staffName: string, timeLabel: string) => void;
  onConflictClick: (staffName: string, timeLabel: string, events: string[]) => void;
  customEvents: CustomEventData[];
}

const CalendarContext = createContext<CalendarContextType>({
  availabilityMode: false,
  selectedSlot: null,
  onSlotClick: () => {},
  onDoubleClickSlot: () => {},
  onConflictClick: () => {},
  customEvents: [],
});

export interface CalendarSubsectionProps {
  availabilityMode?: boolean;
  selectedSlot?: { staffName: string; timeLabel: string } | null;
  onSlotClick?: (staffName: string, timeLabel: string) => void;
  onDoubleClickSlot?: (staffName: string, timeLabel: string) => void;
  onConflictClick?: (staffName: string, timeLabel: string, events: string[]) => void;
  customEvents?: CustomEventData[];
}

const staffNames = [
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

const timeColumns = [
  "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
];

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

interface RowCellProps {
  staffName: string;
  timeLabel: string;
  chips: CellChip[];
}

const CELL_WIDTH = 283;

const RowCell = ({ staffName, timeLabel, chips }: RowCellProps) => {
  const { availabilityMode, selectedSlot, onSlotClick, onDoubleClickSlot, onConflictClick } =
    useContext(CalendarContext);

  const isConflict = chips.length >= 2;
  const isEmpty = chips.length === 0;
  const isAvailable = availabilityMode && isEmpty;
  const isSelected =
    selectedSlot?.staffName === staffName && selectedSlot?.timeLabel === timeLabel;

  let bgClass = "bg-[#f8f9fa]";
  if (isSelected) bgClass = "bg-[#bfdbfe] ring-2 ring-inset ring-[#0065f4]";
  else if (isAvailable) bgClass = "bg-[#e5effd] hover:bg-[#c7d9fc]";
  else if (isConflict) bgClass = "bg-[#fff7ed]";

  const chipWidth = chips.length === 1
    ? CELL_WIDTH - 2
    : Math.floor((CELL_WIDTH - 4) / chips.length);

  return (
    <div
      className={`relative h-10 border-b border-r border-[#dcdfe3] overflow-hidden flex items-center transition-colors ${bgClass} ${
        isAvailable ? "cursor-pointer group" : "cursor-default"
      }`}
      style={{ width: CELL_WIDTH }}
      onClick={isAvailable ? () => onSlotClick(staffName, timeLabel) : undefined}
      onDoubleClick={() => onDoubleClickSlot(staffName, timeLabel)}
      title={isAvailable ? `Click to schedule · Double-click to add event` : `Double-click to add event here`}
      data-testid={`cell-${staffName}-${timeLabel}`}
    >
      {/* Chips */}
      {chips.length > 0 && (
        <div className="flex items-center h-[37px] gap-px overflow-hidden relative top-px pl-px">
          {chips.map((chip, i) => (
            <div
              key={i}
              className="flex flex-col items-start justify-center pl-2 pr-1 pt-0.5 pb-1 overflow-hidden border-l-4 border-solid h-[37px] rounded flex-shrink-0"
              style={{
                width: chipWidth,
                backgroundColor: chip.bg,
                borderLeftColor: chip.border,
              }}
            >
              <span className="text-[10px] font-bold text-[#252627] truncate block w-full leading-tight">
                {chip.label}
              </span>
            </div>
          ))}
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

      {/* Availability hover hint */}
      {isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="text-[9px] font-semibold text-[#0065f4] bg-white/90 px-1.5 py-0.5 rounded shadow-sm">
            + Schedule
          </span>
        </div>
      )}

      {/* Selected state label */}
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[9px] font-bold text-[#0065f4]">Selected</span>
        </div>
      )}
    </div>
  );
};

export const CalendarSubsection = ({
  availabilityMode = false,
  selectedSlot = null,
  onSlotClick = () => {},
  onDoubleClickSlot = () => {},
  onConflictClick = () => {},
  customEvents = [],
}: CalendarSubsectionProps): JSX.Element => {
  const colCount = timeColumns.length;

  return (
    <CalendarContext.Provider
      value={{ availabilityMode, selectedSlot, onSlotClick, onDoubleClickSlot, onConflictClick, customEvents }}
    >
      <div
        className="w-full border border-solid border-[#e8e8e8] overflow-auto rounded-sm"
        style={{ maxHeight: "504px" }}
        data-testid="calendar-grid"
      >
        {/* CSS-grid container: sticky corner + time headers + sticky names + cells */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `181px repeat(${colCount}, ${CELL_WIDTH}px)`,
            gridTemplateRows: `40px repeat(${staffNames.length}, 40px)`,
            width: "max-content",
            minWidth: "100%",
          }}
        >
          {/* ── Corner cell (sticky top-left) ── */}
          <div
            className="sticky top-0 left-0 z-30 bg-white border-b border-r border-[#dcdfe3]"
            style={{ gridColumn: 1, gridRow: 1 }}
          />

          {/* ── Time column headers (sticky top) ── */}
          {timeColumns.map((time, ci) => (
            <div
              key={time}
              className="sticky top-0 z-20 bg-white border-b border-r border-[#dcdfe3] flex items-center px-3"
              style={{ gridColumn: ci + 2, gridRow: 1 }}
            >
              <span className="[font-family:'Inter',Helvetica] font-medium text-[#0e1828] text-sm">
                {time}
              </span>
            </div>
          ))}

          {/* ── Staff rows ── */}
          {staffNames.map((staff, si) => (
            <React.Fragment key={staff}>
              {/* Staff name cell (sticky left) */}
              <div
                className="sticky left-0 z-10 bg-white border-b border-r border-[#dcdfe3] flex items-center px-4"
                style={{ gridColumn: 1, gridRow: si + 2 }}
              >
                <span className="[font-family:'Inter',Helvetica] font-medium text-[#0e1828] text-sm whitespace-nowrap">
                  {staff}
                </span>
              </div>

              {/* Time cells */}
              {timeColumns.map((time, ci) => {
                const baseChips = calendarData[staff]?.[time] || [];
                const customEvent = customEvents.find(
                  (e) => e.staffName === staff && e.startTime === time
                );
                const allChips: CellChip[] = [
                  ...baseChips,
                  ...(customEvent
                    ? [
                        {
                          bg: customEvent.color.bg,
                          border: customEvent.color.border,
                          label: customEvent.title,
                        },
                      ]
                    : []),
                ];

                return (
                  <div
                    key={`${staff}-${time}`}
                    style={{ gridColumn: ci + 2, gridRow: si + 2 }}
                  >
                    <RowCell staffName={staff} timeLabel={time} chips={allChips} />
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </CalendarContext.Provider>
  );
};
