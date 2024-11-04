import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ILabel } from "@/types/board.types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

interface ExpandedMembersProps {
  labels: ILabel[];
  toggleLabelSelection: (value: string) => void;
  selectedLabelsFilters: string[];
}

function ExpandLabels({
  labels,
  toggleLabelSelection,
  selectedLabelsFilters,
}: ExpandedMembersProps) {
  const [_, setSearchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  const selectedLabelsCount = selectedLabelsFilters.reduce((acc, filter) => {
    if (filter === "empty") return acc;
    return acc + 1;
  }, 0);

  function isLabelSelected(label: ILabel) {
    const isSelected = selectedLabelsFilters.find((m) => m === label._id);

    return isSelected ? true : false;
  }

  function toggleAllLabels() {
    if (selectedLabelsCount > 0) {
      setSearchParams((params) => {
        params.delete("labels");
        return params;
      });
    } else {
      const allLabelsIds = labels.map((label) => label._id);
      setSearchParams((params) => {
        params.set("labels", allLabelsIds.join(","));
        return params;
      });
    }
  }

  const handleSelect = (e: React.MouseEvent, value: ILabel) => {
    e.preventDefault();
    toggleLabelSelection(value._id);
  };

  return (
    <li className=" px-2 flex items-center gap-4 w-full">
      <Checkbox
        onClick={toggleAllLabels}
        checked={selectedLabelsCount > 0}
        className=" border-text_dark_blue/50"
      />
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"naked"}
            className="font-normal h-10 flex justify-between items-center w-full px-2 py-2 border border-white hover:border-slate-400 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>
              {selectedLabelsCount > 0
                ? `${selectedLabelsCount} labels selected`
                : "Select labels"}
            </span>
            <ChevronDown size={14} strokeWidth={4} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="bottom"
          className="w-[246px] break-500px:w-[312px] max-h-64 overflow-y-auto rounded-lg py-2 px-0"
        >
          {labels.map((label) => {
            return (
              <DropdownMenuItem
                className="pr-2 border-l-2 border-white hover:border-blue-600 hover:bg-slate-200 cursor-pointer"
                key={label._id}
                onClick={(e) => handleSelect(e, label)}
              >
                <div className=" w-full flex items-center pl-3 gap-3 transition-colors text-text_dark_blue">
                  <Checkbox
                    checked={isLabelSelected(label)}
                    className="border-text_dark_blue/50 h-4 w-4"
                  />
                  <div
                    className=" flex w-full items-center bg-black rounded-sm h-8 px-3"
                    style={{ backgroundColor: label.color }}
                  >
                    <p className=" text-text_dark_blue font-medium">
                      {label.title}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}

export default ExpandLabels;
