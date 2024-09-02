import { Outlet, useParams } from "react-router-dom";
import { useGetBoard } from "@/hooks/Query hooks/Board hooks/useGetBoard";
import BoardItems from "../BoardItems";
import { Ellipsis, ListFilter, Star } from "lucide-react";
import BoardSideBar from "./RightSideBar/BoardSideBar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IBoardBackground } from "@/types/board.types";
import { useAuth } from "@/providers/auth-provider";

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
  const { loggedInUser } = useAuth();
  const { boardId } = useParams();
  const { data: board, isPending, isError, error } = useGetBoard(boardId!);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const isStarred = loggedInUser?.sttaredBoards.find((b) => b._id === boardId);

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
        <div
          className={`text-white backdrop-blur-[4px] supports-[backdrop-filter]:bg-black/[.10] ${
            isSideBarOpen && "mr-[300px] md:mr-[340px]"
          }`}
        >
          <div className=" py-3 pr-[10px] pl-4 flex justify-between flex-wrap">
            <div className=" flex-1 min-w-12 mr-1 flex items-center flex-nowrap">
              <h1 className=" truncate px-[10px] font-bold text-lg">
                {board.name}
              </h1>
              <Button
                variant={"naked"}
                className=" bg-inherit p-0 m-0 hover:bg-inherit group"
                size={"sm"}
              >
                {isStarred ? (
                  <Star
                    fill="currentColor"
                    size={16}
                    className=" transition-transform duration-200 ease-in-out group-hover:scale-125"
                  />
                ) : (
                  <Star
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
