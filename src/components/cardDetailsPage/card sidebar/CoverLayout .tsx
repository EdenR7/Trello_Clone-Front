import PopoverLayout from "@/components/general/PopoverLayout";
import { Button } from "@/components/ui/button";
import { ICard } from "@/types/card.types";
import { Rows2 } from "lucide-react";
import CardCoverPopup from "../CardCoverPopup";

interface CoverLayoutProps {
  card: ICard;
}

function CoverLayout(props: CoverLayoutProps) {
  const { card } = props;
  return (
    <PopoverLayout
      trigger={
        <Button
          variant={"secondary"}
          className={` break-card_modal:w-auto mt-2 h-8 overflow-hidden relative text-ellipsis whitespace-nowrap max-w-[300px] flex justify-start items-center py-[6px] px-3 mr-2 w-[calc(50%-8px)] ${
            card.bgCover.bg !== "" && "invisible h-0 w-0 m-0 p-0"
          }`}
        >
          <span className="mr-[6px] -ml-[6px]">
            <Rows2 size={15} />
          </span>
          <span>Cover</span>
        </Button>
      }
      title="Cover"
    >
      <CardCoverPopup card={card} />
    </PopoverLayout>
  );
}

export default CoverLayout;
