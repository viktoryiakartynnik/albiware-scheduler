import { useState } from "react";
import { ChevronDownIcon, SearchIcon, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import feedbackIcon from "@assets/feedback_1775055097972.png";
import notificationIcon from "@assets/notification_1775055097972.png";
import clockIcon from "@assets/time-clock_1775055097972.png";

export const FrameSubsection = (): JSX.Element => {
  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="flex w-full items-center justify-between">
      {/* Search bar */}
      <div className="relative flex-1 max-w-[441px]">
        <div className={`flex h-10 items-center gap-2 px-3.5 py-2 w-full bg-white rounded-md border border-solid transition-all ${
          searchFocused
            ? "border-[#93b9f9] shadow-[0_0_0_2px_rgba(0,101,244,0.08)]"
            : "border-[#e8e8e8]"
        }`}>
          <SearchIcon className={`w-4 h-4 flex-shrink-0 transition-colors ${searchFocused ? "text-[#0065f4]" : "text-[#9aa3b0]"}`} />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search names, phone numbers, and addresses"
            className="flex-1 bg-transparent text-sm font-medium text-[#0e1828] placeholder-[#9aa3b0] outline-none [font-family:'Inter',Helvetica]"
            data-testid="header-search-input"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="text-[#9aa3b0] hover:text-[#344153] transition-colors flex-shrink-0"
              data-testid="header-search-clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search results dropdown (when typing) */}
        {searchFocused && searchValue.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e8e8e8] rounded-lg shadow-lg z-50 py-1">
            <div className="px-3 py-2 text-xs font-semibold text-[#9ca3af] [font-family:'Inter',Helvetica]">
              Search results for "{searchValue}"
            </div>
            {["Alan Thomas", "Chiara Bondesan", "Adam Smith"].filter(n =>
              n.toLowerCase().includes(searchValue.toLowerCase())
            ).map(name => (
              <div
                key={name}
                className="px-3 py-2 flex items-center gap-2.5 hover:bg-[#f8f9fa] cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="w-6 h-6 rounded-full bg-[#344153] flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
                  {name.split(" ").map(p => p[0]).join("").slice(0,2)}
                </div>
                <span className="text-sm text-[#0e1828] font-medium [font-family:'Inter',Helvetica]">{name}</span>
              </div>
            ))}
            {["Alan Thomas", "Chiara Bondesan", "Adam Smith"].filter(n =>
              n.toLowerCase().includes(searchValue.toLowerCase())
            ).length === 0 && (
              <div className="px-3 py-2.5 text-sm text-[#9ca3af] [font-family:'Inter',Helvetica]">
                No results found
              </div>
            )}
          </div>
        )}
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
