import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArchiveRestore, Eye, Info, Minus, Tag } from "lucide-react";
import { SideBarModeProps } from "./BoardSideBar";
import { useNavigate } from "react-router-dom";

function RightSideBarNormalMode({
  boardStyle,
  setSideBarMode,
}: SideBarModeProps) {
  const navigate = useNavigate();

  function handleGoHome() {
    navigate("/");
  }

  if (!setSideBarMode) return null;
  return (
    <ul className=" flex flex-col gap-3">
      <li>
        <Button
          onClick={() => setSideBarMode("About this board")}
          className=" flex gap-3 w-full m-0 justify-start font-normal p-[6px] rounded-lg"
          variant={"naked"}
        >
          <span className=" w-5 h-5 flex items-center">
            <Info className=" mx-auto" size={16} />
          </span>

          <span>About this board</span>
        </Button>
      </li>
      <li>
        <Button
          onClick={() => setSideBarMode("Archive")}
          className=" flex gap-3 w-full m-0 justify-start font-normal p-[6px] rounded-lg"
          variant={"naked"}
        >
          <span className=" w-5 h-5 flex items-center">
            <ArchiveRestore className=" mx-auto" size={16} />
          </span>
          <span>Archived items</span>
        </Button>
      </li>
      <Separator />
      <li>
        <Button
          onClick={() => setSideBarMode("Change background")}
          className=" flex gap-3 w-full m-0 justify-start items-center font-normal p-[6px] rounded-lg"
          variant={"naked"}
        >
          <span className=" w-5 h-5 rounded-md" style={boardStyle} />
          <span>Change background</span>
        </Button>
      </li>
      <li>
        <Button
          className=" flex gap-3 w-full m-0 justify-start font-normal p-[6px] rounded-lg "
          variant={"naked"}
          onClick={() => setSideBarMode("Labels")}
        >
          <span className=" w-5 h-5 flex items-center">
            <Tag className=" mx-auto" size={16} />
          </span>

          <span>Labels</span>
        </Button>
      </li>
      <Separator />
      <li>
        <Button
          className=" flex gap-3 w-full m-0 justify-start font-normal p-[6px] rounded-lg "
          variant={"naked"}
        >
          <span className=" w-5 h-5 flex items-center">
            <Eye className=" mx-auto" size={16} />
          </span>
          <span>Watch</span>
        </Button>
      </li>
      <li>
        <Button
          className=" flex gap-3 w-full m-0 justify-start font-normal p-[6px] rounded-lg "
          variant={"naked"}
          onClick={handleGoHome}
        >
          <span className=" w-5 h-5 flex items-center">
            <Minus className=" mx-auto" size={16} />
          </span>
          <span>Close board</span>
        </Button>
      </li>
    </ul>
  );
}

export default RightSideBarNormalMode;
