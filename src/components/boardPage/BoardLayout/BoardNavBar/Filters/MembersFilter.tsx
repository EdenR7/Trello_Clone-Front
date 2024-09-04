import { Checkbox } from "@/components/ui/checkbox";
import MakeUserIcon from "@/utils/makeUserIcon";
import { User } from "lucide-react";
import ExpandedMembers from "./ExpandMembers";
import { LoggedInUser } from "@/providers/auth-provider";
import { IBoard } from "@/types/board.types";
// import { SetURLSearchParams } from "react-router-dom";

interface MembersFilterProps {
  board: IBoard;
  loggedInUser: LoggedInUser;
  searchParams: URLSearchParams;
  //   setSearchParams: SetURLSearchParams;
  updateUrlParams: (key: string, values: string[]) => void;
}

function MembersFilter({
  board,
  loggedInUser,
  searchParams,
  updateUrlParams,
}: MembersFilterProps) {
  const selectedMembersFilters = searchParams.get("members")?.split(",") || [];

  const toggleMemberSelection = (value: string) => {
    let updatedMembers = [...selectedMembersFilters];
    if (updatedMembers.includes(value)) {
      updatedMembers = updatedMembers.filter((m) => m !== value);
    } else {
      updatedMembers.push(value);
    }
    updateUrlParams("members", updatedMembers);
  };

  function isFilterSelected(filterValue: string) {
    const isSelected = selectedMembersFilters.some((m) => m === filterValue);
    return isSelected ? true : false;
  }

  return (
    <div className=" mt-4">
      <h4 className=" my-4 mb-2 text-xs font-semibold">Members</h4>
      <ul className=" space-y-3">
        <li
          className=" px-2 pt-2 flex items-center gap-4 cursor-pointer"
          onClick={() => toggleMemberSelection("empty")}
        >
          <Checkbox
            checked={isFilterSelected("empty")}
            color=""
            className=" border-text_dark_blue/50"
          />
          <div className=" flex gap-2">
            <div className=" bg-slate-100 h-6 w-6 rounded-full flex items-center justify-center">
              <User className=" text-slate-500" size={14} />
            </div>
            <p>No members</p>
          </div>
        </li>
        <li
          className=" px-2 pt-2 flex items-center gap-4 cursor-pointer"
          onClick={() => toggleMemberSelection(loggedInUser.username)}
        >
          <Checkbox
            checked={isFilterSelected(loggedInUser.username)}
            className=" border-text_dark_blue/50"
          />
          <div className=" flex gap-2">
            <MakeUserIcon user={loggedInUser} className=" h-6 w-6 text-xs" />
            <p className=" text-text_dark_blue">Cards assigned to me</p>
          </div>
        </li>
        <ExpandedMembers
          selectedMembersFilters={selectedMembersFilters}
          toggleMemberSelection={toggleMemberSelection}
          loggedInUser={loggedInUser}
          members={board.members.filter(
            (member) => member.username !== loggedInUser.username
          )}
        />
      </ul>
    </div>
  );
}

export default MembersFilter;
