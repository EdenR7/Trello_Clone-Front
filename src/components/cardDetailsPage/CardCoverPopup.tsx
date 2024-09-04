import { ICard } from "@/types/card.types";
import CardCoverSizeLayout from "./CardCoverSizeLayout";
import { getHoverColorForBackground } from "@/utils/getHoverColorFromText";
import useChangeBackground from "@/hooks/Query hooks/Card bg hooks/useChangeBackground";
import { useParams } from "react-router-dom";
import { useLocalStorage } from "@uidotdev/usehooks";

interface CardCoverPopupProps {
  card: ICard;
}

function CardCoverPopup(props: CardCoverPopupProps) {
  const { card } = props;
  const { boardId } = useParams();

  const bg = card.bgCover;

  const { mutate: changeBackground } = useChangeBackground(boardId!);

  // const [activeBgState, setActiveBgState] = useLocalStorage<
  //   "Header" | "Cover" | null
  // >(`trella-background-active-state-${card._id}`, null);

  const [activeBgState, setActiveBgState] = useLocalStorage<
    "Header" | "Cover" | null
  >(
    `trella-background-active-state-${card._id}`,
    card.bgCover.isCover ? "Cover" : "Header"
  );

  const [activeColor, setActiveColor] = useLocalStorage<string | null>(
    `trella-card-background-color-${card._id}`,
    card.bgCover.bg
  );
  // const [activeColor, setActiveColor] = useLocalStorage<string | null>(
  //   `trella-card-background-color-${card._id}`,
  //   null
  // );

  const colors = [
    "#4BCE97",
    "#F5CD47",
    "#FEA362",
    "#F87168",
    "#9F8FEF",
    "#579DFF",
    "#6CC3E0",
    "#94C748",
    "#E774BB",
    "#8590A2",
  ];

  function handleChangeBackgroundColor(cardId: string, color: string) {
    if (activeColor !== color) {
      if (activeBgState === null) {
        setActiveBgState("Header");
      }
      setActiveColor(color);
      changeBackground({ cardId, color });
    }
  }
  return (
    <div>
      <CardCoverSizeLayout
        activeBgState={activeBgState}
        setActiveBgState={setActiveBgState}
        setActiveColor={setActiveColor}
        bg={bg}
      />
      <h4 className="font-semibold text-gray-600 leading-4 mb-1 text-xs mt-4  ">
        Colors
      </h4>
      <div className=" grid grid-cols-5 gap-2 p-1 -mx-1">
        {colors.map((color) => {
          const hoverColor = getHoverColorForBackground(color, true);
          return (
            <button
              key={color}
              onClick={() => handleChangeBackgroundColor(card._id, color)}
              className={`w-[50px] h-8 cursor-pointer rounded-md py-[6px] px-3 ${
                activeColor === color && "ring-2 ring-primary ring-offset-2"
              } `}
              style={{ backgroundColor: color }}
              onMouseEnter={(e) =>
                activeColor !== color &&
                (e.currentTarget.style.backgroundColor = hoverColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = color)
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export default CardCoverPopup;
