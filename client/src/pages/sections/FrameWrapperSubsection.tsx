import { Card, CardContent } from "@/components/ui/card";

// Data for the 5 cards displayed in the horizontal row
const cardItems = [
  {
    title: "Saina 051476 - 25-1305-SAINA TEST-111118-coll",
    reference: "51476 - 25-1305",
    dateRange: "5/1/2025 08:05 PM - 5/1/2025 08:05 PM",
  },
  {
    title: "Saina 051476 - 25-1305-SAINA TEST-111118-coll",
    reference: "51476 - 25-1305",
    dateRange: "5/1/2025 08:05 PM - 5/1/2025 08:05 PM",
  },
  {
    title: "Saina 051476 - 25-1305-SAINA TEST-111118-coll",
    reference: "51476 - 25-1305",
    dateRange: "5/1/2025 08:05 PM - 5/1/2025 08:05 PM",
  },
  {
    title: "Saina 051476 - 25-1305-SAINA TEST-111118-coll",
    reference: "51476 - 25-1305",
    dateRange: "5/1/2025 08:05 PM - 5/1/2025 08:05 PM",
  },
  {
    title: "Saina 051476 - 25-1305-SAINA TEST-111118-coll",
    reference: "51476 - 25-1305",
    dateRange: "5/1/2025 08:05 PM - 5/1/2025 08:05 PM",
  },
];

export const FrameWrapperSubsection = (): JSX.Element => {
  return (
    <div className="flex flex-row items-center gap-2 w-full">
      {cardItems.map((item, index) => (
        <Card
          key={index}
          className="flex-shrink-0 bg-[#e6e7ec] rounded-lg overflow-hidden border-0 shadow-none"
        >
          <CardContent className="flex flex-col items-start justify-center gap-2 px-3 py-2.5">
            {/* Bold title line */}
            <p className="w-fit font-black text-[#252627] whitespace-nowrap [font-family:'Inter',Helvetica] text-xs tracking-[0] leading-4">
              {item.title}
            </p>
            {/* Reference number */}
            <p className="self-stretch font-normal text-black [font-family:'Inter',Helvetica] text-xs tracking-[0] leading-4">
              {item.reference}
            </p>
            {/* Date range */}
            <p className="self-stretch font-normal text-black [font-family:'Inter',Helvetica] text-xs tracking-[0] leading-4">
              {item.dateRange}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
