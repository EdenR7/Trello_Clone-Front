import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import useRemoveBackground from "@/hooks/Query hooks/Card bg hooks/useRemoveBackground";
import useChangeBgState from "@/hooks/Query hooks/Card bg hooks/useChangeBgState";

interface CardCoverSizeLayoutprops {
  bg: { isCover: boolean; bg: string };
  activeBgState: "Header" | "Cover" | null;
  setActiveBgState: React.Dispatch<
    React.SetStateAction<"Header" | "Cover" | null>
  >;
  setActiveColor: React.Dispatch<React.SetStateAction<string | null>>;
}

function CardCoverSizeLayout({
  bg,
  activeBgState,
  setActiveBgState,
  setActiveColor,
}: CardCoverSizeLayoutprops) {
  const { boardId, cardId } = useParams();

  const { mutate: removeBackground } = useRemoveBackground(boardId!);
  const { mutate: changeBgState } = useChangeBgState(boardId!);

  function handleRemoveCover() {
    if (activeBgState === null) return;
    setActiveBgState(null);
    setActiveColor(null);
    if (cardId) removeBackground({ cardId });
  }

  function handleChangeBgState(
    cardId: string,
    isCover: boolean,
    side: "Header" | "Cover"
  ) {
    setActiveBgState(side);
    const willBeCover = !isCover;
    changeBgState({ cardId, isCover: willBeCover });
  }

  return (
    <>
      <h4 className=" font-semibold text-gray-600 leading-4 mb-1 text-xs ">
        Size
      </h4>
      <div className=" grid grid-cols-2 -mx-1 p-1 gap-2 overflow-x-hidden ">
        <div
          onClick={() => {
            if (bg.bg === "") return;
            if (activeBgState === "Header") return;
            handleChangeBgState(cardId!, bg.isCover, "Header");
          }}
          className={`h-16 w-[134px] border border-btn_bg_primary rounded-md cursor-pointer ${
            bg.bg === "" && "cursor-context-menu"
          } ${
            activeBgState === "Header" && "ring-2 ring-primary ring-offset-2"
          }`}
        >
          <div
            className={`h-7 rounded-t-sm  ${bg.bg === "" && "bg-gray-300 "}`}
            style={{ backgroundColor: bg.bg }}
          ></div>
          <div className=" relative pt-[6px] pr-1 pb-1 pl-[6px] ">
            <Skeleton
              className={`w-[122px] h-1 rounded-full bg-gray-400 animate-none ${
                bg.bg === "" && "bg-gray-300"
              }`}
            />
            <Skeleton
              className={`w-[98px] mt-1 h-1 rounded-full bg-gray-400 animate-none ${
                bg.bg === "" && "bg-gray-300"
              }`}
            />
            <div className=" flex mt-[6px]">
              <Skeleton
                className={`animate-none w-4 h-[6px] mr-[2px] rounded-sm bg-slate-400 ${
                  bg.bg === "" && "bg-gray-300"
                }`}
              />
              <Skeleton
                className={`animate-none w-4 h-[6px] mr-2px rounded-sm bg-slate-400 ${
                  bg.bg === "" && "bg-gray-300 "
                }`}
              />
            </div>
            <Skeleton
              className={`absolute right-1 bottom-1 w-[10px] h-[10px] rounded-full bg-slate-400 animate-none ${
                bg.bg === "" && "bg-gray-300 "
              }`}
            />
          </div>
        </div>
        <div
          onClick={() => {
            if (bg.bg === "") return;
            if (activeBgState === "Cover") return;

            handleChangeBgState(cardId!, bg.isCover, "Cover");
          }}
          style={{ backgroundColor: bg.bg }}
          className={`h-16 w-[134px] border border-btn_bg_primary rounded-md cursor-pointer relative ${
            bg.bg === "" && "cursor-default bg-gray-300"
          } ${
            activeBgState === "Cover" && "ring-2 ring-primary ring-offset-2"
          }`}
        >
          <div className=" absolute bottom-1 pt-[6px] pr-1 pb-1 pl-[6px]">
            <Skeleton
              className={`w-[116px] bg-gray-900 opacity-60 h-1 rounded-full animate-none ${
                bg.bg === "" && "bg-white "
              }`}
            />
            <Skeleton
              className={`w-[92px] mt-1 bg-gray-900 opacity-60 h-1 rounded-full animate-none ${
                bg.bg === "" && "bg-white "
              }`}
            />
          </div>
        </div>
      </div>
      {bg.bg !== "" && (
        <Button
          onClick={handleRemoveCover}
          className=" mt-1 w-full"
          variant={"secondary"}
        >
          Remove cover
        </Button>
      )}
    </>
  );
}

export default CardCoverSizeLayout;
