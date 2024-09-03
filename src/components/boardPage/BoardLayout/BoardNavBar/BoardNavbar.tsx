import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useClickOutside from "@/hooks/CustomHooks/useClickOutside";
import api from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { IBoard } from "@/types/board.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ellipsis, ListFilter, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

async function updateBoardNameApi(boardId: string, name: string) {
  try {
    const res = await api.patch(`/board/${boardId}/name`, { name });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

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

  const qClient = useQueryClient();
  const boardNameUpdater = useMutation({
    mutationFn: ({ name }: { name: string }) =>
      updateBoardNameApi(board._id, name),
    onMutate: async ({ name }) => {
      const previousData: IBoard | undefined = qClient.getQueryData([
        "board",
        board._id,
      ]);
      qClient.setQueryData(["board", board._id], { ...previousData, name });
      return { previousData };
    },
    onError(error, __, context) {
      console.log(error);
      qClient.setQueryData(["board", board._id], context?.previousData);
    },
  });

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
