import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, X } from "lucide-react";
import { getBoardBgStyle } from "../BoardLayout";
import { IBoard } from "@/types/board.types";
import { useState } from "react";
import RightSideBarNormalMode from "./NormalMode";
import LabelLayout from "@/components/labels/LabelLayout";
import AboutMode from "./AboutMode";
import ArchiveMode from "./ArchiveMode";

interface BoardSideBarProps {
  boardId: string;
  setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSideBarOpen: boolean;
}

export type SideBarMode =
  | "Menu"
  | "About this board"
  | "Archive"
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
  let boardStyle = getBoardBgStyle(board.bg);

  return (
    <div
      className={`absolute right-0 top-0 h-[calc(100vh-48px)] text-text_dark_blue z-50 bg-white transition-width duration-300 ease-in-out overflow-hidden ${
        isSideBarOpen ? "w-[305px] md:w-[340px] px-3" : "w-0"
      }`}
    >
      <header className=" flex justify-center items-center my-[15px]">
        {sideBarMode !== "Menu" && (
          <Button
            onClick={() => setSideBarMode("Menu")}
            variant={"naked"}
            size={"icon"}
            className=" mr-auto text-gray-600 h-8 w-8 rounded-lg absolute left-3"
          >
            <ChevronLeft size={24} />
          </Button>
        )}
        <h2 className=" text-base font-medium flex-1 text-center">
          {sideBarMode}
        </h2>
        <Button
          variant={"naked"}
          size={"icon"}
          className=" ml-auto text-gray-600 h-8 w-8 rounded-lg absolute right-3"
          onClick={() => {
            setSideBarMode("Menu");
            setIsSideBarOpen(false);
          }}
        >
          <X size={20} />
        </Button>
      </header>
      <Separator />
      <div className=" pt-3 pb-2 overflow-x-auto h-[calc(100%-68px)]">
        {sideBarMode === "Menu" && (
          <RightSideBarNormalMode
            setSideBarMode={setSideBarMode}
            boardStyle={boardStyle}
          />
        )}
        {sideBarMode === "About this board" && <AboutMode boardId={boardId} />}
        {sideBarMode === "Archive" && <ArchiveMode boardId={boardId} />}
        {/* {sideBarMode === "Background" && <div>Background</div>} */}
        {sideBarMode === "Labels" && <LabelLayout boardId={boardId} />}
      </div>
    </div>
  );
}
export default BoardSideBar;
