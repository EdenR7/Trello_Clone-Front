import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

function FilterDefinition() {
  const [filterDefinition, setFilterDefinition] = useState(
    localStorage.getItem("filterDefinition")
  );
  
  const [isOpen, setIsOpen] = useState(false);

  function changeFilterDefinition(
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    value: "Exact" | "Any"
  ) {
    ev.preventDefault();
    localStorage.setItem("filterDefinition", value);
    setFilterDefinition(value);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"naked"}
          className="font-normal h-10 flex justify-between items-center w-full px-2 py-2 border border-white hover:border-slate-400 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <p>{filterDefinition === "Exact" ? "Exact match" : "Any match"}</p>
          <ChevronDown size={14} strokeWidth={4} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="bottom"
        className="w-[246px] break-500px:w-[312px] max-h-64 overflow-y-auto rounded-lg py-2 px-0"
      >
        <DropdownMenuItem
          className={`pr-2 border-l-2 border-white text-text_dark_blue hover:border-blue-600 hover:bg-slate-200 cursor-pointer ${
            filterDefinition !== "Exact" &&
            "bg-blue-200 text-blue-600 border-blue-600 hover:bg-blue-200/60"
          }`}
          onClick={(e) => changeFilterDefinition(e, "Any")}
        >
          <div className=" w-full transition-colors">
            <h4>Any match</h4>
            <p className=" text-xs">Matches any label and any member</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`pr-2 border-l-2 text-text_dark_blue border-white hover:border-blue-600 hover:bg-slate-200 cursor-pointer ${
            filterDefinition === "Exact" &&
            "bg-blue-200 text-blue-600 border-blue-600 hover:bg-blue-200/60"
          }`}
          onClick={(e) => changeFilterDefinition(e, "Exact")}
        >
          <div className=" w-full transition-colors">
            <h4>Exact match</h4>
            <p className=" text-xs">Matches all label and all member</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default FilterDefinition;
