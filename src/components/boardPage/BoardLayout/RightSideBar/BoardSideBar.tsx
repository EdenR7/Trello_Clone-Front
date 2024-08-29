import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, X } from "lucide-react";
import { getBoardBgStyle } from "../BoardLayout";
import { IBoard } from "@/types/board.types";
import { useState } from "react";
import RightSideBarNormalMode from "./NormalMode";
import { Input } from "@/components/ui/input";

interface BoardSideBarProps {
  boardId: string;
  setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSideBarOpen: boolean;
}

export type SideBarMode =
  | "Menu"
  | "About"
  | "Archived"
  | "Background"
  | "Labels";

export function BoardSideBar({
  boardId,
  setIsSideBarOpen,
  isSideBarOpen,
}: BoardSideBarProps) {
  const qClient = useQueryClient();
  const board: IBoard | undefined = qClient.getQueryData(["board", boardId]);
  const [sideBarMode, setSideBarMode] = useState<SideBarMode>("Menu");

  if (!board) return null;
  console.log(board.labels);

  let boardStyle = getBoardBgStyle(board.bg);

  return (
    <div
      className={`absolute right-0 top-0 h-[calc(100vh-48px)] z-50 bg-white transition-width duration-300 ease-in-out overflow-hidden ${
        isSideBarOpen ? "w-[300px] md:w-[340px] px-3" : "w-0"
      }`}
    >
      <div className=" px-3">
        <header className=" flex justify-center items-center my-[10px]">
          {sideBarMode !== "Menu" && (
            <Button
              onClick={() => setSideBarMode("Menu")}
              variant={"naked"}
              size={"icon"}
              className=" mr-auto text-gray-600 h-8 w-8 rounded-lg"
            >
              <ChevronLeft size={24} />
            </Button>
          )}
          <h3 className=" text-base font-medium flex-1 text-center">
            {sideBarMode}
          </h3>
          <Button
            variant={"naked"}
            size={"icon"}
            className=" ml-auto text-gray-600 h-8 w-8 rounded-lg"
            onClick={() => {
              setSideBarMode("Menu");
              setIsSideBarOpen(false);
            }}
          >
            <X size={20} />
          </Button>
        </header>
        <Separator />
      </div>
      <div className=" pt-3 pb-2 px-3 overflow-x-auto h-[calc(100%-68px)]">
        {sideBarMode === "Menu" && (
          <RightSideBarNormalMode
            setSideBarMode={setSideBarMode}
            boardStyle={boardStyle}
          />
        )}
        {/* {sideBarMode === "About" && <div>About</div>} */}
        {/* {sideBarMode === "Archived" && <div>Archived</div>} */}
        {/* {sideBarMode === "Background" && <div>Background</div>} */}
        {sideBarMode === "Labels" && (
          <div className=" flex flex-col gap-2">
            <Input
              className="border h-9  border-gray-400 py-0 focus-visible:ring-0 focus:border-blue-500 focus:border-2 focus:outline-none"
              placeholder=" Search labels..."
            />
            <h3 className=" text-xs font-semibold">Labels</h3>
            <ul>
              {board.labels.map((label) => {
                return <li key={label._id}>
                  
                </li>;
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
export default BoardSideBar;
