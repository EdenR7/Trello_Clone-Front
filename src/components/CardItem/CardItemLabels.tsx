import { ILabel } from "@/types/board.types";
import { getHoverColorForBackground } from "@/utils/getHoverColorFromText";
import { getTextColorForBackground } from "@/utils/getTextColorFromBg";

interface CardItemLabelsProps {
  label: ILabel;

  isLabelsOpen: boolean;
  setIsLabelsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function CardItemLabels(props: CardItemLabelsProps) {
  const { label, isLabelsOpen, setIsLabelsOpen } = props;
  const textColor = getTextColorForBackground(label.color);
  const hoverColor = getHoverColorForBackground(
    label.color,
    textColor === "FFF"
  );

  return (
    <div
      className=" inline-flex max-w-[calc(100%-4px)]  "
      onClick={(ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        setIsLabelsOpen((prev) => !prev);
      }}
    >
      <span
        className={`  my-0 px-0 inline-block relative overflow-hidden rounded-md text-sm leading-4 text-left text-ellipsis whitespace-nowrap align-middle transition-all  ${
          isLabelsOpen && ` px-2   `
        } ${
          isLabelsOpen ? " font-[500] min-w-14 h-4 max-w-full" : " w-10 h-2"
        } `}
        style={{
          backgroundColor: label.color,
          color: isLabelsOpen ? textColor : "transparent",
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
    </div>
  );
}

export default CardItemLabels;
