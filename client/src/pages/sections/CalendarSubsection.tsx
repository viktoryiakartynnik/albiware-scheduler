import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Staff names data
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

// Reusable event chip component
interface EventChipProps {
  width: string;
  bg: string;
  border: string;
  label: string;
}

const EventChip = ({ width, bg, border, label }: EventChipProps) => (
  <div
    className={`flex flex-col items-start justify-center pl-2 pr-0 pt-0.5 pb-1 relative overflow-hidden border-l-4 border-solid h-[37px] rounded flex-shrink-0`}
    style={{ width, backgroundColor: bg, borderLeftColor: border }}
  >
    <div className="w-fit font-bold text-[#252627] whitespace-nowrap [font-family:'Inter',Helvetica] text-xs tracking-[0] leading-4">
      {label}
    </div>
  </div>
);

// Empty spacer chip
const EmptyChip = ({ width = "46px" }: { width?: string }) => (
  <div className="flex-shrink-0 h-[37px] rounded" style={{ width }} />
);

// Row cell wrapper
const RowCell = ({ children }: { children?: React.ReactNode }) => (
  <div className="relative self-stretch w-full h-10 bg-gray-100 border-b border-solid border-[#dbdee3]">
    {children && (
      <div className="inline-flex h-[37px] items-center gap-px relative top-px">
        {children}
      </div>
    )}
  </div>
);

