import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { ChevronDown, Star } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { getBoardBgStyle } from "@/utils/utilFuncs";

interface StarredBoardsPopoverProps {
  handleBoardClick: (boardId: string, event: React.MouseEvent) => void;
  handleChangeStarredStatus: (boardId: string) => void;
  isPopoverOpen: boolean;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function StarredBoardsPopover(props: StarredBoardsPopoverProps) {
  const {
    handleBoardClick,
    handleChangeStarredStatus,
    isPopoverOpen,
    setIsPopoverOpen,
  } = props;
  const { loggedInUser } = useAuth();
  if (!loggedInUser) return;
  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <button className="font-medium  hover:bg-[var(--hover-color)] px-3 py-1.5 rounded-sm text-sm mr-1">
          Starred <ChevronDown className="inline h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-white text-black max-h-[831px] p-3 overflow-x-hidden overflow-y-auto w-[304px] rounded-lg">
        {loggedInUser.sttaredBoards.length === 0 ? (
          <div className=" px-1 py-1 rounded-lg">
            No sttared boards 
          </div>
        ) : (
          <>
            {loggedInUser.sttaredBoards.map((starredBoard) => {
              return (
                <div
                  key={starredBoard._id}
                  className=" group flex items-center px-1 py-1 hover:bg-gray-100 cursor-pointer rounded-lg"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    ev.preventDefault();
                    handleBoardClick(starredBoard._id, ev);
                  }}
                >
                  <div
                    className=" w-10 h-8 rounded-md inline-block "
                    style={getBoardBgStyle(starredBoard.bg)}
                  ></div>
                  <span className=" flex-1 w-full pl-2">
                    {starredBoard.name}
                  </span>
                  <Star
                    onClick={(ev) => {
                      ev.stopPropagation();
                      ev.preventDefault();
                      handleChangeStarredStatus(starredBoard._id);
                    }}
                    className={`
                  ${
                    loggedInUser.sttaredBoards.some(
                      (starBoard) => starBoard._id === starredBoard._id
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
              );
            })}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default StarredBoardsPopover;
