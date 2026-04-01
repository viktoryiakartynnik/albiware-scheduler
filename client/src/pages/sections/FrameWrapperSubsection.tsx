import { useState } from "react";

const UNASSIGNED_COLORS = [
  { bg: "#fcf1d9", border: "#eca203" },
  { bg: "#e5effd", border: "#0063ec" },
  { bg: "#f2ebf8", border: "#8238bb" },
  { bg: "#e5f1ed", border: "#007c54" },
  { bg: "#fcf1d9", border: "#eca203" },
];

const cardItems = [
  {
    title: "Saina 051476 - 25-1305-SAINA TEST-111118-coll",
    reference: "51476 - 25-1305",
    dateRange: "5/1/2025 08:05 PM - 5/1/2025 08:05 PM",
  },
  {
    title: "PRJ 3057 – Building 221 – Pipe Replacement",
    reference: "PRJ-3057",
    dateRange: "5/1/2025 09:00 AM - 5/1/2025 11:00 AM",
  },
  {
    title: "GEN 5521 – Warehouse District Inspection",
    reference: "GEN-5521",
    dateRange: "5/1/2025 01:00 PM - 5/1/2025 02:00 PM",
  },
  {
    title: "HVAC Check – Midtown Tower Unit 4B",
    reference: "HVAC-4401",
    dateRange: "5/1/2025 03:00 PM - 5/1/2025 04:00 PM",
  },
  {
    title: "Emergency Call – Burst Pipe – River North",
    reference: "SRV-12058",
    dateRange: "5/1/2025 04:30 PM - 5/1/2025 05:30 PM",
  },
];

interface FrameWrapperSubsectionProps {
  onCardAssigned?: (cardIndex: number) => void;
}

export const FrameWrapperSubsection = ({ onCardAssigned }: FrameWrapperSubsectionProps): JSX.Element => {
  const [assignedCards, setAssignedCards] = useState<Set<number>>(new Set());
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const markAssigned = (idx: number) => {
    setAssignedCards((prev) => new Set([...prev, idx]));
    onCardAssigned?.(idx);
  };

  return (
    <div className="flex flex-row items-start gap-2 w-full flex-wrap">
      {cardItems.map((item, index) => {
        const color = UNASSIGNED_COLORS[index % UNASSIGNED_COLORS.length];
        const isAssigned = assignedCards.has(index);
        const isDragging = draggingIdx === index;

        return (
          <div
            key={index}
            draggable={!isAssigned}
            onDragStart={(e) => {
              if (isAssigned) return;
              setDraggingIdx(index);
              const payload = JSON.stringify({
                title: item.title,
                reference: item.reference,
                dateRange: item.dateRange,
                color,
              });
              e.dataTransfer.setData("unassigned", payload);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => setDraggingIdx(null)}
            className={`flex-shrink-0 rounded-lg border-l-4 bg-white shadow-sm select-none transition-all duration-150 ${
              isAssigned
                ? "opacity-40 cursor-not-allowed"
                : isDragging
                ? "opacity-50 scale-95 cursor-grabbing shadow-lg ring-2 ring-[#0065f4]/30"
                : "cursor-grab hover:shadow-md hover:-translate-y-0.5"
            }`}
            style={{ borderLeftColor: color.border, minWidth: 200, maxWidth: 260 }}
            data-testid={`unassigned-card-${index}`}
          >
            <div className="flex flex-col items-start gap-1.5 px-3 py-2.5">
              <div className="flex items-center gap-1.5 w-full">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color.border }}
                />
                <p className="font-black text-[#252627] [font-family:'Inter',Helvetica] text-[11px] tracking-[0] leading-4 truncate flex-1">
                  {item.title}
                </p>
              </div>
              <p className="font-semibold text-[#6b7280] [font-family:'Inter',Helvetica] text-[10px] tracking-[0] leading-4">
                {item.reference}
              </p>
              <p className="text-[#9ca3af] [font-family:'Inter',Helvetica] text-[10px] tracking-[0] leading-4">
                {item.dateRange}
              </p>
              {isAssigned ? (
                <span className="text-[9px] font-bold text-[#059669] bg-[#d1fae5] px-1.5 py-0.5 rounded-full">
                  ✓ Assigned
                </span>
              ) : (
                <span className="text-[9px] text-[#9ca3af] [font-family:'Inter',Helvetica] italic">
                  Drag to grid to assign
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { cardItems };