export const CalendarSubsection = (): JSX.Element => {
  return (
    <div className="w-full border border-solid border-[#e8e8e8] flex items-start overflow-hidden">
      {/* Left sticky names column */}
      <div className="flex flex-col w-[181px] flex-shrink-0 items-start border-r border-solid border-[#dbdee3]">
        {/* Header empty cell */}
        <div className="relative self-stretch w-full h-10 bg-gray-100 border-b border-solid border-[#dbdee3]" />
        {/* Staff name rows */}
        {staffNames.map((name) => (
          <div
            key={name}
            className="relative self-stretch w-full h-10 bg-gray-100 border-b border-solid border-[#dbdee3] flex items-center px-3"
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
          {/* 10:00 AM Column */}
          <div className="flex flex-col w-[283px] flex-shrink-0 border-r border-solid border-[#dbdee3]">
            {/* Time header */}
            <div className="relative self-stretch w-full h-10 bg-gray-100 border-b border-solid border-[#dbdee3] flex items-center px-3">
              <span className="[font-family:'Inter',Helvetica] font-medium text-[#0e1828] text-sm tracking-[0] leading-5 whitespace-nowrap">
                10:00 AM
              </span>
            </div>
            {/* Row 1 - Alan Thomas */}
            <RowCell>
              <EventChip
                width="282px"
                bg="#fcf1d9"
                border="#eca203"
                label="PRJ 3057 – Building 221 – Pipe Replacement 051476 - 25-1305-SAINA TEST-111118-coll"
              />
            </RowCell>
            {/* Row 2 - Michael Schaj */}
            <RowCell>
              <EmptyChip />
              <EventChip
                width="234px"
                bg="#e5effd"
                border="#0063ec"
                label="PN 1045 – Lakeshore Plumbing Upgrade"
              />
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
            </RowCell>
            {/* Row 3 - Anna Sorokin */}
            <div className="relative self-stretch w-full h-10 bg-gray-100 border-b border-solid border-[#dbdee3]">
              <div className="flex flex-col w-[357px] items-start justify-center pl-2 pr-0 pt-0.5 pb-1 relative top-px bg-[#e5f1ed] overflow-hidden border-l-4 border-solid border-[#007c54] h-[37px] rounded">
                <div className="w-fit font-bold text-[#252627] whitespace-nowrap [font-family:'Inter',Helvetica] text-xs tracking-[0] leading-4">
                  Gas Line Inspection – Safety Audit
                </div>
              </div>
            </div>
            {/* Row 4 - Connor Grace - empty */}
            <RowCell />
            {/* Row 5 - Carmen Flores */}
            <RowCell>
              <EventChip
                width="46px"
                bg="#e5effd"
                border="#0063ec"
                label="GEN 5521 – Warehouse District – Generator Check 051476 - 25-1305-SAINA TEST-111118-coll"
              />
            </RowCell>
            {/* Row 6 - Shamoil Soni - empty */}
            <RowCell />
            {/* Row 7 - Chiara Bondesan */}
            <RowCell>
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EventChip
                width="46px"
                bg="#f2ebf8"
                border="#8238bb"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EmptyChip />
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
            </RowCell>
            {/* Row 8 - Christy Blaker */}
            <RowCell>
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="SRV 12058 – River North Complex – Drain Cleaning"
              />
              <EmptyChip />
            </RowCell>
            {/* Row 9 - Adam Smith */}
            <RowCell>
              <EventChip
                width="140px"
                bg="#007c541a"
                border="#007c54"
                label="PRJ 3057 – Building 221 – Pipe Replacement"
              />
            </RowCell>
            {/* Row 10 - Daniyal Shamoon */}
            <RowCell>
              <EventChip
                width="282px"
                bg="#fcf1d9"
                border="#eca203"
                label="GEN 5521 – Warehouse District – Generator Check"
              />
            </RowCell>
            {/* Row 11 - Michele Rave */}
            <RowCell>
              <EmptyChip />
            </RowCell>
            {/* Row 12 - Chandler Steffy */}
            <RowCell>
              <EventChip
                width="283px"
                bg="#f2ebf8"
                border="#8238bb"
                label="HVAC 6678 – Office Buildout – Full Installation-s"
              />
            </RowCell>
            {/* Row 13 - Bradley Lynch */}
            <RowCell>
              <EmptyChip width="186px" />
              <EventChip
                width="95px"
                bg="#007c541a"
                border="#007c54"
                label="PRJ 3057 – Building 221 – Pipe Replacement"
              />
            </RowCell>
            {/* Row 14 - Moasfar Javed */}
            <RowCell>
              <EventChip
                width="283px"
                bg="#007c541a"
                border="#007c54"
                label="JOB 6583945 – 25-1305 – SAINA TEST–1123-call"
              />
            </RowCell>
          </div>

          {/* 11:00 AM Column */}
          <div className="flex flex-col w-[283px] flex-shrink-0 border-r border-solid border-[#dbdee3]">
            {/* Time header */}
            <div className="relative self-stretch w-full h-10 bg-gray-100 border-b border-solid border-[#dbdee3] flex items-center px-3">
              <span className="[font-family:'Inter',Helvetica] font-medium text-[#0e1828] text-sm tracking-[0] leading-5 whitespace-nowrap">
                11:00 AM
              </span>
            </div>
            {/* Row 1 - Alan Thomas */}
            <RowCell>
              <EventChip
                width="282px"
                bg="#f2ebf8"
                border="#8238bb"
                label="AS 3341 – Safety Audit – Line Inspection"
              />
            </RowCell>
            {/* Row 2 - Michael Schaj */}
            <div className="relative self-stretch w-full h-10 bg-gray-100 border-b border-solid border-[#dbdee3]">
              <div className="flex w-[282px] h-[37px] items-center gap-px relative top-px">
                <EmptyChip />
                <EventChip
                  width="94px"
                  bg="#fcf1d9"
                  border="#eca203"
                  label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
                />
              </div>
            </div>
            {/* Row 3 - Anna Sorokin */}
            <RowCell>
              <EventChip
                width="234px"
                bg="#fcf1d9"
                border="#eca203"
                label="JOB 7712 – Elmwood Ave – Kitchen Plumbing"
              />
            </RowCell>
            {/* Row 4 - Connor Grace - empty */}
            <RowCell />
            {/* Row 5 - Carmen Flores */}
            <RowCell>
              <EmptyChip />
              <EventChip
                width="236px"
                bg="#007c541a"
                border="#007c54"
                label="Gas Line Inspection – Safety Audit"
              />
            </RowCell>
            {/* Row 6 - Shamoil Soni - empty */}
            <RowCell />
            {/* Row 7 - Chiara Bondesan */}
            <RowCell>
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EventChip
                width="46px"
                bg="#f2ebf8"
                border="#8238bb"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EventChip
                width="46px"
                bg="#f2ebf8"
                border="#8238bb"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EmptyChip />
            </RowCell>
            {/* Row 8 - Christy Blaker - empty */}
            <RowCell />
            {/* Row 9 - Adam Smith */}
            <RowCell>
              <EventChip
                width="282px"
                bg="#007c541a"
                border="#007c54"
                label="SRV 12058 – River North Complex – Drain Cleaning"
              />
            </RowCell>
            {/* Row 10 - Daniyal Shamoon */}
            <RowCell>
              <EmptyChip />
            </RowCell>
            {/* Row 11 - Michele Rave */}
            <RowCell>
              <EmptyChip />
            </RowCell>
            {/* Row 12 - Chandler Steffy */}
            <RowCell>
              <EventChip
                width="281px"
                bg="#f2ebf8"
                border="#8238bb"
                label="HVAC 6678 – Office Buildout – Full Installation-87"
              />
            </RowCell>
            {/* Row 13 - Bradley Lynch - empty */}
            <RowCell />
            {/* Row 14 - Moasfar Javed */}
            <RowCell>
              <EmptyChip />
              <EventChip
                width="235px"
                bg="#e5effd"
                border="#0063ec"
                label="MG 1102 – After Hours – Burst Pipe Response"
              />
            </RowCell>
          </div>

          {/* 12:00 AM Column */}
          <div className="flex flex-col w-[283px] flex-shrink-0 border-r border-solid border-[#dbdee3]">
            {/* Time header */}
            <div className="relative self-stretch w-full h-10 bg-gray-100 border-b border-solid border-[#dbdee3] flex items-center px-3">
              <span className="[font-family:'Inter',Helvetica] font-medium text-[#0e1828] text-sm tracking-[0] leading-5 whitespace-nowrap">
                12:00 AM
              </span>
            </div>
            {/* Row 1 - Alan Thomas */}
            <RowCell>
              <EventChip
                width="282px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina Kitchen Plumbing – Residential Unit 3A - 25-1305-SAINA TEST-111118-coll"
              />
            </RowCell>
            {/* Row 2 - Michael Schaj */}
            <RowCell>
              <EmptyChip />
              <EventChip
                width="234px"
                bg="#fcf1d9"
                border="#eca203"
                label="Fire Alarm Testing – Corporate HQ - 3545-"
              />
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
            </RowCell>
            {/* Row 3 - Anna Sorokin */}
            <RowCell>
              <EventChip
                width="357px"
                bg="#e5effd"
                border="#0063ec"
                label="ELEC 9903 – Unit 12B – Panel Upgrade- 45-67-162-"
              />
            </RowCell>
            {/* Row 4 - Connor Grace - empty */}
            <RowCell />
            {/* Row 5 - Carmen Flores */}
            <RowCell>
              <EventChip
                width="282px"
                bg="#f2ebf8"
                border="#8238bb"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
            </RowCell>
            {/* Row 6 - Shamoil Soni */}
            <RowCell>
              <EmptyChip />
            </RowCell>
            {/* Row 7 - Chiara Bondesan */}
            <RowCell>
              <EventChip
                width="46px"
                bg="#f2ebf8"
                border="#8238bb"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EmptyChip />
              <EventChip
                width="188px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
            </RowCell>
            {/* Row 8 - Christy Blaker */}
            <RowCell>
              <EventChip
                width="143px"
                bg="#fcf1d9"
                border="#eca203"
                label="AS 3341 – Safety Audit – Line Inspection"
              />
            </RowCell>
            {/* Row 9 - Adam Smith - empty */}
            <RowCell />
            {/* Row 10 - Daniyal Shamoon */}
            <RowCell>
              <EventChip
                width="282px"
                bg="#007c541a"
                border="#007c54"
                label="Kitchen Plumbing – Residential Unit 3A - 45-5657-"
              />
            </RowCell>
            {/* Row 11 - Michele Rave */}
            <RowCell>
              <EventChip
                width="282px"
                bg="#e5effd"
                border="#0063ec"
                label="Gas Line Inspection – Safety Audit - 25-1305-89"
              />
            </RowCell>
            {/* Row 12 - Chandler Steffy */}
            <RowCell>
              <EmptyChip width="140px" />
              <EventChip
                width="141px"
                bg="#fcf1d9"
                border="#eca203"
                label="SRV 12058 – River North Complex – Drain Cleaning"
              />
            </RowCell>
            {/* Row 13 - Bradley Lynch */}
            <RowCell>
              <EmptyChip />
            </RowCell>
            {/* Row 14 - Moasfar Javed */}
            <RowCell>
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EventChip
                width="46px"
                bg="#f2ebf8"
                border="#8238bb"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EmptyChip />
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
            </RowCell>
          </div>

          {/* 01:00 PM Column */}
          <div className="flex flex-col w-[283px] flex-shrink-0 border-r border-solid border-[#dbdee3]">
            {/* Time header */}
            <div className="relative self-stretch w-full h-10 bg-gray-100 border-b border-solid border-[#dbdee3] flex items-center px-3">
              <span className="[font-family:'Inter',Helvetica] font-medium text-[#0e1828] text-sm tracking-[0] leading-5 whitespace-nowrap">
                01:00 PM
              </span>
            </div>
            {/* Row 1 - Alan Thomas - empty */}
            <RowCell />
            {/* Row 2 - Michael Schaj */}
            <RowCell>
              <EmptyChip />
              <EventChip
                width="234px"
                bg="#fcf1d9"
                border="#eca203"
                label="GEN 5521 – Warehouse District – Generator Check"
              />
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
            </RowCell>
            {/* Row 3 - Anna Sorokin - empty */}
            <RowCell />
            {/* Row 4 - Connor Grace */}
            <RowCell>
              <EventChip
                width="140px"
                bg="#007c541a"
                border="#007c54"
                label="Fire Alarm Testing – Corporate HQ - 3545- 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EventChip
                width="141px"
                bg="#007c541a"
                border="#007c54"
                label="Pipe Replacement – Building 221"
              />
            </RowCell>
            {/* Row 5 - Carmen Flores */}
            <RowCell>
              <EmptyChip />
            </RowCell>
            {/* Row 6 - Shamoil Soni */}
            <RowCell>
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Gas Line Inspection – Safety Audit 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="AS 3341 – Safety Audit – Line InspectionAS 3341 – Safety Audit – Line Inspection"
              />
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="GEN 5521 – Warehouse District – Generator Check 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EventChip
                width="46px"
                bg="#f2ebf8"
                border="#8238bb"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EmptyChip />
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
            </RowCell>
            {/* Row 7 - Chiara Bondesan */}
            <RowCell>
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EventChip
                width="46px"
                bg="#f2ebf8"
                border="#8238bb"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EmptyChip />
            </RowCell>
            {/* Row 8 - Christy Blaker */}
            <RowCell>
              <EventChip
                width="93px"
                bg="#fcf1d9"
                border="#eca203"
                label="GEN 5521 – Warehouse District – Generator Check"
              />
            </RowCell>
            {/* Row 9 - Adam Smith - empty */}
            <RowCell />
            {/* Row 10 - Daniyal Shamoon - empty */}
            <RowCell />
            {/* Row 11 - Michele Rave - empty */}
            <RowCell />
            {/* Row 12 - Chandler Steffy */}
            <RowCell>
              <EmptyChip />
            </RowCell>
            {/* Row 13 - Bradley Lynch */}
            <RowCell>
              <EventChip
                width="282px"
                bg="#fcf1d9"
                border="#eca203"
                label="SRV 8422 – Southside Block – Sewer Inspection 051476 - 25-1305-SAINA TEST-111118-coll"
              />
            </RowCell>
            {/* Row 14 - Moasfar Javed */}
            <RowCell>
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EventChip
                width="46px"
                bg="#f2ebf8"
                border="#8238bb"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
              <EmptyChip />
              <EventChip
                width="46px"
                bg="#fcf1d9"
                border="#eca203"
                label="Saina 051476 - 25-1305-SAINA TEST-111118-coll"
              />
            </RowCell>
          </div>

          {/* Scrollbar indicator column */}
          <div className="inline-flex flex-col items-start self-stretch flex-shrink-0">
            <div className="flex flex-col h-10 items-start pl-[52px] pr-3 pt-0 pb-3 self-stretch w-full bg-gray-100 border-b border-solid border-[#dbdee3]" />
            <div className="inline-flex h-[777px] items-start gap-2 p-1">
              <div className="w-2 h-[219px] bg-gray-400 rounded-lg" />
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
