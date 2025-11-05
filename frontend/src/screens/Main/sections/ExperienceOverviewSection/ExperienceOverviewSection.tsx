import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

export const ExperienceOverviewSection = (): JSX.Element => {
  return (
    <header className="flex w-full items-center justify-between px-[124px] py-4 bg-[#f8f8f8] shadow-[0px_2px_16px_#0000001a]">
      <img
        className="w-[100px] h-[55px] object-cover"
        alt="Hdlogo"
        src="/hdlogo-1.png"
      />

      <div className="inline-flex items-center gap-4">
        <Input
          type="text"
          placeholder="Search experiences"
          className="w-[340px] bg-[#ececec] border-0 text-sm text-[#727272] placeholder:text-[#727272] focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <Button className="h-auto bg-[#ffd643] hover:bg-[#ffd643]/90 text-[#161616] font-medium text-sm px-5 py-3 rounded-lg">
          Search
        </Button>
      </div>
    </header>
  );
};
