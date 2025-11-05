import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const ExperienceListSection = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <Card className="w-[280px] overflow-hidden rounded-xl border-0 shadow-none">
      <div className="bg-[url(/frame-9-7.svg)] bg-cover bg-[50%_50%] w-full h-[170px]" />

      <CardContent className="flex flex-col items-start gap-5 p-4 bg-[#f0f0f0]">
        <div className="flex flex-col items-start gap-3 w-full">
          <div className="flex items-center justify-between w-full">
            <h3 className="[font-family:'Inter',Helvetica] font-medium text-[#161616] text-base tracking-[0] leading-5 whitespace-nowrap">
              Nandi Hills Sunrise
            </h3>

            <Badge className="h-auto px-2 py-1 bg-[#d5d5d5] hover:bg-[#d5d5d5] rounded">
              <span className="font-medium text-[11px] [font-family:'Inter',Helvetica] text-[#161616] tracking-[0] leading-4 whitespace-nowrap">
                Bangalore
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
            <span className="font-normal text-xs [font-family:'Inter',Helvetica] text-[#161616] tracking-[0] leading-4 whitespace-nowrap">
              From
            </span>

            <span className="mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-[#161616] text-xl tracking-[0] leading-6 whitespace-nowrap">
              ₹899
            </span>
          </div>

          <Button
            onClick={() => navigate("/experience/1")}
            className="h-auto px-2 py-1.5 bg-[#ffd643] hover:bg-[#ffd643]/90 rounded"
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
