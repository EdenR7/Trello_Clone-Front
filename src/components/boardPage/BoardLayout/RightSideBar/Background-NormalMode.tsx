import { Separator } from "@/components/ui/separator";
import { BackgroundModeType } from "./BackgroundMode";

export interface NormalModeProps {
  setMode?: React.Dispatch<React.SetStateAction<BackgroundModeType>>;
  boardId?: string;
}

export function NormalMode({ setMode }: NormalModeProps) {
  return (
    <>
      <div className=" grid grid-cols-2 gap-2">
        <div
          className=" cursor-pointer"
          onClick={() => {
            if (setMode) setMode("Photos");
          }}
        >
          <div className=" overflow-hidden mb-2 rounded-md h-24 bg-black hover:opacity-70 transition-opacity duration-300">
            <img
              src="https://trello.com/assets/8f9c1323c9c16601a9a4.jpg"
              alt=""
              className=" h-full w-full object-cover"
            />
          </div>
          <h3 className=" text-center">Photos</h3>
        </div>
        <div
          className=" cursor-pointer"
          onClick={() => {
            if (setMode) setMode("Colors");
          }}
        >
          <div className=" overflow-hidden mb-2 rounded-md h-24 hover:opacity-70 transition-opacity duration-300">
            <img
              src="https://trello.com/assets/97db30fe74a58b7b7a18.png"
              alt="Colors cover picture"
              className=" h-full w-full object-cover"
            />
          </div>
          <h3 className=" text-center">Colors</h3>
        </div>
      </div>
      <Separator className=" mt-4" />
    </>
  );
}
export default NormalMode;
