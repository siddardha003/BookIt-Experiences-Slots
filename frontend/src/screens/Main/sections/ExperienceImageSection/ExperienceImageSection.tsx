import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const ExperienceImageSection = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col w-[280px] rounded-xl overflow-hidden">
      <div className="[background:url(..//frame-9-5.png)_50%_50%_/_cover] relative w-full h-[170px]" />

      <CardContent className="flex flex-col items-start gap-5 px-4 py-3 bg-[#f0f0f0]">
        <div className="flex flex-col items-start gap-3 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="[font-family:'Inter',Helvetica] font-medium text-[#161616] text-base tracking-[0] leading-5 whitespace-nowrap">
              Coffee Trail
            </div>

            <Badge className="inline-flex items-center justify-center gap-2.5 px-2 py-1 bg-[#d5d5d5] rounded hover:bg-[#d5d5d5]">
              <span className="mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-[#161616] text-[11px] tracking-[0] leading-4 whitespace-nowrap">
                Coorg
              </span>
            </Badge>
          </div>

          <div className="[font-family:'Inter',Helvetica] font-normal text-[#6c6c6c] text-xs tracking-[0] leading-4">
            Curated small-group experience. Certified guide. Safety first with
            gear included.
          </div>
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="inline-flex items-center gap-1.5">
            <div className="font-normal text-xs [font-family:'Inter',Helvetica] text-[#161616] tracking-[0] leading-4 whitespace-nowrap">
              From
            </div>

            <div className="mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-[#161616] text-xl tracking-[0] leading-6 whitespace-nowrap">
              ₹1299
            </div>
          </div>

          <Button
            onClick={() => navigate("/experience/1")}
            className="inline-flex items-center justify-center gap-2.5 px-2 py-1.5 h-auto bg-[#ffd643] rounded hover:bg-[#ffd643]/90"
          >
            <span className="mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-[#161616] text-sm tracking-[0] leading-[18px] whitespace-nowrap">
              View Details
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
