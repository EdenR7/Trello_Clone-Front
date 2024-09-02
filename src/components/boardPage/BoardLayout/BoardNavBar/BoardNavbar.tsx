import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { IBoard } from "@/types/board.types";
import { Ellipsis, ListFilter, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
  const { loggedInUser, setLoggedInUser } = useAuth();
  if (!board || !loggedInUser) return null;
  const [onNewTitleInput, setOnNewTitleInput] = useState(false);
  const [boardTitle, setBoardTitle] = useState(board.name);
  const [inputWidth, setInputWidth] = useState(board.name.length);

  const isStarred = useMemo(() => {
    return loggedInUser?.sttaredBoards.find((b) => b._id === board._id);
  }, [loggedInUser?.sttaredBoards, board._id]);

  useEffect(() => {
    const newWidth = boardTitle.length;
    const averageCharacterWidth = 0.6 * 18;
    setInputWidth(Math.floor(newWidth * averageCharacterWidth) + 1);
  }, [boardTitle]);
  //Click outside to save the new title + validation

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
              onChange={(e) => setBoardTitle(e.target.value)}
              style={{ width: `${inputWidth + 20}px` }}
              value={boardTitle}
              className={`text-text_dark_blue px-[10px] h-8 mx-2`}
            />
          ) : (
            <h1
              onClick={() => setOnNewTitleInput(true)}
              className=" cursor-pointer truncate px-[10px] "
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
          <Button
            className=" py-[6px] px-2 hover:bg-white hover:bg-opacity-10"
            variant="naked"
            // onClick={() => setIsSideBarOpen(true)}
          >
            <ListFilter size={18} color="white" />
          </Button>
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
