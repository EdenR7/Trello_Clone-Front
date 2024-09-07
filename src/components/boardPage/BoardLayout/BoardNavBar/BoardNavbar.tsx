import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { IBoard } from "@/types/board.types";
import { CircleAlert, Ellipsis, ListFilter, UserSearch, X } from "lucide-react";
import { useRef, useState } from "react";
import FiltersLayout from "./Filters/FiltersLayout";
import BoardsFilters from "./Filters/BoardsFilters";
import BoardTitle from "./BoardTitle";
import BoardStarring from "./BoardStarring";
import { useSearchParams } from "react-router-dom";
import MakeUserIcon from "@/utils/makeUserIcon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useAddMember from "@/hooks/Query hooks/Board hooks/useAddMember";

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
  const memberNameRef = useRef<HTMLInputElement | null>(null);
  const { mutate: addMember } = useAddMember();
  const [isOpen, setIsOpen] = useState(false);

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
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
              className={` max-w-[400px] h-8 mr-1 mt-1 mb-0 pl-2 overflow-hidden bg-gray-200 hover:bg-white text-[#172B4D] bg-btn_bg_primary  py-[6px] px-3  inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  disabled:opacity-50  `}
            >
              <UserSearch size={16} className=" mr-1" />
              Share
            </DialogTrigger>
            <DialogContent
              aria-describedby={undefined}
              className=" min-h-[200px] pt-5 pl-6 pr-0 pb-0"
            >
              <DialogHeader>
                <DialogTitle className=" min-h-8 mr-6  mt-0 ml-0 text-2xl font-normal ">
                  Share board
                </DialogTitle>
              </DialogHeader>
              <div className=" mr-6 mb-5">
                <div>
                  <div className=" flex items-start">
                    <div className=" flex-grow">
                      <Input
                        ref={memberNameRef}
                        className=" max-w-[380px] w-full py-1.5 pr-1 pl-3 rounded-sm min-h-8 border-gray-600"
                        placeholder="Email address or name"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        if (!memberNameRef.current) return;
                        addMember({
                          boardId: board._id!,
                          memberName: memberNameRef.current?.value,
                        });
                        setIsOpen(false);
                      }}
                      className=" h-10 m-0 "
                    >
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
