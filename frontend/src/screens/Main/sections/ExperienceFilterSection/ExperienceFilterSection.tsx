import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const ExperienceFilterSection = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <Card className="w-[280px] overflow-hidden rounded-xl border-0 shadow-none">
      <div className="[background:url(..//frame-9-1.png)_50%_50%_/_cover] w-full h-[170px]" />

      <CardContent className="flex flex-col items-start gap-5 p-4 bg-[#f0f0f0]">
        <div className="flex flex-col items-start gap-3 w-full">
          <div className="flex items-center justify-between w-full">
            <h3 className="[font-family:'Inter',Helvetica] font-medium text-[#161616] text-base tracking-[0] leading-5 whitespace-nowrap">
              Coffee Trail
            </h3>

            <Badge className="bg-[#d5d5d5] hover:bg-[#d5d5d5] text-[#161616] px-2 py-1 rounded h-auto">
              <span className="[font-family:'Inter',Helvetica] font-medium text-[11px] tracking-[0] leading-4 whitespace-nowrap">
                Coorg
              </span>
            </Badge>
          </div>

          <p className="[font-family:'Inter',Helvetica] font-normal text-[#6c6c6c] text-xs tracking-[0] leading-4">
            Curated small-group experience. Certified guide. Safety first with
            gear included.
          </p>
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="inline-flex items-center gap-1.5">
            <span className="[font-family:'Inter',Helvetica] font-normal text-xs text-[#161616] tracking-[0] leading-4 whitespace-nowrap">
              From
            </span>

            <span className="[font-family:'Inter',Helvetica] font-medium text-[#161616] text-xl tracking-[0] leading-6 whitespace-nowrap">
              ₹1299
            </span>
          </div>

          <Button
            onClick={() => navigate("/experience/1")}
            className="bg-[#ffd643] hover:bg-[#ffd643]/90 text-[#161616] px-2 py-1.5 rounded h-auto"
          >
            <span className="[font-family:'Inter',Helvetica] font-medium text-sm tracking-[0] leading-[18px] whitespace-nowrap">
              View Details
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
