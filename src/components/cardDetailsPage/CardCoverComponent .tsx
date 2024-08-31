import { ICard } from "@/types/card.types";
import { Button } from "../ui/button";
import { Rows2 } from "lucide-react";
import PopoverLayout from "../general/PopoverLayout";
import CardCoverPopup from "./CardCoverPopup";

interface CardCoverComponentProps {
  card: ICard;
}

function CardCoverComponent(props: CardCoverComponentProps) {
  const { card } = props;

  return (
    <div
      className=" relative w-full transition-opacity overflow-hidden rounded-t-lg h-[116px] min-h-[116px] p-0"
      style={{ backgroundColor: card.bgCover.bg }}
    >
      <div className=" flex absolute w-full p-3 justify-end items-center  bottom-0">
        <PopoverLayout
          title="Cover"
          trigger={
            <Button
              className=" py-[6px] pr-3 pl-[6px] hover:bg-gray-500/40 flex items-center gap-2 text-gray-600"
              variant={"ghost"}
            >
              <Rows2 size={16} />
              Cover
            </Button>
          }
        >
          <CardCoverPopup card={card} />
        </PopoverLayout>
      </div>
    </div>
  );
}

export default CardCoverComponent;
