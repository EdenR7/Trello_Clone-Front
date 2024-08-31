import { ILabel } from "@/types/board.types";
import { getHoverColorForBackground } from "@/utils/getHoverColorFromText";
import { getTextColorForBackground } from "@/utils/getTextColorFromBg";
import CardModalLabels from "./CardModalLabelLayout";
import { useState } from "react";
import { CreateAndEditLabelLayout } from "./CreateAndEditLabelLayout.tsx";
import { useParams } from "react-router-dom";
import LabelPopoverLayout from "../general/LabelPopoverLayout.tsx";

interface CardLabelItemProps {
  label: ILabel;
  cardLabels: ILabel[];
  boardId: string;
  onToggleLabel: (labelId: string) => void;
}

function CardLabelItem({
  label,
  boardId,
  cardLabels,
  onToggleLabel,
}: CardLabelItemProps) {
  const { cardId } = useParams();
  const [isEditLabel, setIsEditLabel] = useState(false);
  const [labelToEdit, setLabelToEdit] = useState<ILabel | null>(null);
  const [isLabelPopoverOpen, setIsLabelPopoverOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const textColor = getTextColorForBackground(label.color);
  const hoverColor = getHoverColorForBackground(
    label.color,
    textColor === "#FFF"
  );

  return (
    <LabelPopoverLayout
      setIsEditLabel={setIsEditLabel}
      setIsEditMode={setIsEditMode}
      setLabelToEdit={setLabelToEdit}
      internalOpen={isLabelPopoverOpen}
      setInternalOpen={setIsLabelPopoverOpen}
      title={`${
        (isEditLabel && isEditMode && "Edit label") ||
        (!isEditLabel && "Labels") ||
        (isEditLabel && !isEditMode && "Create label")
      }`}
      trigger={
        <span
          key={label._id}
          className="relative min-w-12 max-w-full h-8 mb-0 px-3 overflow-hidden rounded-sm font-semibold leading-8 text-left text-ellipsis whitespace-nowrap"
          style={{
            backgroundColor: label.color,
            color: textColor, // Set dynamic text color based on background
            cursor: "pointer", // Adding cursor pointer for hover effect
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = hoverColor)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = label.color)
          }
        >
          {label.title}
        </span>
      }
    >
      {isEditLabel ? (
        <CreateAndEditLabelLayout
          isEditMode={isEditMode}
          color={labelToEdit?.color}
          labelId={labelToEdit?._id}
          title={labelToEdit?.title}
          setIsLabelPopoverOpen={setIsLabelPopoverOpen}
          cardId={cardId}
        />
      ) : (
        <CardModalLabels
          boardId={boardId}
          cardLabels={cardLabels}
          onToggleLabel={onToggleLabel}
          setIsEditLabel={setIsEditLabel}
          setIsEditMode={setIsEditMode}
          setLabelToEdit={setLabelToEdit}
        />
      )}
    </LabelPopoverLayout>
  );
}

export default CardLabelItem;
