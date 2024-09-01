import { Separator } from "@/components/ui/separator";
import { boardBgColorOptions } from "@/constants/board.constants";
import { gradientStrings } from "@/constants/gradient.constant";

function ColorsMode() {
  return (
    <>
      <ul className=" grid grid-cols-2 h-[520px] gap-2 px-2">
        {gradientStrings.map((gradient, index) => {
          return (
            <li
              // remember to put v mark if its the bg rignt now
              key={index}
              className=" w-full h-full rounded-md relative cursor-pointer"
              style={{ background: gradient.linear }}
            >
              <span className=" absolute bottom-2 left-2 text-base">
                {gradient.emoji}
              </span>
            </li>
          );
        })}
      </ul>
      <Separator className=" mt-5 mb-5" />
      <ul className="grid grid-cols-5 h-32 gap-2 px-2">
        {boardBgColorOptions.map((color, index) => {
          return (
            <li
              // remember to put v mark if its the bg rignt now
              key={index}
              className=" w-full h-full rounded-[8px] relative cursor-pointer"
              style={{ background: color }}
            ></li>
          );
        })}
      </ul>
    </>
  );
}

export default ColorsMode;
