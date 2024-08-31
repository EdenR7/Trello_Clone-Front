import { ILabel } from "@/types/board.types";
import { getHoverColorForBackground } from "@/utils/getHoverColorFromText";
import { getTextColorForBackground } from "@/utils/getTextColorFromBg";
import PopoverLayout from "../general/PopoverLayout";
import CardModalLabels from "./CardModalLabelLayout";

interface CardLabelItemProps {
  label: ILabel;
  cardLabels: string[];
  boardId: string;
  onToggleLabel: (labelId: string) => void;
}

function CardLabelItem({
  label,
  boardId,
  cardLabels,
  onToggleLabel,
}: CardLabelItemProps) {
  const textColor = getTextColorForBackground(label.color);
  const hoverColor = getHoverColorForBackground(
    label.color,
    textColor === "#FFF"
  );

  return (
    <PopoverLayout
      title="Labels"
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
      <CardModalLabels
        boardId={boardId}
        cardLabels={cardLabels}
        onToggleLabel={onToggleLabel}
      />
    </PopoverLayout>
  );
}

export default CardLabelItem;
