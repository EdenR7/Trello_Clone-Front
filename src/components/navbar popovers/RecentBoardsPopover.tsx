import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { ChevronDown, Star } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { getBoardBgStyle } from "@/utils/utilFuncs";

interface RecentBoardsPopoverProps {
  handleBoardClick: (boardId: string, event: React.MouseEvent) => void;
  handleChangeStarredStatus: (boardId: string) => void;
  isPopoverOpen: boolean;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RecentBoardsPopover: React.FC<RecentBoardsPopoverProps> = ({
  handleBoardClick,
  handleChangeStarredStatus,
  isPopoverOpen,
  setIsPopoverOpen,
}) => {
  const { loggedInUser } = useAuth();
  if (!loggedInUser) return;
  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <button className="font-medium px-3 py-1.5 rounded-sm text-sm hover:bg-[var(--hover-color)]">
          Recent <ChevronDown className="inline h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-white text-black max-h-[831px] p-3 overflow-x-hidden overflow-y-auto w-[304px] rounded-lg">
        {loggedInUser.recentBoards.map((recentBoard) => (
          <div
            key={recentBoard._id}
            className=" group flex items-center px-1 py-1 hover:bg-gray-100 cursor-pointer rounded-lg"
            onClick={(ev) => {
              ev.stopPropagation();
              ev.preventDefault();
              handleBoardClick(recentBoard._id, ev);
            }}
          >
            <div
              className=" w-10 h-8 rounded-md inline-block "
              style={getBoardBgStyle(recentBoard.bg)}
            ></div>
            <span className=" flex-1 w-full pl-2">{recentBoard.name}</span>
            <Star
              onClick={(ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                handleChangeStarredStatus(recentBoard._id);
              }}
              className={`
                  ${
                    loggedInUser.sttaredBoards.some(
                      (starBoard) => starBoard._id === recentBoard._id
                    )
                      ? "text-[#E2B203] hover:text-black"
                      : "text-black hidden group-hover:block hover:text-[#E2B203]"
                  }
                   hover:scale-110 transition-all
                `}
              size={18}
              strokeWidth={1.75}
            />
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default RecentBoardsPopover;
