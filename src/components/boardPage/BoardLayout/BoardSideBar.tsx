import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { ArchiveRestore, Eye, Info, Minus, Tag, X } from "lucide-react";
import { getBoardBgStyle } from "./BoardLayout";
import { IBoard } from "@/types/board.types";

interface BoardSideBarProps {
  boardId: string;
  setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSideBarOpen: boolean;
}

export function BoardSideBar({
  boardId,
  setIsSideBarOpen,
  isSideBarOpen,
}: BoardSideBarProps) {
  const qClient = useQueryClient();
  const board: IBoard | undefined = qClient.getQueryData(["board", boardId]);

  if (!board) return null;
  console.log(board.labels);
  

  let boardStyle = getBoardBgStyle(board.bg);

  return (
    <div
      className={`absolute right-0 top-0 h-[calc(100vh-48px)] z-50 bg-white transition-width duration-300 ease-in-out overflow-hidden ${
        isSideBarOpen ? "w-[300px] md:w-[340px] px-3" : "w-0"
      }`}
    >
      {" "}
      <div className=" px-3">
        <header className=" flex justify-center items-center">
          <h3 className=" text-base font-medium my-[18px] flex-1 text-center">
            Menu
          </h3>
          <Button
            variant={"naked"}
            size={"icon"}
            className=" ml-auto text-gray-600 h-8 w-8 rounded-lg"
            onClick={() => setIsSideBarOpen(false)}
          >
            <X size={20} />
          </Button>
        </header>
        <Separator />
      </div>
      <div className=" pt-3 pb-2 px-3 overflow-x-auto h-[calc(100%-68px)]">
        <ul className=" flex flex-col gap-3">
          <li>
            <Button
              className=" flex gap-3 w-full m-0 justify-start font-normal p-[6px] rounded-lg"
              variant={"naked"}
            >
              <span className=" w-5 h-5 flex items-center">
                <Info className=" mx-auto" size={16} />
              </span>

              <span>About this board</span>
            </Button>
          </li>
          <li>
            <Button
              className=" flex gap-3 w-full m-0 justify-start font-normal p-[6px] rounded-lg"
              variant={"naked"}
            >
              <span className=" w-5 h-5 flex items-center">
                <ArchiveRestore className=" mx-auto" size={16} />
              </span>
              <span>Archived items</span>
            </Button>
          </li>
          <Separator />
          <li>
            <Button
              className=" flex gap-3 w-full m-0 justify-start font-normal p-[6px] rounded-lg"
              variant={"naked"}
            >
              <span className=" w-5 h-5" style={boardStyle} />
              <span>Change background</span>
            </Button>
          </li>
          <li>
            <Button
              className=" flex gap-3 w-full m-0 justify-start font-normal p-[6px] rounded-lg "
              variant={"naked"}
            >
              <span className=" w-5 h-5 flex items-center">
                <Tag className=" mx-auto" size={16} />
              </span>

              <span>Labels</span>
            </Button>
          </li>
          <Separator />
          <li>
            <Button
              className=" flex gap-3 w-full m-0 justify-start font-normal p-[6px] rounded-lg "
              variant={"naked"}
            >
              <span className=" w-5 h-5 flex items-center">
                <Eye className=" mx-auto" size={16} />
              </span>
              <span>Watch</span>
            </Button>
          </li>
          <li>
            <Button
              className=" flex gap-3 w-full m-0 justify-start font-normal p-[6px] rounded-lg "
              variant={"naked"}
            >
              <span className=" w-5 h-5 flex items-center">
                <Minus className=" mx-auto" size={16} />
              </span>
              <span>Close board</span>
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default BoardSideBar;
