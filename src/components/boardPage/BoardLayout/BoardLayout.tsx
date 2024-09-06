import { Outlet, useParams } from "react-router-dom";
import { useGetBoard } from "@/hooks/Query hooks/Board hooks/useGetBoard";
import BoardItems from "../BoardItems";
import BoardSideBar from "./RightSideBar/BoardSideBar";
import { useState } from "react";
import { getBoardBgStyle } from "@/utils/utilFuncs";
import BoardNavbar from "./BoardNavBar/BoardNavbar";

function BoardLayout() {
  const { boardId } = useParams();
  const { data: board, isPending, isError, error } = useGetBoard(boardId!);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  if (!board) return null;
  const boardStyle = getBoardBgStyle(board.bg);

  if (isPending) return <div>Loadinggg....</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <>
      <div
        style={boardStyle!}
        className="h-[calc(100vh-48px)] w-full relative overflow-y-hidden"
      >
        <BoardNavbar
          board={board}
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
        <div
          className={` pt-2 pb-2 mr-2 px-[6px] h-[calc(100vh-110px)] overflow-x-auto scrollbar scrollbar-thumb-slate-300/50 scrollbar-track-black/10 ${
            isSideBarOpen && "w-[calc(100%-308px)] md:w-[calc(100%-348px)]"
          }`}
        >
          <BoardItems />
        </div>
        <BoardSideBar
          setIsSideBarOpen={setIsSideBarOpen}
          boardId={boardId!}
          isSideBarOpen={isSideBarOpen}
        />
      </div>
      <Outlet />
    </>
  );
}

export default BoardLayout;
