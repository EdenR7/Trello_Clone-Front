import { Input } from "@/components/ui/input";
import useClickOutside from "@/hooks/CustomHooks/useClickOutside";
import { useUpdateName } from "@/hooks/Query hooks/Board hooks/useUpdateName";
import { IBoard } from "@/types/board.types";
import { useEffect, useRef, useState } from "react";

export const averageCharacterWidth = 0.6 * 18;

interface BoardTitleProps {
  board: IBoard;
  onNewTitleInput: boolean;
  setOnNewTitleInput: React.Dispatch<React.SetStateAction<boolean>>;
}

function BoardTitle({
  board,
  onNewTitleInput,
  setOnNewTitleInput,
}: BoardTitleProps) {
  const [boardTitle, setBoardTitle] = useState(board.name);
  const newTitlenputRef = useRef<HTMLInputElement>(null);
  useClickOutside(newTitlenputRef, handleClickOutside);
  const boardNameUpdater = useUpdateName(board._id);

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

  const adjustedInputFieldWidth =
    Math.floor(boardTitle.length * averageCharacterWidth) + 35;
    
  return (
    <>
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
    </>
  );
}

export default BoardTitle;
