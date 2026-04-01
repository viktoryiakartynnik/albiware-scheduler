import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import feedbackIcon from "@assets/feedback_1775055097972.png";
import notificationIcon from "@assets/notification_1775055097972.png";
import clockIcon from "@assets/time-clock_1775055097972.png";

export const FrameSubsection = (): JSX.Element => {
  return (
    <div className="flex w-full items-center justify-between">
      {/* Search bar */}
      <div className="relative flex-1 max-w-[441px]">
        <div className="flex h-10 items-center gap-2 px-3.5 py-2.5 w-full bg-white rounded-md border-2 border-solid border-[#dedede] shadow-sm">
          <SearchIcon className="w-4 h-4 text-[#9aa3b0] flex-shrink-0" />
          <span className="font-medium text-[#9aa3b0] text-sm leading-6 [font-family:'Inter',Helvetica] tracking-[0] whitespace-nowrap">
            Search names, phone numbers, and addresses
          </span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="inline-flex h-10 items-center gap-2 flex-shrink-0">
        {/* Icon buttons */}
        <div className="inline-flex h-10 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded flex items-center justify-center hover:bg-[#f3f4f6]"
            title="Feedback"
          >
            <img src={feedbackIcon} alt="Feedback" className="w-5 h-5 object-contain" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded flex items-center justify-center hover:bg-[#f3f4f6]"
            title="Notifications"
          >
            <img src={notificationIcon} alt="Notifications" className="w-5 h-5 object-contain" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded flex items-center justify-center hover:bg-[#f3f4f6]"
            title="Time"
          >
            <img src={clockIcon} alt="Time" className="w-5 h-5 object-contain" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* User profile */}
        <div className="gap-1 pl-2 pr-1 py-1.5 bg-white rounded inline-flex h-10 items-center cursor-pointer hover:bg-[#f9fafb] transition-colors">
          <div className="inline-flex items-center gap-2">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="text-xs font-semibold bg-[#344153] text-white">
                SP
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-[#344153] text-xs leading-5 [font-family:'Inter',Helvetica] tracking-[0] whitespace-nowrap">
              Steph Pro User
            </span>
          </div>
          <ChevronDownIcon className="w-4 h-4 text-[#344153]" />
        </div>
      </div>
    </div>
  );
};
