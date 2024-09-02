import { Outlet, useParams } from "react-router-dom";
import { useGetBoard } from "@/hooks/Query hooks/Board hooks/useGetBoard";
import BoardItems from "../BoardItems";
import { Ellipsis, ListFilter } from "lucide-react";
import BoardSideBar from "./RightSideBar/BoardSideBar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IBoardBackground } from "@/types/board.types";

export type BoardStyle = {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
};

export function getBoardBgStyle(bg: IBoardBackground) {
  let boardStyle: BoardStyle | undefined;
  if (bg) {
    boardStyle = {
      ...(bg.bgType === "color" && {
        backgroundColor: bg.background,
      }),
      ...(bg.bgType === "gradient" && {
        backgroundImage: bg.background,
      }),
      ...(bg.bgType === "image" && {
        backgroundImage: `url(${bg.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }),
    };
  }
  return boardStyle;
}

function BoardLayout() {
  const { boardId } = useParams();
  const { data: board, isPending, isError, error } = useGetBoard(boardId!);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  if (!board) return null;
  const boardStyle = getBoardBgStyle(board.bg);
  // console.log("hi");

  if (isPending) return <div>Loadinggg....</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <>
      <div
        style={boardStyle!}
        className="h-[calc(100vh-48px)] w-full relative overflow-y-hidden"
      >
        <div className=" backdrop-blur-[4px] supports-[backdrop-filter]:bg-background/80">
          <div className=" py-3 pr-[10px] pl-4 flex justify-between">
            <div className=" flex items-center">a</div>
            <div className=" flex items-center gap-2">
              <span>
                <ListFilter size={16} color="black" />
              </span>
              <span className=" h-5 w-[1px] bg-gray-500 rounded-xl opacity-35"></span>
              <div>
                <Button
                  className=" py-[6px] px-2"
                  variant="naked"
                  onClick={() => setIsSideBarOpen(true)}
                >
                  <Ellipsis size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={` pt-2 pb-8 px-[6px] h-[calc(100vh-110px)] overflow-x-auto ${
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
