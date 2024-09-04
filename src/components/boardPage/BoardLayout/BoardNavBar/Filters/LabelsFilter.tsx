import { Checkbox } from "@/components/ui/checkbox";
import { IBoard } from "@/types/board.types";
import { Tag } from "lucide-react";
import ExpandLabels from "./ExpandLabels";

interface LabelsFilterProps {
  board: IBoard;
  searchParams: URLSearchParams;
  updateUrlParams: (key: string, values: string[]) => void;
}

function LabelsFilter({
  board,
  searchParams,
  updateUrlParams,
}: LabelsFilterProps) {
  const selectedLabelsFilters = searchParams.get("labels")?.split(",") || [];

  const firstLabels =
    board.labels.length > 3 ? board.labels.slice(0, 3) : [...board.labels];

  const toggleLabelSelection = (value: string) => {
    let updatedLabels = [...selectedLabelsFilters];

    if (updatedLabels.includes(value)) {
      updatedLabels = updatedLabels.filter((m) => m !== value);
    } else {
      updatedLabels.push(value);
    }
    updateUrlParams("labels", updatedLabels);
  };

  function isFilterSelected(filterValue: string) {
    const isSelected = selectedLabelsFilters.some((m) => m === filterValue);
    return isSelected ? true : false;
  }

  return (
    <div className=" mt-4">
      <h4 className=" my-4 mb-2 text-xs font-semibold">Labels</h4>
      <ul className=" space-y-1">
        <li
          className=" px-2 pt-2 flex items-center gap-4 cursor-pointer"
          onClick={() => toggleLabelSelection("empty")}
        >
          <Checkbox
            checked={isFilterSelected("empty")}
            color=""
            className=" border-text_dark_blue/50"
          />
          <div className=" flex gap-2">
            <div className=" bg-slate-100 h-6 w-6 rounded-full flex items-center justify-center">
              <Tag className=" text-slate-500" size={14} />
            </div>
            <p>No Labels</p>
          </div>
        </li>
        {firstLabels.map((label) => (
          <li
            key={label._id}
            className=" px-2 pt-2 flex items-center gap-4 cursor-pointer w-full"
            onClick={() => toggleLabelSelection(label._id)}
          >
            <Checkbox
              checked={isFilterSelected(label._id)}
              className=" border-text_dark_blue/50"
            />
            <div
              className=" flex w-full items-center bg-black rounded-sm h-8 px-3"
              style={{ backgroundColor: label.color }}
            >
              <p className=" text-text_dark_blue font-medium">{label.title}</p>
            </div>
          </li>
        ))}
        <ExpandLabels
          labels={board.labels}
          selectedLabelsFilters={selectedLabelsFilters}
          toggleLabelSelection={toggleLabelSelection}
        />
        {/* <ExpandedMembers
          selectedMembersFilters={selectedMembersFilters}
          toggleMemberSelection={toggleMemberSelection}
          loggedInUser={loggedInUser}
          members={board.members.filter(
            (member) => member.username !== loggedInUser.username
          )}
        /> */}
      </ul>
    </div>
  );
}

export default LabelsFilter;
