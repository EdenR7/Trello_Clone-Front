import { Outlet, useParams } from "react-router-dom";
import { useGetBoard } from "@/hooks/Query hooks/Board hooks/useGetBoard";
import BoardItems from "../BoardItems";
import { Ellipsis, ListFilter } from "lucide-react";
import BoardSideBar from "./BoardSideBar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export type BoardStyle = {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
};

function BoardLayout() {
  const { boardId } = useParams();
  const { data: board, isPending, isError, error } = useGetBoard(boardId!);
  const [openSideBar, setOpenSideBar] = useState(true);

  if (!board) return null;
  let boardStyle: BoardStyle;
  if (board.bg) {
    boardStyle = {
      ...(board!.bg.bgType === "color" && {
        backgroundColor: board!.bg.background,
      }),
      ...(board!.bg.bgType === "gradient" && {
        backgroundImage: board!.bg.background,
      }),
      ...(board!.bg.bgType === "image" && {
        backgroundImage: `url(${board!.bg.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }),
    };
  }

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
                  onClick={() => setOpenSideBar(true)}
                >
                  <Ellipsis size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={` pt-2 pb-8 px-[6px] h-[calc(100vh-110px)] overflow-x-scroll ${
            openSideBar && "w-[calc(100%-300px)] md:w-[calc(100%-342px)]"
          }`}
        >
          <BoardItems />
        </div>
        {<BoardSideBar />}
      </div>
      <Outlet />
    </>
  );
}

export default BoardLayout;
