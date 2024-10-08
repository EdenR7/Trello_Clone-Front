import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IBoard, ILabel } from "@/types/board.types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { getTextColorForBackground } from "@/utils/getTextColorFromBg.ts";
import { getHoverColorForBackground } from "@/utils/getHoverColorFromText.ts";

interface CardModalLabelsProps {
  boardId: string;
  cardLabels: ILabel[];
  onToggleLabel: (labelId: string) => void;
  setIsEditLabel?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditMode?: React.Dispatch<React.SetStateAction<boolean>>;
  setLabelToEdit?: React.Dispatch<React.SetStateAction<ILabel | null>>;
}

function CardModalLabels({
  boardId,
  cardLabels,
  onToggleLabel,
  setIsEditLabel,
  setIsEditMode,
  setLabelToEdit,
}: CardModalLabelsProps) {
  const qClient = useQueryClient();

  const board: IBoard | undefined = qClient.getQueryData(["board", boardId]);

  const [showAllLabels, setShowAllLabels] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const labelSearchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (labelSearchRef.current) {
      labelSearchRef.current.focus();
    }
  }, []);

  if (!board) return null;

  const labels = [...board.labels];
  labels.sort((a, b) => {
    if (a.title === "Default") return 1;
    if (b.title === "Default") return -1;
    return a.title.localeCompare(b.title);
  });

  const filteredLabels = labels.filter((label) =>
    label.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleEditLabel(label: ILabel) {
    if (setLabelToEdit && setIsEditLabel && setIsEditMode) {
      setLabelToEdit(label);
      setIsEditMode(true);
      setIsEditLabel(true);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Input
        className="border h-9 border-gray-400 py-0 focus-visible:ring-0 focus:border-blue-500 focus:border-2 focus:outline-none"
        placeholder="Search labels..."
        ref={labelSearchRef}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <h3 className="text-xs font-semibold">Labels</h3>

      <ul className="flex flex-col gap-1">
        {filteredLabels.map((label, index) => {
          if (index > 7 && !showAllLabels) return null;
          const textColor = getTextColorForBackground(label.color);
          const hoverColor = getHoverColorForBackground(
            label.color,
            textColor === "#FFF"
          );
          return (
            <li key={label._id}>
              <div className="flex justify-between items-center gap-1">
                <div className="flex items-center gap-2 flex-grow">
                  <Checkbox
                    checked={
                      cardLabels.find((lbl) => label._id === lbl._id)
                        ? true
                        : false
                    }
                    onCheckedChange={() => onToggleLabel(label._id)}
                  />
                  <Button
                    className="w-full h-8 rounded-sm flex justify-start font-medium items-center pl-3"
                    variant="naked"
                    style={{
                      backgroundColor: label.color,
                      color: textColor,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = hoverColor)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = label.color)
                    }
                    onClick={() => onToggleLabel(label._id)}
                  >
                    {label.title !== "Default" && label.title}
                  </Button>
                </div>
                <Button
                  className="flex justify-center items-center h-8 w-8"
                  size="icon"
                  onClick={() => handleEditLabel(label)}
                  variant="naked"
                >
                  <Pencil size={14} />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <Button
        onClick={() => {
          if (setIsEditMode && setIsEditLabel) {
            setIsEditMode(false);
            setIsEditLabel(true);
          }
        }}
        variant={"secondary"}
      >
        Create a new label
      </Button>

      {!showAllLabels && filteredLabels.length > 8 && (
        <Button variant="secondary" onClick={() => setShowAllLabels(true)}>
          Show more labels
        </Button>
      )}
      <Separator />
    </div>
  );
}

export default CardModalLabels;
