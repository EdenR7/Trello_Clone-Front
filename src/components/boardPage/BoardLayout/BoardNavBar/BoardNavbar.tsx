import PopoverLayout from "@/components/general/PopoverLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useClickOutside from "@/hooks/CustomHooks/useClickOutside";
import { useUpdateName } from "@/hooks/Query hooks/Board hooks/useUpdateName";
import api from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { IBoard } from "@/types/board.types";
import { Ellipsis, ListFilter, Star, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import FiltersLayout from "./FiltersLayout";
import { Checkbox } from "@/components/ui/checkbox";
import MakeUserIcon from "@/utils/makeUserIcon";

export interface BoardNavbarProps {
  isSideBarOpen: boolean;
  board: IBoard | undefined;
  setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const averageCharacterWidth = 0.6 * 18;

function BoardNavbar({
  isSideBarOpen,
  board,
  setIsSideBarOpen,
}: BoardNavbarProps) {
  const { loggedInUser, setLoggedInUser } = useAuth();
  if (!board || !loggedInUser) return null;
  const [onNewTitleInput, setOnNewTitleInput] = useState(false);
  const [boardTitle, setBoardTitle] = useState(board.name);
  const newTitlenputRef = useRef<HTMLInputElement>(null);
  useClickOutside(newTitlenputRef, handleClickOutside);

  const boardNameUpdater = useUpdateName(board._id);

  const adjustedInputFieldWidth =
    Math.floor(boardTitle.length * averageCharacterWidth) + 35;
  const isStarred = useMemo(() => {
    return loggedInUser?.sttaredBoards.find((b) => b._id === board._id);
  }, [loggedInUser?.sttaredBoards, board._id]);

  useEffect(() => {
    if (onNewTitleInput) {
      newTitlenputRef.current?.focus();
      newTitlenputRef.current?.select();
    }
  }, [onNewTitleInput]);

  function handleClickOutside() {
    if (onNewTitleInput) {
      setOnNewTitleInput(false);
      if (isValidBoardTitle(boardTitle)) {
        boardNameUpdater.mutate({ name: boardTitle });
      } else {
        setBoardTitle(board?.name as string);
      }
    }
  }
  function isValidBoardTitle(title: string): boolean {
    return title.trim().length > 0 && title[0] !== " ";
  }

  async function handleChangeStarredStatus() {
    try {
      const res = await api.patch(`/user/starred/${board?._id}`);
      setLoggedInUser(res.data);
    } catch (error) {
      console.log(error);
    }
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
          {onNewTitleInput ? (
            <Input
              ref={newTitlenputRef}
              onChange={(e) => setBoardTitle(e.target.value)}
              style={{ width: `${Math.max(adjustedInputFieldWidth, 48)}px` }}
              value={boardTitle}
              className={`text-text_dark_blue text-base h-8 mx-2 px-[10px] py-0`}
            />
          ) : (
            <h1
              onClick={() => setOnNewTitleInput(true)}
              className=" cursor-pointer truncate px-[10px]  "
            >
              {board.name}
            </h1>
          )}

          <Button
            variant={"naked"}
            className=" bg-inherit p-0 m-0 hover:bg-inherit group"
            size={"sm"}
          >
            {isStarred ? (
              <Star
                onClick={handleChangeStarredStatus}
                fill="currentColor"
                size={16}
                className=" transition-transform duration-200 ease-in-out group-hover:scale-125"
              />
            ) : (
              <Star
                onClick={handleChangeStarredStatus}
                size={16}
                className=" transition-transform duration-200 ease-in-out group-hover:scale-125"
              />
            )}
          </Button>
        </div>
        <div className=" flex items-center gap-2">
          <FiltersLayout
            trigger={
              <Button
                className=" py-[6px] px-2 hover:bg-white hover:bg-opacity-10 "
                variant="naked"
              >
                <ListFilter size={18} color="white" />
              </Button>
            }
          >
            <div className="" style={{ color: "rgb(68, 84, 111)" }}>
              <div>
                <h4 className=" my-4 mb-2 text-xs font-semibold">Keyword</h4>
                <Input
                  className=" h-9 py-2 px-3 border border-text_dark_blue/50"
                  placeholder="Enter a keyword..."
                />
                <p className=" text-[11px] mt-2 mb-1">
                  Search cards, members, labels, and more
                </p>
              </div>
              <div className=" mt-4">
                <h4 className=" my-4 mb-2 text-xs font-semibold">Members</h4>
                <ul className=" space-y-4">
                  <li className=" px-2 pt-2 flex items-center gap-4">
                    <Checkbox color="" className=" border-text_dark_blue/50" />
                    <div className=" flex gap-2">
                      <div className=" bg-slate-100 h-6 w-6 rounded-full flex items-center justify-center">
                        <User className=" text-slate-500" size={14} />
                      </div>
                      <p>No members</p>
                    </div>
                  </li>
                  <li className=" px-2 pt-2 flex items-center gap-4">
                    <Checkbox color="" className=" border-text_dark_blue/50" />
                    <div className=" flex gap-2">
                      <MakeUserIcon
                        user={loggedInUser}
                        className=" h-6 w-6 text-xs"
                      />
                      <p className=" text-text_dark_blue">
                        Cards assigned to me
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </FiltersLayout>
          <span className=" h-5 w-[1px] bg-gray-400 rounded-xl opacity-35"></span>
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
