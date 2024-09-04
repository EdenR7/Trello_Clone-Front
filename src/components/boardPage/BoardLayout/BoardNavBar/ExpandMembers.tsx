import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { IMember } from "@/types/board.types";
import { Checkbox } from "@/components/ui/checkbox";
import MakeUserIcon from "@/utils/makeUserIcon";

interface ExpandedMembersProps {
  members: IMember[];
  toggleMemberSelection: (value: string) => void;
  selectedMembersFilters: string[];
}

export function ExpandedMembers({
  members,
  toggleMemberSelection,
  selectedMembersFilters,
}: ExpandedMembersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (e: React.MouseEvent, value: IMember) => {
    e.preventDefault();
    toggleMemberSelection(value.username);
  };

  function isMemberSelected(member: IMember) {
    const isSelected = selectedMembersFilters.some(
      (m) => m === member.username
    );
    return isSelected ? true : false;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"naked"}
          className="font-normal max-h-10 flex justify-between items-center w-full px-2 py-2 border border-white hover:border-slate-400 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Select members</span>
          <ChevronDown size={14} strokeWidth={4} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="bottom"
        className="w-[246px] break-500px:w-[312px] max-h-64 overflow-y-auto rounded-lg py-2 px-0"
      >
        {members.map((member) => {
          return (
            <DropdownMenuItem
              key={member._id}
              onClick={(e) => handleSelect(e, member)}
            >
              <div className=" py-1 border-l-2 border-white hover:border-blue-600 hover:bg-slate-200 flex items-center pl-5 gap-2 transition-colors text-text_dark_blue">
                <Checkbox
                  checked={isMemberSelected(member)}
                  className="border-text_dark_blue/50 h-4 w-4"
                />
                <MakeUserIcon user={member} className="h-6 w-6 text-xs" />
                <p>
                  {member.firstName} {member.lastName}
                </p>
                <p className=" text-slate-600 text-xs">@{member.username}</p>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ExpandedMembers;
