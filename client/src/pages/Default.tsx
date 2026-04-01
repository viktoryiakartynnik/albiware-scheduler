import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarSubsection } from "./sections/CalendarSubsection";
import { FrameSubsection } from "./sections/FrameSubsection";
import { FrameWrapperSubsection } from "./sections/FrameWrapperSubsection";
import { ViewControlsSubsection } from "./sections/ViewControlsSubsection";

// Sidebar navigation tab placeholders (5 tabs)
const sidebarTabs = [
  { alt: "Appbar tab 1" },
  { alt: "Appbar tab 2" },
  { alt: "Appbar tab 3" },
  { alt: "Appbar tab 4" },
  { alt: "Appbar tab 5" },
];

// Event cards data for the calendar overlay
const eventCards = [
  {
    top: "top-[465px]",
    left: "left-[181px]",
    width: "w-[1083px]",
    bg: "bg-[#ede2f5]",
    border: "border-[#8238bb]",
    label: "Saina 051476 - 25-1305-SAINA TEST-111118-call",
    overflow: false,
  },
  {
    top: "top-[745px]",
    left: "left-[747px]",
    width: "w-[564px]",
    bg: "bg-[#ede2f5]",
    border: "border-[#8238bb]",
    label: "HVAC 6678 – Office Buildout – Full Installation-s- 56-65-2323",
    overflow: false,
  },
  {
    top: "top-[425px]",
    left: "left-[1030px]",
    width: "w-[281px]",
    bg: "bg-[#ede2f5]",
    border: "border-[#8238bb]",
    label:
      "Gas Line Inspection – Safety Audit 051476 - 25-1305-SAINA TEST-111118-coll",
    overflow: true,
  },
  {
    top: "top-[665px]",
    left: "left-[181px]",
    width: "w-[564px]",
    bg: "bg-[#e5effd]",
    border: "border-[#0063ec]",
    label: "HVAC 6678 – Office Buildout – Full Installation-s- 56-65-2323",
    overflow: false,
  },
];

export const Default = (): JSX.Element => {
  return (
    <div className="w-[1440px] min-h-[1024px] flex gap-[21px] bg-[#f8f9fa] shadow-shadow-sm">
      {/* Left sidebar navigation */}
      <aside className="flex mt-[5px] w-[78px] min-h-[1019px] flex-col items-start bg-white flex-shrink-0">
        {/* Logo area */}
        <div className="relative self-stretch w-full h-[85px] rounded overflow-hidden flex items-center justify-center">
          <div className="flex flex-col w-10 h-10 items-center justify-center gap-0.5">
            <img className="w-10 h-10 object-cover" alt="Albi icon sky white" />
          </div>
        </div>

        {/* Navigation tabs */}
        {sidebarTabs.map((tab, index) => (
          <img key={index} className="self-stretch w-full h-12" alt={tab.alt} />
        ))}
      </aside>

      {/* Main content area */}
      <main className="mt-7 w-[1330px] min-h-[944px] relative">
        {/* FrameSubsection - top filter/search bar area */}
        <FrameSubsection />

        {/* Page title */}
        <h1 className="absolute top-[94px] left-0 font-black text-neutral-900 text-2xl leading-7 [font-family:'Inter',Helvetica] tracking-[0] whitespace-nowrap">
          Scheduler
        </h1>

        {/* Breadcrumb */}
        <nav className="absolute top-[60px] left-0 w-[1282px] [font-family:'Inter',Helvetica] font-semibold text-[#666666] text-sm tracking-[0] leading-5">
          Scheduler / Scheduling
        </nav>

        {/* Calendar section */}
        <CalendarSubsection />

        {/* Unassigned events label */}
        <div className="absolute top-[calc(50.00%_+_337px)] left-[calc(50.00%_-_665px)] h-5 flex items-center [font-family:'Inter',Helvetica] font-medium text-[#666666] text-xl tracking-[0] leading-5 whitespace-nowrap">
          Unassigned events
        </div>

        {/* View controls (week/day/month toggles etc.) */}
        <ViewControlsSubsection />

        {/* New Event button */}
        <Button
          className="inline-flex h-10 items-center gap-1 px-3 py-2 absolute top-[88px] right-0 bg-[#0065f4] hover:bg-[#0052c2] rounded-md border-0"
          style={{ height: "40px" }}
        >
          <PlusIcon className="w-5 h-5 text-gray-100" />
          <span className="font-medium text-gray-100 text-sm leading-5 [font-family:'Inter',Helvetica] tracking-[0] whitespace-nowrap">
            New Event
          </span>
        </Button>

        {/* Availability Search button */}
        <Button
          variant="outline"
          className="inline-flex h-10 items-center gap-1 px-3 py-2 absolute top-[88px] right-[132px] rounded-md border-2 border-solid border-[#0065f4] bg-transparent hover:bg-[#e5effd]"
          style={{ height: "40px" }}
        >
          <span className="font-medium text-[#0065f4] text-sm leading-5 [font-family:'Inter',Helvetica] tracking-[0] whitespace-nowrap">
            Availability Search
          </span>
        </Button>

        {/* FrameWrapperSubsection - resource/staff list on left side */}
        <FrameWrapperSubsection />

        {/* Event cards overlaid on the calendar */}
        {eventCards.map((card, index) => (
          <div
            key={index}
            className={`flex flex-col ${card.width} items-start justify-center pl-2 pr-0 pt-0.5 pb-1 absolute ${card.top} ${card.left} ${card.bg} overflow-hidden border-l-4 [border-left-style:solid] ${card.border} h-[37px] rounded`}
          >
            <div
              className={`${card.overflow ? "w-fit mr-[-183.00px]" : "w-fit"} font-bold text-[#252627] whitespace-nowrap relative [font-family:'Inter',Helvetica] text-xs tracking-[0] leading-4`}
            >
              {card.label}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};
