import { Separator } from "@/components/ui/separator";
import { boardBgColorOptions } from "@/constants/board.constants";
import { gradientStrings } from "@/constants/gradient.constant";
import { useUpdateBg } from "@/hooks/Query hooks/Board hooks/useUpdateBg";
import { IBoard } from "@/types/board.types";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useParams } from "react-router-dom";

function ColorsMode() {
  const { boardId } = useParams();
  const qClient = useQueryClient();
  const board: IBoard | undefined = qClient.getQueryData(["board", boardId]);
  if (!board) return;

  const bgChanger = useUpdateBg(boardId!);

  function handleBgChange(background: string, bgType: string) {
    bgChanger.mutate({ background, bgType });
  }

  return (
    <>
      <ul className=" grid grid-cols-2 h-[520px] gap-2 px-2">
        {gradientStrings.map((gradient, index) => {
          return (
            <li
              onClick={() => handleBgChange(gradient.linear, "gradient")}
              key={index}
              className=" w-full h-full rounded-md relative cursor-pointer"
              style={{ background: gradient.linear }}
            >
              <span className=" absolute bottom-2 left-2 text-base">
                {gradient.emoji}
              </span>
              {board.bg.background === gradient.linear && (
                <Check
                  size={24}
                  color="#ffffff"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              )}
            </li>
          );
        })}
      </ul>
      <Separator className=" mt-5 mb-5" />
      <ul className="grid grid-cols-5 h-32 gap-2 px-2">
        {boardBgColorOptions.map((color, index) => {
          return (
            <li
              onClick={() => handleBgChange(color, "color")}
              key={index}
              className=" w-full h-full rounded-[8px] relative cursor-pointer flex items-center justify-center"
              style={{ background: color }}
            >
              {board.bg.background === color && (
                <Check
                  size={24}
                  color="#ffffff"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default ColorsMode;
