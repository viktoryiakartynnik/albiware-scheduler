import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const FrameSubsection = (): JSX.Element => {
  return (
    <div className="flex w-full items-center justify-between">
      {/* SearchIcon bar */}
      <div className="relative flex-1 max-w-[441px]">
        <div className="flex h-10 items-center gap-2 px-3.5 py-2.5 w-full bg-basewhite rounded-md border-2 border-solid border-[#dedede] shadow-shadow-xs">
          <SearchIcon className="w-4 h-4 text-[#9aa3b0] flex-shrink-0" />
          <span className="font-medium text-[#9aa3b0] text-base leading-6 [font-family:'Inter',Helvetica] tracking-[0] whitespace-nowrap">
            SearchIcon names, phone numbers, and addrresses
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
            className="w-9 h-9 rounded flex items-center justify-center"
          >
            <span className="w-5 h-5 flex items-center justify-center text-[#344153]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 5h14M3 10h14M3 15h14"
                  stroke="#344153"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded flex items-center justify-center"
          >
            <span className="w-5 h-5 flex items-center justify-center text-[#344153]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="3"
                  width="6"
                  height="6"
                  rx="1"
                  stroke="#344153"
                  strokeWidth="1.5"
                />
                <rect
                  x="11"
                  y="3"
                  width="6"
                  height="6"
                  rx="1"
                  stroke="#344153"
                  strokeWidth="1.5"
                />
                <rect
                  x="3"
                  y="11"
                  width="6"
                  height="6"
                  rx="1"
                  stroke="#344153"
                  strokeWidth="1.5"
                />
                <rect
                  x="11"
                  y="11"
                  width="6"
                  height="6"
                  rx="1"
                  stroke="#344153"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded flex items-center justify-center"
          >
            <span className="w-5 h-5 flex items-center justify-center text-[#344153]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="5" r="1.5" fill="#344153" />
                <circle cx="10" cy="10" r="1.5" fill="#344153" />
                <circle cx="10" cy="15" r="1.5" fill="#344153" />
              </svg>
            </span>
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* User profile */}
        <div className="gap-1 pl-2 pr-1 py-1.5 bg-white rounded inline-flex h-10 items-center cursor-pointer">
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
