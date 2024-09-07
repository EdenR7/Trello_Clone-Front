import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { IBoard } from "@/types/board.types";
import { CircleAlert, Ellipsis, ListFilter, X } from "lucide-react";
import { useState } from "react";
import FiltersLayout from "./Filters/FiltersLayout";
import BoardsFilters from "./Filters/BoardsFilters";
import BoardTitle from "./BoardTitle";
import BoardStarring from "./BoardStarring";
import { useSearchParams } from "react-router-dom";
import MakeUserIcon from "@/utils/makeUserIcon";

export interface BoardNavbarProps {
  isSideBarOpen: boolean;
  board: IBoard | undefined;
  setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function BoardNavbar({
  isSideBarOpen,
  board,
  setIsSideBarOpen,
}: BoardNavbarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { loggedInUser } = useAuth();
  if (!board || !loggedInUser) return null;
  const [onNewTitleInput, setOnNewTitleInput] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const hasFilters = searchParams.size > 0;

  function clearAllFilters() {
    setSearchParams({});
    setOpenFilters(false);
  }

  return (
    <div
      className={`text-white backdrop-blur-[4px] supports-[backdrop-filter]:bg-black/[.10] ${
        isSideBarOpen && "mr-[300px] md:mr-[340px]"
      }`}
    >
      <div className=" py-3 pr-[10px] pl-4 flex justify-between flex-wrap">
        <div
          className={`${
            !onNewTitleInput && "flex-1 min-w-12"
          }  mr-1 flex items-center flex-nowrap font-bold text-lg gap-2`}
        >
          <BoardTitle
            setOnNewTitleInput={setOnNewTitleInput}
            board={board}
            onNewTitleInput={onNewTitleInput}
          />
          <BoardStarring boardId={board._id} />
        </div>
        <div className=" flex items-center gap-2">
          <div
            className={` h-8 overflow-hidden flex items-center ${
              hasFilters && "bg-[#dcdfe4]"
            }`}
          >
            <FiltersLayout
              setOpenFilters={setOpenFilters}
              openFilters={openFilters}
              trigger={
                <Button
                  className={`py-[6px] px-2 hover:bg-white hover:bg-opacity-10 ${
                    hasFilters && "hover:bg-opacity-100 px-3"
                  }`}
                  variant="naked"
                >
                  <ListFilter
                    size={hasFilters ? 14 : 18}
                    color={`${hasFilters ? "black" : "white"}`}
                  />
                  <CircleAlert
                    size={14}
                    className={`${
                      hasFilters ? " ml-2 text-blue-600" : "hidden"
                    }`}
                  />
                </Button>
              }
            >
              <BoardsFilters
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                board={board}
                loggedInUser={loggedInUser}
              />
            </FiltersLayout>
            <div className={`${hasFilters ? "" : "hidden"}`}>
              <Button
                onClick={clearAllFilters}
                variant={"naked"}
                size={"sm"}
                className=" text-text_dark_blue font-medium px-3 hover:bg-white"
              >
                <X size={16} className=" break-600px:hidden" />
                <span className="hidden break-600px:inline">Clear all</span>
              </Button>
            </div>
          </div>
          <span className=" h-5 w-[1px] bg-gray-400 rounded-xl opacity-35"></span>
          <div className=" relative align-baseline top-0.5 max-h-8 mr-2 pl-0.5 overflow-visible leading-8 flex justify-center ">
            {board.members.map((member) => (
              <div
                key={member._id}
                className=" z-10 w-[30px] h-[30px] relative -mr-1 "
              >
                <MakeUserIcon user={member} />
                {board.admin === member._id && (
                  <span
                    className=" h-3 w-3 absolute z-50 right-[1px] -bottom-[2px] "
                    style={{
                      backgroundImage: `url("https://trello.com/assets/88a4454280d68a816b89.png")`,
                      backgroundSize: "100%",
                    }}
                  ></span>
                )}
              </div>
            ))}
          </div>
          <div>
            <Button
              className=" py-[6px] px-2 hover:bg-white hover:bg-opacity-10"
              variant="naked"
              onClick={() => setIsSideBarOpen(true)}
            >
              <Ellipsis size={18} color="white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardNavbar;
