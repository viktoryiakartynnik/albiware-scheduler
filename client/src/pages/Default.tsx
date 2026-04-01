import { PlusIcon, CalendarIcon, UsersIcon, BriefcaseIcon, MapPinIcon, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarSubsection } from "./sections/CalendarSubsection";
import { FrameSubsection } from "./sections/FrameSubsection";
import { FrameWrapperSubsection } from "./sections/FrameWrapperSubsection";
import { ViewControlsSubsection } from "./sections/ViewControlsSubsection";

const navItems = [
  { icon: CalendarIcon, label: "Scheduler", active: true },
  { icon: UsersIcon, label: "Customers" },
  { icon: BriefcaseIcon, label: "Jobs" },
  { icon: MapPinIcon, label: "Map" },
  { icon: SettingsIcon, label: "Settings" },
];

const eventCards = [
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
    label: "Gas Line Inspection – Safety Audit 051476 - 25-1305-SAINA TEST-111118-coll",
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

export const Default = (): JSX.Element => {
  return (
    <div className="w-[1440px] min-h-[1024px] flex gap-[21px] bg-[#f8f9fa] shadow-shadow-sm">
      {/* Left sidebar navigation */}
      <aside className="flex mt-[5px] w-[78px] min-h-[1019px] flex-col items-center bg-white border-r border-[#e8e8e8] flex-shrink-0 pt-3">
        {/* Logo area */}
        <div className="flex items-center justify-center w-full h-[85px]">
          <div className="w-10 h-10 rounded-lg bg-[#0065f4] flex items-center justify-center shadow-md">
            <span className="text-white font-black text-sm leading-none select-none">A</span>
          </div>
        </div>

        {/* Navigation tabs */}
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
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium leading-none">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content area */}
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
          className="inline-flex h-10 items-center gap-1 px-3 py-2 absolute top-[88px] right-0 bg-[#0065f4] hover:bg-[#0052c2] rounded-md border-0"
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
        >
          <span className="font-medium text-[#0065f4] text-sm leading-5 [font-family:'Inter',Helvetica] tracking-[0] whitespace-nowrap">
            Availability Search
          </span>
        </Button>

        {/* View controls (date nav + Day/Week/Month/Agenda toggles) */}
        <div className="absolute top-[136px] left-0 right-0">
          <ViewControlsSubsection />
        </div>

        {/* Calendar section */}
        <div className="absolute top-[184px] left-0 right-0">
          <CalendarSubsection />
        </div>

        {/* Event overlay cards */}
        {eventCards.map((card, index) => (
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
    </div>
  );
};
