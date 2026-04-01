import { createContext, useContext } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export interface CustomEventData {
  id: string;
  staffName: string;
  startTime: string;
  title: string;
  color: { bg: string; border: string };
}

interface CalendarContextType {
  availabilityMode: boolean;
  selectedSlot: { staffName: string; timeLabel: string } | null;
  onSlotClick: (staffName: string, timeLabel: string) => void;
  customEvents: CustomEventData[];
}

const CalendarContext = createContext<CalendarContextType>({
  availabilityMode: false,
  selectedSlot: null,
  onSlotClick: () => {},
  customEvents: [],
});

export interface CalendarSubsectionProps {
  availabilityMode?: boolean;
  selectedSlot?: { staffName: string; timeLabel: string } | null;
  onSlotClick?: (staffName: string, timeLabel: string) => void;
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

interface EventChipProps {
  width: string;
  bg: string;
  border: string;
  label: string;
}

const EventChip = ({ width, bg, border, label }: EventChipProps) => (
  <div
    className="flex flex-col items-start justify-center pl-2 pr-0 pt-0.5 pb-1 relative overflow-hidden border-l-4 border-solid h-[37px] rounded flex-shrink-0"
    style={{ width, backgroundColor: bg, borderLeftColor: border }}
  >
    <div className="w-fit font-bold text-[#252627] whitespace-nowrap [font-family:'Inter',Helvetica] text-xs tracking-[0] leading-4 overflow-hidden max-w-[260px] text-ellipsis">
      {label}
    </div>
  </div>
);

const EmptyChip = ({ width = "46px" }: { width?: string }) => (
  <div className="flex-shrink-0 h-[37px] rounded" style={{ width }} />
);

interface RowCellProps {
  children?: React.ReactNode;
  staffName: string;
  timeLabel: string;
  hasEventContent?: boolean;
}

const RowCell = ({ children, staffName, timeLabel, hasEventContent }: RowCellProps) => {
  const { availabilityMode, selectedSlot, onSlotClick, customEvents } = useContext(CalendarContext);

  const customEvent = customEvents.find(
    (e) => e.staffName === staffName && e.startTime === timeLabel
  );

  const occupied = hasEventContent || !!children || !!customEvent;
  const isAvailable = availabilityMode && !occupied;
  const isSelected =
    selectedSlot?.staffName === staffName && selectedSlot?.timeLabel === timeLabel;

  let bgClass = "bg-gray-100";
  if (isSelected) bgClass = "bg-[#bfdbfe]";
  else if (isAvailable) bgClass = "bg-[#e5effd] hover:bg-[#c7d9fc]";

  return (
    <div
      className={`relative self-stretch w-full h-10 border-b border-solid border-[#dbdee3] transition-colors ${bgClass} ${
        isAvailable ? "cursor-pointer group" : ""
      } ${isSelected ? "ring-2 ring-inset ring-[#0065f4]" : ""}`}
      onClick={isAvailable ? () => onSlotClick(staffName, timeLabel) : undefined}
      title={isAvailable ? `Schedule ${staffName} at ${timeLabel}` : undefined}
      data-testid={isAvailable ? `slot-${staffName}-${timeLabel}` : undefined}
    >
      {(children || customEvent) && (
        <div className="inline-flex h-[37px] items-center gap-px relative top-px">
          {customEvent && (
            <EventChip
              width="282px"
              bg={customEvent.color.bg}
              border={customEvent.color.border}
              label={customEvent.title}
            />
          )}
          {children}
        </div>
      )}
      {isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="text-[10px] font-semibold text-[#0065f4] bg-white/80 px-2 py-0.5 rounded">
            + Schedule
          </span>
        </div>
      )}
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] font-bold text-[#0065f4]">Selected</span>
        </div>
      )}
    </div>
  );
};

