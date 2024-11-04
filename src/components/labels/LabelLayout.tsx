import { IBoard } from "@/types/board.types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import PopoverLayout from "../general/PopoverLayout";
import { Separator } from "../ui/separator";
import { CreateAndEditLabelLayout } from "./CreateAndEditLabelLayout.tsx";
import { SideBarModeProps } from "../boardPage/BoardLayout/RightSideBar/BoardSideBar.tsx";
import { getTextColorForBackground } from "@/utils/getTextColorFromBg.ts";
import { getHoverColorForBackground } from "@/utils/getHoverColorFromText.ts";

function LabelLayout({ boardId }: SideBarModeProps) {
  const qClient = useQueryClient();
  const board: IBoard | undefined = qClient.getQueryData(["board", boardId]);
  const [showAllLabels, setShowAllLabels] = useState(false);
  const [filteredLabelsInput, setFilteredLabelsInput] = useState("");

  if (!board) return;

  const labels = [...board.labels];
  labels.sort((a, b) => {
    if (a.title === "Default") return 1;
    if (b.title === "Default") return -1;
    return a.title.localeCompare(b.title);
  });

  const filteredLabels = labels.filter((label) =>
    label.title.includes(filteredLabelsInput)
  );

  return (
    <div className=" flex flex-col gap-3">
      <Input
        value={filteredLabelsInput}
        onChange={(e) => setFilteredLabelsInput(e.target.value)}
        className="border h-9  border-gray-400 py-0 focus-visible:ring-0 focus:border-blue-500 focus:border-2 focus:outline-none"
        placeholder=" Search labels..."
      />
      <h3 className=" text-xs font-semibold">Labels</h3>

      <ul className=" flex flex-col gap-1">
        {filteredLabels.map((label, index) => {
          if (index > 7 && !showAllLabels) return;
          const textColor = getTextColorForBackground(label.color);
          const hoverColor = getHoverColorForBackground(
            label.color,
            textColor === "#FFF"
          );
          return (
            <li key={label._id}>
              <div className=" flex justify-between items-center gap-1">
                <PopoverLayout
                  title="Lables"
                  triggerVariant={"secondary"}
                  popoverClassName="-translate-x-4 md:-translate-x-0 w-[304px]"
                  side=""
                  trigger={
                    <Button
                      className="w-full h-8 rounded-sm flex justify-start font-medium items-center pl-3 translate-y"
                      variant={"naked"}
                      style={{ backgroundColor: label.color, color: textColor }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = hoverColor)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = label.color)
                      }
                    >
                      {label.title !== "Default" && label.title}
                    </Button>
                  }
                >
                  <CreateAndEditLabelLayout
                    labelId={label._id}
                    color={label.color}
                    title={label.title !== "Default" ? label.title : ""}
                    isEditMode={true}
                  />
                </PopoverLayout>
                <PopoverLayout
                  title="Lables"
                  triggerVariant={"secondary"}
                  popoverClassName=" w-[304px] "
                  side="right"
                  trigger={
                    <Button
                      className=" flex justify-center items-center h-8 w-8"
                      size={"icon"}
                      variant={"naked"}
                    >
                      <Pencil size={14} />
                    </Button>
                  }
                >
                  <CreateAndEditLabelLayout
                    labelId={label._id}
                    color={label.color}
                    title={label.title !== "Default" ? label.title : ""}
                    isEditMode={true}
                  />
                </PopoverLayout>
              </div>
            </li>
          );
        })}
      </ul>

      <PopoverLayout
        title="Lables"
        triggerText="Create a new label"
        triggerVariant={"secondary"}
        side=""
        popoverClassName="-translate-x-4 md:-translate-x-0 w-[304px]"
      >
        <CreateAndEditLabelLayout isEditMode={false} />
      </PopoverLayout>
      {!showAllLabels && filteredLabels.length > 8 && (
        <Button variant={"secondary"} onClick={() => setShowAllLabels(true)}>
          Show more labels
        </Button>
      )}
      <Separator />
    </div>
  );
}

export default LabelLayout;
