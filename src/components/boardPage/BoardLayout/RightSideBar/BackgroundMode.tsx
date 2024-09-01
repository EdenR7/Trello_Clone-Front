import { useState } from "react";
import NormalMode from "./Background-NormalMode";
import PhotosMode from "./Background-PhotosMode";
import ColorsMode from "./Background-ColorsMode";
import { SideBarMode } from "./BoardSideBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const backgroundModeOptions = {
  Normal: NormalMode,
  Photos: PhotosMode,
  Colors: ColorsMode,
};

export type BackgroundModeType = "Normal" | "Photos" | "Colors";

function BackgroundMode({
  setIsSideBarOpen,
  setSideBarMode,
}: {
  setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSideBarMode: React.Dispatch<React.SetStateAction<SideBarMode>>;
}) {
  const [mode, setMode] = useState<BackgroundModeType>("Normal");
  const CurrentMode = backgroundModeOptions[mode];

  return (
    <>
      <header className=" flex justify-center items-center my-[15px]">
        <Button
          onClick={() => {
            mode === "Normal" ? setSideBarMode("Menu") : setMode("Normal");
          }}
          variant={"naked"}
          size={"icon"}
          className=" mr-auto text-gray-600 h-8 w-8 rounded-lg absolute left-3"
        >
          <ChevronLeft size={24} />
        </Button>

        <h2 className=" text-base font-medium flex-1 text-center">
          Change background
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
      <div
        className={`pt-3 pb-2 overflow-x-auto ${
          mode === "Photos" && "overflow-y-hidden"
        } h-[calc(100%-68px)]`}
      >
        <CurrentMode setMode={setMode} />
      </div>
    </>
  );
}

export default BackgroundMode;