export const CalendarSubsection = ({
  availabilityMode = false,
  selectedSlot = null,
  onSlotClick = () => {},
  customEvents = [],
}: CalendarSubsectionProps): JSX.Element => {
  return (
    <CalendarContext.Provider value={{ availabilityMode, selectedSlot, onSlotClick, customEvents }}>
      <div className="w-full border border-solid border-[#e8e8e8] flex items-start overflow-hidden">
        {/* Left sticky names column */}
        <div className="flex flex-col w-[181px] flex-shrink-0 items-start border-r border-solid border-[#dcdfe3]">
          <div className="relative self-stretch w-full h-10 bg-white border-b border-solid border-[#dcdfe3]" />
          {staffNames.map((name) => (
            <div
              key={name}
              className="relative self-stretch w-full h-10 bg-white border-b border-solid border-[#dcdfe3] flex items-center px-4"
            >
              <span className="[font-family:'Inter',Helvetica] font-medium text-[#0e1828] text-sm tracking-[0] leading-5 whitespace-nowrap">
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Scrollable time columns */}
        <ScrollArea className="flex-1 overflow-x-auto">
          <div className="flex items-start">
            {/* ───── 10:00 AM ───── */}
            <div className="flex flex-col w-[283px] flex-shrink-0 border-r border-solid border-[#dcdfe3]">
              <div className="relative self-stretch w-full h-10 bg-white border-b border-solid border-[#dcdfe3] flex items-center px-3">
                <span className="[font-family:'Inter',Helvetica] font-medium text-[#0e1828] text-sm">10:00 AM</span>
              </div>
              <RowCell staffName="Alan Thomas" timeLabel="10:00 AM">
                <EventChip width="282px" bg="#fcf1d9" border="#eca203" label="PRJ 3057 – Building 221 – Pipe Replacement" />
              </RowCell>
              <RowCell staffName="Michael Schaj" timeLabel="10:00 AM">
                <EmptyChip />
                <EventChip width="234px" bg="#e5effd" border="#0063ec" label="PN 1045 – Lakeshore Plumbing Upgrade" />
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
              </RowCell>
              <RowCell staffName="Anna Sorokin" timeLabel="10:00 AM" hasEventContent>
                <div className="flex flex-col w-[357px] items-start justify-center pl-2 pr-0 pt-0.5 pb-1 bg-[#e5f1ed] overflow-hidden border-l-4 border-solid border-[#007c54] h-[37px] rounded flex-shrink-0">
                  <div className="w-fit font-bold text-[#252627] whitespace-nowrap [font-family:'Inter',Helvetica] text-xs">
                    Gas Line Inspection – Safety Audit
                  </div>
                </div>
              </RowCell>
              <RowCell staffName="Connor Grace" timeLabel="10:00 AM" />
              <RowCell staffName="Carmen Flores" timeLabel="10:00 AM">
                <EventChip width="46px" bg="#e5effd" border="#0063ec" label="GEN 5521 – Warehouse District" />
              </RowCell>
              <RowCell staffName="Shamoil Soni" timeLabel="10:00 AM" />
              <RowCell staffName="Chiara Bondesan" timeLabel="10:00 AM">
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
                <EventChip width="46px" bg="#f2ebf8" border="#8238bb" label="Saina 051476" />
                <EmptyChip />
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
              </RowCell>
              <RowCell staffName="Christy Blaker" timeLabel="10:00 AM">
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="SRV 12058 – River North" />
                <EmptyChip />
              </RowCell>
              <RowCell staffName="Adam Smith" timeLabel="10:00 AM">
                <EventChip width="140px" bg="#007c541a" border="#007c54" label="PRJ 3057 – Building 221" />
              </RowCell>
              <RowCell staffName="Daniyal Shamoon" timeLabel="10:00 AM">
                <EventChip width="282px" bg="#fcf1d9" border="#eca203" label="GEN 5521 – Warehouse District" />
              </RowCell>
              <RowCell staffName="Michele Rave" timeLabel="10:00 AM">
                <EmptyChip />
              </RowCell>
              <RowCell staffName="Chandler Steffy" timeLabel="10:00 AM">
                <EventChip width="283px" bg="#f2ebf8" border="#8238bb" label="HVAC 6678 – Office Buildout" />
              </RowCell>
              <RowCell staffName="Bradley Lynch" timeLabel="10:00 AM">
                <EmptyChip width="186px" />
                <EventChip width="95px" bg="#007c541a" border="#007c54" label="PRJ 3057" />
              </RowCell>
              <RowCell staffName="Moasfar Javed" timeLabel="10:00 AM">
                <EventChip width="283px" bg="#007c541a" border="#007c54" label="JOB 6583945 – 25-1305 – SAINA TEST" />
              </RowCell>
            </div>

            {/* ───── 11:00 AM ───── */}
            <div className="flex flex-col w-[283px] flex-shrink-0 border-r border-solid border-[#dcdfe3]">
              <div className="relative self-stretch w-full h-10 bg-white border-b border-solid border-[#dcdfe3] flex items-center px-3">
                <span className="[font-family:'Inter',Helvetica] font-medium text-[#0e1828] text-sm">11:00 AM</span>
              </div>
              <RowCell staffName="Alan Thomas" timeLabel="11:00 AM">
                <EventChip width="282px" bg="#f2ebf8" border="#8238bb" label="AS 3341 – Safety Audit" />
              </RowCell>
              <RowCell staffName="Michael Schaj" timeLabel="11:00 AM">
                <EmptyChip />
                <EventChip width="94px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
              </RowCell>
              <RowCell staffName="Anna Sorokin" timeLabel="11:00 AM">
                <EventChip width="234px" bg="#fcf1d9" border="#eca203" label="JOB 7712 – Elmwood Ave – Kitchen Plumbing" />
              </RowCell>
              <RowCell staffName="Connor Grace" timeLabel="11:00 AM" />
              <RowCell staffName="Carmen Flores" timeLabel="11:00 AM">
                <EmptyChip />
                <EventChip width="236px" bg="#007c541a" border="#007c54" label="Gas Line Inspection – Safety Audit" />
              </RowCell>
              <RowCell staffName="Shamoil Soni" timeLabel="11:00 AM" />
              <RowCell staffName="Chiara Bondesan" timeLabel="11:00 AM">
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
                <EventChip width="46px" bg="#f2ebf8" border="#8238bb" label="Saina 051476" />
                <EventChip width="46px" bg="#f2ebf8" border="#8238bb" label="Saina 051476" />
                <EmptyChip />
              </RowCell>
              <RowCell staffName="Christy Blaker" timeLabel="11:00 AM" />
              <RowCell staffName="Adam Smith" timeLabel="11:00 AM">
                <EventChip width="282px" bg="#007c541a" border="#007c54" label="SRV 12058 – River North Complex" />
              </RowCell>
              <RowCell staffName="Daniyal Shamoon" timeLabel="11:00 AM">
                <EmptyChip />
              </RowCell>
              <RowCell staffName="Michele Rave" timeLabel="11:00 AM">
                <EmptyChip />
              </RowCell>
              <RowCell staffName="Chandler Steffy" timeLabel="11:00 AM">
                <EventChip width="281px" bg="#f2ebf8" border="#8238bb" label="HVAC 6678 – Office Buildout" />
              </RowCell>
              <RowCell staffName="Bradley Lynch" timeLabel="11:00 AM" />
              <RowCell staffName="Moasfar Javed" timeLabel="11:00 AM">
                <EmptyChip />
                <EventChip width="235px" bg="#e5effd" border="#0063ec" label="MG 1102 – After Hours – Burst Pipe" />
              </RowCell>
            </div>

            {/* ───── 12:00 PM ───── */}
            <div className="flex flex-col w-[283px] flex-shrink-0 border-r border-solid border-[#dcdfe3]">
              <div className="relative self-stretch w-full h-10 bg-white border-b border-solid border-[#dcdfe3] flex items-center px-3">
                <span className="[font-family:'Inter',Helvetica] font-medium text-[#0e1828] text-sm">12:00 PM</span>
              </div>
              <RowCell staffName="Alan Thomas" timeLabel="12:00 PM">
                <EventChip width="282px" bg="#fcf1d9" border="#eca203" label="Saina Kitchen Plumbing – Residential Unit 3A" />
              </RowCell>
              <RowCell staffName="Michael Schaj" timeLabel="12:00 PM">
                <EmptyChip />
                <EventChip width="234px" bg="#fcf1d9" border="#eca203" label="Fire Alarm Testing – Corporate HQ" />
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
              </RowCell>
              <RowCell staffName="Anna Sorokin" timeLabel="12:00 PM">
                <EventChip width="357px" bg="#e5effd" border="#0063ec" label="ELEC 9903 – Unit 12B – Panel Upgrade" />
              </RowCell>
              <RowCell staffName="Connor Grace" timeLabel="12:00 PM" />
              <RowCell staffName="Carmen Flores" timeLabel="12:00 PM">
                <EventChip width="282px" bg="#f2ebf8" border="#8238bb" label="Saina 051476" />
              </RowCell>
              <RowCell staffName="Shamoil Soni" timeLabel="12:00 PM">
                <EmptyChip />
              </RowCell>
              <RowCell staffName="Chiara Bondesan" timeLabel="12:00 PM">
                <EventChip width="46px" bg="#f2ebf8" border="#8238bb" label="Saina 051476" />
                <EmptyChip />
                <EventChip width="188px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
              </RowCell>
              <RowCell staffName="Christy Blaker" timeLabel="12:00 PM">
                <EventChip width="143px" bg="#fcf1d9" border="#eca203" label="AS 3341 – Safety Audit" />
              </RowCell>
              <RowCell staffName="Adam Smith" timeLabel="12:00 PM" />
              <RowCell staffName="Daniyal Shamoon" timeLabel="12:00 PM">
                <EventChip width="282px" bg="#007c541a" border="#007c54" label="Kitchen Plumbing – Residential Unit 3A" />
              </RowCell>
              <RowCell staffName="Michele Rave" timeLabel="12:00 PM">
                <EventChip width="282px" bg="#e5effd" border="#0063ec" label="Gas Line Inspection – Safety Audit" />
              </RowCell>
              <RowCell staffName="Chandler Steffy" timeLabel="12:00 PM">
                <EmptyChip width="140px" />
                <EventChip width="141px" bg="#fcf1d9" border="#eca203" label="SRV 12058 – River North" />
              </RowCell>
              <RowCell staffName="Bradley Lynch" timeLabel="12:00 PM">
                <EmptyChip />
              </RowCell>
              <RowCell staffName="Moasfar Javed" timeLabel="12:00 PM">
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
                <EventChip width="46px" bg="#f2ebf8" border="#8238bb" label="Saina 051476" />
                <EmptyChip />
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
              </RowCell>
            </div>

            {/* ───── 01:00 PM ───── */}
            <div className="flex flex-col w-[283px] flex-shrink-0 border-r border-solid border-[#dcdfe3]">
              <div className="relative self-stretch w-full h-10 bg-white border-b border-solid border-[#dcdfe3] flex items-center px-3">
                <span className="[font-family:'Inter',Helvetica] font-medium text-[#0e1828] text-sm">01:00 PM</span>
              </div>
              <RowCell staffName="Alan Thomas" timeLabel="01:00 PM" />
              <RowCell staffName="Michael Schaj" timeLabel="01:00 PM">
                <EmptyChip />
                <EventChip width="234px" bg="#fcf1d9" border="#eca203" label="GEN 5521 – Warehouse District" />
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
              </RowCell>
              <RowCell staffName="Anna Sorokin" timeLabel="01:00 PM" />
              <RowCell staffName="Connor Grace" timeLabel="01:00 PM">
                <EventChip width="140px" bg="#007c541a" border="#007c54" label="Fire Alarm Testing – Corporate HQ" />
                <EventChip width="141px" bg="#007c541a" border="#007c54" label="Pipe Replacement – Building 221" />
              </RowCell>
              <RowCell staffName="Carmen Flores" timeLabel="01:00 PM">
                <EmptyChip />
              </RowCell>
              <RowCell staffName="Shamoil Soni" timeLabel="01:00 PM">
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Gas Line Inspection" />
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="AS 3341" />
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="GEN 5521" />
                <EventChip width="46px" bg="#f2ebf8" border="#8238bb" label="Saina 051476" />
                <EmptyChip />
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
              </RowCell>
              <RowCell staffName="Chiara Bondesan" timeLabel="01:00 PM">
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
                <EventChip width="46px" bg="#f2ebf8" border="#8238bb" label="Saina 051476" />
                <EmptyChip />
              </RowCell>
              <RowCell staffName="Christy Blaker" timeLabel="01:00 PM">
                <EventChip width="93px" bg="#fcf1d9" border="#eca203" label="GEN 5521 – Warehouse District" />
              </RowCell>
              <RowCell staffName="Adam Smith" timeLabel="01:00 PM" />
              <RowCell staffName="Daniyal Shamoon" timeLabel="01:00 PM" />
              <RowCell staffName="Michele Rave" timeLabel="01:00 PM" />
              <RowCell staffName="Chandler Steffy" timeLabel="01:00 PM">
                <EmptyChip />
              </RowCell>
              <RowCell staffName="Bradley Lynch" timeLabel="01:00 PM">
                <EventChip width="282px" bg="#fcf1d9" border="#eca203" label="SRV 8422 – Southside Block – Sewer Inspection" />
              </RowCell>
              <RowCell staffName="Moasfar Javed" timeLabel="01:00 PM">
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
                <EventChip width="46px" bg="#f2ebf8" border="#8238bb" label="Saina 051476" />
                <EmptyChip />
                <EventChip width="46px" bg="#fcf1d9" border="#eca203" label="Saina 051476" />
              </RowCell>
            </div>

            {/* Scrollbar indicator column */}
            <div className="inline-flex flex-col items-start self-stretch flex-shrink-0">
              <div className="flex flex-col h-10 items-start pl-[52px] pr-3 pt-0 pb-3 self-stretch w-full bg-white border-b border-solid border-[#dcdfe3]" />
              <div className="inline-flex h-[777px] items-start gap-2 p-1">
                <div className="w-2 h-[219px] bg-gray-400 rounded-lg" />
              </div>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </CalendarContext.Provider>
  );
};
